import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { certificationTypes } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

// GET all certification types
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const allTypes = await db.query.certificationTypes.findMany({
            orderBy: [desc(certificationTypes.createdAt)]
        });
        return NextResponse.json(allTypes);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to fetch certification types' }, { status: 500 });
    }
}

// POST create certification type
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { name, description } = await req.json();

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const [newType] = await db.insert(certificationTypes).values({
            name,
            description
        }).returning();

        return NextResponse.json(newType, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to create certification type' }, { status: 500 });
    }
}
