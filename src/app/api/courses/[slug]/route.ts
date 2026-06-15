import { NextResponse } from 'next/server';
import { db } from '@/db';
import { courses, courseSchedules } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

// GET public single course details
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    try {
        const course = await db.query.courses.findFirst({
            where: and(eq(courses.slug, slug), eq(courses.published, true)),
            with: {
                schedules: true,
                category: true,
                courseTags: {
                    with: {
                        tag: true
                    }
                }
                // Materials should NOT be visible to public users
            }
        });

        if (!course) {
            return NextResponse.json({ error: 'Course not found or not published' }, { status: 404 });
        }

        return NextResponse.json(course);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to fetch course detail' }, { status: 500 });
    }
}
