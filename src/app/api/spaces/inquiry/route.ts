import { NextResponse } from 'next/server';
import { db } from '@/db';
import { spaceInquiries } from '@/db/schema';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, spaceName, preferredDate, message } = body;

        if (!name || !email || !phone || !spaceName || !preferredDate) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newInquiry = await db.insert(spaceInquiries).values({
            name,
            email,
            phone,
            spaceName,
            preferredDate: new Date(preferredDate),
            message,
            status: 'PENDING',
        }).returning();

        return NextResponse.json(newInquiry[0]);
    } catch (err) {
        console.error('Space inquiry error:', err);
        return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
    }
}
