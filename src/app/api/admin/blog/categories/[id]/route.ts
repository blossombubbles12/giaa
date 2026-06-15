import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { postCategories } from '@/db/schema';
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
        const { name, slug: customSlug, description } = await req.json();
        const data: any = {};
        if (name) data.name = name;
        if (description !== undefined) data.description = description;

        if (customSlug) {
            data.slug = customSlug;
        } else if (name) {
            data.slug = slugify(name);
        }

        const [updatedCategory] = await db
            .update(postCategories)
            .set(data)
            .where(eq(postCategories.id, id))
            .returning();

        if (!updatedCategory) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        return NextResponse.json(updatedCategory);
    } catch (err: any) {
        if (err.code === '23505') {
            return NextResponse.json({ error: 'Category name or slug already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
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
        await db.delete(postCategories).where(eq(postCategories.id, id));
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
}
