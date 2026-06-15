import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { events, users, notifications } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { slugify } from '@/lib/utils';
import crypto from 'crypto';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const allEvents = await db.query.events.findMany({
            orderBy: [desc(events.startDate)],
        });
        return NextResponse.json(allEvents);
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
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
        const location = formData.get('location') as string;
        const capacity = formData.get('capacity') as string;
        const startDate = formData.get('startDate') as string;
        const endDate = formData.get('endDate') as string;
        const thumbnailFile = formData.get('thumbnail') as File | null;

        if (!title || !capacity || !startDate || !endDate) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        let thumbnailUrl: string | null = null;
        let thumbnailPublicId: string | null = null;
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
            thumbnailUrl = uploadResult.secure_url;
            thumbnailPublicId = uploadResult.public_id;
        }

        const eventId = crypto.randomUUID();
        const slug = `${slugify(title)}-${eventId.split('-')[0]}`;

        const [newEvent] = await db.insert(events).values({
            id: eventId,
            title,
            slug,
            description,
            location,
            capacity: parseInt(capacity),
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            thumbnail: thumbnailUrl,
            thumbnailPublicId: thumbnailPublicId,
        }).returning();

        // Broadcast notification to all students
        const allUsers = await db.query.users.findMany({ columns: { id: true } });
        if (allUsers.length > 0) {
            const notificationPayload = allUsers.map(u => ({
                userId: u.id,
                title: 'New Session Scheduled! 📅',
                message: `${title} has been scheduled for ${new Date(startDate).toLocaleDateString()}. Register your spot now!`,
                type: 'INFO' as const,
                link: '/events',
                read: false,
            }));
            await db.insert(notifications).values(notificationPayload);
        }

        return NextResponse.json(newEvent);
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
    }
}
