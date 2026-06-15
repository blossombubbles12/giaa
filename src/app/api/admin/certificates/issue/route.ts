import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { certificates, users, courses } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { v2 as cloudinary } from 'cloudinary';
import { generateCertificatePDF, generateVerificationHash } from '@/lib/certificates/generator';

// Cloudinary Config (Centralized for this route)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { userId, courseId } = await req.json();

        if (!userId || !courseId) {
            return NextResponse.json({ error: 'User ID and Course ID are required' }, { status: 400 });
        }

        // 1. Fetch Data
        const [student, course] = await Promise.all([
            db.query.users.findFirst({ where: eq(users.id, userId) }),
            db.query.courses.findFirst({ where: eq(courses.id, courseId) }),
        ]);

        if (!student || !course) {
            return NextResponse.json({ error: 'Student or Course not found' }, { status: 404 });
        }

        // 2. Security: Check if certificate already exists
        // (Optional: depending on business logic, but good for idempotency)

        // 3. Generate Logic
        const verifyHash = generateVerificationHash(userId, courseId);
        const verificationUrl = `${process.env.NEXTAUTH_URL}/verify/${verifyHash}`;
        const pdfBuffer = await generateCertificatePDF({
            studentName: student.name || 'Student',
            courseTitle: course.title,
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
            verificationUrl,
        });

        // 4. Upload to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'raw',
                    folder: 'certificates',
                    public_id: `cert_${verifyHash}`,
                    format: 'pdf',
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            stream.end(pdfBuffer);
        });

        const pdfUrl = (uploadResult as any).secure_url;

        // 5. Save to DB
        const [newCert] = await db.insert(certificates).values({
            userId,
            courseId,
            pdfUrl,
            verifyHash,
        }).returning();

        return NextResponse.json(newCert, { status: 201 });
    } catch (err) {
        console.error('Certificate Issuance Error:', err);
        return NextResponse.json({ error: 'Failed to issue certificate' }, { status: 500 });
    }
}
