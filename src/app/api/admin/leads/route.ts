import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { leads } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const data = await db.query.leads.findMany({
            with: {
                course: {
                    columns: {
                        title: true,
                    }
                }
            },
            orderBy: [desc(leads.createdAt)],
        });
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
    }
}
