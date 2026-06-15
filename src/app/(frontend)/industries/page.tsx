'use client';

import { Building2, Factory, Fuel, HardHat, Stethoscope, Cpu, Landmark, Store, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/frontend/layout/PageHeader';

const industries = [
  { name: 'Banking & Financial Services', icon: Landmark, desc: 'Regulatory compliance, risk management, internal audit, and financial control for banks, insurance companies, and financial institutions.' },
  { name: 'Manufacturing', icon: Factory, desc: 'ISO certification, quality management, operational efficiency, supply chain optimization, and health & safety compliance.' },
  { name: 'Oil & Gas', icon: Fuel, desc: 'Risk management, environmental compliance, safety management systems, and governance frameworks for the energy sector.' },
  { name: 'Construction & Real Estate', icon: HardHat, desc: 'Project management systems, quality assurance, safety compliance, and business transformation for construction firms.' },
  { name: 'Healthcare', icon: Stethoscope, desc: 'Medical device quality management (ISO 13485), laboratory compliance, healthcare governance, and risk management.' },
  { name: 'Technology', icon: Cpu, desc: 'Information security (ISO 27001), IT service management (ISO 20000), cybersecurity advisory, and IT governance.' },
  { name: 'Government & Public Sector', icon: Building2, desc: 'Public financial management, compliance systems, governance frameworks, and institutional capacity building.' },
  { name: 'SMEs & Startups', icon: Store, desc: 'Business strategy, tax compliance, financial control setup, HR systems, and growth advisory for small and medium enterprises.' },
];

export default function IndustriesPage() {
  return (
    <div className="bg-white dark:bg-slate-950 transition-colors duration-500">
      <PageHeader
        title="Industries We Serve"
        description="Deep industry expertise applied across diverse sectors to deliver tailored governance, compliance, and performance solutions."
        breadcrumbs={[{ name: 'Industries' }]}
      />

      <section className="py-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((ind, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:border-brand/50 hover:shadow-xl transition-all duration-500"
              >
                <div className="w-16 h-16 rounded-2xl bg-brand/10 flex items-center justify-center text-brand mb-6 group-hover:bg-brand group-hover:text-primary-blue transition-all duration-500">
                  <ind.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-primary-blue dark:text-white mb-4">{ind.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{ind.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/30 border-y border-slate-100 dark:border-slate-800">
        <div className="container">
          <div className="bg-primary-blue rounded-[4rem] p-12 md:p-20 text-center space-y-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #a13938 0%, transparent 70%)' }} />
            <div className="max-w-3xl mx-auto space-y-8 relative z-10">
              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tighter">
                Not Sure Which Service Fits <span className="text-brand">Your Industry?</span>
              </h2>
              <p className="text-white/80 text-lg font-medium">
                Let&apos;s discuss your specific needs and craft a solution tailored to your sector.
              </p>
              <Link href="/contact">
                <Button className="bg-brand hover:bg-brand-dark text-primary-blue font-bold rounded-full h-14 px-10 shadow-xl active:scale-95 transition-all">
                  Schedule a Discussion <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}