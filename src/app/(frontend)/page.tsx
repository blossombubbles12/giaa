'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, FileCheck, Scale, BarChart3, LineChart, Globe, Users, Lock, CheckCircle2, Quote, Target, Eye, Heart } from 'lucide-react';

const services = [
  { title: 'Financial Governance & Audit Assurance', desc: 'Strengthen internal controls and ensure financial integrity with our comprehensive audit and assurance services.', icon: FileCheck },
  { title: 'Tax Planning & Compliance', desc: 'Navigate complex tax regulations with strategic planning and full compliance support.', icon: Scale },
  { title: 'ISO Implementation Support', desc: 'Achieve certification across 50+ ISO standards including 9001, 14001, 27001, 45001, and more.', icon: Shield },
  { title: 'Risk Management', desc: 'Enterprise risk frameworks, compliance systems, and internal controls to protect your organization.', icon: BarChart3 },
  { title: 'Business Strategy Consulting', desc: 'Growth strategy, business model design, and operational restructuring for sustainable performance.', icon: LineChart },
  { title: 'ESG & Sustainability Advisory', desc: 'Implement ESG frameworks and sustainability reporting aligned with global standards.', icon: Globe },
  { title: 'HR & Organizational Development', desc: 'Develop robust HR policies and performance management systems that drive results.', icon: Users },
  { title: 'IT & Cybersecurity Advisory', desc: 'Strengthen IT governance and protect against cyber threats with expert advisory services.', icon: Lock },
];

