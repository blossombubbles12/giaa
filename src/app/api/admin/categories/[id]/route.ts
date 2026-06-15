import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { categories } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Utility to generate slug
const slugify = (text: string) =>
    text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { name, slug: customSlug, description } = await req.json();
        const updateData: any = {};

        if (name) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        
        if (customSlug) {
            updateData.slug = customSlug;
        } else if (name) {
            updateData.slug = slugify(name);
        }

        const [updated] = await db.update(categories)
            .set(updateData)
            .where(eq(categories.id, id))
            .returning();

        return NextResponse.json(updated);
    } catch (err: any) {
        if (err.code === '23505') {
            return NextResponse.json({ error: 'Category with this name or slug already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await db.delete(categories).where(eq(categories.id, id));
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
}
