'use client';

import { BookOpen, ArrowRight, Calendar, Tag, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/frontend/layout/PageHeader';

const insights = [
  { title: 'Navigating ISO 27001:2025 — What Has Changed?', category: 'ISO Standards', date: 'June 2026', excerpt: 'The revised ISO 27001 standard brings significant changes to information security management. Learn what your organization needs to know.' },
  { title: 'Corporate Tax Compliance in Nigeria: A 2026 Guide', category: 'Tax', date: 'May 2026', excerpt: 'Stay ahead of your tax obligations with our comprehensive guide to corporate tax compliance in Nigeria for 2026.' },
  { title: 'Building an Effective ESG Framework', category: 'ESG', date: 'April 2026', excerpt: 'Environmental, Social, and Governance considerations are no longer optional. Heres how to build a framework that works.' },
  { title: 'Internal Audit Best Practices for Financial Institutions', category: 'Audit', date: 'March 2026', excerpt: 'Strengthen your internal audit function with proven best practices tailored for the financial services sector.' },
  { title: 'Risk Management in an Era of Uncertainty', category: 'Risk', date: 'February 2026', excerpt: 'How organizations can build resilience through enterprise risk management frameworks that adapt to changing conditions.' },
  { title: 'ISO 45001 Implementation: A Step-by-Step Guide', category: 'ISO Standards', date: 'January 2026', excerpt: 'Practical steps for implementing an occupational health and safety management system that protects your workforce.' },
];

const categories = ['All', 'ISO Standards', 'Tax', 'Audit', 'Risk', 'ESG', 'Finance', 'Strategy'];

export default function InsightsPage() {
  return (
    <div className="bg-white dark:bg-slate-950 transition-colors duration-500">
      <PageHeader
        title="Insights & Articles"
        description="Expert perspectives on ISO standards, tax, compliance, risk management, ESG, finance, and business strategy."
        breadcrumbs={[{ name: 'Insights' }]}
      />

      <section className="py-24">
        <div className="container">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-12">
            {categories.map((cat, i) => (
              <button
                key={i}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                  i === 0 ? 'bg-primary-blue text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {insights.map((post, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:border-brand/50 hover:shadow-xl transition-all duration-500"
              >
                <div className="flex items-center gap-3 mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <span className="flex items-center gap-1"><Calendar size={10} /> {post.date}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span className="flex items-center gap-1 text-brand"><Tag size={10} /> {post.category}</span>
                </div>
                <h3 className="text-lg font-bold text-primary-blue dark:text-white mb-3 group-hover:text-brand transition-colors leading-tight">
                  {post.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                  {post.excerpt}
                </p>
                <Link href="#" className="text-xs font-bold text-brand uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read More <ChevronRight size={12} />
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" className="rounded-full h-12 px-8 font-bold border-slate-200 dark:border-slate-700">
              Load More Articles
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}