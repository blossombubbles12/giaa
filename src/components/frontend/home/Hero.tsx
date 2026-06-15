'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Play, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const slides = [
    {
        id: 1,
        image: 'https://plus.unsplash.com/premium_photo-1681398556150-7fa0d1e72703?auto=format&fit=crop&q=80&w=1600',
        subtitle: 'For HR & L&D Managers',
        title: '“The CEO approved the training budget. The results were embarrassing.”',
        description: 'Generic training offers no real lasting results. We don\'t just train your team. We change how they think and how they show up.',
        cta: 'I\'m In For This. Show Me How',
        href: '/contact'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=1600',
        subtitle: 'For Finance & Accounting Professionals',
        title: '“We started at the same time. Now he\'s miles ahead of me.”',
        description: 'That feeling? Hurts as hell. We call it “knowledge depth.” It\'s exactly what GIA is built to give you.',
        cta: 'Yes, Show Me What I\'ve Been Missing',
        href: '/contact'
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=1600',
        subtitle: 'For SME Owners & Entrepreneurs',
        title: 'You built the business. Now, you feel stuck.',
        description: 'They tell you “hustle more” to break the ceiling. Well, they lied. What works? Better people. Cleaner finances. Sharper systems.',
        cta: 'Show Me How To Break Through',
        href: '/contact'
    }
];

export function Hero() {
    const [current, setCurrent] = useState(0);
    const [reveal, setReveal] = useState<Record<number, boolean>>({});

    const toggleReveal = (id: number) => {
        setReveal(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Auto-play
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 8000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

    return (
        <>
            {/* ═══ Hero Slider (Top) ═══ */}
            <section className="relative w-full h-[70vh] min-h-[600px] overflow-hidden bg-[#020817]">
                <AnimatePresence initial={false} mode="wait">
                    <motion.div
                        key={current}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="absolute inset-0"
                    >
                        {/* Background Image with Overlay */}
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] scale-105"
                            style={{ backgroundImage: `url(${slides[current].image})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#020817] via-[#020817]/90 to-transparent" />
                        
                        {/* Slide Content */}
                        <div className="container relative z-10 mx-auto px-4 md:px-10 h-full flex items-center">
                            <div className="max-w-3xl space-y-6">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-[10px] font-black uppercase tracking-[0.2em]"
                                >
                                    {slides[current].subtitle}
                                </motion.div>

                                <motion.h1
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight"
                                >
                                    {slides[current].title}
                                </motion.h1>

                                <motion.div className="space-y-4">
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className={cn(
                                            "text-sm md:text-base text-slate-400 max-w-xl leading-relaxed font-medium transition-all duration-500",
                                            !reveal[current] && "line-clamp-2 md:line-clamp-none"
                                        )}
                                    >
                                        {slides[current].description}
                                    </motion.p>
                                    
                                    <div className="hidden md:block">
                                        {!reveal[current] ? (
                                            <button 
                                                onClick={() => toggleReveal(current)}
                                                className="text-xs font-black uppercase tracking-widest text-brand hover:text-white transition-colors"
                                            >
                                                Read Full Message [+]
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => toggleReveal(current)}
                                                className="text-xs font-black uppercase tracking-widest text-brand hover:text-white transition-colors"
                                            >
                                                Show Less [-]
                                            </button>
                                        )}
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="pt-4 flex flex-wrap items-center gap-6"
                                >
                                    <Link href={slides[current].href}>
                                        <Button size="sm" className="bg-brand hover:bg-white hover:text-brand text-white rounded-xl h-12 px-8 font-black uppercase tracking-widest active:scale-95 transition-all text-xs group">
                                            {slides[current].cta}
                                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                        No pitch. No pressure.
                                    </span>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Slider Controls */}
                <div className="absolute bottom-6 left-10 md:left-20 z-20 flex items-center gap-4">
                    <div className="flex gap-2">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={cn(
                                    "h-1 transition-all duration-500 rounded-full",
                                    current === i ? "w-8 bg-brand" : "w-4 bg-white/20 hover:bg-white/40"
                                )}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ Why We Exist (Philosophy) ═══ */}
            <section className="relative pt-16 pb-10 lg:pt-24 lg:pb-12 overflow-hidden bg-white dark:bg-[#020617]">
                <div className="container mx-auto px-4 md:px-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-8"
                        >
                            <div className="space-y-4">
                                <h4 className="text-brand font-black uppercase tracking-[0.3em] text-[10px] px-3 py-1 bg-brand/5 border border-brand/10 rounded-full inline-block">
                                    Our Purpose
                                </h4>
                                <h2 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                                    We Didn't Build GIA To Be <span className="text-brand">Another</span> Training Company.
                                </h2>
                                <p className="text-base font-bold text-slate-500">
                                    We were tired of watching good businesses fail their people.
                                </p>
                            </div>

                            <div className="space-y-6 text-[13px] md:text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                <p>
                                    Too many times, we've watched it happen firsthand. Great organisations. Talented people. Real potential lying dormant. Not because the business lacked ambition, but because the development it invested in sucked.
                                </p>
                                
                                <div className="relative">
                                    <div className={cn(
                                        "space-y-6 transition-all duration-500 overflow-hidden",
                                        reveal[99] ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                                    )}>
                                        <p className="text-slate-900 dark:text-white font-black border-l-2 border-brand pl-6">
                                            So we built something different. Not a firm that shows up, talks, and disappears before the results. But a partner that gets her hands dirty.
                                        </p>
                                        <p>
                                            We do the real work: train the people, bridge the knowledge gap, build the systems, and stay until the work is done. That's GIA.
                                        </p>
                                    </div>
                                    
                                    {!reveal[99] ? (
                                        <button 
                                            onClick={() => toggleReveal(99)}
                                            className="mt-2 text-xs font-black uppercase tracking-widest text-brand hover:text-slate-900 dark:hover:text-white transition-colors"
                                        >
                                            Read Our Philisophy [+]
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => toggleReveal(99)}
                                            className="mt-4 text-xs font-black uppercase tracking-widest text-brand hover:text-slate-900 dark:hover:text-white transition-colors"
                                        >
                                            Show Less [-]
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4">
                                <Link href="/about">
                                    <Button variant="outline" size="sm" className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-brand hover:text-white hover:border-brand rounded-xl h-12 px-8 font-black uppercase tracking-widest transition-all group">
                                        Our Story
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:rotate-45 transition-transform" />
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="relative"
                        >
                            <div className="relative z-10 rounded-[2.5rem] overflow-hidden border-4 border-slate-100 dark:border-slate-800 shadow-2xl">
                                <img
                                    src="https://plus.unsplash.com/premium_photo-1682141022525-1ea27f60e201?auto=format&fit=crop&q=80&w=800" 
                                    alt="Our approach"
                                    className="w-full h-auto aspect-square object-cover opacity-80 hover:opacity-100 transition-opacity duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent flex items-bottom p-8">
                                    <div className="mt-auto">
                                        <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mb-2">Client Experience</p>
                                        <p className="text-white text-sm font-medium">"They stayed until the results started showing."</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </>
    );
}
