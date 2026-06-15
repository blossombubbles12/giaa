'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, Landmark, Briefcase, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const audiences = [
    {
        id: 'hr',
        title: 'HR & L&D MANAGER',
        subtitle: 'Leadership & Development',
        headline: 'Fighting for a Seat at the Table.',
        body: 'You know what good training looks like. Seen what happens when it\'s done right. Felt the frustration of watching it done wrong too many times. You don\'t need another motivational trainer who only fires people up for 14 days. You need a partner who\'s obsessed with results as you do.',
        icon: UserCheck,
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
        color: 'bg-brand/5'
    },
    {
        id: 'finance',
        title: 'FINANCE PROFESSIONAL',
        subtitle: 'Numbers & Strategy',
        headline: 'Striving for Knowledge Depth.',
        body: 'You\'re good at what you do, no doubt. Only that good is never good enough. See, you don\'t need more talents like they say. You only need to be more current, more prepared, and more confident in the rooms that matter.',
        icon: Landmark,
        image: 'https://images.unsplash.com/photo-1759310610775-b298f34f73aa?auto=format&fit=crop&q=80&w=800',
        color: 'bg-blue-500/5'
    },
    {
        id: 'sme',
        title: 'SME OWNER',
        subtitle: 'Founders & Entrepreneurs',
        headline: 'Breaking the Growth Ceiling.',
        body: 'How frustrating it feels to stay stuck at a ceiling. You can feel it but can\'t seem to break through. They’ll tell you, “work harder”. Don\'t listen. Instead, do the opposite: Build your people. Clean up your numbers. Create systems that run without you.',
        icon: Briefcase,
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800',
        color: 'bg-emerald-500/5'
    }
];

export function WhoThisIsFor() {
    const [reveal, setReveal] = useState<Record<string, boolean>>({});

    const toggleReveal = (id: string) => {
        setReveal(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <section className="py-20 bg-slate-50 dark:bg-[#020617] relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-10">
                <div className="max-w-3xl mb-16 space-y-3">
                    <h4 className="text-brand font-black uppercase tracking-[0.3em] text-[10px]">Target Audience</h4>
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                        Built for those who demand <br />
                        <span className="text-brand">Real Results.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {audiences.map((a, i) => (
                        <div
                            key={a.id}
                            className={`group relative overflow-hidden rounded-[2rem] bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-brand/30 hover:shadow-md dark:hover:border-brand/30 p-8 flex flex-col h-full transition-all duration-300`}
                        >
                            <div className="mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-6">
                                    <a.icon className="h-6 w-6 text-brand" />
                                </div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{a.subtitle}</span>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase mt-1 mb-3 group-hover:text-brand transition-colors">{a.title}</h3>
                                <p className="text-base font-bold text-slate-700 dark:text-slate-300 leading-snug mb-4">
                                    {a.headline}
                                </p>
                                
                                <div className="space-y-3">
                                    <p className={cn(
                                        "text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium transition-all duration-300",
                                        !reveal[a.id] && "line-clamp-2"
                                    )}>
                                        {a.body}
                                    </p>
                                    <button 
                                        onClick={() => toggleReveal(a.id)}
                                        className="text-[10px] font-black uppercase tracking-widest text-brand inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors"
                                    >
                                        {!reveal[a.id] ? <><ChevronDown size={10} /> Details</> : <><ChevronUp size={10} /> Less</>}
                                    </button>
                                </div>
                            </div>

                            <div className="mt-auto pt-6">
                                <img 
                                    src={a.image} 
                                    alt={a.title} 
                                    className="w-full h-80 object-cover object-top rounded-2xl opacity-40 dark:opacity-30 group-hover:opacity-60 dark:group-hover:opacity-50 transition-opacity duration-500"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center md:text-left flex flex-col md:flex-row items-center gap-8">
                    <p className="text-sm font-bold text-slate-500">
                        Fits multiple profiles? <br className="hidden md:block" />
                        <span className="text-slate-400">We offer integrated solutions for complex needs.</span>
                    </p>
                    <Link href="/contact">
                        <Button size="sm" className="bg-slate-900 border border-slate-700 text-white rounded-xl h-12 px-10 font-black uppercase tracking-widest hover:bg-brand hover:border-brand transition-all group">
                            Let's Connect
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
