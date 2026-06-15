import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { settings } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const allSettings = await db.query.settings.findMany();
        return NextResponse.json(allSettings);
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { group, key, value } = await req.json();

        if (!group || !key || value === undefined) {
            return NextResponse.json({ error: 'Group, key, and value are required' }, { status: 400 });
        }

        // Upsert logic
        const existing = await db.query.settings.findFirst({
            where: eq(settings.key, key),
        });

        if (existing) {
            await db.update(settings)
                .set({ value, group, updatedAt: new Date() })
                .where(eq(settings.key, key));
        } else {
            await db.insert(settings).values({
                group,
                key,
                value,
            });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
    }
}
