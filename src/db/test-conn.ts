import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL!);

async function main() {
    try {
        const result = await sql`SELECT now()`;
        console.log('Successfully connected to NeonDB:', result);
        process.exit(0);
    } catch (err) {
        console.error('Failed to connect to NeonDB:', err);
        process.exit(1);
    }
}

main();
