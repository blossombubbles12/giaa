import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { resend } from '@/lib/resend';
import { ResetPasswordEmail } from '@/components/emails/ResetPasswordEmail';
import { z } from 'zod';

const schema = z.object({
    email: z.string().email(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = schema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
        }

        const { email } = parsed.data;

        const user = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (!user) {
            // We return a success message even if user not found for security
            return NextResponse.json({ message: 'If an account exists with this email, a reset link has been sent.' });
        }

        const resetToken = crypto.randomUUID();
        const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour

        await db.update(users)
            .set({ resetToken, resetTokenExpires, updatedAt: new Date() })
            .where(eq(users.id, user.id));

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://giaadvisory.com';
        const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

        await resend.emails.send({
            from: 'GIA Advisory <security@giaadvisory.com>',
            to: email,
            subject: 'Reset Your Password | GIA Advisory',
            react: ResetPasswordEmail({ name: user.name || 'User', resetUrl }),
        });

        return NextResponse.json({ message: 'If an account exists with this email, a reset link has been sent.' });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
