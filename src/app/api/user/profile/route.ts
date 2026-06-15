import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { users, notifications } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
});

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const parsed = profileSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ message: parsed.error.issues[0].message }, { status: 400 });
        }

        const { name } = parsed.data;

        await db.update(users)
            .set({ name, updatedAt: new Date() })
            .where(eq(users.id, session.user.id));

        // Create a notification for the user
        await db.insert(notifications).values({
            userId: session.user.id,
            title: 'Profile Updated',
            message: 'Your institutional profile information has been successfully revised.',
            type: 'SUCCESS'
        });

        return NextResponse.json({ message: 'Profile updated successfully' });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
