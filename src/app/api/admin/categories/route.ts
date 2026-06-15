import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { categories } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

// Utility to generate slug
const slugify = (text: string) =>
    text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w-]+/g, '')  // Remove all non-word chars
        .replace(/--+/g, '-');    // Replace multiple - with single -

export async function GET() {
    try {
        const allCategories = await db.query.categories.findMany({
            orderBy: [desc(categories.createdAt)],
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

        // Check if category already exists
        const [newCategory] = await db.insert(categories).values({
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
