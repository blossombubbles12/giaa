import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { testimonials, notifications, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import crypto from 'crypto';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const allTestimonials = await db.query.testimonials.findMany({
            with: {
                user: {
                    columns: {
                        name: true,
                        email: true,
                        image: true
                    }
                }
            },
            orderBy: [desc(testimonials.createdAt)],
        });
        return NextResponse.json(allTestimonials);
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
    }
}


export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { content, rating, userId, customName, approved } = await req.json();

        if (!content || !rating) {
            return NextResponse.json({ error: 'Content and rating are required' }, { status: 400 });
        }

        const isAdmin = session.user.role === 'ADMIN';
        let targetUserId = (isAdmin && userId) ? userId : session.user.id;
        const targetApproval = (isAdmin && approved !== undefined) ? approved : false;

        // If admin supplies a custom name instead of selecting a user, create a dummy ghost user
        if (isAdmin && customName && !userId) {
            const [newUser] = await db.insert(users).values({
                name: customName,
                email: `guest-${crypto.randomUUID().substring(0, 8)}@giaadvisory.com`,
                password: crypto.randomUUID(),
                role: 'STUDENT',
            }).returning();
            targetUserId = newUser.id;
        }

        const [newTestimonial] = await db.insert(testimonials).values({
            userId: targetUserId,
            content,
            rating,
            approved: targetApproval,
        }).returning();

        return NextResponse.json(newTestimonial);
    } catch (err) {
        return NextResponse.json({ error: 'Failed to submit testimonial' }, { status: 500 });
    }
}
