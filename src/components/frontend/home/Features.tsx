'use client';

import { useState } from 'react';
import {
    Users2,
    TrendingUp,
    Settings2,
    ArrowRight,
    MessageCircle,
    Plus,
    Minus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const services = [
    {
        id: 'hcd',
        eyebrow: 'For HR & L&D',
        title: 'HUMAN CAPITAL',
        headline: 'Your People Aren\'t the Problem.',
        body: 'We show your people how the job should be done. Suddenly, your team members no longer need 24/7 monitoring. They know what to do and how to do it. We don\'t just train them. We change how they think and show up.',
        icon: Users2,
        color: 'text-brand',
        bg: 'bg-brand/10',
        href: '/courses'
    },
    {
        id: 'fs',
        eyebrow: 'For Finance',
        title: 'FINANCIAL STRATEGY',
        headline: 'Numbers Shouldn\'t Keep You Up.',
        body: 'We train your people to understand money the way it should be understood. Now they can make practical financial decisions without you sweating out at 2 am, fearing the worst. Because when your whole team speaks the language of money, everything gets sharper.',
        icon: TrendingUp,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
        href: '/courses'
    },
    {
        id: 'obi',
        eyebrow: 'For Operations',
        title: 'BUSINESS IMPROVEMENT',
        headline: 'Systems That Run Without You.',
        body: 'We sneak into the engine room of your business. The processes that break down. The workflows that create bottlenecks. The gaps that cost you time, money, and energy every single week. We fix them. And we equip your people to keep them fixed.',
        icon: Settings2,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
        href: '/courses'
    }
];

export function FeatureSection() {
    const [reveal, setReveal] = useState<Record<string, boolean>>({});

    const toggleReveal = (id: string) => {
        setReveal(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <section className="relative pt-10 pb-20 lg:pt-12 lg:pb-24 bg-white dark:bg-[#0F172A] overflow-hidden">
            {/* Background Accent */}
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
                        <div 
                            key={s.id} 
                            className="group p-8 rounded-[2rem] bg-slate-50 dark:bg-[#1E293B]/50 border border-slate-200 dark:border-slate-800 hover:border-brand/40 dark:hover:border-brand/30 transition-all duration-500 flex flex-col h-full"
                        >
                            <div className={`w-14 h-14 ${s.bg} rounded-2xl flex items-center justify-center mb-6`}>
                                <s.icon className={`h-6 w-6 ${s.color}`} />
                            </div>
                            
                            <div className="space-y-4 flex-grow">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.eyebrow}</span>
                                <h3 className="text-base font-black text-slate-900 dark:text-white uppercase leading-tight tracking-wide">{s.title}</h3>
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-snug">
                                    {s.headline}
                                </p>
                                
                                <div className="space-y-2">
                                    <p className={cn(
                                        "text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed transition-all duration-300",
                                        !reveal[s.id] && "line-clamp-2"
                                    )}>
                                        {s.body}
                                    </p>
                                    <button 
                                        onClick={() => toggleReveal(s.id)}
                                        className="text-[10px] font-black uppercase tracking-widest text-brand inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors"
                                    >
                                        {!reveal[s.id] ? <><Plus size={10} /> Details</> : <><Minus size={10} /> Less</>}
                                    </button>
                                </div>
                            </div>

                            <Link href={s.href} className="mt-8">
                                <Button variant="ghost" className="p-0 h-auto hover:bg-transparent text-slate-400 hover:text-brand font-black uppercase tracking-widest text-[10px] flex items-center gap-2 group/btn transition-colors">
                                    Browse Curriculum 
                                    <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-base font-bold text-slate-700 dark:text-slate-300">
                        Not sure where to start? <br className="hidden md:block" />
                        <span className="text-slate-500 font-medium">Let's talk about your organization's needs.</span>
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
