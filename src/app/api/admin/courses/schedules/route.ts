import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { courseSchedules } from '@/db/schema';
import { eq, desc, and, sql } from 'drizzle-orm';

// GET all schedules with pagination
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const whereConditions: any[] = [];
    if (courseId) whereConditions.push(eq(courseSchedules.courseId, courseId));

    const [allSchedules, totalCount] = await Promise.all([
        db.query.courseSchedules.findMany({
            where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
            orderBy: [desc(courseSchedules.startDate)],
            limit,
            offset,
            with: {
                course: true
            }
        }),
        db.select({ count: sql<number>`count(*)` }).from(courseSchedules).where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
    ]);

    return NextResponse.json({
        data: allSchedules,
        pagination: {
            page,
            limit,
            totalCount: totalCount[0].count,
            totalPages: Math.ceil(totalCount[0].count / limit)
        }
    });
}

// POST create schedule
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { courseId, startDate, endDate, location, capacity } = body;

        const [newSchedule] = await db.insert(courseSchedules).values({
            courseId,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            location,
            capacity: capacity ? parseInt(capacity) : null,
        }).returning();

        return NextResponse.json(newSchedule, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to create schedule' }, { status: 500 });
    }
}
