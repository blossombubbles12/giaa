import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json({ error: 'Missing token' }, { status: 400 });
        }

        const user = await db.query.users.findFirst({
            where: eq(users.verificationToken, token),
        });

        if (!user) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
        }

        await db.update(users)
            .set({ 
                emailVerified: new Date(),
                verificationToken: null,
                updatedAt: new Date(),
            })
            .where(eq(users.id, user.id));

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'https://giaadvisory.com'}/login?verified=true`);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
