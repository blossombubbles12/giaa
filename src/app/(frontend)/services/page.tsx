'use client';

import { useState } from 'react';
import { Shield, FileCheck, Scale, BarChart3, LineChart, Globe, Users, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/frontend/layout/PageHeader';
import { ServiceCard } from '@/components/frontend/home/ServiceCard';
import Image from 'next/image';

const serviceCategories = [
  {
    id: 'iso',
    icon: Shield,
    title: 'ISO Implementation & Certification Advisory',
    desc: 'End-to-end support for implementing and certifying management systems across 50+ ISO standards.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=900',
    details: [
      { sub: 'Quality Management', items: ['ISO 9001', 'ISO 9004', 'ISO 10001', 'ISO 10002'] },
      { sub: 'Environmental Management', items: ['ISO 14001', 'ISO 14004', 'ISO 14064', 'ISO 14067'] },
      { sub: 'Occupational Health & Safety', items: ['ISO 45001', 'ISO 45003', 'ISO 45005'] },
      { sub: 'Information Security', items: ['ISO 27001', 'ISO 27002', 'ISO 27701', 'ISO 27032'] },
      { sub: 'Risk & Governance', items: ['ISO 31000', 'ISO 37001', 'ISO 37301'] },
      { sub: 'Business Continuity', items: ['ISO 22301', 'ISO 22316', 'ISO 22361'] },
    ],
  },
  {
    id: 'audit',
    icon: FileCheck,
    title: 'Audit, Assurance & Financial Control Services',
    desc: 'Strengthen internal controls and ensure financial integrity with comprehensive audit and assurance services.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=900',
    details: [
      { sub: 'Internal Audits', items: ['Internal control system reviews', 'Operational audit engagements', 'Compliance audit programs', 'Fraud risk assessment'] },
      { sub: 'Financial Statement Review', items: ['Financial statement preparation', 'Independent financial reviews', 'Due diligence assessments', 'Reporting quality assessment'] },
      { sub: 'IFRS Advisory', items: ['IFRS transition support', 'IFRS 9, 15, 16 implementation', 'Revenue recognition advisory'] },
      { sub: 'Control Systems', items: ['Internal control framework design', 'Sox compliance support', 'Process and control documentation'] },
    ],
  },
  {
    id: 'tax',
    icon: Scale,
    title: 'Tax Advisory & Compliance Services',
    desc: 'Navigate complex tax regulations with strategic planning and full compliance support.',
    image: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&q=80&w=900',
    details: [
      { sub: 'Tax Planning', items: ['Corporate tax strategy', 'Tax-efficient business structuring', 'Cross-border tax planning', 'Estate tax planning'] },
      { sub: 'Compliance Support', items: ['Tax return preparation', 'Withholding tax management', 'Transfer pricing documentation'] },
      { sub: 'VAT & Corporate Tax', items: ['VAT registration and compliance', 'Corporate tax advisory', 'Tax incentive optimization'] },
      { sub: 'Tax Audit Assistance', items: ['Tax audit representation', 'Tax dispute resolution', 'Pre-audit readiness reviews'] },
    ],
  },
  {
    id: 'risk',
    icon: BarChart3,
    title: 'Risk Management & Compliance Advisory',
    desc: 'Enterprise risk frameworks, compliance systems, and internal controls to protect your organization.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=900',
    details: [
      { sub: 'Enterprise Risk Frameworks', items: ['ERM framework design', 'Risk appetite setting', 'Risk register development'] },
      { sub: 'Compliance Systems', items: ['Compliance management framework', 'Regulatory compliance mapping', 'Whistleblowing hotline setup'] },
      { sub: 'Internal Controls', items: ['Control framework design', 'Control testing and validation', 'SOX compliance support'] },
    ],
  },
  {
    id: 'strategy',
    icon: LineChart,
    title: 'Business Strategy & Transformation Consulting',
    desc: 'Growth strategy, business model design, and operational restructuring for sustainable performance.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=900',
    details: [
      { sub: 'Growth Strategy', items: ['Market entry strategy', 'Growth opportunity assessment', 'M&A advisory and support'] },
      { sub: 'Business Model Design', items: ['Business model innovation', 'Value proposition design', 'Digital business transformation'] },
      { sub: 'Operational Restructuring', items: ['Process optimization', 'Cost reduction and efficiency', 'Change management support'] },
    ],
  },
  {
    id: 'esg',
    icon: Globe,
    title: 'ESG & Sustainability Advisory',
    desc: 'Implement ESG frameworks and sustainability reporting aligned with global standards.',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=900',
    details: [
      { sub: 'ESG Frameworks', items: ['ESG strategy development', 'Materiality assessment', 'Stakeholder engagement', 'ESG policy formulation'] },
      { sub: 'Sustainability Reporting', items: ['GRI/TCFD/ISSB alignment', 'Carbon footprint measurement', 'Science-based targets setting'] },
    ],
  },
  {
    id: 'hr',
    icon: Users,
    title: 'HR & Organizational Development',
    desc: 'Develop robust HR policies and performance management systems that drive results.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=900',
    details: [
      { sub: 'HR Policies', items: ['HR policy development and review', 'Employee handbook creation', 'Compensation and benefits design'] },
      { sub: 'Performance Systems', items: ['Performance management system design', 'KPI development', '360-degree feedback', 'Succession planning'] },
    ],
  },
  {
    id: 'it',
    icon: Lock,
    title: 'IT & Cybersecurity Advisory',
    desc: 'Strengthen IT governance and protect against cyber threats with expert advisory services.',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=900',
    details: [
      { sub: 'IT Governance', items: ['IT governance framework design', 'IT strategy and roadmap', 'IT policy development'] },
      { sub: 'Cyber Risk', items: ['Cybersecurity risk assessment', 'Security architecture review', 'Incident response planning'] },
    ],
  },
];

const commonlyRequested = [
  'ISO 9001 — Quality Management', 'ISO 14001 — Environmental Management',
  'ISO 45001 — Occupational Health & Safety', 'ISO 27001 — Information Security',
  'ISO 22000 — Food Safety', 'ISO 22301 — Business Continuity',
  'ISO 50001 — Energy Management', 'ISO 20000-1 — IT Service Management',
  'ISO 13485 — Medical Devices', 'ISO 37001 — Anti-Bribery',
  'ISO 37301 — Compliance Management', 'ISO 41001 — Facility Management',
  'ISO 55001 — Asset Management', 'ISO 39001 — Road Traffic Safety',
  'ISO 21001 — Educational Organizations', 'ISO 27701 — Privacy Information Management',
  'ISO 28000 — Supply Chain Security',
];

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState(serviceCategories[0].id);
  const activeService = serviceCategories.find(c => c.id === activeTab)!;

  return (
    <div className="bg-white dark:bg-slate-950 transition-colors duration-500">
      <PageHeader
        title="Our Services"
        description="Comprehensive advisory services across governance, compliance, risk, finance, and business transformation."
        breadcrumbs={[{ name: 'Services' }]}
      />

      {/* ── Service Cards Grid ── */}
      <section className="py-20 md:py-28 border-b border-slate-100 dark:border-slate-800">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
              Everything You Need, <span className="text-brand">In One Place</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Click any service to explore its full scope and details.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {serviceCategories.map((cat, i) => (
              <ServiceCard key={cat.id} service={cat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Tabbed Deep-Dive ── */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
              Explore Each <span className="text-brand">Service Area</span>
            </h2>
          </div>

          {/* Sticky Tab Nav */}
          <div className="sticky top-20 z-30 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 mb-12 -mx-5 sm:-mx-8 md:-mx-12 lg:-mx-16 px-5 sm:px-8 md:px-12 lg:px-16">
            <div className="overflow-x-auto">
              <div className="flex gap-1 py-3 min-w-max">
                {serviceCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                      activeTab === cat.id
                        ? 'bg-primary-blue text-white shadow-lg'
                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <cat.icon size={14} />
                    {cat.title.split('&')[0].trim().split(' ').slice(0, 2).join(' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Service Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            {/* Image + Header */}
            <div className="lg:col-span-2 space-y-6">
              <div className="relative h-72 rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={activeService.image}
                  alt={activeService.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="flex items-center gap-2 text-brand text-xs font-bold uppercase tracking-widest mb-1">
                    <activeService.icon size={14} /> Advisory Service
                  </div>
                  <h3 className="text-white font-black text-lg leading-tight">{activeService.title}</h3>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{activeService.desc}</p>
              <Link href={`/services/${activeService.id}`}>
                <Button className="bg-primary-blue hover:bg-primary-blue/90 text-white font-bold rounded-full px-8 h-12">
                  Full Service Details <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Details Grid */}
            <div className="lg:col-span-3 space-y-6">
              {activeService.details.map((section, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border border-slate-100 dark:border-slate-800 rounded-2xl p-6"
                >
                  <h4 className="text-base font-bold text-primary-blue dark:text-white mb-4">{section.sub}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {section.items.map((item, j) => (
                      <div key={j} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <CheckCircle2 size={15} className="text-brand shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}

              {activeService.id === 'iso' && (
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
                  <h4 className="text-base font-bold text-primary-blue dark:text-white mb-4">Commonly Requested Standards</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {commonlyRequested.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <CheckCircle2 size={15} className="text-brand shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          </div>{/* end max-w-4xl */}
        </div>
      </section>
      <section className="py-24 relative border-y border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/images/bottombanner.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary-blue/85" />
        </div>
        <div className="container text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tighter">
              Need Help Choosing the Right <span className="text-brand">Service?</span>
            </h2>
            <p className="text-lg text-slate-300 font-medium">
              Our team of experts will guide you through the right compliance and advisory solutions for your organization.
            </p>
            <Link href="/contact">
              <Button className="bg-brand hover:bg-brand-dark text-white font-bold rounded-full h-14 px-10 shadow-xl active:scale-95 transition-all">
                Request a Consultation <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}