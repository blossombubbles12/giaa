import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { createAdminNotification } from '@/lib/notifications';

import { resend } from '@/lib/resend';
import { WelcomeEmail } from '@/components/emails/WelcomeEmail';
import { AdminNotificationEmail } from '@/components/emails/AdminNotificationEmail';

const schema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = schema.safeParse(body);
        if (!parsed.success) {
            const issues = (parsed.error as any).issues ?? (parsed.error as any).errors;
            return NextResponse.json({ error: issues?.[0]?.message ?? 'Invalid input' }, { status: 400 });
        }

        const { name, email, password } = parsed.data;

        const [existing] = await db.select().from(users).where(eq(users.email, email));
        if (existing) {
            return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomUUID();
        
        await db.insert(users).values({ 
            name, 
            email, 
            password: hashedPassword, 
            role: 'STUDENT',
            verificationToken 
        });

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://giaadvisory.com';
        const verificationUrl = `${baseUrl}/api/auth/verify?token=${verificationToken}`;

        // Send Welcome Email to User
        try {
            await resend.emails.send({
                from: 'GIA Advisory <noreply@giaadvisory.com>',
                to: email,
                subject: 'Confirm Your Registration | GIA Advisory',
                react: WelcomeEmail({ name, verificationUrl }),
            });
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
        }

        // Notify Admin via Email
        try {
            const admins = await db.query.users.findMany({
                where: (u: any, { eq }: any) => eq(u.role, 'ADMIN'),
            });

            for (const admin of admins) {
                await resend.emails.send({
                    from: 'GIA Advisory system <system@giaadvisory.com>',
                    to: admin.email,
                    subject: 'New Student Registration Notification',
                    react: AdminNotificationEmail({ 
                        name, 
                        email, 
                        adminUrl: `${baseUrl}/admin/users` 
                    }),
                });
            }
        } catch (adminEmailError) {
            console.error('Failed to send admin email notification:', adminEmailError);
        }

        // System Notification for Admin
        await createAdminNotification({
            title: 'New Student Registration',
            message: `${name} (${email}) has just created an account.`,
            type: 'INFO',
            link: `/admin/users`
        });

        return NextResponse.json({ message: 'Account created successfully. Please check your email to verify your account.' }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}
