import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { certificates } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const studentCertificates = await db.query.certificates.findMany({
            where: eq(certificates.userId, session.user.id),
            with: {
                course: {
                    columns: {
                        title: true,
                        thumbnail: true
                    }
                }
            },
            orderBy: [desc(certificates.issuedAt)],
        });

        return NextResponse.json(studentCertificates);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to fetch certificates' }, { status: 500 });
    }
}
