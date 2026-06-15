import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { galleries } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { v2 as cloudinary } from 'cloudinary';

// Allow large payloads and longer duration for video/multiple large files
export const maxDuration = 300;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
    try {
        const allGalleries = await db.query.galleries.findMany({
            orderBy: [desc(galleries.createdAt)],
        });
        return NextResponse.json(allGalleries);
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch galleries' }, { status: 500 });
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
        const description = formData.get('description') as string;
        const imageFiles = formData.getAll('images') as File[];

        if (!title) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }

        const folderPath = `gia/galleries/${title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+g, '')}`;

        const uploadedImages: { url: string, publicId: string }[] = [];

        for (const file of imageFiles) {
            if (file.size > 0) {
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const uploadResult = await new Promise<any>((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        {
                            folder: folderPath,
                            resource_type: 'auto', // Supports raw, video, images
                            quality: 'auto:good', // optimize
                            fetch_format: 'auto'
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    ).end(buffer);
                });
                uploadedImages.push({
                    url: uploadResult.secure_url,
                    publicId: uploadResult.public_id
                });
            }
        }

        const [newGallery] = await db.insert(galleries).values({
            title,
            description,
            images: uploadedImages,
        }).returning();

        return NextResponse.json(newGallery);
    } catch (err: any) {
        console.error('Gallery creation error:', err);
        return NextResponse.json({ error: 'Failed to create gallery' }, { status: 500 });
    }
}
