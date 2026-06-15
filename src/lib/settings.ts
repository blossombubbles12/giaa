import { db } from '@/db';
import { settings } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getSetting(key: string, fallback: string = "") {
    const res = await db.query.settings.findFirst({
        where: eq(settings.key, key)
    });
    return res?.value || fallback;
}

export async function getCurrencySymbol() {
    const code = await getSetting('CURRENCY_CODE', 'GBP');
    const symbols: Record<string, string> = {
        'USD': '$',
        'GBP': '£',
        'NGN': '₦',
        'GHS': '₵',
        'XOF': 'CFA',
        'EUR': '€',
        'SLL': 'Le',
        'LRD': '$',
        'GMD': 'D'
    };
    return symbols[code] || symbols['GBP'];
}

export async function formatPrice(amount: number | string) {
    const symbol = await getCurrencySymbol();
    const formatted = Number(amount).toLocaleString();
    return `${symbol}${formatted}`;
}
