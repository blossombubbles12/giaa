import { db } from '@/db';
import { courses } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getCurrencySymbol } from '@/lib/settings';
import { CoursesClient } from './CoursesClient';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default async function CoursesPage() {
    const [allCourses, allCategories, allTags, allCertifications, currencySymbol] = await Promise.all([
        db.query.courses.findMany({
            where: eq(courses.published, true),
            orderBy: [desc(courses.createdAt)],
            with: {
                category: true,
                certificationType: true,
                schedules: true,
                courseTags: {
                    with: {
                        tag: true
                    }
                }
            }
        }),
        db.query.categories.findMany(),
        db.query.tags.findMany(),
        db.query.certificationTypes.findMany(),
        getCurrencySymbol()
    ]);

    return (
        <Suspense fallback={<div className="min-h-screen bg-white dark:bg-navy" />}>
            <CoursesClient
                initialCourses={allCourses}
                categories={allCategories}
                tags={allTags}
                certificationTypes={allCertifications}
                currencySymbol={currencySymbol}
            />
        </Suspense>
    );
}
