'use client';

import Image from 'next/image';
import { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const clients = [
    { id: 1, src: '/client1.webp', alt: 'Client 1' },
    { id: 2, src: '/client2.webp', alt: 'Client 2' },
    { id: 3, src: '/client3.webp', alt: 'Client 3' },
    { id: 4, src: '/client4.png', alt: 'Client 4' },
    { id: 5, src: '/client5.webp', alt: 'Client 5' },
    { id: 6, src: '/client6.webp', alt: 'Client 6' },
    { id: 7, src: '/client7.webp', alt: 'Client 7' },
    { id: 8, src: '/client8.webp', alt: 'Client 8' },
    { id: 9, src: '/client9.webp', alt: 'Client 9' },
];

export function ClientsSection() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (scrollRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                if (scrollLeft + clientWidth >= scrollWidth - 10) {
                    scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    scroll('right');
                }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-16 md:py-24 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="text-left space-y-4 max-w-2xl">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
                            Our Awesome <span className="text-brand">Clients</span>
                        </h2>
                        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
                            Trusted by top enterprises and organizations to upscale their teams and solve complex business challenges.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <button
                            onClick={() => scroll('left')}
                            className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-500 hover:text-brand hover:border-brand/50 hover:bg-brand/5 transition-all outline-none"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-500 hover:text-brand hover:border-brand/50 hover:bg-brand/5 transition-all outline-none"
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="relative w-full overflow-hidden">
                    <div
                        ref={scrollRef}
                        className="flex w-full gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-4"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {clients.map((client) => (
                            <div
                                key={client.id}
                                className="bg-slate-50 dark:bg-slate-950 px-6 py-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-brand/30 transition-all duration-300 w-40 lg:w-48 flex items-center justify-center relative shrink-0 snap-start"
                            >
                                <div className="relative w-full h-16 md:h-20 flex items-center justify-center transition-transform duration-500 hover:scale-110">
                                    <Image
                                        src={client.src}
                                        alt={client.alt}
                                        fill
                                        className="object-contain"
                                        sizes="(max-width: 768px) 128px, (max-width: 1024px) 160px, 192px"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
