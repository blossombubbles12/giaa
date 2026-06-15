import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { courses, notifications, courseSchedules, materials, courseTags } from '@/db/schema';
import { v2 as cloudinary } from 'cloudinary';
import { eq, desc, ilike, and, sql } from 'drizzle-orm';
import { slugify } from '@/lib/utils';
import crypto from 'crypto';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET all courses with search, filtering and pagination
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const categoryId = searchParams.get('categoryId');
    const type = searchParams.get('type') as 'ONLINE' | 'OFFLINE' | null;
    const venue = searchParams.get('venue');
    const year = searchParams.get('year');
    const month = searchParams.get('month');
    const published = searchParams.get('published');
    const certificationTypeId = searchParams.get('certificationTypeId');

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const whereConditions: any[] = [];
    if (search) whereConditions.push(ilike(courses.title, `%${search}%`));
    if (categoryId) whereConditions.push(eq(courses.categoryId, categoryId));
    if (type) whereConditions.push(eq(courses.type, type));
    if (venue) whereConditions.push(ilike(courses.venue, `%${venue}%`));
    if (year) whereConditions.push(eq(courses.year, parseInt(year)));
    if (month) whereConditions.push(eq(courses.month, month));
    if (published === 'true') whereConditions.push(eq(courses.published, true));
    if (published === 'false') whereConditions.push(eq(courses.published, false));
    if (certificationTypeId) whereConditions.push(eq(courses.certificationTypeId, certificationTypeId));

    const [allCourses, totalCount] = await Promise.all([
        db.query.courses.findMany({
            where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
            orderBy: [desc(courses.createdAt)],
            limit,
            offset,
            with: {
                schedules: true,
                materials: true,
                category: true,
                certificationType: true,
                courseTags: {
                    with: {
                        tag: true
                    }
                }
            }
        }),
        db.select({ count: sql<number>`count(*)` }).from(courses).where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
    ]);

    return NextResponse.json({
        data: allCourses,
        pagination: {
            page,
            limit,
            totalCount: totalCount[0].count,
            totalPages: Math.ceil(totalCount[0].count / limit)
        }
    });
}

// POST create course
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await req.formData();

        // Base fields
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const price = parseFloat(formData.get('price') as string);
        const type = formData.get('type') as 'ONLINE' | 'OFFLINE';
        const published = formData.get('published') === 'true';
        const thumbnailFile = formData.get('thumbnail') as File | null;

        // Enhanced fields
        const duration = formData.get('duration') as string | null;
        const venue = formData.get('venue') as string | null;
        const certificationTypeId = formData.get('certificationTypeId') as string | null;
        const year = formData.get('year') ? parseInt(formData.get('year') as string) : null;
        const month = formData.get('month') as string | null;

        const accessLink = formData.get('accessLink') as string | null;
        const categoryId = formData.get('categoryId') as string | null;
        const tagIdsJson = formData.get('tagIds') as string | null; // Array of UUIDs
        const targetAudience = formData.get('targetAudience') as string | null;
        const learningOutcomes = formData.get('learningOutcomes') as string | null;
        const schedulesJson = formData.get('schedules') as string | null;

        let thumbnailUrl: string | null = null;
        let thumbnailPublicId: string | null = null;
        if (thumbnailFile && thumbnailFile.size > 0) {
            const bytes = await thumbnailFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const uploadResult = await new Promise<any>((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: 'gia/courses/thumbnails', resource_type: 'image' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(buffer);
            });
            thumbnailUrl = uploadResult.secure_url;
            thumbnailPublicId = uploadResult.public_id;
        }

        // Handle materials
        const materialFiles = formData.getAll('materials') as File[];
        const uploadedMaterials: { title: string, url: string, publicId: string }[] = [];

        for (const file of materialFiles) {
            if (file.size > 0) {
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const uploadResult = await new Promise<any>((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        {
                            folder: 'gia/courses/materials',
                            resource_type: 'raw',
                            format: 'pdf'
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    ).end(buffer);
                });
                uploadedMaterials.push({
                    title: file.name,
                    url: uploadResult.secure_url,
                    publicId: uploadResult.public_id
                });
            }
        }

        const customSlug = formData.get('slug') as string | null;
        const courseId = crypto.randomUUID();
        const slug = customSlug || slugify(title);

        const [newCourse] = await db.insert(courses).values({
            id: courseId,
            title,
            slug,
            description,
            price,
            type,
            duration,
            venue,
            certificationTypeId: certificationTypeId === 'null' ? null : certificationTypeId,
            year,
            month,
            accessLink,
            categoryId,
            targetAudience,
            learningOutcomes,
            published,
            thumbnail: thumbnailUrl,
            thumbnailPublicId: thumbnailPublicId,
        }).returning();

        // Insert Tags (Many-to-Many)
        if (tagIdsJson) {
            const tagIds = JSON.parse(tagIdsJson);
            if (Array.isArray(tagIds) && tagIds.length > 0) {
                await db.insert(courseTags).values(
                    tagIds.map((tagId: string) => ({
                        courseId: newCourse.id,
                        tagId: tagId,
                    }))
                );
            }
        }

        // Insert schedules if provided
        if (schedulesJson) {
            const schedules = JSON.parse(schedulesJson);
            if (Array.isArray(schedules) && schedules.length > 0) {
                await db.insert(courseSchedules).values(
                    schedules.map((s: any) => ({
                        courseId: newCourse.id,
                        startDate: new Date(s.startDate),
                        endDate: new Date(s.endDate),
                        location: s.location,
                        capacity: s.capacity ? parseInt(s.capacity) : null,
                    }))
                );
            }
        }

        // Insert materials if provided
        if (uploadedMaterials.length > 0) {
            await db.insert(materials).values(
                uploadedMaterials.map(m => ({
                    courseId: newCourse.id,
                    title: m.title,
                    fileUrl: m.url,
                    publicId: m.publicId
                }))
            );
        }

        // Notify current admin
        await db.insert(notifications).values({
            userId: session.user.id,
            title: 'Course Created',
            message: `New course "${title}" has been created successfully.`,
            type: 'SUCCESS',
            link: `/admin/courses/${newCourse.id}/edit`,
        });

        return NextResponse.json(newCourse, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
    }
}
