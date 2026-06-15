import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { pageContent } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const contents = await db.query.pageContent.findMany({
            orderBy: [desc(pageContent.updatedAt)],
        });
        return NextResponse.json(contents);
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch page content' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id, value } = await req.json();
        if (!id || value === undefined) {
            return NextResponse.json({ error: 'ID and value are required' }, { status: 400 });
        }

        const [updated] = await db.update(pageContent)
            .set({ value, updatedAt: new Date() })
            .where(eq(pageContent.id, id))
            .returning();

        return NextResponse.json(updated);
    } catch (err) {
        return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
    }
}
