import { db } from './index';
import { users, settings } from './schema';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

async function main() {
    console.log('🌱 Seeding database...');

    try {
        // Seed Admin Users
        const adminPassword = await bcrypt.hash('admin123', 10);
        await db.insert(users).values({
            name: 'Admin User',
            email: 'admin@giaadvisory.com',
            password: adminPassword,
            role: 'ADMIN',
        }).onConflictDoNothing();
        console.log('✓ Admin user (admin@giaadvisory.com) ready');

        const debbyPassword = await bcrypt.hash('Debby221$', 10);
        await db.insert(users).values({
            name: 'Debby',
            email: 'debby@giaconsults.com',
            password: debbyPassword,
            role: 'ADMIN',
        }).onConflictDoNothing();
        console.log('✓ Admin user (debby@giaconsults.com) ready');

        // Seed Default Settings
        const defaultSettings = [
            { group: 'GENERAL', key: 'APP_NAME', value: 'GIA Advisory' },
            { group: 'GENERAL', key: 'SUPPORT_EMAIL', value: 'support@giaadvisory.com' },
            { group: 'SECURITY', key: 'MAINTENANCE_MODE', value: 'OFF' },
            { group: 'SECURITY', key: 'REG_ENABLED', value: 'YES' },
            { group: 'LOCALIZATION', key: 'CURRENCY_CODE', value: 'GBP (£)' },
            { group: 'BRANDING', key: 'PRIMARY_COLOR', value: '#2563eb' },
        ];

        for (const s of defaultSettings) {
            await db.insert(settings).values(s).onConflictDoNothing();
        }
        console.log('✓ Default settings ready');

        console.log('\n🚀 Seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('✗ Seeding failed:', err);
        process.exit(1);
    }
}

main();
