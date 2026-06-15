import { db } from '../db/index.js';
import { courseSchedules, courses } from '../db/schema.js';

async function debugSchedules() {
    try {
        console.log('--- Debugging Course Schedules ---');
        
        const allSchedules = await db.query.courseSchedules.findMany({
            with: {
                course: true
            }
        });
        
        console.log(`Total schedules found (with relation): ${allSchedules.length}`);
        
        if (allSchedules.length > 0) {
            allSchedules.forEach((s, i) => {
                console.log(`[${i+1}] ID: ${s.id}`);
                console.log(`    Course ID: ${s.courseId}`);
                console.log(`    Course Title: ${s.course?.title || 'NULL (Relation Failed)'}`);
                console.log(`    Start Date: ${s.startDate}`);
                console.log('---------------------------');
            });
        }

    } catch (error) {
        console.error('Debug Error:', error);
    }
}

debugSchedules();
