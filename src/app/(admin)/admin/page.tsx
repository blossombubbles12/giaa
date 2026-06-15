export const dynamic = 'force-dynamic';

import { db } from '@/db';
import { users, courses, enrollments, payments } from '@/db/schema';
import { eq, count, sum, desc } from 'drizzle-orm';
import {
    Users,
    BookOpen,
    BookMarked,
    TrendingUp,
    DollarSign,
    ArrowUpRight,
} from 'lucide-react';

async function getStats() {
    const [totalUsers] = await db.select({ count: count() }).from(users).where(eq(users.role, 'STUDENT'));
    const [totalCourses] = await db.select({ count: count() }).from(courses);
    const [totalEnrollments] = await db.select({ count: count() }).from(enrollments);
    const [revenue] = await db.select({ total: sum(payments.amount) }).from(payments).where(eq(payments.status, 'SUCCESS'));

    return {
        students: totalUsers.count,
        courses: totalCourses.count,
        enrollments: totalEnrollments.count,
        revenue: revenue.total ?? 0,
    };
}

export default async function AdminDashboardPage() {
    const stats = await getStats();

    const statCards = [
        {
            title: 'Total Students',
            value: stats.students.toLocaleString(),
            icon: Users,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10 border-blue-500/20',
            change: '+12% this month',
        },
        {
            title: 'Total Courses',
            value: stats.courses.toLocaleString(),
            icon: BookOpen,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10 border-purple-500/20',
            change: 'Active catalogue',
        },
        {
            title: 'Total Enrollments',
            value: stats.enrollments.toLocaleString(),
            icon: BookMarked,
            color: 'text-green-400',
            bg: 'bg-green-500/10 border-green-500/20',
            change: '+8% this month',
        },
        {
            title: 'Total Revenue',
            value: `£${Number(stats.revenue).toLocaleString('en-GB', { minimumFractionDigits: 2 })}`,
            icon: DollarSign,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10 border-amber-500/20',
            change: 'Successful payments',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
                <p className="text-slate-400 text-sm mt-1">Real-time snapshot of your training platform</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {statCards.map(({ title, value, icon: Icon, color, bg, change }) => (
                    <div key={title} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${bg}`}>
                                <Icon className={`w-5 h-5 ${color}`} />
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-slate-600" />
                        </div>
                        <p className="text-2xl font-bold text-white">{value}</p>
                        <p className="text-slate-400 text-sm mt-1">{title}</p>
                        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {change}
                        </p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-white font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { label: 'Add Course', href: '/admin/courses/new', icon: BookOpen },
                        { label: 'Add User', href: '/admin/users', icon: Users },
                        { label: 'Create Event', href: '/admin/events/new', icon: BookMarked },
                        { label: 'Issue Certificate', href: '/admin/certificates', icon: BookOpen },
                    ].map(({ label, href, icon: Icon }) => (
                        <a
                            key={label}
                            href={href}
                            className="flex items-center gap-2 p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm text-slate-300 hover:text-white transition-all border border-slate-700 hover:border-slate-600"
                        >
                            <Icon size={16} className="text-blue-400 shrink-0" />
                            {label}
                        </a>
                    ))}
                </div>
            </div>

            {/* Empty state notice — Replace with charts later */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
                <TrendingUp className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 font-medium">Revenue & Enrollment Charts</p>
                <p className="text-slate-500 text-sm mt-1">Charts will appear here as data grows</p>
            </div>
        </div>
    );
}
