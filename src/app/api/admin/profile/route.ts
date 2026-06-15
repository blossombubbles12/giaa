import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { users, notifications } from '@/db/schema';
import { eq, and, ne } from 'drizzle-orm';
import { z } from 'zod';

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
});

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const parsed = profileSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
        }

        const { name, email } = parsed.data;

        // Check if email already in use by another user
        const otherUser = await db.query.users.findFirst({
            where: and(
                eq(users.email, email),
                ne(users.id, (session.user as any).id)
            )
        });

        if (otherUser) {
            return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
        }

        await db.update(users)
            .set({ name, email, updatedAt: new Date() })
            .where(eq(users.id, (session.user as any).id));

        // Create notification
        await db.insert(notifications).values({
            userId: (session.user as any).id,
            title: 'Vault Profile Updated',
            message: 'Institutional identity markers have been revised.',
            type: 'INFO'
        });

        return NextResponse.json({ message: 'Profile updated successfully' });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
