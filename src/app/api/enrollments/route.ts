import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { enrollments, courses, notifications } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

// POST enroll in course (Student)
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { courseId } = await req.json();
        if (!courseId) {
            return NextResponse.json({ error: 'CourseId is required' }, { status: 400 });
        }

        // Check course existence and status
        const course = await db.query.courses.findFirst({
            where: and(eq(courses.id, courseId), eq(courses.published, true))
        });

        if (!course) {
            return NextResponse.json({ error: 'Course not found or not published' }, { status: 404 });
        }

        // Check existing enrollment
        const existing = await db.query.enrollments.findFirst({
            where: and(eq(enrollments.courseId, courseId), eq(enrollments.userId, session.user.id))
        });

        if (existing) {
            return NextResponse.json({ error: 'Already enrolled in this course' }, { status: 400 });
        }

        // Create enrollment
        const [newEnrollment] = await db.insert(enrollments).values({
            courseId,
            userId: session.user.id,
            status: 'ACTIVE'
        }).returning();

        // Create notification
        await db.insert(notifications).values({
            userId: session.user.id,
            title: 'Successfully Enrolled',
            message: `You have successfully enrolled in "${course.title}". You can now access all course materials in your dashboard for preparation.`,
            type: 'SUCCESS',
            link: `/dashboard/courses/${courseId}`
        });

        return NextResponse.json(newEnrollment, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to enroll' }, { status: 500 });
    }
}

// GET current user's enrollments
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const userEnrollments = await db.query.enrollments.findMany({
            where: eq(enrollments.userId, session.user.id),
            with: {
                course: true
            }
        });
        return NextResponse.json(userEnrollments);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to fetch enrollments' }, { status: 500 });
    }
}
