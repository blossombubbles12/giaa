import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { enrollments, courses } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    BookOpen,
    Clock,
    Globe,
    MapPin,
    Users,
    Target,
    FileText,
    Download,
    Calendar,
    CheckCircle2,
    Lock,
    LinkIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export default async function StudentCoursePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) redirect('/login');

    // Verify enrollment
    const enrollment = await db.query.enrollments.findFirst({
        where: and(eq(enrollments.userId, session.user.id), eq(enrollments.courseId, id)),
    });

    if (!enrollment) {
        redirect('/dashboard');
    }

    const course = await db.query.courses.findFirst({
        where: eq(courses.id, id),
        with: {
            materials: true,
            schedules: true,
            category: true,
            courseTags: {
                with: {
                    tag: true
                }
            }
        }
    });

    if (!course) notFound();

    const upcomingSessions = course.schedules
        .filter((s) => new Date(s.endDate) > new Date())
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    const learningPoints = course.learningOutcomes
        ? course.learningOutcomes.split('\n').filter(Boolean)
        : [];

    return (
        <div className="space-y-8 max-w-5xl animate-in fade-in duration-500">
            {/* Back */}
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors font-medium group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
            </Link>

            {/* Hero */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
                {course.thumbnail ? (
                    <div className="relative h-52 sm:h-64">
                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 w-full p-8">
                            <div className="flex flex-wrap gap-2 mb-3">
                                {course.category && (
                                    <span className="text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white px-3 py-1 rounded-full">
                                        {course.category.name}
                                    </span>
                                )}
                                {course.courseTags.map((ct) => (
                                    <span key={ct.tagId} className="text-[10px] font-bold uppercase tracking-wider bg-slate-800/80 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700">
                                        #{ct.tag.name}
                                    </span>
                                ))}
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">{course.title}</h1>
                        </div>
                    </div>
                ) : (
                    <div className="bg-slate-900 p-8">
                        <h1 className="text-3xl font-extrabold text-white">{course.title}</h1>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main */}
                <div className="lg:col-span-2 space-y-8">
                    {/* About */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
                        <h2 className="text-white font-bold text-lg">About this course</h2>
                        <p className="text-slate-400 text-sm leading-loose">{course.description}</p>
                    </div>

                    {/* Who is it for */}
                    {course.targetAudience && (
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
                            <h2 className="text-white font-bold text-lg flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-500" />
                                Who is this for?
                            </h2>
                            <p className="text-slate-400 text-sm leading-loose">{course.targetAudience}</p>
                        </div>
                    )}

                    {/* Learning Outcomes */}
                    {learningPoints.length > 0 && (
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
                            <h2 className="text-white font-bold text-lg flex items-center gap-2">
                                <Target className="w-5 h-5 text-purple-500" />
                                What you'll learn
                            </h2>
                            <ul className="space-y-3">
                                {learningPoints.map((point, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Upcoming Sessions */}
                    {course.schedules.length > 0 && (
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
                            <h2 className="text-white font-bold text-lg flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-amber-500" />
                                Upcoming Sessions
                            </h2>
                            <div className="space-y-3">
                                {course.schedules.map((session) => {
                                    const isPast = new Date(session.endDate) < new Date();
                                    return (
                                        <div
                                            key={session.id}
                                            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 rounded-2xl border ${isPast
                                                ? 'border-slate-800 bg-slate-800/20 opacity-50'
                                                : 'border-amber-500/20 bg-amber-500/5'
                                                }`}
                                        >
                                            <div>
                                                <p className={`text-sm font-bold ${isPast ? 'text-slate-500' : 'text-white'}`}>
                                                    {format(new Date(session.startDate), 'EEEE, MMMM d, yyyy')}
                                                </p>
                                                <p className={`text-xs mt-0.5 ${isPast ? 'text-slate-600' : 'text-slate-400'}`}>
                                                    {format(new Date(session.startDate), 'h:mm a')} — {format(new Date(session.endDate), 'h:mm a')}
                                                    {session.location && ` · ${session.location}`}
                                                </p>
                                            </div>
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl whitespace-nowrap ${isPast
                                                ? 'bg-slate-800 text-slate-500'
                                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                                }`}>
                                                {isPast ? 'Past' : 'Upcoming'}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Course Meta */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                        <h3 className="text-white font-bold text-sm uppercase tracking-widest">Course Details</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center">
                                    {course.type === 'ONLINE' ? <Globe className="w-4 h-4 text-emerald-400" /> : <MapPin className="w-4 h-4 text-amber-400" />}
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase text-slate-600 tracking-widest">Format</p>
                                    <p className="text-white font-medium">{course.type}</p>
                                </div>
                            </div>

                            {course.duration && (
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center">
                                        <Clock className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase text-slate-600 tracking-widest">Duration</p>
                                        <p className="text-white font-medium">{course.duration}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase text-slate-600 tracking-widest">Status</p>
                                    <p className="text-emerald-400 font-bold">Enrolled</p>
                                </div>
                            </div>
                        </div>

                        {/* Access Link */}
                        {course.type === 'ONLINE' && course.accessLink && (
                            <a
                                href={course.accessLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-500 text-white rounded-2xl py-3 text-sm font-bold transition-all shadow-xl shadow-blue-600/20"
                            >
                                <LinkIcon className="w-4 h-4" />
                                Join Course Session
                            </a>
                        )}
                    </div>

                    {/* Materials */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                        <h3 className="text-white font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                            <FileText className="w-4 h-4 text-rose-400" />
                            Course Materials
                        </h3>

                        {course.materials.length === 0 ? (
                            <p className="text-slate-600 text-xs text-center py-4 border border-dashed border-slate-800 rounded-xl">
                                No materials available yet
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {course.materials.map((material) => (
                                    <a
                                        key={material.id}
                                        href={material.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download
                                        className="flex items-center justify-between bg-slate-800/50 hover:bg-slate-800 px-4 py-3 rounded-xl border border-slate-700 group transition-all"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                                                <FileText className="w-4 h-4 text-rose-400" />
                                            </div>
                                            <span className="text-xs font-medium text-slate-300 truncate group-hover:text-white transition-colors">
                                                {material.title}
                                            </span>
                                        </div>
                                        <Download className="w-4 h-4 text-slate-500 group-hover:text-white shrink-0 transition-colors" />
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
