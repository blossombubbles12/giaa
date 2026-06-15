import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { tags } from '@/db/schema';
import { desc, ilike } from 'drizzle-orm';

// Utility to generate slug
const slugify = (text: string) =>
    text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w-]+/g, '')  // Remove all non-word chars
        .replace(/--+/g, '-');    // Replace multiple - with single -

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');

    try {
        const allTags = await db.query.tags.findMany({
            where: search ? ilike(tags.name, `%${search}%`) : undefined,
            orderBy: [desc(tags.createdAt)],
        });
        return NextResponse.json(allTags);
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { name } = await req.json();
        if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

        const slug = slugify(name);

        const [newTag] = await db.insert(tags).values({
            name,
            slug,
        }).returning();

        return NextResponse.json(newTag, { status: 201 });
    } catch (err: any) {
        if (err.code === '23505') {
            return NextResponse.json({ error: 'Tag with this name or slug already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 });
    }
}
