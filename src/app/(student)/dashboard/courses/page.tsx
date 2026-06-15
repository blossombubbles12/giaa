import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { enrollments } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';
import {
    BookOpen,
    Clock,
    ArrowRight,
    Search,
    Filter,
    FileText,
    Calendar,
    Globe,
    MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getCurrencySymbol } from '@/lib/settings';

export default async function MyCoursesPage() {
    const session = await getServerSession(authOptions);
    const userId = session!.user.id;

    const myEnrollments = await db.query.enrollments.findMany({
        where: eq(enrollments.userId, userId),
        with: {
            course: {
                with: {
                    category: true,
                    materials: true,
                    schedules: true
                }
            }
        },
        orderBy: [desc(enrollments.createdAt)]
    });

    const currencySymbol = await getCurrencySymbol();

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">My Professional Vault</h1>
                    <p className="text-slate-400 font-medium italic opacity-80 text-sm mt-1">Access your complete history of specialized training and resources.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={16} />
                        <Input
                            placeholder="Filter your inventory..."
                            className="pl-10 bg-slate-900 border-slate-800 text-sm h-11 rounded-2xl w-full md:w-64 focus:ring-blue-600 focus:border-blue-600 italic shadow-inner"
                        />
                    </div>
                    <Button variant="outline" className="bg-slate-900 border-slate-800 text-slate-400 hover:text-white rounded-2xl h-11 px-4">
                        <Filter size={18} />
                    </Button>
                </div>
            </div>

            {/* Courses Grid */}
            {myEnrollments.length === 0 ? (
                <div className="bg-slate-900/40 border-2 border-dashed border-slate-800 rounded-[3rem] p-24 text-center">
                    <div className="w-20 h-20 bg-slate-800/50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <BookOpen className="text-slate-600 w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight italic">Inventory Empty</h3>
                    <p className="text-slate-500 mt-3 max-w-sm mx-auto italic font-medium">You haven't initiated any specialized training yet. Start by exploring our accredited curriculum.</p>
                    <Link href="/courses" className="mt-10 inline-block">
                        <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl px-10 h-14 font-black uppercase tracking-widest shadow-2xl shadow-blue-600/30 active:scale-95 transition-all">
                            Browse Academy
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {myEnrollments.map((enrollment) => {
                        const course = enrollment.course;
                        return (
                            <div key={enrollment.id} className="group bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden hover:border-blue-500/50 transition-all duration-500 shadow-sm flex flex-col">
                                <div className="relative h-56 bg-slate-800 overflow-hidden">
                                    {course.thumbnail ? (
                                        <img
                                            src={course.thumbnail}
                                            alt={course.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-700 bg-gradient-to-br from-slate-900 to-slate-800">
                                            <BookOpen size={48} />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />

                                    <div className="absolute top-5 right-5">
                                        <div className="bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 px-4 py-1.5 rounded-2xl flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Active</span>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-5 left-5 right-5">
                                        <span className="bg-blue-600/90 backdrop-blur-sm text-[9px] font-black uppercase tracking-[0.2em] text-white px-3 py-1 rounded-lg">
                                            {course.category?.name || 'Professional'}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-8 space-y-6 flex-1 flex flex-col">
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-black text-white uppercase italic leading-tight group-hover:text-blue-400 transition-colors tracking-tight">
                                            {course.title}
                                        </h3>
                                        <p className="text-slate-500 text-xs italic font-medium line-clamp-2 opacity-80 leading-relaxed">
                                            {course.description}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-800/50">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black uppercase text-slate-600 tracking-widest">Delivery</p>
                                            <div className="flex items-center gap-2">
                                                {course.type === 'ONLINE' ? <Globe size={14} className="text-emerald-500" /> : <MapPin size={14} className="text-amber-500" />}
                                                <span className="text-[11px] font-bold text-slate-300">{course.type}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1 text-right">
                                            <p className="text-[9px] font-black uppercase text-slate-600 tracking-widest">Duration</p>
                                            <div className="flex items-center gap-2 justify-end text-slate-300">
                                                <Clock size={14} className="text-blue-500" />
                                                <span className="text-[11px] font-bold">{course.duration || 'Flexible'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-2 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                                                <FileText size={14} className="text-slate-600" />
                                                {course.materials.length} Docs
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                                                <Calendar size={14} className="text-slate-600" />
                                                {course.schedules.length} Sessions
                                            </div>
                                        </div>

                                        <Link href={`/dashboard/courses/${course.id}`}>
                                            <Button className="bg-white text-slate-950 hover:bg-slate-100 rounded-xl px-6 h-10 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-white/5 active:scale-95 transition-all">
                                                Open <ArrowRight size={14} className="ml-1" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
