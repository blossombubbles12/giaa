import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { enrollments, courses, certificates, bookings, notifications } from '@/db/schema';
import { eq, desc, count } from 'drizzle-orm';
import Link from 'next/link';
import {
    BookOpen,
    Clock,
    ArrowRight,
    Calendar,
    FileText,
    Award,
    CheckCircle2,
    Timer,
    Bell,
    ExternalLink,
    ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';

import { VerificationAlert } from '@/components/dashboard/VerificationAlert';

export default async function StudentDashboard() {
    const session = await getServerSession(authOptions);
    const userId = session!.user.id;
    const isVerified = session?.user?.emailVerified;

    // Fetch Stats
    const [enrollmentCount] = await db.select({ value: count() }).from(enrollments).where(eq(enrollments.userId, userId));
    const [certificateCount] = await db.select({ value: count() }).from(certificates).where(eq(certificates.userId, userId));
    const [bookingCount] = await db.select({ value: count() }).from(bookings).where(eq(bookings.userId, userId));

    // Fetch Recent Activity
    const recentEnrollments = await db.query.enrollments.findMany({
        where: eq(enrollments.userId, userId),
        with: {
            course: {
                with: {
                    materials: true,
                    schedules: true,
                    category: true
                }
            }
        },
        orderBy: [desc(enrollments.createdAt)],
        limit: 3
    });

    const recentNotifications = await db.query.notifications.findMany({
        where: eq(notifications.userId, userId),
        orderBy: [desc(notifications.createdAt)],
        limit: 4
    });

    const stats = [
        { label: 'Active Courses', value: enrollmentCount.value, icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-600/10' },
        { label: 'Certificates', value: certificateCount.value, icon: Award, color: 'text-emerald-500', bg: 'bg-emerald-600/10' },
        { label: 'Upcoming Bookings', value: bookingCount.value, icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-600/10' }
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Verification Alert */}
            {!isVerified && <VerificationAlert isVerified={isVerified} />}

            {/* Header section with Stats */}
            <div className="space-y-6">
                <div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter ">Intelligence Hub</h1>
                    <p className="text-slate-400 font-medium  opacity-80">Welcome back, {session?.user?.name}. You have persistent access to your professional development ecosystem.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 flex items-center justify-between shadow-sm group hover:border-slate-700 transition-all">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">{stat.label}</p>
                                <p className="text-3xl font-black text-white ">{stat.value}</p>
                            </div>
                            <div className={`${stat.bg} ${stat.color} w-16 h-16 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <stat.icon size={28} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main: Recently Accessed Courses */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-xl font-black text-white uppercase tracking-tight  flex items-center gap-2">
                            <Clock className="text-blue-500" size={20} />
                            Resume Learning
                        </h2>
                        <Link href="/dashboard/courses" className="text-[10px] font-black uppercase text-blue-500 hover:text-blue-400 tracking-widest flex items-center gap-2 transition-all group">
                            Full Inventory <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {recentEnrollments.length === 0 ? (
                            <div className="bg-slate-900/40 border-2 border-dashed border-slate-800 rounded-[2.5rem] p-12 text-center">
                                <BookOpen className="text-slate-700 w-12 h-12 mx-auto mb-4" />
                                <h3 className="text-white font-bold  uppercase tracking-tight">No active enrollments</h3>
                                <p className="text-slate-500 text-sm mt-2  max-w-xs mx-auto">Enhance your professional portfolio by starting a new specialized course today.</p>
                                <Link href="/courses" className="mt-8 inline-block">
                                    <Button className="bg-white text-slate-950 hover:bg-slate-100 rounded-2xl px-8 h-12 font-black uppercase tracking-widest shadow-xl shadow-white/10 active:scale-95 transition-all text-xs">
                                        Explore Academy
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            recentEnrollments.map((enrollment) => (
                                <Link key={enrollment.id} href={`/dashboard/courses/${enrollment.course.id}`} className="block group">
                                    <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 flex flex-col md:flex-row gap-6 items-center group-hover:border-slate-700 group-hover:bg-slate-900/80 transition-all shadow-sm">
                                        <div className="w-full md:w-32 h-32 rounded-3xl overflow-hidden bg-slate-800 border border-slate-800 shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-500">
                                            {enrollment.course.thumbnail ? (
                                                <img src={enrollment.course.thumbnail} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-700"><BookOpen size={32} /></div>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-4 text-center md:text-left">
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-black uppercase text-blue-500 tracking-widest">{enrollment.course.category?.name || 'Academic'}</span>
                                                <h3 className="text-xl font-black text-white uppercase  leading-tight group-hover:text-blue-400 transition-colors">{enrollment.course.title}</h3>
                                            </div>
                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                                    <Timer size={14} className="text-slate-600" />
                                                    {enrollment.course.duration || 'Unlimited'}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                                    <FileText size={14} className="text-slate-600" />
                                                    {enrollment.course.materials.length} Resources
                                                </div>
                                                <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                                    <CheckCircle2 size={12} />
                                                    Active
                                                </div>
                                            </div>
                                        </div>
                                        <div className="md:ml-auto">
                                            <div className="w-12 h-12 bg-slate-800/50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                                                <ExternalLink size={20} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>

                    <div className="bg-blue-600/5 border border-blue-600/10 rounded-[2.5rem] p-8 mt-12 flex items-start gap-5 shadow-inner">
                        <div className="w-12 h-12 bg-blue-600/20 border border-blue-600/30 rounded-2xl flex items-center justify-center shrink-0">
                            <ShieldCheck className="text-blue-500" size={24} />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-white uppercase tracking-tight  mb-1">Academic Ledger Integrity</h4>
                            <p className="text-slate-500 text-[10px] leading-relaxed font-bold  opacity-80">
                                Your progress is institutionalized in our secure vault. You can switch devices seamlessly without losing your certification milestones.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Activity & Notifications */}
                <div className="space-y-8">
                    {/* Recent Feed */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-black text-white uppercase tracking-tight  px-2 flex items-center gap-2">
                            <Bell className="text-amber-500" size={18} />
                            Activity Feed
                        </h2>

                        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm">
                            <div className="divide-y divide-slate-800/50">
                                {recentNotifications.length === 0 ? (
                                    <div className="p-10 text-center space-y-2">
                                        <Bell className="w-8 h-8 text-slate-800 mx-auto" />
                                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Zero Alerts</p>
                                    </div>
                                ) : (
                                    recentNotifications.map((notif) => (
                                        <div key={notif.id} className="p-5 hover:bg-slate-800/30 transition-all group cursor-default">
                                            <div className="flex gap-4">
                                                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${notif.read ? 'bg-slate-700' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]'}`} />
                                                <div className="space-y-1">
                                                    <p className="text-sm font-black text-white uppercase leading-tight tracking-tight group-hover:text-blue-400 transition-colors ">{notif.title}</p>
                                                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed opacity-80">{notif.message}</p>
                                                    <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest pt-1">
                                                        {new Date(notif.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            {recentNotifications.length > 0 && (
                                <Link href="#" className="block p-4 bg-slate-800/20 text-center text-[10px] font-black uppercase text-slate-500 hover:text-white transition-all border-t border-slate-800  tracking-[0.2em]">
                                    Archive View
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Support Box */}
                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2.5rem] p-8 space-y-6 text-white shadow-2xl shadow-blue-600/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                        <div className="relative space-y-2">
                            <h3 className="text-xl font-black  uppercase tracking-tight">Need Support?</h3>
                            <p className="text-white/70 text-xs font-medium leading-relaxed ">
                                Encountering technical issues or need academic guidance? Our curators are ready to help.
                            </p>
                        </div>
                        <Button className="w-full bg-white text-blue-600 hover:bg-slate-50 rounded-2xl h-12 font-black uppercase tracking-widest text-[10px] relative z-10">
                            Open Ticket
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
