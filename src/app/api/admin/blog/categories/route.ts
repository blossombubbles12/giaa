import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { postCategories } from '@/db/schema';
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
        const allCategories = await db.query.postCategories.findMany({
            orderBy: [desc(postCategories.createdAt)],
        });
        return NextResponse.json(allCategories);
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { name, slug: customSlug, description } = await req.json();
        if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

        const slug = customSlug || slugify(name);

        const [newCategory] = await db.insert(postCategories).values({
            name,
            slug,
            description,
        }).returning();

        return NextResponse.json(newCategory, { status: 201 });
    } catch (err: any) {
        if (err.code === '23505') {
            return NextResponse.json({ error: 'Category with this name or slug already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}
