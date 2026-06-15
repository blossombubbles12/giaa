import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { posts, postTagJunction } from '@/db/schema';
import { desc, eq, inArray } from 'drizzle-orm';

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
        const allPosts = await db.query.posts.findMany({
            with: {
                category: true,
                postTags: {
                    with: {
                        tag: true
                    }
                }
            },
            orderBy: [desc(posts.createdAt)],
        });
        return NextResponse.json(allPosts);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const excerpt = formData.get('excerpt') as string;
        const categoryId = formData.get('categoryId') as string;
        const published = formData.get('published') === 'true';
        const tagIdsRaw = formData.get('tagIds') as string;
        const thumbnailFile = formData.get('thumbnail') as File | null;

        if (!title || !content) {
            return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
        }

        let thumbnailUrl: string | null = null;
        let thumbnailPublicId: string | null = null;

        if (thumbnailFile && thumbnailFile.size > 0) {
            const bytes = await thumbnailFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const uploadResult = await new Promise<any>((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: 'gia/blog/thumbnails', resource_type: 'image' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(buffer);
            });
            thumbnailUrl = uploadResult.secure_url;
            thumbnailPublicId = uploadResult.public_id;
        }

        const tagIds = tagIdsRaw ? JSON.parse(tagIdsRaw) : [];
        const slug = slugify(title);

        const result = await db.transaction(async (tx) => {
            const [newPost] = await tx.insert(posts).values({
                title,
                slug,
                content,
                excerpt,
                thumbnail: thumbnailUrl,
                thumbnailPublicId: thumbnailPublicId,
                categoryId: categoryId || null,
                published,
                authorId: session.user.id,
            }).returning();

            if (tagIds && Array.isArray(tagIds) && tagIds.length > 0) {
                await tx.insert(postTagJunction).values(
                    tagIds.map((tagId: string) => ({
                        postId: newPost.id,
                        tagId: tagId,
                    }))
                );
            }

            return newPost;
        });

        return NextResponse.json(result, { status: 201 });
    } catch (err: any) {
        console.error(err);
        if (err.code === '23505') {
            return NextResponse.json({ error: 'Post with this title/slug already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}
