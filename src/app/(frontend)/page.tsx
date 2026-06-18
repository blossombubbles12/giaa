'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Hero } from '@/components/frontend/home/Hero';
import { ServiceCard } from '@/components/frontend/home/ServiceCard';
import {
  ArrowRight, Shield, FileCheck, Scale, BarChart3,
  LineChart, Globe, Users, Lock, CheckCircle2, Target, Eye, Heart, ShieldCheck, Search, Award,
} from 'lucide-react';

const services = [
  { id: 'iso',      title: 'ISO Implementation & Certification',    desc: 'End-to-end support across 50+ ISO standards including Quality, Environmental, Safety, and Information Security.', icon: Shield,    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800' },
  { id: 'audit',    title: 'Audit, Assurance & Financial Control',   desc: 'Strengthen internal controls and ensure financial integrity with comprehensive audit and assurance services.',    icon: FileCheck,  image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800' },
  { id: 'tax',      title: 'Tax Advisory & Compliance',              desc: 'Navigate complex tax regulations with strategic planning, VAT compliance, and full advisory support.',            icon: Scale,      image: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&q=80&w=800' },
  { id: 'risk',     title: 'Risk Management & Compliance',           desc: 'Enterprise risk frameworks, compliance management systems, and internal controls to protect your organisation.',  icon: BarChart3,  image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800' },
  { id: 'strategy', title: 'Business Strategy & Transformation',     desc: 'Growth strategy, business model design, and operational restructuring for sustainable performance.',             icon: LineChart,  image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800' },
  { id: 'esg',      title: 'ESG & Sustainability Advisory',          desc: 'Implement ESG frameworks and sustainability reporting aligned with GRI, TCFD, and ISSB standards.',               icon: Globe,      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800' },
  { id: 'hr',       title: 'HR & Organisational Development',        desc: 'Robust HR policies, performance management systems, and organisational development that drives results.',         icon: Users,      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800' },
  { id: 'it',       title: 'IT & Cybersecurity Advisory',            desc: 'IT governance frameworks, cybersecurity risk assessments, and security architecture reviews.',                    icon: Lock,       image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800' },
];

const whyUs = [
  { title: 'Technical Expertise',       desc: 'Certified professionals across audit, tax, risk, ISO standards, and business strategy.',       icon: Shield },
  { title: 'Practical Implementation',  desc: 'We don\'t just advise — we implement with hands-on support and structured delivery.',          icon: CheckCircle2 },
  { title: 'Compliance Focus',          desc: 'Regulatory compliance is at the core of every engagement, keeping you ahead of requirements.', icon: Target },
  { title: 'Results-Driven Approach',   desc: 'Every engagement is measured against clear KPIs and tangible business outcomes.',             icon: BarChart3 },
];

const stats = [
  { number: '50+',  label: 'ISO Standards' },
  { number: '200+', label: 'Clients Served' },
  { number: '15+',  label: 'Years Experience' },
  { number: '8',    label: 'Service Lines' },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-0 overflow-hidden">

      <Hero />

      {/* ═══ WHO WE ARE ═══ */}
      <section className="py-16 md:py-20 bg-white dark:bg-slate-950">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left — text */}
            <div className="space-y-6">
              <h4 className="text-brand font-bold uppercase tracking-[0.3em] text-xs">Who We Are</h4>
              <h2 className="text-2xl md:text-4xl font-black text-primary-blue dark:text-white leading-tight tracking-tighter">
                Trusted Advisors in <span className="text-brand">Governance & Compliance</span>
              </h2>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                GIA Advisory Consulting Services is a professional consulting firm helping organisations strengthen
                governance systems, achieve regulatory compliance, and improve operational performance across
                finance, audit, risk, taxation, and business strategy.
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Our team of certified professionals — Chartered Accountants, ISO Lead Auditors, Risk Management
                Professionals, and Business Strategy Consultants — brings decades of combined experience to
                deliver practical, results-oriented solutions.
              </p>
              <Link href="/about">
                <Button className="bg-primary-blue hover:bg-primary-blue/90 text-white rounded-full h-11 px-7 font-bold text-sm">
                  Learn More About Us <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Right — image + stats */}
            <div className="space-y-6">
              <div className="rounded-2xl overflow-hidden shadow-2xl max-w-sm mx-auto lg:mx-0">
                <img
                  src="/images/hoemabout2.jpg"
                  alt="GIA Advisory team"
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {stats.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 text-center"
                  >
                    <p className="text-xl md:text-2xl font-black text-brand">{s.number}</p>
                    <p className="text-[10px] font-medium text-slate-500 mt-1 leading-tight">{s.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ WHAT WE DO ═══ */}
      <section className="py-16 md:py-20 bg-slate-50 dark:bg-slate-900/30 border-y border-slate-100 dark:border-slate-800">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <h4 className="text-brand font-bold uppercase tracking-[0.3em] text-xs">What We Do</h4>
            <h2 className="text-2xl md:text-4xl font-black text-primary-blue dark:text-white leading-tight tracking-tighter">
              Comprehensive <span className="text-brand">Advisory Services</span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              End-to-end consulting solutions designed to strengthen your organisation from the ground up.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {services.map((svc, i) => (
              <ServiceCard key={svc.id} service={svc} index={i} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/services">
              <Button className="bg-primary-blue hover:bg-primary-blue/90 text-white rounded-full h-12 px-8 font-bold shadow-lg text-sm">
                View All Services <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ WHY WE EXIST ═══ */}
      <section className="py-16 md:py-20 bg-white dark:bg-slate-950">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left — text */}
            <div className="space-y-6">
              <h4 className="text-brand font-bold uppercase tracking-[0.3em] text-xs">Our Approach</h4>
              <h2 className="text-2xl md:text-4xl font-black text-primary-blue dark:text-white leading-tight tracking-tighter">
                We Don't Just Advise — <span className="text-brand">We Deliver Results</span>
              </h2>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                At GIA Advisory, every engagement goes beyond recommendations. We work alongside your team to implement practical solutions — building the systems, processes, and capabilities your organisation needs to perform at its best.
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                From ISO certification to financial governance, tax compliance to business transformation, our certified professionals bring structured delivery and deep technical expertise to every client relationship — staying until the work is truly done.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/about">
                  <Button className="bg-primary-blue hover:bg-primary-blue/90 text-white rounded-full h-11 px-7 font-bold text-sm">
                    About GIA <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="rounded-full h-11 px-7 font-bold text-sm border-slate-200 dark:border-slate-700">
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right — image */}
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/images/gia333234.jpg"
                alt="GIA Advisory consulting"
                className="w-full h-auto object-cover"
              />
            </div>

          </div>
        </div>
      </section>

      {/* ═══ WHY CHOOSE US ═══ */}
      <section className="py-16 md:py-20 bg-white dark:bg-slate-950">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <h4 className="text-brand font-bold uppercase tracking-[0.3em] text-xs">Why Choose Us</h4>
            <h2 className="text-2xl md:text-4xl font-black text-primary-blue dark:text-white leading-tight tracking-tighter">
              What Sets <span className="text-brand">GIA Apart</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
                  <item.icon size={24} />
                </div>
                <h3 className="text-sm font-black text-primary-blue dark:text-white">{item.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MISSION / VISION / VALUES ═══ */}
      <section className="py-16 md:py-20 bg-primary-blue relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #a13938 0%, transparent 70%)' }} />
        <div className="container relative z-10">
          <div className="text-center mb-10 space-y-2">
            <h4 className="text-brand font-bold uppercase tracking-[0.3em] text-xs">Our Foundation</h4>
            <h2 className="text-2xl md:text-4xl font-black text-white leading-tight tracking-tighter">
              Mission, Vision & <span className="text-brand">Values</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Our Mission', icon: Target, text: 'To deliver world-class consulting services that strengthen governance, improve compliance, and enhance performance.' },
              { title: 'Our Vision',  icon: Eye,    text: 'To be a trusted advisory partner for organisations seeking excellence in compliance, finance, and transformation.' },
              { title: 'Our Values',  icon: Heart,  text: 'Integrity · Excellence · Precision · Confidentiality · Client Focus' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-white/5 border border-white/10 space-y-4"
              >
                <div className="w-12 h-12 rounded-xl bg-brand/20 flex items-center justify-center text-brand">
                  <item.icon size={24} />
                </div>
                <h3 className="text-base font-black text-brand">{item.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CERTIFICATE VERIFICATION ═══ */}
      <section className="py-16 md:py-20 bg-slate-50 dark:bg-slate-900/30 border-y border-slate-100 dark:border-slate-800">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand/10 border border-brand/20 rounded-full text-brand text-[10px] font-bold uppercase tracking-widest">
                <ShieldCheck size={12} /> Credential Verification
              </div>
              <h2 className="text-2xl md:text-4xl font-black text-primary-blue dark:text-white leading-tight tracking-tighter">
                Verify a <span className="text-brand">Certificate</span>
              </h2>
              <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Instantly confirm the authenticity of any GIA Advisory certificate. 
                Enter the unique verification hash from the document and get real-time validation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link href="/verify">
                  <Button className="bg-brand hover:bg-brand-dark text-white rounded-full h-12 px-8 font-bold text-sm shadow-lg active:scale-95 transition-all">
                    Verify Now <Search className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-500" /> Instant</span>
                  <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-brand" /> Secure</span>
                  <span className="flex items-center gap-1.5"><Award size={14} className="text-blue-500" /> Trusted</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white dark:bg-slate-950 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-800 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-brand/10 flex items-center justify-center text-brand mx-auto">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-lg font-bold text-primary-blue dark:text-white">Secure Verification System</h3>
                <p className="text-sm text-slate-500 max-w-xs mx-auto">
                  All certificates are secured with SHA-256 encryption and a unique verification hash.
                </p>
                <div className="flex items-center justify-center gap-6 pt-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <span>SHA-256</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span>Real-Time</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span>Public</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/images/bottombanner.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary-blue/88" />
        </div>
        <div className="container relative z-10 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl md:text-4xl font-black text-white leading-tight tracking-tighter">
              Ready to Strengthen Your <span className="text-brand">Governance & Compliance?</span>
            </h2>
            <p className="text-sm md:text-base text-slate-300 font-medium">
              Let&apos;s discuss how GIA Advisory can help your organisation achieve excellence in governance, compliance, and performance.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link href="/contact">
                <Button className="bg-brand hover:bg-brand-dark text-white font-bold rounded-full h-12 px-8 text-sm shadow-xl active:scale-95 transition-all">
                  Request a Consultation <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="mailto:info@giaadvisory.com" className="inline-flex items-center gap-2 border-2 border-white/20 text-white rounded-full h-12 px-8 font-bold text-sm hover:bg-white/10 transition-all">
                info@giaadvisory.com
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
