import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { materials } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// DELETE individual material
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const material = await db.query.materials.findFirst({
            where: eq(materials.id, id)
        });

        if (!material) {
            return NextResponse.json({ error: 'Material not found' }, { status: 404 });
        }

        // Cleanup Cloudinary
        if (material.publicId) {
            await cloudinary.uploader.destroy(material.publicId, { resource_type: 'raw' });
        }

        // Delete from DB
        await db.delete(materials).where(eq(materials.id, id));

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to delete material' }, { status: 500 });
    }
}
