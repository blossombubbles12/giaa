import { db } from '@/db';
import { courses, enrollments } from '@/db/schema';
import { eq, count, and, not, or } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
    BookOpen,
    Clock,
    Globe2,
    MapPin,
    Users,
    Target,
    CheckCircle2,
    ShieldCheck,
    ArrowRight,
    FileText,
    Calendar,
    Download,
    Play,
    Award,
    BarChart3,
    Tv,
    Smartphone,
    Star,
    ChevronRight,
    Share2,
    Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { getCurrencySymbol } from '@/lib/settings';
import { ContactForm } from '@/components/frontend/forms/ContactForm';
import { CourseBrochure } from '@/components/frontend/courses/CourseBrochure';

export const dynamic = 'force-dynamic';

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    
    const course = await db.query.courses.findFirst({
        where: or(eq(courses.slug, slug), eq(courses.id, slug)),
        with: {
            category: true,
            lessons: {
                orderBy: (lessons, { asc }) => [asc(lessons.order)]
            },
            materials: true,
            schedules: true,
            certificationType: true,
            courseTags: {
                with: {
                    tag: true
                }
            }
        }
    });

    if (!course || !course.published) notFound();

    // Fetch related courses in the same category (limit 3, excluding current)
    const relatedCourses = await db.query.courses.findMany({
        where: and(
            eq(courses.published, true),
            not(eq(courses.slug, course.slug)),
            course.categoryId ? eq(courses.categoryId, course.categoryId) : undefined
        ),
        limit: 3,
        with: {
            category: true,
            schedules: true,
        },
        orderBy: (courses, { desc }) => [desc(courses.createdAt)]
    });

    // Find the next upcoming schedule
    const upcomingSchedule = course.schedules
        .map(s => ({ ...s, date: new Date(s.startDate) }))
        .filter(s => s.date >= new Date())
        .sort((a, b) => a.date.getTime() - b.date.getTime())[0];

    const currencySymbol = await getCurrencySymbol();

    // Get enrollment count for social proof
    const [enrollmentCount] = await db.select({ count: count() }).from(enrollments).where(eq(enrollments.courseId, course.id));
    const totalStudents = enrollmentCount?.count || 0;
    const totalLessons = course.lessons.length;
    const totalMaterials = course.materials.length;

    return (
        <div className="bg-white dark:bg-navy">

            {/* ═══ Contained Course Hero ═══ */}
            <div className="container pt-10">
                <section className="relative py-12 md:py-16 rounded-[2.5rem] overflow-hidden group shadow-2xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-900 text-white">
                    {/* Background Overlay */}
                    <div className="absolute inset-0 z-0 opacity-20">
                        {course.thumbnail && (
                            <img src={course.thumbnail} alt="" className="w-full h-full object-cover blur-2xl scale-110" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/40 to-transparent" />
                    </div>

                    <div className="relative z-10 px-6 md:px-12 flex flex-col gap-6">
                        {/* Breadcrumb - Fluid & Wrapped */}
                        <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <Link href="/courses" className="hover:text-brand transition-colors">Academy</Link>
                            <ChevronRight size={10} className="text-slate-600" />
                            {course.category && (
                                <>
                                    <span className="text-slate-500">{course.category.name}</span>
                                    <ChevronRight size={10} className="text-slate-600" />
                                </>
                            )}
                            <span className="text-brand truncate max-w-[150px] md:max-w-xs">{course.title}</span>
                        </nav>

                        <div className="max-w-4xl space-y-4">
                            {/* Course Type Badge */}
                            <div className="flex flex-wrap gap-2">
                                <Badge className="bg-brand text-white border-0 text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">
                                    {course.type}
                                </Badge>
                                {course.certificationType && (
                                    <Badge className="bg-white/10 text-white border border-white/20 text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-lg flex items-center gap-1.5">
                                        <Award size={10} className="text-brand" />
                                        {course.certificationType.name}
                                    </Badge>
                                )}
                            </div>

                            {/* Title - Fluid Size */}
                            <h1 className="text-2xl md:text-3xl lg:text-5xl font-black leading-tight tracking-tighter uppercase max-w-3xl">
                                {course.title}
                            </h1>

                            {/* Meta Info - Compact Grid/Wrap */}
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-0.5 text-amber-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={12} className="fill-current" />
                                        ))}
                                    </div>
                                    <span className="text-xs font-black text-amber-500">4.8</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">({Math.max(totalStudents * 3, 12)} Reviews)</span>
                                </div>
                                <div className="h-4 w-px bg-slate-800 hidden md:block" />
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-300">
                                    <Users size={14} className="text-brand" />
                                    {Math.max(totalStudents, 5).toLocaleString()} Enrolled
                                </div>
                                {upcomingSchedule && (
                                    <>
                                        <div className="h-4 w-px bg-slate-800 hidden md:block" />
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                                            <Calendar size={14} />
                                            Next: {upcomingSchedule.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Mobile CTA (shown below lg) - More Compact */}
                        <div className="lg:hidden mt-2 space-y-3">
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Course Price</span>
                                    <span className="text-xl font-black text-white">{currencySymbol}{Number(course.price).toLocaleString()}</span>
                                </div>
                                <Link href={`/checkout/${course.slug}`} className="flex-1 max-w-[160px]">
                                    <Button className="w-full bg-brand hover:bg-white hover:text-brand text-white h-10 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-brand/20 transition-all">
                                        Enroll Now
                                    </Button>
                                </Link>
                            </div>
                            <CourseBrochure course={course} currencySymbol={currencySymbol} />
                        </div>
                    </div>
                </section>
            </div>

            {/* ═══ Main Content + Sidebar ═══ */}
            <div className="container relative">
                <div className="flex flex-col lg:flex-row gap-12 py-12">

                    {/* ——— Left Column: Course Content ——— */}
                    <div className="flex-1 space-y-12 min-w-0">

                        {/* Full Description - Contained & Wrapped */}
                        <div className="bg-slate-50 dark:bg-slate-900/40 rounded-[2rem] p-8 md:p-10 border border-slate-100 dark:border-slate-800 space-y-6 overflow-hidden max-w-full">
                            <div className="flex items-center gap-3">
                                <div className="h-6 w-1 bg-brand rounded-full" />
                                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Executive Summary</h2>
                            </div>
                            <div
                                className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed prose prose-sm md:prose-base dark:prose-invert max-w-full break-words [&>img]:rounded-2xl [&>img]:max-w-full [&>table]:w-full [&>table]:overflow-x-auto [&>table]:block"
                                dangerouslySetInnerHTML={{ __html: course.description }}
                            />
                        </div>

                        {/* "What you'll learn" Box (Udemy signature) */}
                        <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-8">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">What you&apos;ll learn</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(course.learningOutcomes ? course.learningOutcomes.replace(/<[^>]*>/g, '').split(/[.•\n]/).filter((s: string) => s.trim().length > 10) : [
                                    'Gain globally recognized certifications',
                                    'Master industry best practices and standards',
                                    'Develop practical, real-world skills',
                                    'Build professional authority in your field'
                                ]).slice(0, 8).map((outcome: string, i: number) => (
                                    <div key={i} className="flex gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                                        <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{outcome.trim()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Stats Row (Coursera-inspired) */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { icon: Clock, label: 'Duration', value: course.duration || 'Flexible', color: 'text-blue-500' },
                                { icon: MapPin, label: 'Location', value: course.venue || (course.type === 'ONLINE' ? 'Global/Online' : 'In-Person'), color: 'text-rose-500' },
                                { icon: Calendar, label: 'Timing', value: course.year && course.month ? `${course.month} ${course.year}` : 'Self-paced', color: 'text-amber-500' },
                                { icon: Globe2, label: 'Format', value: course.type === 'ONLINE' ? 'Online' : 'In-Person', color: 'text-emerald-500' }
                            ].map((stat, i) => (
                                <div key={i} className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-5 flex items-start gap-4 border border-slate-100 dark:border-slate-800">
                                    <div className={`${stat.color} mt-0.5`}>
                                        <stat.icon size={22} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{stat.label}</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Who is this for */}
                        {course.targetAudience && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Users className="h-5 w-5 text-blue-500" />
                                    Who this course is for
                                </h2>
                                <div
                                    className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed prose prose-sm dark:prose-invert max-w-none"
                                    dangerouslySetInnerHTML={{ __html: course.targetAudience }}
                                />
                            </div>
                        )}

                        {/* ——— Course Curriculum (Udemy-style accordion) ——— */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Course Content</h2>
                                <span className="text-sm text-slate-500 font-medium">
                                    {totalLessons} {totalLessons === 1 ? 'section' : 'sections'}
                                </span>
                            </div>

                            {course.lessons.length > 0 ? (
                                <Accordion type="single" collapsible className="w-full border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-200 dark:divide-slate-800">
                                    {course.lessons.map((lesson, i) => (
                                        <AccordionItem key={lesson.id} value={`item-${i}`} className="border-0">
                                            <AccordionTrigger className="hover:no-underline px-6 py-4 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
                                                <div className="flex items-center gap-4 text-left w-full">
                                                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-950 flex items-center justify-center text-xs font-bold text-brand border border-slate-200 dark:border-slate-800 shrink-0">
                                                        {i + 1}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <span className="text-sm font-semibold text-slate-900 dark:text-white block truncate">
                                                            {lesson.title}
                                                        </span>
                                                    </div>
                                                    {lesson.videoUrl && (
                                                        <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0">
                                                            <Play size={12} className="fill-current" />
                                                            <span>Video</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="px-6 pb-6 pt-3 bg-white dark:bg-navy">
                                                <div className="pl-12 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                                    {lesson.content || 'Detailed module content covering specialized industry standards and practical applications.'}
                                                    {lesson.videoUrl && (
                                                        <div className="mt-3 flex items-center gap-2 text-brand text-xs font-semibold">
                                                            <Play size={14} className="fill-current" />
                                                            Video Lesson Included
                                                        </div>
                                                    )}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            ) : (
                                <div className="p-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center">
                                    <BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                                    <p className="text-slate-400 font-medium text-sm">Curriculum details being updated for the next session.</p>
                                </div>
                            )}
                        </div>

                        {/* Downloadable Materials */}
                        {course.materials.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-purple-500" />
                                    Downloadable Resources
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {course.materials.map((m) => (
                                        <a
                                            key={m.id}
                                            href={m.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:border-brand hover:bg-brand/5 transition-all group"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-950 flex items-center justify-center border border-slate-200 dark:border-slate-800 group-hover:border-brand/30 transition-colors">
                                                <Download size={16} className="text-slate-400 group-hover:text-brand transition-colors" />
                                            </div>
                                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-brand transition-colors truncate">{m.title}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Training Schedule Section */}
                        {course.schedules.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-blue-500" />
                                    Upcoming Sessions
                                </h2>
                                <div className="space-y-3">
                                    {course.schedules.map((s) => (
                                        <div key={s.id} className="flex items-center justify-between p-5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-xl bg-white dark:bg-slate-950 flex flex-col items-center justify-center border border-slate-200 dark:border-slate-800 shrink-0">
                                                    <span className="text-xs font-bold text-brand uppercase">{new Date(s.startDate).toLocaleDateString('en-GB', { month: 'short' })}</span>
                                                    <span className="text-lg font-extrabold text-slate-900 dark:text-white leading-none">{new Date(s.startDate).getDate()}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                                                        {new Date(s.startDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </p>
                                                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                                                        <MapPin size={12} /> {s.location || 'Online Session'}
                                                    </p>
                                                </div>
                                            </div>
                                            <Link href={`/checkout/${course.slug}`}>
                                                <Button size="sm" className="bg-brand hover:bg-brand/90 text-white rounded-lg text-xs font-bold px-4 shadow-sm">
                                                    Enroll
                                                </Button>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ——— Right Column: Sticky Sidebar (Desktop) ——— */}
                    <div className="hidden lg:block w-[380px] shrink-0">
                        <div className="sticky top-24 space-y-6">

                            {/* Course Card */}
                            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden">

                                {/* Thumbnail with play button */}
                                <div className="relative aspect-video bg-slate-100 dark:bg-slate-900 overflow-hidden group cursor-pointer">
                                    {course.thumbnail ? (
                                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                            <BookOpen size={48} />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl">
                                            <Play fill="black" className="text-black ml-1" size={24} />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 space-y-5">
                                    {/* Price */}
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                                            {currencySymbol}{Number(course.price).toLocaleString()}
                                        </span>
                                    </div>

                                    {/* CTA Buttons */}
                                    <Link href={`/checkout/${course.slug}`} className="block">
                                        <Button className="w-full bg-brand hover:bg-brand/90 text-white h-14 rounded-xl font-bold text-base shadow-lg shadow-brand/25 transition-all active:scale-[0.98]">
                                            Enroll Now
                                        </Button>
                                    </Link>
                                    <p className="text-center text-xs text-slate-400">Full access • Certificate included</p>

                                    {/* Course includes */}
                                    <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-4">
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">This course includes:</h4>
                                        <ul className="space-y-3">
                                            {[
                                                { icon: Clock, text: `${course.duration || 'Flexible'} of content` },
                                                { icon: BookOpen, text: `${totalLessons} comprehensive lessons` },
                                                ...(upcomingSchedule ? [{ icon: Calendar, text: `Next Session: ${upcomingSchedule.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}` }] : []),
                                                { icon: FileText, text: `${totalMaterials} downloadable resources` },
                                                { icon: Tv, text: 'Full lifetime access' },
                                                { icon: Smartphone, text: 'Access on mobile and desktop' },
                                                { icon: Award, text: course.certificationType ? `${course.certificationType.name} Certificate` : 'Certificate of completion' },
                                            ].map((item, i) => (
                                                <li key={i} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                                    <item.icon size={16} className="shrink-0" />
                                                    <span>{item.text}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Share / Wishlist / Brochure */}
                                    <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-3">
                                        <CourseBrochure course={course} currencySymbol={currencySymbol} />
                                        
                                        <div className="flex items-center gap-3 pt-1">
                                            <Button variant="outline" size="sm" className="flex-1 rounded-lg border-slate-200 dark:border-slate-700 text-slate-500 hover:text-brand hover:border-brand gap-2 text-xs font-semibold">
                                                <Share2 size={14} /> Share
                                            </Button>
                                            <Button variant="outline" size="sm" className="flex-1 rounded-lg border-slate-200 dark:border-slate-700 text-slate-500 hover:text-red-500 hover:border-red-300 gap-2 text-xs font-semibold">
                                                <Heart size={14} /> Wishlist
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl p-5 space-y-3">
                                {[
                                    { icon: ShieldCheck, text: 'Internationally Accredited', color: 'text-emerald-500' },
                                    { icon: Award, text: 'ISO 9001:2015 Certified', color: 'text-blue-500' },
                                    { icon: BarChart3, text: '98% Completion Rate', color: 'text-brand' },
                                ].map((badge, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <badge.icon size={18} className={badge.color} />
                                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{badge.text}</span>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            {/* ═══ Lead Capture Section ═══ */}
            <section className="py-12 md:py-24 border-t border-slate-100 dark:border-slate-800">
                <div className="container">
                    <div className="max-w-5xl mx-auto bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] md:rounded-[4rem] p-6 md:p-16 border border-slate-100 dark:border-slate-800 shadow-xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
                            <div className="space-y-4 md:space-y-6 text-center lg:text-left">
                                <h4 className="text-brand font-black uppercase tracking-[.3em] text-[10px]">Still have questions?</h4>
                                <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">
                                    Inquire about <br className="hidden md:block" />
                                    <span className="text-brand">This Course</span>
                                </h2>
                                <p className="text-sm md:text-base text-slate-500 font-medium">
                                    Need more details about the curriculum, certification, or corporate group discounts? Send us a quick message.
                                </p>
                            </div>
                            <div className="bg-white dark:bg-slate-950 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800">
                                <ContactForm 
                                    source="COURSE_DETAIL" 
                                    courseId={course.id} 
                                    defaultSubject={`Inquiry: ${course.title}`}
                                    className="!grid-cols-1 !gap-4"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ Related Courses ═══ */}
            {relatedCourses.length > 0 && (
                <section className="py-24 bg-slate-50 dark:bg-navy border-t border-slate-100 dark:border-slate-800">
                    <div className="container">
                        <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12 text-center md:text-left">
                            <div className="space-y-3">
                                <h4 className="text-brand font-black uppercase tracking-[.3em] text-[10px]">Upgrade Your Skills</h4>
                                <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                                    Related <span className="text-brand">Courses</span>
                                </h2>
                            </div>
                            <Link href="/courses">
                                <Button variant="ghost" className="rounded-xl font-bold uppercase tracking-widest text-[10px] gap-2 group flex mx-auto md:mx-0">
                                    View All Courses <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedCourses.map((rc) => {
                                const rcUpcomingSchedule = rc.schedules
                                    ?.map(s => ({ ...s, date: new Date(s.startDate) }))
                                    .filter(s => s.date >= new Date())
                                    .sort((a, b) => a.date.getTime() - b.date.getTime())[0];

                                return (
                                    <Link
                                        key={rc.id}
                                        href={`/courses/${rc.slug}`}
                                        className="group bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden hover:border-brand transition-all duration-500 shadow-sm flex flex-col h-full max-w-[360px] mx-auto w-full"
                                    >
                                        <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-900">
                                            {rc.thumbnail ? (
                                                <img src={rc.thumbnail} alt={rc.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center opacity-20">
                                                    <BookOpen size={48} />
                                                </div>
                                            )}
                                            <div className="absolute top-4 left-4">
                                                <Badge className="bg-white/90 backdrop-blur-md text-slate-950 hover:bg-white text-[9px] font-black uppercase px-2 py-1 rounded-md border-0 shadow-lg">
                                                    {rc.category?.name || 'Professional'}
                                                </Badge>
                                            </div>
                                            <div className="absolute bottom-4 right-4">
                                                <div className="bg-brand text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-xl shadow-brand/20">
                                                    {currencySymbol}{Number(rc.price).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6 space-y-4 flex-1 flex flex-col">
                                            <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight uppercase group-hover:text-brand transition-colors line-clamp-2">
                                                {rc.title}
                                            </h3>
                                            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
                                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                                                    {rc.type === 'ONLINE' ? <Globe2 size={12} className="text-emerald-500" /> : <MapPin size={12} className="text-amber-500" />}
                                                    {rc.type}
                                                </div>
                                                {rcUpcomingSchedule ? (
                                                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-brand">
                                                        <Calendar size={12} />
                                                        {rcUpcomingSchedule.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                                                        <Clock size={12} />
                                                        Self-paced
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* ═══ Bottom CTA Banner ═══ */}
            <section className="bg-slate-900 border-t border-slate-800">
                <div className="container py-16">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <h2 className="text-3xl font-extrabold text-white tracking-tight">
                            Ready to advance your career?
                        </h2>
                        <p className="text-slate-400 font-medium max-w-xl mx-auto">
                            Join thousands of professionals who have transformed their careers with GIA Advisory. Get certified today.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                            <Link href={`/checkout/${course.slug}`}>
                                <Button className="bg-brand hover:bg-brand/90 text-white rounded-xl h-14 px-10 font-bold text-base shadow-xl shadow-brand/25 gap-2">
                                    Enroll for {currencySymbol}{Number(course.price).toLocaleString()} <ArrowRight size={18} />
                                </Button>
                            </Link>
                            <Link href="/courses">
                                <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl h-14 px-10 font-bold text-base">
                                    Browse All Courses
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
