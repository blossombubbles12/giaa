'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const slides = [
  {
    id: 1,
    image: '/images/slider1.jpg',
    tag: 'ISO Certification',
    title: 'Achieve ISO Certification With Confidence',
    description: 'End-to-end implementation support across 50+ ISO standards — Quality, Environmental, Safety, Information Security, and more.',
    cta: 'Explore ISO Services',
    href: '/services/iso',
  },
  {
    id: 2,
    image: '/images/slider2.jpg',
    tag: 'Audit & Financial Control',
    title: 'Strengthen Governance & Financial Integrity',
    description: 'Comprehensive audit, assurance, and financial control services that protect your organisation and build stakeholder trust.',
    cta: 'See Audit Services',
    href: '/services/audit',
  },
  {
    id: 3,
    image: '/images/slider3.jpg',
    tag: 'Risk & Compliance',
    title: 'Stay Ahead of Regulatory Requirements',
    description: 'Enterprise risk frameworks, compliance management systems, and internal controls designed to keep your business protected.',
    cta: 'Explore Risk Advisory',
    href: '/services/risk',
  },
  {
    id: 4,
    image: '/images/slider4.jpg',
    tag: 'Business Strategy',
    title: 'Transform Your Business for Sustainable Growth',
    description: 'From market entry strategy to operational restructuring — we help you build the systems and capabilities that last.',
    cta: 'View Strategy Services',
    href: '/services/strategy',
  },
];

export function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent(p => (p + 1) % slides.length), 7000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent(p => (p === 0 ? slides.length - 1 : p - 1));
  const next = () => setCurrent(p => (p + 1) % slides.length);

  return (
    <section className="relative w-full h-[75vh] min-h-[560px] overflow-hidden bg-slate-950">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-[12s]"
            style={{ backgroundImage: `url('${slides[current].image}')` }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-950/20" />

          {/* Content */}
          <div className="container relative z-10 h-full flex items-center">
            <div className="max-w-2xl space-y-6">
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/15 border border-brand/30 text-brand text-[10px] font-black uppercase tracking-[0.25em]"
              >
                {slides[current].tag}
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tighter"
              >
                {slides[current].title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-sm md:text-base text-slate-300 leading-relaxed max-w-xl font-medium"
              >
                {slides[current].description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-3 pt-2"
              >
                <Link href={slides[current].href}>
                  <Button className="bg-brand hover:bg-brand-dark text-white font-black rounded-full h-12 px-8 text-xs uppercase tracking-widest active:scale-95 transition-all group">
                    {slides[current].cta}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 font-bold rounded-full h-12 px-8 text-xs uppercase tracking-widest transition-all">
                    Request Consultation
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Prev / Next */}
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-brand/80 border border-white/20 flex items-center justify-center text-white transition-all">
        <ChevronLeft size={18} />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-brand/80 border border-white/20 flex items-center justify-center text-white transition-all">
        <ChevronRight size={18} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              'h-1.5 rounded-full transition-all duration-500',
              current === i ? 'w-8 bg-brand' : 'w-3 bg-white/30 hover:bg-white/60'
            )}
          />
        ))}
      </div>
    </section>
  );
}
