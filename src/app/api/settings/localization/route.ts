import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { getCurrencySymbol } from '@/lib/settings';

export async function GET() {
    try {
        const currencySymbol = await getCurrencySymbol();
        return NextResponse.json({
            currencySymbol
        });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}
