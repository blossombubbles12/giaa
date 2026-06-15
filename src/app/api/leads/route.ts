import { NextResponse } from 'next/server';
import { db } from '@/db';
import { leads, courses } from '@/db/schema';
import { resend } from '@/lib/resend';
import { createAdminNotification } from '@/lib/notifications';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, subject, message, source, courseId } = body;

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const [newLead] = await db.insert(leads).values({
            name,
            email,
            phone,
            subject,
            message,
            source,
            courseId: courseId || null,
        }).returning();

        // Get course title if applicable
        let courseTitle = '';
        if (courseId) {
            const course = await db.query.courses.findFirst({
                where: eq(courses.id, courseId),
                columns: { title: true }
            });
            courseTitle = course?.title || '';
        }

        // Notify Admin (In-app)
        await createAdminNotification({
            title: 'New Lead Captured',
            message: `${name} (${email}) sent a new inquiry regarding ${courseTitle || subject || 'general information'}.`,
            type: 'INFO',
            link: `/admin/leads`,
        });

        // Notify Admin (Email via Resend)
        try {
            await resend.emails.send({
                from: 'GIA Advisory <onboarding@resend.dev>',
                to: ['info@giaadvisory.com'], // Placeholder, in prod use admin emails
                subject: `New Lead: ${subject || 'Website Inquiry'}`,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; color: #333;">
                        <h2 style="color: #2563eb;">New Lead Captured</h2>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                        <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
                        ${courseTitle ? `<p><strong>Course:</strong> ${courseTitle}</p>` : ''}
                        <p><strong>Source:</strong> ${source || 'Website'}</p>
                        <div style="margin-top: 20px; padding: 15px; background: #f3f4f6; border-radius: 8px;">
                            <p><strong>Message:</strong></p>
                            <p>${message}</p>
                        </div>
                        <p style="margin-top: 20px; font-size: 12px; color: #666;">
                            View this lead in the <a href="https://giaadvisory.com/admin/leads">Admin Dashboard</a>.
                        </p>
                    </div>
                `,
            });
        } catch (emailErr) {
            console.error('Failed to send lead email:', emailErr);
            // Don't fail the whole request if email fails
        }

        return NextResponse.json({ success: true, lead: newLead });
    } catch (err) {
        console.error('Lead submission error:', err);
        return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
    }
}
