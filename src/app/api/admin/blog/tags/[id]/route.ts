import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { postTags } from '@/db/schema';
import { eq } from 'drizzle-orm';

const slugify = (text: string) =>
    text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    try {
        const { name } = await req.json();
        const data: any = {};
        if (name) {
            data.name = name;
            data.slug = slugify(name);
        }

        const [updatedTag] = await db
            .update(postTags)
            .set(data)
            .where(eq(postTags.id, id))
            .returning();

        if (!updatedTag) {
            return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
        }

        return NextResponse.json(updatedTag);
    } catch (err: any) {
        if (err.code === '23505') {
            return NextResponse.json({ error: 'Tag name or slug already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to update tag' }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    try {
        await db.delete(postTags).where(eq(postTags.id, id));
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 });
    }
}
