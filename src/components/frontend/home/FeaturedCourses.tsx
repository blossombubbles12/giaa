'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Globe2, MapPin, Tag, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Course {
    id: string;
    slug: string;
    title: string;
    description: string;
    price: number;
    thumbnail: string | null;
    type: string;
    duration: string | null;
    category?: { name: string } | null;
    schedules?: { startDate: Date | string }[] | null;
}

export function FeaturedCourses({ courses, currencySymbol }: { courses: Course[], currencySymbol: string }) {
    return (
        <section className="py-10 bg-slate-50 dark:bg-navy">
            <div className="container mx-auto px-4 md:px-6">

                <div className="flex flex-col md:flex-row items-end justify-between gap-4 mb-6">
                    <div className="space-y-4 max-w-2xl">
                        <h4 className="text-brand font-black uppercase tracking-[.3em] text-xs">Upcoming Academy Sessions</h4>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                            World-Class <span className="text-brand">Curriculum</span> <br />
                            for 2026 Careers
                        </h2>
                    </div>
                    <Link href="/courses">
                        <Button variant="ghost" className="rounded-2xl font-black uppercase tracking-widest text-xs gap-2 group">
                            All Professional Courses
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-w-6xl mx-auto">
                    {courses.map((course, i) => {
                        const upcomingSchedule = course.schedules
                            ?.map(s => ({ ...s, date: new Date(s.startDate) }))
                            .filter(s => s.date >= new Date())
                            .sort((a, b) => a.date.getTime() - b.date.getTime())[0];

                        return (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="group bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden hover:border-brand transition-all duration-500 shadow-sm flex flex-col h-full max-w-[360px] w-full"
                            >
                                {/* Card Image */}
                                <div className="relative h-36 overflow-hidden bg-slate-100 dark:bg-slate-900">
                                    {course.thumbnail ? (
                                        <img
                                            src={course.thumbnail}
                                            alt={course.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center opacity-20">
                                            <Tag size={64} />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                                        <Badge className="bg-white/90 backdrop-blur-md text-slate-950 hover:bg-white text-[9px] font-black uppercase px-2 py-1 rounded-md border-0 shadow-lg shadow-black/5 leading-none">
                                            {course.category?.name || 'Professional'}
                                        </Badge>
                                    </div>
                                    <div className="absolute bottom-4 right-4">
                                        <div className="bg-brand text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-xl shadow-brand/20">
                                            {currencySymbol}{Number(course.price).toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="p-3 space-y-2 flex-1 flex flex-col">
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight uppercase group-hover:text-brand transition-colors line-clamp-2">
                                            {course.title}
                                        </h3>
                                        <div
                                            className="text-xs font-medium text-slate-500 leading-relaxed line-clamp-2 opacity-80"
                                            dangerouslySetInnerHTML={{ __html: course.description }}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 py-3 border-y border-slate-100 dark:border-slate-800/50">
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Delivery</span>
                                            <div className="flex items-center gap-1.5">
                                                {course.type === 'ONLINE' ? <Globe2 size={12} className="text-emerald-500" /> : <MapPin size={12} className="text-amber-500" />}
                                                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{course.type}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1.5 items-end">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Next Session</span>
                                            <div className="flex items-center gap-1.5">
                                                {upcomingSchedule ? (
                                                    <>
                                                        <Calendar size={12} className="text-brand" />
                                                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                                            {upcomingSchedule.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Clock size={12} className="text-slate-400" />
                                                        <span className="text-[11px] font-medium text-slate-500">Self-paced</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-2 mt-auto">
                                        <Link href={`/courses/${course.slug}`}>
                                            <Button className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-brand dark:hover:bg-brand hover:text-white rounded-xl h-12 font-black uppercase tracking-widest text-[10px] shadow-sm active:scale-95 transition-all">
                                                Course Details <ArrowRight className="ml-2 h-3 w-3" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
