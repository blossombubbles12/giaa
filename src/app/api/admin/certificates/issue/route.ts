import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { certificates, users, courses } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { v2 as cloudinary } from 'cloudinary';
import { generateCertificatePDF, generateVerificationHash, generateShortCode } from '@/lib/certificates/generator';

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
        const { name, email, courseId } = await req.json();

        if (!name || !email || !courseId) {
            return NextResponse.json({ error: 'Name, email, and course ID are required' }, { status: 400 });
        }

        // 1. Find course
        const course = await db.query.courses.findFirst({ where: eq(courses.id, courseId) });
        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        // 2. Check if user exists by email
        const existingUser = await db.query.users.findFirst({ where: eq(users.email, email) });

        const userId = existingUser?.id ?? null;
        const studentName = existingUser?.name || name;

        // 3. Generate certificate
        const verifyHash = generateVerificationHash(email, courseId);
        const shortCode = generateShortCode();
        const codeUrl = `${shortCode.slice(0, 3)}-${shortCode.slice(3)}`;
        const verificationUrl = `${process.env.NEXTAUTH_URL}/verify/${codeUrl}`;
        const pdfBuffer = await generateCertificatePDF({
            studentName,
            courseTitle: course.title,
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
            verificationUrl,
            shortCode,
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
            recipientName: existingUser ? null : name,
            recipientEmail: existingUser ? null : email,
            courseId,
            shortCode,
            pdfUrl,
            verifyHash,
        }).returning();

        return NextResponse.json(newCert, { status: 201 });
    } catch (err) {
        console.error('Certificate Issuance Error:', err);
        return NextResponse.json({ error: 'Failed to issue certificate' }, { status: 500 });
    }
}
