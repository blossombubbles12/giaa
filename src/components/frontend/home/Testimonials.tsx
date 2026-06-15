'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star, Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Testimonial {
    id: string;
    content: string;
    rating: number;
    user: {
        name: string | null;
        image: string | null;
    };
}

export function TestimonialSection({ testimonials }: { testimonials: Testimonial[] }) {
    const [reveal, setReveal] = useState<Record<string, boolean>>({});

    const toggleReveal = (id: string) => {
        setReveal(prev => ({ ...prev, [id]: !prev[id] }));
    };

    if (testimonials.length === 0) return null;

    return (
        <section className="py-20 bg-[#0F172A] relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-10">
                <div className="mb-16 space-y-4">
                    <h4 className="text-brand font-black uppercase tracking-[.3em] text-[10px]">Testimonials</h4>
                    <h2 className="text-2xl md:text-3xl font-black text-white leading-tight tracking-tight">
                        Don't Take Our Word For It. <br />
                        <span className="text-brand">Hear What Others Say:</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <div
                            key={t.id}
                            className="p-8 rounded-[2rem] bg-[#1E293B]/50 border border-slate-800 relative flex flex-col h-full group hover:border-brand/30 transition-all duration-500"
                        >
                            <Quote className="h-8 w-8 text-brand/10 absolute top-8 right-8 group-hover:text-brand/20 transition-all" />

                            <div className="flex gap-1 mb-6">
                                {[...Array(t.rating)].map((_, j) => (
                                    <Star key={j} className="h-3 w-3 fill-brand text-brand" />
                                ))}
                            </div>

                            <div className="space-y-3 flex-grow">
                                <p className={cn(
                                    "text-sm font-medium text-slate-300 leading-relaxed transition-all duration-300",
                                    !reveal[t.id] && "line-clamp-3"
                                )}>
                                    "{t.content}"
                                </p>
                                <button 
                                    onClick={() => toggleReveal(t.id)}
                                    className="text-[10px] font-black uppercase tracking-widest text-brand inline-flex items-center gap-1 hover:text-white transition-colors"
                                >
                                    {!reveal[t.id] ? <><Plus size={10} /> Read Full</> : <><Minus size={10} /> Less</>}
                                </button>
                            </div>

                            <div className="flex items-center gap-3 mt-8 pt-6 border-t border-slate-800">
                                <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 border-2 border-brand/20 shadow-lg shrink-0">
                                    {t.user.image ? (
                                        <img src={t.user.image} alt={t.user.name || ''} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center font-black text-brand bg-brand/5 text-xs">
                                            {t.user.name?.[0]}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-black text-white uppercase text-[10px] tracking-wider">{t.user.name || 'Anonymous Student'}</span>
                                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Verified Alumni</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
