import { db } from '@/db';
import { courses, courseSchedules } from '@/db/schema';
import { desc, sql } from 'drizzle-orm';
import ScheduleManagementClient from './ScheduleManagementClient';

export default async function SchedulesPage() {
    const limit = 20;
    const [allSchedules, allCourses, totalCount] = await Promise.all([
        db.query.courseSchedules.findMany({
            orderBy: [desc(courseSchedules.startDate)],
            limit,
            with: {
                course: true
            }
        }),
        db.query.courses.findMany({
            orderBy: [desc(courses.title)],
        }),
        db.select({ count: sql<number>`count(*)` }).from(courseSchedules)
    ]);

    const initialData = {
        data: allSchedules,
        pagination: {
            page: 1,
            limit,
            totalCount: totalCount[0].count,
            totalPages: Math.ceil(totalCount[0].count / limit)
        }
    };

    return <ScheduleManagementClient
        initialSchedules={initialData}
        courses={allCourses}
    />;
}
