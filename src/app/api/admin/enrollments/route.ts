import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { enrollments } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const allEnrollments = await db.query.enrollments.findMany({
            with: {
                user: {
                    columns: {
                        name: true,
                        email: true
                    }
                },
                course: {
                    columns: {
                        title: true
                    }
                }
            },
            orderBy: [desc(enrollments.createdAt)],
        });

        return NextResponse.json(allEnrollments);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to fetch enrollments' }, { status: 500 });
    }
}
