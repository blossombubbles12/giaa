import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { galleries } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { v2 as cloudinary } from 'cloudinary';

export const maxDuration = 300;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const gallery = await db.query.galleries.findFirst({
            where: eq(galleries.id, id),
        });

        if (!gallery) {
            return NextResponse.json({ error: 'Gallery not found' }, { status: 404 });
        }

        return NextResponse.json(gallery);
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        const formData = await req.formData();

        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const existingImagesJson = formData.get('existingImages') as string;
        const newImageFiles = formData.getAll('newImages') as File[];

        let updatedImagesList: { url: string, publicId: string }[] = existingImagesJson
            ? JSON.parse(existingImagesJson)
            : [];

        const folderPath = `gia/galleries/${title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')}`;

        // Upload new images/videos/files to cloudinary
        for (const file of newImageFiles) {
            if (file.size > 0) {
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const uploadResult = await new Promise<any>((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        {
                            folder: folderPath,
                            resource_type: 'auto',
                            quality: 'auto:good',
                            fetch_format: 'auto'
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    ).end(buffer);
                });
                updatedImagesList.push({
                    url: uploadResult.secure_url,
                    publicId: uploadResult.public_id
                });
            }
        }

        const [updatedGallery] = await db
            .update(galleries)
            .set({ title, description, images: updatedImagesList })
            .where(eq(galleries.id, id))
            .returning();

        return NextResponse.json(updatedGallery);
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to update gallery' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;

        const currentItem = await db.query.galleries.findFirst({
            where: eq(galleries.id, id)
        });

        // Delete all elements in this gallery from Cloudinary
        const imgs = currentItem?.images as { url: string, publicId: string }[] || [];
        for (const img of imgs) {
            if (img.publicId) {
                try {
                    // Try destroying as image first, fallback to video/raw if needed, auto deletes works sometimes but manual specifies better.
                    await cloudinary.uploader.destroy(img.publicId, { resource_type: 'image' }).catch(() => null);
                    await cloudinary.uploader.destroy(img.publicId, { resource_type: 'video' }).catch(() => null);
                    await cloudinary.uploader.destroy(img.publicId, { resource_type: 'raw' }).catch(() => null);
                } catch (e) { }
            }
        }

        await db.delete(galleries).where(eq(galleries.id, id));
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: 'Failed to delete gallery' }, { status: 500 });
    }
}