const whyUs = [
  { title: 'Technical Expertise', desc: 'Deep specialization across audit, tax, risk, ISO, and strategy with certified professionals.', icon: Shield },
  { title: 'Practical Implementation', desc: 'We dont just advise — we help you implement with hands-on support and structured delivery.', icon: CheckCircle2 },
  { title: 'Compliance Focus', desc: 'Regulatory compliance is at the core of everything we do, ensuring you stay ahead of requirements.', icon: Target },
  { title: 'Results-Driven', desc: 'Every engagement is measured against clear KPIs and business outcomes.', icon: BarChart3 },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-0 overflow-hidden">

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[90vh] flex items-center bg-primary-blue overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-blue via-primary-blue to-slate-900" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, #a13938 0%, transparent 50%), radial-gradient(circle at 75% 75%, #a13938 0%, transparent 50%)' }} />
        <div className="container relative z-10 py-24">
          <div className="max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand/10 border border-brand/30 rounded-full text-brand text-xs font-bold uppercase tracking-widest mb-8">
                <Eye className="h-4 w-4" /> Governance. Compliance. Performance.
              </div>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tighter mb-6">
              GIA Advisory<br />
              <span className="text-brand">Consulting Services</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-lg md:text-xl text-slate-300 font-medium max-w-2xl mb-10 leading-relaxed">
              We help organizations strengthen governance systems, achieve regulatory compliance, 
              and improve operational performance across finance, audit, risk, taxation, and business strategy.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-wrap gap-4">
              <Link href="/contact">
                <Button className="bg-brand hover:bg-brand-dark text-primary-blue font-bold rounded-full h-14 px-10 text-sm shadow-2xl shadow-brand/30 active:scale-95 transition-all">
                  Request a Consultation <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full h-14 px-10 text-sm font-bold">
                  Explore Services
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-slate-950 to-transparent" />
      </section>

      {/* ═══ WHO WE ARE ═══ */}
      <section className="py-24 md:py-32 bg-white dark:bg-slate-950">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h4 className="text-brand font-bold uppercase tracking-[0.3em] text-xs">Who We Are</h4>
                <h2 className="text-3xl md:text-5xl font-black text-primary-blue dark:text-white leading-tight tracking-tighter">
                  Trusted Advisors in <span className="text-brand">Governance & Compliance</span>
                </h2>
              </div>
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                We specialize in audit, taxation, risk management, financial advisory, ISO systems implementation, 
                and business transformation. Our team of certified professionals brings decades of combined experience 
                across industries to deliver practical, results-oriented solutions.
              </p>
              <Link href="/about">
                <Button className="bg-primary-blue hover:bg-primary-blue/90 text-white rounded-full h-12 px-8 font-bold">
                  Learn More About Us <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { number: '50+', label: 'ISO Standards' },
                  { number: '200+', label: 'Clients Served' },
                  { number: '15+', label: 'Years Experience' },
                  { number: '8', label: 'Service Lines' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 text-center"
                  >
                    <p className="text-3xl md:text-4xl font-black text-brand">{stat.number}</p>
                    <p className="text-sm font-medium text-slate-500 mt-2">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ WHAT WE DO / SERVICES ═══ */}
      <section className="py-24 md:py-32 bg-slate-50 dark:bg-slate-900/30 border-y border-slate-100 dark:border-slate-800">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h4 className="text-brand font-bold uppercase tracking-[0.3em] text-xs">What We Do</h4>
            <h2 className="text-3xl md:text-5xl font-black text-primary-blue dark:text-white leading-tight tracking-tighter">
              Comprehensive <span className="text-brand">Advisory Services</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              End-to-end consulting solutions designed to strengthen your organization from the ground up.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((svc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group bg-white dark:bg-slate-950 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 hover:border-brand/50 hover:shadow-xl transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center text-brand mb-6 group-hover:bg-brand group-hover:text-primary-blue transition-all duration-500">
                  <svc.icon size={28} />
                </div>
                <h3 className="text-base font-bold text-primary-blue dark:text-white mb-3 leading-tight">{svc.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{svc.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/services">
              <Button className="bg-primary-blue hover:bg-primary-blue/90 text-white rounded-full h-14 px-10 font-bold shadow-lg">
                View All Services <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ WHY CHOOSE US ═══ */}
      <section className="py-24 md:py-32 bg-white dark:bg-slate-950">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h4 className="text-brand font-bold uppercase tracking-[0.3em] text-xs">Why Choose Us</h4>
            <h2 className="text-3xl md:text-5xl font-black text-primary-blue dark:text-white leading-tight tracking-tighter">
              What Sets <span className="text-brand">GIA Apart</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyUs.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center text-brand mx-auto">
                  <item.icon size={32} />
                </div>
                <h3 className="text-lg font-bold text-primary-blue dark:text-white">{item.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MISSION / VISION / VALUES ═══ */}
      <section className="py-24 md:py-32 bg-primary-blue text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #a13938 0%, transparent 70%)' }} />
        <div className="container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Our Mission', icon: Target, text: 'To deliver world-class consulting services that strengthen governance, improve compliance, and enhance performance.' },
              { title: 'Our Vision', icon: Eye, text: 'To be a trusted advisory partner for organizations seeking excellence in compliance, finance, and transformation.' },
              { title: 'Our Values', icon: Heart, text: 'Integrity, Excellence, Precision, Confidentiality, Client Focus.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center space-y-6 p-8 rounded-3xl bg-white/5 border border-white/10"
              >
                <div className="w-16 h-16 rounded-full bg-brand/20 flex items-center justify-center text-brand mx-auto">
                  <item.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-brand">{item.title}</h3>
                <p className="text-slate-300 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-24 md:py-32 bg-white dark:bg-slate-950">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-5xl font-black text-primary-blue dark:text-white leading-tight tracking-tighter">
              Ready to Strengthen Your <span className="text-brand">Governance & Compliance?</span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
              Let&apos;s discuss how GIA Advisory can help your organization achieve excellence 
              in governance, compliance, and performance.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/contact">
                <Button className="bg-brand hover:bg-brand-dark text-primary-blue font-bold rounded-full h-14 px-10 text-sm shadow-2xl shadow-brand/30 active:scale-95 transition-all">
                  Request a Consultation <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="mailto:info@giaadvisory.com" className="inline-flex items-center gap-2 border-2 border-primary-blue dark:border-white/20 text-primary-blue dark:text-white rounded-full h-14 px-10 font-bold text-sm hover:bg-primary-blue hover:text-white dark:hover:bg-white/10 transition-all">
                info@giaadvisory.com
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}