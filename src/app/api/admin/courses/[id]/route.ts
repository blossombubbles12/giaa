import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { courses, courseSchedules, materials, courseTags } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { slugify } from '@/lib/utils';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET single course
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const course = await db.query.courses.findFirst({
        where: eq(courses.id, id),
        with: {
            schedules: true,
            materials: true,
            category: true,
            courseTags: {
                with: {
                    tag: true
                }
            }
        }
    });

    if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    return NextResponse.json(course);
}

// PATCH update course
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const updateData: Record<string, any> = {};

        // Base fields
        if (formData.has('slug')) {
            updateData.slug = formData.get('slug');
        } else if (formData.has('title')) {
            const title = formData.get('title') as string;
            updateData.title = title;
            updateData.slug = slugify(title);
        }

        if (formData.has('title')) updateData.title = formData.get('title');
        if (formData.has('description')) updateData.description = formData.get('description');
        if (formData.has('price')) updateData.price = parseFloat(formData.get('price') as string);
        if (formData.has('type')) updateData.type = formData.get('type');
        if (formData.has('published')) updateData.published = formData.get('published') === 'true';

        // Enhanced fields
        if (formData.has('duration')) updateData.duration = formData.get('duration');
        if (formData.has('venue')) updateData.venue = formData.get('venue');
        if (formData.has('certificationTypeId')) updateData.certificationTypeId = formData.get('certificationTypeId') === 'null' ? null : formData.get('certificationTypeId');
        if (formData.has('year')) updateData.year = formData.get('year') ? parseInt(formData.get('year') as string) : null;
        if (formData.has('month')) updateData.month = formData.get('month');

        if (formData.has('accessLink')) updateData.accessLink = formData.get('accessLink');
        if (formData.has('categoryId')) updateData.categoryId = formData.get('categoryId') === 'null' ? null : formData.get('categoryId');
        if (formData.has('targetAudience')) updateData.targetAudience = formData.get('targetAudience');
        if (formData.has('learningOutcomes')) updateData.learningOutcomes = formData.get('learningOutcomes');

        const thumbnailFile = formData.get('thumbnail') as File | null;
        if (thumbnailFile && thumbnailFile.size > 0) {
            // Cleanup old thumbnail
            const currentItem = await db.query.courses.findFirst({
                where: eq(courses.id, id),
                columns: { thumbnailPublicId: true }
            });
            if (currentItem?.thumbnailPublicId) {
                await cloudinary.uploader.destroy(currentItem.thumbnailPublicId);
            }

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
            updateData.thumbnail = uploadResult.secure_url;
            updateData.thumbnailPublicId = uploadResult.public_id;
        }

        // Handle Tags (Many-to-Many - Replace all)
        if (formData.has('tagIds')) {
            const tagIds = JSON.parse(formData.get('tagIds') as string);
            if (Array.isArray(tagIds)) {
                await db.delete(courseTags).where(eq(courseTags.courseId, id));
                if (tagIds.length > 0) {
                    await db.insert(courseTags).values(
                        tagIds.map((tagId: string) => ({
                            courseId: id,
                            tagId: tagId,
                        }))
                    );
                }
            }
        }

        // Handle materials (multiple PDFs)
        const materialFiles = formData.getAll('materials') as File[];
        if (materialFiles.length > 0) {
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

                    await db.insert(materials).values({
                        courseId: id,
                        title: file.name,
                        fileUrl: uploadResult.secure_url,
                        publicId: uploadResult.public_id,
                    });
                }
            }
        }

        // Handle schedules
        if (formData.has('schedules')) {
            const schedules = JSON.parse(formData.get('schedules') as string);
            if (Array.isArray(schedules)) {
                await db.delete(courseSchedules).where(eq(courseSchedules.courseId, id));
                if (schedules.length > 0) {
                    await db.insert(courseSchedules).values(
                        schedules.map((s: any) => ({
                            courseId: id,
                            startDate: new Date(s.startDate),
                            endDate: new Date(s.endDate),
                            location: s.location,
                            capacity: s.capacity ? parseInt(s.capacity) : null,
                        }))
                    );
                }
            }
        }

        updateData.updatedAt = new Date();
        const [updated] = await db.update(courses).set(updateData).where(eq(courses.id, id)).returning();
        return NextResponse.json(updated);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
    }
}

// DELETE course with Cloudinary cleanup
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 1. Fetch course details for cleanup
        const course = await db.query.courses.findFirst({
            where: eq(courses.id, id),
            with: { materials: true }
        });

        if (!course) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        // 2. Delete thumbnail from Cloudinary
        if (course.thumbnailPublicId) {
            await cloudinary.uploader.destroy(course.thumbnailPublicId);
        }

        // 3. Delete materials from Cloudinary
        for (const material of course.materials) {
            if (material.publicId) {
                // For 'raw' files, we need to specify resource_type
                await cloudinary.uploader.destroy(material.publicId, { resource_type: 'raw' });
            }
        }

        // 4. Delete from DB (cascades to enrollments, schedules, materials, lessons)
        await db.delete(courses).where(eq(courses.id, id));

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
    }
}
