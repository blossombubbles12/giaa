import { db } from '@/db';
import { courses, categories, tags } from '@/db/schema';
import { desc, sql } from 'drizzle-orm';
import CourseManagementClient from './CourseManagementClient';
import { getCurrencySymbol } from '@/lib/settings';

export default async function CoursesPage() {
    const limit = 10;
    const [allCourses, allCategories, allTags, currencySymbol, totalCount] = await Promise.all([
        db.query.courses.findMany({
            orderBy: [desc(courses.createdAt)],
            limit,
            with: {
                materials: true,
                schedules: true,
                category: true,
                certificationType: true,
                courseTags: {
                    with: {
                        tag: true
                    }
                }
            }
        }),
        db.query.categories.findMany(),
        db.query.tags.findMany(),
        getCurrencySymbol(),
        db.select({ count: sql<number>`count(*)` }).from(courses)
    ]);

    const initialData = {
        data: allCourses,
        pagination: {
            page: 1,
            limit,
            totalCount: totalCount[0].count,
            totalPages: Math.ceil(totalCount[0].count / limit)
        }
    };

    return <CourseManagementClient
        initialCourses={initialData}
        categories={allCategories}
        tags={allTags}
        currencySymbol={currencySymbol as string}
    />;
}
