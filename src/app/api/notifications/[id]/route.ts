import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { notifications } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { read } = await req.json();

        await db
            .update(notifications)
            .set({ read: !!read })
            .where(and(eq(notifications.id, id), eq(notifications.userId, session.user.id)));

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Update notification error:', err);
        return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await db
            .delete(notifications)
            .where(and(eq(notifications.id, id), eq(notifications.userId, session.user.id)));

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Delete notification error:', err);
        return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 });
    }
}
