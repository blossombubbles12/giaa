import { NextResponse } from 'next/server';
import { db } from '@/db';
import { enrollments, payments, users, courses } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { createAdminNotification } from '@/lib/notifications';
import { resend } from '@/lib/resend';
import { CourseInvoiceEmail } from '@/components/emails/CourseInvoiceEmail';
import { AdminNotificationEmail } from '@/components/emails/AdminNotificationEmail';
import { getCurrencySymbol } from '@/lib/settings';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { courseId, paymentType, billingEmail, billingAddress, phone, participantsCount = 1 } = body;

        if (!courseId) {
            return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
        }

        // Fetch course details
        const course = await db.query.courses.findFirst({
            where: eq(courses.id, courseId),
        });

        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        // Check if already enrolled
        const [existing] = await db.select().from(enrollments).where(
            and(
                eq(enrollments.userId, session.user.id),
                eq(enrollments.courseId, courseId)
            )
        );

        if (existing) {
            return NextResponse.json({ error: 'You are already enrolled in this course.' }, { status: 400 });
        }

        const currencySymbol = await getCurrencySymbol();
        const transactionId = `OFF-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Create Enrollment as PENDING
        const [enrollment] = await db.insert(enrollments).values({
            userId: session.user.id,
            courseId,
            status: 'PENDING',
            billingEmail,
            billingAddress: `${billingAddress} (Participants: ${participantsCount}, Phone: ${phone})`,
        }).returning();

        // Create Payment record as PENDING
        await db.insert(payments).values({
            userId: session.user.id,
            courseId,
            amount: course.price * participantsCount,
            status: 'PENDING',
            transactionId,
            paymentType: paymentType || 'SELF',
        });

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://giaadvisory.com';

        // 1. Send Invoice Email to User
        try {
            await resend.emails.send({
                from: 'GIA Academy <academy@giaadvisory.com>',
                to: session.user.email!,
                subject: `Invoice for ${course.title} | GIA Advisory`,
                react: CourseInvoiceEmail({
                    userName: session.user.name || 'Student',
                    courseTitle: course.title,
                    amount: Number(course.price * participantsCount).toLocaleString(),
                    currencySymbol,
                    invoiceNumber: transactionId,
                    date: new Date().toLocaleDateString(),
                    paymentMethod: 'Bank Transfer (Offline)',
                    status: 'Awaiting Payment',
                }),
            });
        } catch (err) {
            console.error('Failed to send invoice email:', err);
        }

        // 2. Notify Admin via Email
        try {
            const admins = await db.query.users.findMany({
                where: (u: any, { eq }: any) => eq(u.role, 'ADMIN'),
            });

            for (const admin of admins) {
                await resend.emails.send({
                    from: 'GIA Academy system <system@giaadvisory.com>',
                    to: admin.email,
                    subject: `New Offline Enrollment: ${course.title}`,
                    react: AdminNotificationEmail({
                        name: session.user.name || 'Student',
                        email: session.user.email || 'N/A',
                        adminUrl: `${baseUrl}/admin/enrollments`
                    }),
                });
            }
        } catch (err) {
            console.error('Failed to notify admin via email:', err);
        }

        // 3. System Notification for Admin
        await createAdminNotification({
            title: 'New Offline Enrollment Request',
            message: `${session.user.name} has requested enrollment for "${course.title}" for ${participantsCount} participant(s) via Bank Transfer.`,
            type: 'WARNING',
            link: `/admin/enrollments`
        });

        return NextResponse.json({ message: 'Enrollment requested successfully.' }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}
