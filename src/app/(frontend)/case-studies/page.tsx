'use client';

import { FileText, ArrowRight, BarChart3, Shield, Scale, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/frontend/layout/PageHeader';

const cases = [
  {
    title: 'Financial Control Improvement',
    industry: 'Financial Services',
    desc: 'Transformed the internal control framework of a mid-sized financial institution, reducing control deficiencies by 80% within 12 months.',
    icon: BarChart3,
    results: ['80% reduction in control deficiencies', 'Enhanced regulatory compliance score', 'Streamlined audit process'],
  },
  {
    title: 'ISO Certification Success',
    industry: 'Manufacturing',
    desc: 'Guided a manufacturing company through ISO 9001:2015 certification, achieving first-pass approval and establishing a quality management system.',
    icon: Shield,
    results: ['First-pass ISO 9001 certification', '35% improvement in process efficiency', 'Enhanced customer satisfaction ratings'],
  },
  {
    title: 'Tax Compliance Optimization',
    industry: 'Technology',
    desc: 'Restructured the tax compliance framework for a fast-growing tech company, reducing tax liabilities while ensuring full regulatory compliance.',
    icon: Scale,
    results: ['22% reduction in effective tax rate', 'Full regulatory compliance achieved', 'Automated tax reporting system'],
  },
];

export default function CaseStudiesPage() {
  return (
    <div className="bg-white dark:bg-slate-950 transition-colors duration-500">
      <PageHeader
        title="Case Studies"
        description="Real results from our engagements across industries. See how we help organizations achieve measurable improvements."
        breadcrumbs={[{ name: 'Case Studies' }]}
      />

      <section className="py-24">
        <div className="container">
          <div className="space-y-16">
            {cases.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="grid grid-cols-1 lg:grid-cols-5 gap-10 p-10 md:p-14 rounded-[3rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:border-brand/30 transition-all"
              >
                <div className="lg:col-span-3 space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand bg-brand/10 px-3 py-1 rounded-full">{c.industry}</span>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center text-brand shrink-0">
                      <c.icon size={28} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-primary-blue dark:text-white leading-tight tracking-tight">{c.title}</h2>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{c.desc}</p>
                </div>
                <div className="lg:col-span-2 border-l border-slate-200 dark:border-slate-700 pl-10 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-brand">Key Results</h4>
                  <div className="space-y-3">
                    {c.results.map((r, j) => (
                      <div key={j} className="flex items-start gap-3 text-sm font-medium text-primary-blue dark:text-white">
                        <CheckCircle2 size={18} className="text-brand shrink-0 mt-0.5" />
                        {r}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/30 border-y border-slate-100 dark:border-slate-800">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-black text-primary-blue dark:text-white leading-tight tracking-tighter">
              Want to See Similar Results <span className="text-brand">for Your Organization?</span>
            </h2>
            <Link href="/contact">
              <Button className="bg-brand hover:bg-brand-dark text-white font-bold rounded-full h-14 px-10 shadow-xl active:scale-95 transition-all">
                Start Your Success Story <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}