import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { payments } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const allPayments = await db.query.payments.findMany({
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
            orderBy: [desc(payments.createdAt)],
        });

        return NextResponse.json(allPayments);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
    }
}
