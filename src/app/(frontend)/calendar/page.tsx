import { db } from '@/db';
import { courses, courseSchedules } from '@/db/schema';
import { gte, asc } from 'drizzle-orm';
import { Calendar as CalendarIcon, Download, MapPin, Clock, FileText, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import { PageHeader } from '@/components/frontend/layout/PageHeader';
import CalendarClient from './CalendarClient';

export const dynamic = 'force-dynamic';

export default async function CalendarPage() {
    const allSchedules = await db.query.courseSchedules.findMany({
        orderBy: [asc(courseSchedules.startDate)],
        with: {
            course: true
        }
    });

    return (
        <div className="bg-transparent pb-32 transition-colors duration-500">

            <PageHeader 
                title="Curriculum Calendar"
                description="Plan your professional development with our comprehensive 2025/2026 curriculum schedule. View upcoming sessions across all our regional hubs."
                breadcrumbs={[{ name: 'Training Calendar' }]}
            />

            <section className="container py-12 space-y-12">
                
                {/* Filterable List */}
                <CalendarClient initialSchedules={allSchedules} />

            </section>

        </div>
    );
}
