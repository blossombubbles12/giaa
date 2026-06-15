import { NextResponse } from 'next/server';
import { db } from '@/db';
import { bookings, events } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { resend } from '@/lib/resend';
import { EventRegistrationEmail } from '@/components/emails/EventRegistrationEmail';
import { AdminEventNotificationEmail } from '@/components/emails/AdminEventNotificationEmail';
import { createAdminNotification } from '@/lib/notifications';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;
        const eventId = id;

        // Find Event
        const event = await db.query.events.findFirst({
            where: eq(events.id, eventId),
            with: {
                bookings: true,
            }
        });

        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        const isPast = new Date(event.startDate) < new Date();
        if (isPast) {
            return NextResponse.json({ error: 'Cannot register for a past event' }, { status: 400 });
        }

        const remainingSeats = event.capacity - event.bookings.length;
        if (remainingSeats <= 0) {
            return NextResponse.json({ error: 'Event is fully booked' }, { status: 400 });
        }

        const isAlreadyBooked = event.bookings.some((b) => b.userId === userId);
        if (isAlreadyBooked) {
            return NextResponse.json({ error: 'You are already registered for this event' }, { status: 400 });
        }

        // Create Booking
        await db.insert(bookings).values({
            eventId,
            userId,
        });

        // Send Emails
        const eventDateStr = new Date(event.startDate).toLocaleDateString('en-GB', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        }) + ' at ' + new Date(event.startDate).toLocaleTimeString('en-GB', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        // To User
        if (session.user.email) {
            try {
                await resend.emails.send({
                    from: 'GIA Events <noreply@giaadvisory.com>',
                    to: session.user.email,
                    subject: `Registration Confirmed: ${event.title} | GIA Advisory`,
                    react: EventRegistrationEmail({ 
                        name: session.user.name || 'Participant',
                        eventTitle: event.title,
                        eventDate: eventDateStr,
                        eventLocation: event.location || 'Virtual Session',
                    }),
                });
            } catch (err) {
                console.error('Error sending registration email to user:', err);
            }
        }

        // To Admin
        try {
            const admins = await db.query.users.findMany({
                where: (u: any, { eq }: any) => eq(u.role, 'ADMIN'),
            });

            for (const admin of admins) {
                await resend.emails.send({
                    from: 'GIA System <system@giaadvisory.com>',
                    to: admin.email,
                    subject: `New Event Registration: ${event.title}`,
                    react: AdminEventNotificationEmail({
                        userName: session.user.name || 'Unknown User',
                        userEmail: session.user.email || 'Unknown Email',
                        eventTitle: event.title,
                    }),
                });
            }
        } catch (err) {
            console.error('Error sending notification email to admins:', err);
        }

        // System Notification for Admin
        await createAdminNotification({
            title: 'New Event Registration',
            message: `${session.user.name} has registered for the event: ${event.title}.`,
            type: 'INFO',
            link: `/admin/events/${eventId}`
        });

        return NextResponse.json({ message: 'Successfully registered for the event' }, { status: 200 });

    } catch (error) {
        console.error('Error registering for event:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
