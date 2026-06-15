import { db } from '../src/db';
import { posts, courses } from '../src/db/schema';
import { desc } from 'drizzle-orm';

async function checkData() {
    try {
        console.log('--- Latest Posts ---');
        const latestPosts = await db.query.posts.findMany({
            orderBy: [desc(posts.createdAt)],
            limit: 5,
            with: {
                category: true
            }
        });
        console.table(latestPosts.map(p => ({
            id: p.id,
            title: p.title,
            published: p.published,
            createdAt: p.createdAt
        })));

        console.log('\n--- Latest Courses ---');
        const latestCourses = await db.query.courses.findMany({
            orderBy: [desc(courses.createdAt)],
            limit: 5
        });
        console.table(latestCourses.map(c => ({
            id: c.id,
            title: c.title,
            published: c.published,
            createdAt: c.createdAt
        })));

    } catch (err) {
        console.error('Error checking data:', err);
    }
    process.exit(0);
}

checkData();
