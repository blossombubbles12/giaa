import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { resend } from '@/lib/resend';
import { WelcomeEmail } from '@/components/emails/WelcomeEmail';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await db.query.users.findFirst({
            where: eq(users.id, session.user.id),
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (user.emailVerified) {
            return NextResponse.json({ error: 'Email already verified' }, { status: 400 });
        }

        const verificationToken = crypto.randomUUID();
        
        await db.update(users)
            .set({ verificationToken, updatedAt: new Date() })
            .where(eq(users.id, user.id));

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://giaadvisory.com';
        const verificationUrl = `${baseUrl}/api/auth/verify?token=${verificationToken}`;

        await resend.emails.send({
            from: 'GIA Advisory <noreply@giaadvisory.com>',
            to: user.email,
            subject: 'Confirm Your Registration | GIA Advisory',
            react: WelcomeEmail({ name: user.name || 'User', verificationUrl }),
        });

        return NextResponse.json({ message: 'Verification email resent successfully' });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
