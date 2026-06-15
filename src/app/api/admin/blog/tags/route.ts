import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { postTags } from '@/db/schema';
import { desc } from 'drizzle-orm';

const slugify = (text: string) =>
    text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');

export async function GET() {
    try {
        const allTags = await db.query.postTags.findMany({
            orderBy: [desc(postTags.createdAt)],
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

        const [newTag] = await db.insert(postTags).values({
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
