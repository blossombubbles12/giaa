import { NextResponse } from 'next/server';
import { db } from '@/db';
import { certificates, users, courses } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ hash: string }> }
) {
    try {
        const { hash } = await params;

        const certificate = await db.query.certificates.findFirst({
            where: eq(certificates.verifyHash, hash),
            with: {
                user: {
                    columns: {
                        name: true,
                    }
                },
                course: {
                    columns: {
                        title: true,
                    }
                }
            }
        });

        if (!certificate) {
            return NextResponse.json({ error: 'Certificate not found or invalid' }, { status: 404 });
        }

        return NextResponse.json({
            valid: true,
            studentName: certificate.user?.name ?? certificate.recipientName,
            courseTitle: certificate.course.title,
            issuedAt: certificate.issuedAt,
            pdfUrl: certificate.pdfUrl,
        });
    } catch (err) {
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
    }
}
