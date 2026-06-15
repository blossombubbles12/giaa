import { BookOpen, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import { PageHeader } from '@/components/frontend/layout/PageHeader';

export default function ArticlesPage() {
    return (
        <div className="bg-white dark:bg-[#020617] min-h-screen transition-colors duration-500">
            <PageHeader 
                title="Latest Articles & Insights"
                description="Industry trends, professional development strategies, and updates from the GIA Advisory knowledge base."
                breadcrumbs={[
                    { name: 'Resources', href: '/resources' },
                    { name: 'Articles' }
                ]}
            />

            {/* Articles Grid */}
            <section className="py-24">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Link key={i} href="#" className="group block bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-2xl hover:border-blue-500/30 transition-all duration-500">
                                <div className="h-64 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-slate-100 dark:bg-slate-900 animate-pulse" />
                                    {/* Replace src with dynamic images when connecting to backend */}
                                    <img src={`https://images.unsplash.com/photo-${1550000000000 + i * 1000}?auto=format&fit=crop&q=80&w=600`} alt="Article Cover" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 relative z-10" />
                                </div>
                                <div className="p-8 space-y-4">
                                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                                        <Calendar size={14} /> Oct 12, 2025
                                    </div>
                                    <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white leading-tight group-hover:text-blue-500 transition-colors">
                                        The Future of Professional Accreditation in Africa
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium line-clamp-3">
                                        Exploring the shifting paradigms in corporate training requirements and how regional organizations are adapting to international standardization metrics.
                                    </p>
                                    <div className="pt-4 flex items-center gap-2 text-sm font-black text-blue-500 uppercase tracking-widest">
                                        Read More <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
