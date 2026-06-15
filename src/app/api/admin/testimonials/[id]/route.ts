import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { testimonials, notifications } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        const { approved } = await req.json();

        const [updated] = await db.update(testimonials)
            .set({ approved, createdAt: new Date() })
            .where(eq(testimonials.id, id))
            .returning();

        if (updated && approved) {
            // Notify user their testimonial was approved
            await db.insert(notifications).values({
                userId: updated.userId,
                title: 'Testimonial Approved',
                message: 'Your testimonial has been reviewed and is now live on the platform. Thank you for your feedback!',
                type: 'SUCCESS',
            });
        }

        return NextResponse.json(updated);
    } catch (err) {
        return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        await db.delete(testimonials).where(eq(testimonials.id, id));
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
    }
}
