'use client';

import { useState } from 'react';
import { Shield, FileCheck, Scale, BarChart3, LineChart, Globe, Users, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/frontend/layout/PageHeader';

const serviceCategories = [
  {
    id: 'iso',
    icon: Shield,
    title: 'ISO Implementation & Certification Advisory',
    desc: 'End-to-end support for implementing and certifying management systems across 50+ ISO standards.',
    details: [
      { sub: 'Quality Management', items: ['ISO 9000 — Quality Management Systems Fundamentals', 'ISO 9001 — Quality Management Systems Requirements', 'ISO 9004 — Quality Management Quality of an Organization Guidance', 'ISO 10001 — Customer Satisfaction Codes of Conduct', 'ISO 10002 — Customer Complaints Handling', 'ISO 10003 — Dispute Resolution', 'ISO 10004 — Customer Satisfaction Monitoring', 'ISO 10005 — Quality Plans', 'ISO 10006 — Quality Management in Projects'] },
      { sub: 'Environmental Management', items: ['ISO 14001 — Environmental Management Systems', 'ISO 14004 — Environmental Management Guidelines', 'ISO 14031 — Environmental Performance Evaluation', 'ISO 14040 — Life Cycle Assessment Principles', 'ISO 14044 — Life Cycle Assessment Requirements', 'ISO 14064 — Greenhouse Gases Quantification', 'ISO 14067 — Carbon Footprint of Products'] },
      { sub: 'Occupational Health & Safety', items: ['ISO 45001 — OH&S Management Systems', 'ISO 45003 — Psychological Health and Safety', 'ISO 45005 — Safe Working During Outbreaks'] },
      { sub: 'Information Security & Privacy', items: ['ISO 27001 — Information Security Management', 'ISO 27002 — Information Security Controls', 'ISO 27005 — Information Security Risk Management', 'ISO 27017 — Cloud Security Controls', 'ISO 27018 — Personal Data Protection in Public Clouds', 'ISO 27031 — ICT Readiness for Business Continuity', 'ISO 27032 — Cybersecurity Guidelines', 'ISO 27035 — Information Security Incident Management', 'ISO 27701 — Privacy Information Management'] },
      { sub: 'Risk, Governance & Compliance', items: ['ISO 31000 — Risk Management Guidelines', 'ISO 31010 — Risk Assessment Techniques', 'ISO 37000 — Governance of Organizations', 'ISO 37001 — Anti-Bribery Management Systems', 'ISO 37301 — Compliance Management Systems'] },
      { sub: 'Business Continuity & Resilience', items: ['ISO 22301 — Business Continuity Management', 'ISO 22313 — Business Continuity Guidance', 'ISO 22316 — Organizational Resilience', 'ISO 22320 — Emergency Management', 'ISO 22361 — Crisis Management'] },
      { sub: 'Food Safety', items: ['ISO 22000 — Food Safety Management Systems', 'ISO 22005 — Traceability in Feed and Food Chain', 'ISO/TS 22002 — Prerequisite Programs for Food Safety'] },
      { sub: 'Energy Management', items: ['ISO 50001 — Energy Management Systems', 'ISO 50002 — Energy Audits', 'ISO 50006 — Energy Performance Indicators'] },
      { sub: 'IT Service Management', items: ['ISO 20000-1 — IT Service Management Systems', 'ISO 20000-2 — Guidance on IT Service Management'] },
      { sub: 'Medical Devices & Healthcare', items: ['ISO 13485 — Quality Management for Medical Devices', 'ISO 14971 — Risk Management for Medical Devices', 'ISO 15189 — Medical Laboratories Requirements'] },
      { sub: 'Supply Chain & Logistics', items: ['ISO 28000 — Supply Chain Security Management', 'ISO 28001 — Security Management Best Practices', 'ISO 28004 — Supply Chain Security Guidance'] },
      { sub: 'Asset & Facility Management', items: ['ISO 41001 — Facility Management Systems', 'ISO 41011 — Facility Management Vocabulary', 'ISO 55001 — Asset Management Systems', 'ISO 55002 — Asset Management Guidelines'] },
      { sub: 'Additional Standards', items: ['ISO 39001 — Road Traffic Safety Management', 'ISO 39002 — Road Traffic Safety Good Practices', 'ISO 21001 — Educational Organizations Management', 'ISO 20121 — Event Sustainability Management', 'ISO 26000 — Social Responsibility Guidance', 'ISO 20400 — Sustainable Procurement', 'ISO 37101 — Sustainable Development in Communities', 'ISO/IEC 17025 — Testing and Calibration Laboratories', 'ISO 17020 — Inspection Bodies Requirements', 'ISO 17021 — Certification Bodies Requirements', 'ISO 17024 — Personnel Certification Bodies', 'IATF 16949 — Automotive Quality Management', 'ISO 26262 — Functional Safety for Road Vehicles', 'ISO 21434 — Road Vehicle Cybersecurity', 'AS9100 — Aerospace Quality Management', 'ISO 14644 — Cleanrooms and Controlled Environments'] },
    ],
  },
  {
    id: 'audit',
    icon: FileCheck,
    title: 'Audit, Assurance & Financial Control Services',
    desc: 'Strengthen internal controls and ensure financial integrity with comprehensive audit and assurance services.',
    details: [
      { sub: 'Internal Audits', items: ['Internal control system reviews', 'Operational audit engagements', 'Compliance audit programs', 'Fraud risk assessment'] },
      { sub: 'Financial Statement Review', items: ['Financial statement preparation and review', 'Independent financial reviews', 'Due diligence assessments', 'Financial reporting quality assessment'] },
      { sub: 'IFRS Advisory', items: ['IFRS transition support', 'IFRS 9, 15, 16 implementation', 'Financial instrument accounting', 'Revenue recognition advisory'] },
      { sub: 'Control Systems', items: ['Internal control framework design', 'Sox compliance support', 'Control self-assessment facilitation', 'Process and control documentation'] },
    ],
  },
  {
    id: 'tax',
    icon: Scale,
    title: 'Tax Advisory & Compliance Services',
    desc: 'Navigate complex tax regulations with strategic planning and full compliance support.',
    details: [
      { sub: 'Tax Planning', items: ['Corporate tax strategy development', 'Tax-efficient business structuring', 'Cross-border tax planning', 'Inheritance and estate tax planning'] },
      { sub: 'Compliance Support', items: ['Tax return preparation and filing', 'Withholding tax management', 'Tax compliance health checks', 'Transfer pricing documentation'] },
      { sub: 'VAT & Corporate Tax', items: ['VAT registration and compliance', 'Corporate tax advisory', 'Tax incentive and relief optimization', 'Indirect tax management'] },
      { sub: 'Tax Audit Assistance', items: ['Tax audit representation', 'Tax dispute resolution', 'Tax authority negotiations', 'Pre-audit readiness reviews'] },
    ],
  },
  {
    id: 'risk',
    icon: BarChart3,
    title: 'Risk Management & Compliance Advisory',
    desc: 'Enterprise risk frameworks, compliance systems, and internal controls to protect your organization.',
    details: [
      { sub: 'Enterprise Risk Frameworks', items: ['ERM framework design and implementation', 'Risk appetite and tolerance setting', 'Risk register development', 'Risk reporting and dashboarding'] },
      { sub: 'Compliance Systems', items: ['Compliance management framework', 'Regulatory compliance mapping', 'Compliance training programs', 'Whistleblowing hotline setup'] },
      { sub: 'Internal Controls', items: ['Internal control framework design', 'Control testing and validation', 'Segregation of duties analysis', 'SOX compliance support'] },
    ],
  },
  {
    id: 'strategy',
    icon: LineChart,
    title: 'Business Strategy & Transformation Consulting',
    desc: 'Growth strategy, business model design, and operational restructuring for sustainable performance.',
    details: [
      { sub: 'Growth Strategy', items: ['Market entry strategy', 'Growth opportunity assessment', 'Strategic planning and execution', 'M&A advisory and support'] },
      { sub: 'Business Model Design', items: ['Business model innovation', 'Value proposition design', 'Revenue model optimization', 'Digital business transformation'] },
      { sub: 'Operational Restructuring', items: ['Process optimization and reengineering', 'Cost reduction and efficiency', 'Organizational restructuring', 'Change management support'] },
    ],
  },
  {
    id: 'esg',
    icon: Globe,
    title: 'ESG & Sustainability Advisory',
    desc: 'Implement ESG frameworks and sustainability reporting aligned with global standards.',
    details: [
      { sub: 'ESG Frameworks', items: ['ESG strategy development', 'Materiality assessment', 'Stakeholder engagement', 'ESG policy formulation'] },
      { sub: 'Sustainability Reporting', items: ['Sustainability report preparation', 'GRI/TCFD/ISSB alignment', 'Carbon footprint measurement', 'Science-based targets setting'] },
    ],
  },
  {
    id: 'hr',
    icon: Users,
    title: 'HR & Organizational Development',
    desc: 'Develop robust HR policies and performance management systems that drive results.',
    details: [
      { sub: 'HR Policies', items: ['HR policy development and review', 'Employee handbook creation', 'Compensation and benefits design', 'HR compliance audit'] },
      { sub: 'Performance Systems', items: ['Performance management system design', 'Goal setting and KPI development', '360-degree feedback implementation', 'Succession planning'] },
    ],
  },
  {
    id: 'it',
    icon: Lock,
    title: 'IT & Cybersecurity Advisory',
    desc: 'Strengthen IT governance and protect against cyber threats with expert advisory services.',
    details: [
      { sub: 'IT Governance', items: ['IT governance framework design', 'IT strategy and roadmap', 'IT policy development', 'IT service management (ISO 20000)'] },
      { sub: 'Cyber Risk', items: ['Cybersecurity risk assessment', 'Security architecture review', 'Incident response planning', 'Security awareness training'] },
    ],
  },
];

const commonlyRequested = [
  'ISO 9001 — Quality Management',
  'ISO 14001 — Environmental Management',
  'ISO 45001 — Occupational Health & Safety',
  'ISO 27001 — Information Security',
  'ISO 22000 — Food Safety',
  'ISO 22301 — Business Continuity',
  'ISO 50001 — Energy Management',
  'ISO 20000-1 — IT Service Management',
  'ISO 13485 — Medical Devices Quality Management',
  'ISO 37001 — Anti-Bribery',
  'ISO 37301 — Compliance Management',
  'ISO 41001 — Facility Management',
  'ISO 55001 — Asset Management',
  'ISO 39001 — Road Traffic Safety',
  'ISO 21001 — Educational Organizations Management',
  'ISO 27701 — Privacy Information Management',
  'ISO 28000 — Supply Chain Security Management',
];

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState(serviceCategories[0].id);

  return (
    <div className="bg-white dark:bg-slate-950 transition-colors duration-500">
      <PageHeader
        title="Our Services"
        description="Comprehensive advisory services across governance, compliance, risk, finance, and business transformation."
        breadcrumbs={[{ name: 'Services' }]}
      />

      {/* Service Navigation Tabs */}
      <section className="sticky top-20 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="container overflow-x-auto">
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
                {cat.title.split('&')[0].trim()}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Service Detail */}
      {serviceCategories.map((cat) => (
        <section key={cat.id} id={cat.id} className={`py-24 ${activeTab === cat.id ? 'block' : 'hidden'}`}>
          <div className="container">
            <div className="max-w-4xl mx-auto space-y-16">
              {/* Header */}
              <div className="text-center space-y-6">
                <div className="w-20 h-20 rounded-3xl bg-brand/10 flex items-center justify-center text-brand mx-auto">
                  <cat.icon size={40} />
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-primary-blue dark:text-white leading-tight tracking-tighter">
                  {cat.title}
                </h2>
                <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
                  {cat.desc}
                </p>
              </div>

              {/* Details */}
              <div className="space-y-12">
                {cat.details.map((section, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="border border-slate-100 dark:border-slate-800 rounded-3xl p-8 md:p-10"
                  >
                    <h3 className="text-xl font-bold text-primary-blue dark:text-white mb-6">{section.sub}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {section.items.map((item, j) => (
                        <div key={j} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                          <CheckCircle2 size={16} className="text-brand shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Commonly Requested - only for ISO */}
              {cat.id === 'iso' && (
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-10 border border-slate-100 dark:border-slate-800">
                  <h3 className="text-xl font-bold text-primary-blue dark:text-white mb-6">Commonly Requested Certification Standards</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {commonlyRequested.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                        <CheckCircle2 size={16} className="text-brand shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/30 border-y border-slate-100 dark:border-slate-800">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-5xl font-black text-primary-blue dark:text-white leading-tight tracking-tighter">
              Need Help Choosing the Right <span className="text-brand">Service?</span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
              Our team of experts will guide you through the right compliance and advisory solutions for your organization.
            </p>
            <Link href="/contact">
              <Button className="bg-brand hover:bg-brand-dark text-primary-blue font-bold rounded-full h-14 px-10 shadow-xl active:scale-95 transition-all">
                Request a Consultation <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}