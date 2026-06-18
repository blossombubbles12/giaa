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
        const { courseId, students } = await req.json();

        if (!courseId || !Array.isArray(students) || students.length === 0) {
            return NextResponse.json({ error: 'courseId and students array are required' }, { status: 400 });
        }

        // Validate course exists
        const course = await db.query.courses.findFirst({ where: eq(courses.id, courseId) });
        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        // Pre-fetch all existing users by email for batch matching
        const emails = students.map(s => s.email?.toLowerCase().trim()).filter(Boolean);
        const existingUsers = emails.length > 0
            ? await db.query.users.findMany({ where: eq(users.email, emails[0]) })
            : [];
        // Note: Drizzle doesn't support IN queries easily with findMany, so we'll check one-by-one

        const results: {
            name: string;
            email: string;
            status: 'success' | 'failed';
            verifyHash?: string;
            shortCode?: string;
            pdfUrl?: string;
            error?: string;
        }[] = [];

        for (const student of students) {
            try {
                const name = (student.name || '').trim();
                const email = (student.email || '').trim().toLowerCase();

                if (!name || !email) {
                    results.push({ name, email, status: 'failed', error: 'Name and email are required' });
                    continue;
                }

                // Check for existing user by email
                const existingUser = await db.query.users.findFirst({ where: eq(users.email, email) });
                const userId = existingUser?.id ?? null;
                const studentName = existingUser?.name || name;

                // Generate certificate
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

                // Upload to Cloudinary
                const uploadResult = await new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        {
                            resource_type: 'image',
                            folder: 'giaconsults',
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

                // Insert to DB
                await db.insert(certificates).values({
                    userId,
                    recipientName: existingUser ? null : name,
                    recipientEmail: existingUser ? null : email,
                    courseId,
                    shortCode,
                    pdfUrl,
                    verifyHash,
                });

                results.push({ name, email, status: 'success', verifyHash, pdfUrl, shortCode });
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Unknown error';
                results.push({ name: student.name, email: student.email, status: 'failed', error: message });
            }
        }

        const successCount = results.filter(r => r.status === 'success').length;
        const failedCount = results.filter(r => r.status === 'failed').length;

        return NextResponse.json({
            total: results.length,
            success: successCount,
            failed: failedCount,
            results,
        });
    } catch (err) {
        console.error('Bulk Certificate Error:', err);
        return NextResponse.json({ error: 'Failed to process bulk upload' }, { status: 500 });
    }
}
