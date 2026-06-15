import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { lessons } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

// GET all lessons for a course
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const courseLessons = await db.query.lessons.findMany({
        where: eq(lessons.courseId, id),
        orderBy: [asc(lessons.order)]
    });
    return NextResponse.json(courseLessons);
}

// POST create lesson
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { title, videoUrl, content, order } = body;

        const [newLesson] = await db.insert(lessons).values({
            title,
            videoUrl,
            content,
            order: order || 0,
            courseId: id,
        }).returning();

        return NextResponse.json(newLesson, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 });
    }
}

// PATCH reorder lessons (bulk update)
export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { items } = await req.json(); // Array of { id, order }
        if (!Array.isArray(items)) throw new Error('Invalid input');

        for (const item of items) {
            await db.update(lessons)
                .set({ order: item.order })
                .where(eq(lessons.id, item.id));
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to reorder lessons' }, { status: 500 });
    }
}
