import { NextResponse } from 'next/server';
import { db } from '@/db';
import { certificates } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const cert = await db.query.certificates.findFirst({
            where: eq(certificates.id, id),
        });

        if (!cert) {
            return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
        }

        // Determine resource_type from the stored URL
        const isImageType = cert.pdfUrl.includes('/image/upload/');
        const resourceType = isImageType ? 'image' : 'raw';

        // Extract public_id from URL
        const match = cert.pdfUrl.match(/(?:giaconsults)\/(.+)\.pdf$/);
        const publicId = match ? `giaconsults/${match[1]}` : null;

        if (!publicId) {
            return NextResponse.json({ error: 'Invalid PDF reference' }, { status: 500 });
        }

        // Generate private download URL via Cloudinary API (bypasses CDN restrictions)
        const downloadUrl = cloudinary.utils.private_download_url(publicId, 'pdf', {
            resource_type: resourceType,
            type: 'upload',
            attachment: true,
        });

        // Fetch the PDF server-side and stream to client
        const response = await fetch(downloadUrl);
        if (!response.ok) {
            throw new Error(`Cloudinary API returned ${response.status}`);
        }

        const pdfBuffer = await response.arrayBuffer();

        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="certificate-${id}.pdf"`,
                'Content-Length': pdfBuffer.byteLength.toString(),
            },
        });
    } catch (err) {
        console.error('PDF download error:', err);
        return NextResponse.json({ error: 'Failed to retrieve PDF' }, { status: 500 });
    }
}
