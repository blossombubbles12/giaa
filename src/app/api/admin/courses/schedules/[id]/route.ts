import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { courseSchedules } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await req.json();
        const { courseId, startDate, endDate, location, capacity } = body;

        const [updatedSchedule] = await db.update(courseSchedules)
            .set({
                courseId,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                location,
                capacity: capacity ? parseInt(capacity) : null,
            })
            .where(eq(courseSchedules.id, id))
            .returning();

        return NextResponse.json(updatedSchedule || { error: 'Not found' });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to update schedule' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        await db.delete(courseSchedules).where(eq(courseSchedules.id, id));
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to delete schedule' }, { status: 500 });
    }
}
