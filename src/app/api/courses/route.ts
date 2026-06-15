import { NextResponse } from 'next/server';
import { db } from '@/db';
import { courses } from '@/db/schema';
import { eq, desc, and, ilike } from 'drizzle-orm';

// GET all published courses with search and filtering
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const categoryId = searchParams.get('categoryId');
    const type = searchParams.get('type') as 'ONLINE' | 'OFFLINE' | null;

    const whereConditions: any[] = [eq(courses.published, true)];

    if (search) whereConditions.push(ilike(courses.title, `%${search}%`));
    if (categoryId) whereConditions.push(eq(courses.categoryId, categoryId));
    if (type) whereConditions.push(eq(courses.type, type));

    try {
        const allCourses = await db.query.courses.findMany({
            where: and(...whereConditions),
            orderBy: [desc(courses.createdAt)],
            with: {
                schedules: true,
                category: true,
                courseTags: {
                    with: {
                        tag: true
                    }
                }
            }
        });
        return NextResponse.json(allCourses);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
    }
}
