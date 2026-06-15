import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { posts, postTagJunction } from '@/db/schema';
import { eq } from 'drizzle-orm';

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const slugify = (text: string) =>
    text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const post = await db.query.posts.findFirst({
            where: eq(posts.id, id),
            with: {
                category: true,
                postTags: {
                    with: {
                        tag: true
                    }
                }
            },
        });
        if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        return NextResponse.json(post);
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    try {
        const formData = await req.formData();
        const title = formData.get('title') as string | null;
        const content = formData.get('content') as string | null;
        const excerpt = formData.get('excerpt') as string | null;
        const categoryId = formData.get('categoryId') as string | null;
        const publishedRaw = formData.get('published') as string | null;
        const tagIdsRaw = formData.get('tagIds') as string | null;
        const thumbnailFile = formData.get('thumbnail') as File | null;

        let thumbnailUrl: string | undefined = undefined;
        let thumbnailPublicId: string | undefined = undefined;

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

        const tagIds = tagIdsRaw ? JSON.parse(tagIdsRaw) : undefined;
        const published = publishedRaw !== null ? publishedRaw === 'true' : undefined;

        const updatedPost = await db.transaction(async (tx) => {
            const updateData: any = { updatedAt: new Date() };
            if (title) {
                updateData.title = title;
                updateData.slug = slugify(title);
            }
            if (content !== null && content !== undefined) updateData.content = content;
            if (excerpt !== null && excerpt !== undefined) updateData.excerpt = excerpt;
            if (thumbnailUrl !== undefined) updateData.thumbnail = thumbnailUrl;
            if (thumbnailPublicId !== undefined) updateData.thumbnailPublicId = thumbnailPublicId;
            if (categoryId !== null && categoryId !== undefined) updateData.categoryId = categoryId || null;
            if (published !== undefined) updateData.published = published;

            const [result] = await tx
                .update(posts)
                .set(updateData)
                .where(eq(posts.id, id))
                .returning();

            if (!result) throw new Error('Post not found');

            // Handle Tags
            if (tagIds !== undefined && Array.isArray(tagIds)) {
                // Remove existing tags
                await tx.delete(postTagJunction).where(eq(postTagJunction.postId, id));

                // Add new tags
                if (tagIds.length > 0) {
                    await tx.insert(postTagJunction).values(
                        tagIds.map((tagId: string) => ({
                            postId: id,
                            tagId: tagId,
                        }))
                    );
                }
            }

            return result;
        });

        return NextResponse.json(updatedPost);
    } catch (err: any) {
        console.error(err);
        if (err.message === 'Post not found') return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        if (err.code === '23505') return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    try {
        await db.delete(posts).where(eq(posts.id, id));
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}
