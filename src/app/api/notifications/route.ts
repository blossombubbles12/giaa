import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { notifications } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const userNotifications = await db
            .select()
            .from(notifications)
            .where(eq(notifications.userId, session.user.id))
            .orderBy(desc(notifications.createdAt))
            .limit(50);

        return NextResponse.json(userNotifications);
    } catch (err: any) {
        console.error('Fetch notifications error:', err);
        if (err.cause) console.error('Error Cause:', err.cause);
        return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { userId, title, message, type, link } = await req.json();

        const [newNotification] = await db.insert(notifications).values({
            userId,
            title,
            message,
            type: type ?? 'INFO',
            link,
        }).returning();

        return NextResponse.json(newNotification, { status: 201 });
    } catch (err) {
        console.error('Create notification error:', err);
        return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
    }
}

// Mark all as read
export async function PATCH() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await db
            .update(notifications)
            .set({ read: true })
            .where(and(eq(notifications.userId, session.user.id), eq(notifications.read, false)));

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Update notifications error:', err);
        return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
    }
}
