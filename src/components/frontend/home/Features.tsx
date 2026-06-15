'use client';

import {
    Users2,
    TrendingUp,
    Settings2,
    ArrowRight,
    MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

const services = [
    {
        id: 'hcd',
        eyebrow: 'For HR & L&D',
        title: 'Human Capital Development',
        headline: "Your People Aren't the Problem.",
        body: "We show your people how the job should be done. Suddenly, your team members no longer need 24/7 monitoring. We don't just train them — we change how they think and show up.",
        icon: Users2,
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=900',
        href: '/courses'
    },
    {
        id: 'fs',
        eyebrow: 'For Finance',
        title: 'Financial Strategy',
        headline: "Numbers Shouldn't Keep You Up.",
        body: "We train your people to understand money the way it should be understood. When your whole team speaks the language of money, everything gets sharper.",
        icon: TrendingUp,
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=900',
        href: '/courses'
    },
    {
        id: 'obi',
        eyebrow: 'For Operations',
        title: 'Business Improvement',
        headline: 'Systems That Run Without You.',
        body: 'We fix the processes that break down. The workflows that create bottlenecks. The gaps that cost you time, money, and energy every single week.',
        icon: Settings2,
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=900',
        href: '/services/strategy'
    }
];

export function FeatureSection() {
    return (
        <section className="relative pt-10 pb-20 lg:pt-12 lg:pb-24 bg-white dark:bg-[#0F172A] overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-brand/[0.03] transform skew-x-12 translate-x-20" />

            <div className="container mx-auto px-4 md:px-10 relative z-10">
                <div className="max-w-2xl mb-16">
                    <h4 className="text-brand font-black uppercase tracking-[0.3em] text-[10px] mb-4">Our Services</h4>
                    <h2 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                        Three Areas. One Goal. <br />
                        <span className="text-brand">A Business That Works.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {services.map((s, i) => (
                        <motion.div
                            key={s.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Link href={s.href} className="group block h-full">
                                <div className="h-full rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#1E293B]/50 hover:border-brand/40 hover:shadow-2xl transition-all duration-500 flex flex-col">
                                    <div className="relative h-52 overflow-hidden">
                                        <Image
                                            src={s.image}
                                            alt={s.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            sizes="(max-width:1024px) 100vw, 33vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                                        <div className="absolute bottom-4 left-4 flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-brand/90 flex items-center justify-center text-white shrink-0">
                                                <s.icon size={18} />
                                            </div>
                                            <span className="text-[10px] font-black text-brand/90 uppercase tracking-widest">{s.eyebrow}</span>
                                        </div>
                                    </div>
                                    <div className="p-7 flex flex-col flex-grow space-y-3">
                                        <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wide group-hover:text-brand transition-colors">{s.title}</h3>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{s.headline}</p>
                                        <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed flex-grow">{s.body}</p>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-brand flex items-center gap-1 pt-2 group-hover:gap-2 transition-all">
                                            Browse Curriculum <ArrowRight className="h-3 w-3" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-base font-bold text-slate-700 dark:text-slate-300">
                        Not sure where to start? <br className="hidden md:block" />
                        <span className="text-slate-500 font-medium">Let&apos;s talk about your organization&apos;s needs.</span>
                    </p>
                    <Link href="/contact">
                        <Button size="sm" className="bg-brand text-white rounded-xl h-12 px-8 font-black uppercase tracking-widest transition-all flex items-center gap-2">
                            <MessageCircle className="h-4 w-4" />
                            Start Conversation
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
