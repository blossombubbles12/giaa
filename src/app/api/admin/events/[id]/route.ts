import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { events } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { slugify } from '@/lib/utils';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const event = await db.query.events.findFirst({
            where: eq(events.id, id),
        });

        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        return NextResponse.json(event);
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
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

        const updates: any = {};
        if (formData.has('title')) {
            const title = formData.get('title') as string;
            updates.title = title;
            updates.slug = `${slugify(title)}-${id.split('-')[0]}`;
        }
        if (formData.has('description')) updates.description = formData.get('description') as string;
        if (formData.has('location')) updates.location = formData.get('location') as string;
        if (formData.has('capacity')) updates.capacity = parseInt(formData.get('capacity') as string);
        if (formData.has('startDate')) updates.startDate = new Date(formData.get('startDate') as string);
        if (formData.has('endDate')) updates.endDate = new Date(formData.get('endDate') as string);

        const thumbnailFile = formData.get('thumbnail') as File | null;
        if (thumbnailFile && thumbnailFile.size > 0) {
            const bytes = await thumbnailFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const uploadResult = await new Promise<any>((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: 'gia/events/thumbnails', resource_type: 'image' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(buffer);
            });
            updates.thumbnail = uploadResult.secure_url;
            updates.thumbnailPublicId = uploadResult.public_id;

            // Note: We could delete the old thumbnail from Cloudinary here to save space
            // if we query the old event first and get thumbnailPublicId
        }

        const [updatedEvent] = await db
            .update(events)
            .set({ ...updates })
            .where(eq(events.id, id))
            .returning();

        return NextResponse.json(updatedEvent);
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;

        // Find it first to delete from cloudinary if needed
        const currentItem = await db.query.events.findFirst({
            where: eq(events.id, id)
        });

        if (currentItem?.thumbnailPublicId) {
            try {
                await cloudinary.uploader.destroy(currentItem.thumbnailPublicId);
            } catch (e) { }
        }

        await db.delete(events).where(eq(events.id, id));
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
    }
}
