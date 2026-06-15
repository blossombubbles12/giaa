'use client';

import { Shield, Target, Eye, Heart, CheckCircle2, ArrowRight, Quote, Users, Globe, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/frontend/layout/PageHeader';

const values = [
  { name: 'Integrity', desc: 'We uphold the highest ethical standards in every engagement, building trust through transparency and honesty.' },
  { name: 'Excellence', desc: 'We deliver superior quality in every service, continuously raising the bar for consulting excellence.' },
  { name: 'Precision', desc: 'We bring analytical rigor and attention to detail to every project, ensuring accuracy and reliability.' },
  { name: 'Confidentiality', desc: 'We safeguard client information with the utmost discretion and robust data protection practices.' },
  { name: 'Client Focus', desc: 'We prioritize our clients\' needs, delivering tailored solutions that address their unique challenges.' },
];

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-slate-950 transition-colors duration-500">
      <PageHeader
        title="About GIA Advisory"
        description="We are a professional consulting firm helping organizations strengthen governance systems, achieve regulatory compliance, and improve operational performance."
        breadcrumbs={[{ name: 'About Us' }]}
      />

      {/* Mission, Vision, Values */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              { title: 'Our Mission', icon: Target, text: 'To deliver world-class consulting services that strengthen governance, improve compliance, and enhance performance.', color: 'text-brand' },
              { title: 'Our Vision', icon: Eye, text: 'To be a trusted advisory partner for organizations seeking excellence in compliance, finance, and transformation.', color: 'text-brand' },
              { title: 'Our Values', icon: Heart, text: 'Integrity, Excellence, Precision, Confidentiality, Client Focus.', color: 'text-brand' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:border-brand/30 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center text-brand mb-6">
                  <item.icon size={28} />
                </div>
                <h3 className="text-xl font-black text-primary-blue dark:text-white mb-4 uppercase tracking-tight">{item.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/30 border-y border-slate-100 dark:border-slate-800">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h4 className="text-brand font-bold uppercase tracking-[0.3em] text-xs">Who We Are</h4>
              <h2 className="text-3xl md:text-4xl font-black text-primary-blue dark:text-white leading-tight tracking-tighter">
                Specialists in Audit, Tax, Risk, <span className="text-brand">and Business Transformation</span>
              </h2>
              <p className="text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                GIA Advisory Consulting Services is a professional services firm that brings together deep expertise 
                across audit, taxation, risk management, financial advisory, ISO systems implementation, and business 
                strategy. We serve organizations across banking, manufacturing, oil & gas, construction, healthcare, 
                technology, government, and SMEs.
              </p>
              <p className="text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Our team comprises certified professionals including Chartered Accountants, Certified Internal Auditors, 
                ISO Lead Auditors, Risk Management Professionals, and Business Strategy Consultants.
              </p>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden border-8 border-white dark:border-slate-800 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
                  alt="GIA Advisory Team"
                  className="w-full h-auto aspect-[4/3] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h4 className="text-brand font-bold uppercase tracking-[0.3em] text-xs">Our Expertise</h4>
            <h2 className="text-3xl md:text-4xl font-black text-primary-blue dark:text-white leading-tight tracking-tighter">
              What We <span className="text-brand">Deliver</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Financial Governance & Audit Assurance', icon: Shield },
              { name: 'Tax Planning & Compliance', icon: Award },
              { name: 'ISO Implementation & Certification', icon: CheckCircle2 },
              { name: 'Risk Management Frameworks', icon: Target },
              { name: 'Business Strategy Consulting', icon: Globe },
              { name: 'ESG & Sustainability Advisory', icon: Users },
              { name: 'HR & Organizational Development', icon: Users },
              { name: 'IT & Cybersecurity Advisory', icon: Shield },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:border-brand/30 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center text-brand shrink-0">
                  <item.icon size={22} />
                </div>
                <span className="text-sm font-bold text-primary-blue dark:text-white">{item.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/30 border-y border-slate-100 dark:border-slate-800">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h4 className="text-brand font-bold uppercase tracking-[0.3em] text-xs">Our Values</h4>
            <h2 className="text-3xl md:text-4xl font-black text-primary-blue dark:text-white leading-tight tracking-tighter">
              The Principles That Guide <span className="text-brand">Every Engagement</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((val, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-3xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 hover:border-brand/30 transition-all"
              >
                <div className="text-4xl font-black text-brand/20 group-hover:text-brand transition-colors mb-4">
                  0{i + 1}
                </div>
                <h3 className="text-xl font-black text-primary-blue dark:text-white mb-3 uppercase tracking-tight">{val.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/images/bottombanner.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary-blue/88" />
        </div>
        <div className="container relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tighter">
              Ready to Work With <span className="text-brand">Us?</span>
            </h2>
            <p className="text-slate-300 text-lg font-medium max-w-xl mx-auto">
              Let&apos;s discuss how GIA Advisory can help your organization achieve excellence in governance, compliance, and performance.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/contact">
                <Button className="bg-brand hover:bg-brand-dark text-white font-bold rounded-full h-14 px-10 shadow-xl active:scale-95 transition-all">
                  Contact Us <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="mailto:info@giaadvisory.com" className="inline-flex items-center gap-2 border-2 border-white/20 text-white rounded-full h-14 px-10 font-bold text-sm hover:bg-white/10 transition-all">
                info@giaadvisory.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}