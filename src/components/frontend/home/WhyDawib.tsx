'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Clock, 
    Ear, 
    MapPin, 
    Award, 
    UserSearch,
    CheckCircle2,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

const differentiators = [
    {
        id: 'stay',
        keyword: 'We Stay.',
        body: 'Most firms disappear the moment the training ends. We don\'t. We follow up. We check in. We measure whether anything actually changed. Anyone can deliver a workshop, only few care enough to deliver results. Results take longer than two days. In short, we don\'t disappear when you need us the most.',
        icon: Clock,
        color: 'text-brand'
    },
    {
        id: 'listen',
        keyword: 'We Listen First.',
        body: 'We\'ve never shown up to a client with a ready-made solution. We show up with questions. We want to see what the issue is. The gaps. The failed solutions. We\'ve realized: the training that delivers, comes after an understanding, never before it.',
        icon: Ear,
        color: 'text-blue-500'
    },
    {
        id: 'nigeria',
        keyword: 'Build for Nigeria.',
        body: 'We don\'t do copycat. Not hypey frameworks “stolen” from textbooks written for foreign markets. Not fluffy theory that sounds good on paper but falls like a pack of cards in the real Nigerian environment. We build for here. For your people and the realities they face every day.',
        icon: MapPin,
        color: 'text-emerald-500'
    },
    {
        id: 'cmd',
        keyword: 'CMD Accredited.',
        body: 'The Centre for Management Development doesn\'t hand out accreditation lightly. Yet they\'ve got our back. It means every programme we run is verified to meet the highest standard of quality in Nigerian professional development.',
        icon: Award,
        color: 'text-orange-500'
    },
    {
        id: 'truth',
        keyword: 'Tell the Truth.',
        body: 'Okay. This might sting a little bit. If your organisation needs something we can\'t deliver, we tell you upfront. If the problem you think you have isn\'t the real problem, we tell you that too. We\'re consultants, not yes-men.',
        icon: UserSearch,
        color: 'text-red-500'
    }
];

export function WhyGIA() {
    const [reveal, setReveal] = useState<Record<string, boolean>>({});

    const toggleReveal = (id: string) => {
        setReveal(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <section className="py-20 bg-white dark:bg-[#020617] text-slate-900 dark:text-white relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand/10 blur-[150px] rounded-full" />
            </div>

            <div className="container mx-auto px-4 md:px-10 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div className="flex flex-col gap-6">
                        <h4 className="text-brand font-black uppercase tracking-[0.3em] text-[10px]">What Makes Us Different</h4>
                        <h2 className="text-xl md:text-2xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
                            Every firm will tell you they’re different. <br />
                            <span className="text-brand">We actually prove it.</span>
                        </h2>
                        <p className="text-[13px] text-slate-500 leading-relaxed font-medium max-w-md">
                            No boring slide decks. No fluff. Just a partner that understands the Nigerian reality and delivers actual results.
                        </p>

                        {/* Section Image */}
                        <div className="relative mt-2 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xl">
                            <img
                                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800"
                                alt="GIA consulting session"
                                className="w-full h-80 lg:h-96 object-cover object-top"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">Our Approach</p>
                                <p className="text-white text-sm font-bold leading-snug">"Results don't come from training. They come from a partner who stays."</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {differentiators.map((d, i) => (
                            <div key={d.id} className="flex gap-6 group">
                                <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:bg-brand/10 dark:group-hover:bg-brand/20 transition-all duration-500`}>
                                    <d.icon className={`h-6 w-6 ${d.color}`} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                                        {d.keyword}
                                    </h3>
                                    <div className="space-y-2">
                                        <p className={cn(
                                            "text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed transition-all duration-300",
                                            !reveal[d.id] && "line-clamp-1"
                                        )}>
                                            {d.body}
                                        </p>
                                        <button 
                                            onClick={() => toggleReveal(d.id)}
                                            className="text-[10px] font-black uppercase tracking-widest text-brand inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors"
                                        >
                                            {!reveal[d.id] ? <><ChevronDown size={10} /> Reveal</> : <><ChevronUp size={10} /> Hide</>}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
