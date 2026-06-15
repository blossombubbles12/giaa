import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/frontend/layout/PageHeader';
import { Shield, FileCheck, Scale, BarChart3, LineChart, Globe, Users, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

const serviceCategories = [
  {
    id: 'iso',
    icon: Shield,
    title: 'ISO Implementation & Certification Advisory',
    desc: 'End-to-end support for implementing and certifying management systems across 50+ ISO standards.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1600',
    richContent: `Achieving ISO certification is more than just a badge of honor; it is a strategic advantage that demonstrates your commitment to quality, security, and continuous improvement. Our experts provide end-to-end advisory services to help organizations navigate the complexities of ISO standards. We don't just hand you a manual; we integrate best practices into your daily operations.`,
    benefits: ['Enhanced operational efficiency', 'Global recognition and credibility', 'Risk mitigation and compliance', 'Improved customer satisfaction'],
    details: [
      { sub: 'Quality Management', items: ['ISO 9000', 'ISO 9001', 'ISO 9004', 'ISO 10001'] },
      { sub: 'Environmental Management', items: ['ISO 14001', 'ISO 14004', 'ISO 14031'] },
      { sub: 'Information Security', items: ['ISO 27001', 'ISO 27002', 'ISO 27005', 'ISO 27701'] },
      { sub: 'Risk & Governance', items: ['ISO 31000', 'ISO 37000', 'ISO 37001', 'ISO 37301'] },
      { sub: 'Business Continuity', items: ['ISO 22301', 'ISO 22316', 'ISO 22320'] },
    ],
  },
  {
    id: 'audit',
    icon: FileCheck,
    title: 'Audit, Assurance & Financial Control',
    desc: 'Strengthen internal controls and ensure financial integrity with comprehensive audit and assurance services.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1600',
    richContent: `Financial integrity is the bedrock of any successful enterprise. Our audit and assurance services go beyond mere compliance to deliver deep insights into your financial operations. We help identify vulnerabilities, strengthen internal controls, and provide stakeholders with the confidence they need.`,
    benefits: ['Identify financial vulnerabilities early', 'Ensure regulatory compliance', 'Build investor and stakeholder trust', 'Optimize financial operations'],
    details: [
      { sub: 'Internal Audits', items: ['Internal control system reviews', 'Operational audit engagements', 'Compliance audit programs', 'Fraud risk assessment'] },
      { sub: 'Financial Statement Review', items: ['Financial statement preparation', 'Independent financial reviews', 'Due diligence assessments'] },
      { sub: 'IFRS Advisory', items: ['IFRS transition support', 'IFRS 9, 15, 16 implementation', 'Revenue recognition advisory'] },
      { sub: 'Control Systems', items: ['Internal control framework design', 'Sox compliance support', 'Process documentation'] },
    ],
  },
  {
    id: 'tax',
    icon: Scale,
    title: 'Tax Advisory & Compliance',
    desc: 'Navigate complex tax regulations with strategic planning and full compliance support.',
    image: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&q=80&w=1600',
    richContent: `Tax regulations are constantly evolving, presenting both risks and opportunities for businesses. Our tax advisory team works closely with you to develop tax-efficient strategies that align with your business goals while ensuring strict compliance with local and international tax laws.`,
    benefits: ['Optimize tax liabilities legally', 'Avoid costly compliance penalties', 'Strategic business structuring', 'Expert representation during audits'],
    details: [
      { sub: 'Tax Planning', items: ['Corporate tax strategy', 'Tax-efficient business structuring', 'Cross-border tax planning'] },
      { sub: 'Compliance Support', items: ['Tax return preparation', 'Withholding tax management', 'Transfer pricing documentation'] },
      { sub: 'VAT & Corporate Tax', items: ['VAT registration', 'Corporate tax advisory', 'Tax incentive optimization'] },
      { sub: 'Tax Audit Assistance', items: ['Tax audit representation', 'Tax dispute resolution', 'Pre-audit readiness'] },
    ],
  },
  {
    id: 'risk',
    icon: BarChart3,
    title: 'Risk Management & Compliance',
    desc: 'Enterprise risk frameworks, compliance systems, and internal controls to protect your organization.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1600',
    richContent: `In an unpredictable business environment, effective risk management is your strongest defense. We help organizations build robust Enterprise Risk Management (ERM) frameworks that proactively identify, assess, and mitigate risks across all operational levels.`,
    benefits: ['Proactive threat identification', 'Resilient operational framework', 'Culture of compliance and accountability', 'Reduced financial losses'],
    details: [
      { sub: 'Enterprise Risk Frameworks', items: ['ERM framework design', 'Risk appetite setting', 'Risk register development'] },
      { sub: 'Compliance Systems', items: ['Compliance management framework', 'Regulatory mapping', 'Whistleblowing hotline setup'] },
      { sub: 'Internal Controls', items: ['Control framework design', 'Control testing', 'Segregation of duties analysis'] },
    ],
  },
  {
    id: 'strategy',
    icon: LineChart,
    title: 'Business Strategy & Transformation',
    desc: 'Growth strategy, business model design, and operational restructuring for sustainable performance.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1600',
    richContent: `True transformation requires more than incremental changes; it demands a fundamental rethinking of how value is created. We partner with leadership teams to design innovative business models, execute operational restructuring, and chart a clear path to sustainable growth.`,
    benefits: ['Clear roadmap for sustainable growth', 'Increased market competitiveness', 'Optimized operational efficiency', 'Successful change adoption'],
    details: [
      { sub: 'Growth Strategy', items: ['Market entry strategy', 'Growth opportunity assessment', 'M&A advisory'] },
      { sub: 'Business Model Design', items: ['Business model innovation', 'Value proposition design', 'Digital transformation'] },
      { sub: 'Operational Restructuring', items: ['Process optimization', 'Cost reduction', 'Change management'] },
    ],
  },
  {
    id: 'esg',
    icon: Globe,
    title: 'ESG & Sustainability Advisory',
    desc: 'Implement ESG frameworks and sustainability reporting aligned with global standards.',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=1600',
    richContent: `Sustainability is no longer optional; it is a business imperative. Our ESG advisory services help you integrate environmental, social, and governance principles into your core strategy, creating long-term value for stakeholders and the planet.`,
    benefits: ['Attract ESG-focused investors', 'Enhance brand reputation', 'Comply with evolving global mandates', 'Future-proof your business model'],
    details: [
      { sub: 'ESG Frameworks', items: ['ESG strategy development', 'Materiality assessment', 'ESG policy formulation'] },
      { sub: 'Sustainability Reporting', items: ['GRI/TCFD alignment', 'Carbon footprint measurement', 'Science-based targets'] },
    ],
  },
  {
    id: 'hr',
    icon: Users,
    title: 'HR & Organizational Development',
    desc: 'Develop robust HR policies and performance management systems that drive results.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1600',
    richContent: `An organization is only as strong as its people. We help you build high-performing teams by designing effective HR policies, performance management systems, and organizational structures that foster talent, engagement, and productivity.`,
    benefits: ['Attract and retain top talent', 'Align individual goals with business objectives', 'Foster a positive workplace culture', 'Ensure labor law compliance'],
    details: [
      { sub: 'HR Policies', items: ['Policy development', 'Employee handbooks', 'Compensation design'] },
      { sub: 'Performance Systems', items: ['Performance management design', 'KPI development', 'Succession planning'] },
    ],
  },
  {
    id: 'it',
    icon: Lock,
    title: 'IT & Cybersecurity Advisory',
    desc: 'Strengthen IT governance and protect against cyber threats with expert advisory services.',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1600',
    richContent: `As digital transformation accelerates, so do cyber threats. Our IT advisory team ensures that your technology infrastructure is not only aligned with your business strategy but fortified against evolving security risks through robust governance and proactive defense mechanisms.`,
    benefits: ['Protect sensitive data from breaches', 'Align IT strategy with business goals', 'Ensure rapid incident response', 'Maintain regulatory data compliance'],
    details: [
      { sub: 'IT Governance', items: ['IT governance framework', 'IT strategy and roadmap', 'IT policy development'] },
      { sub: 'Cyber Risk', items: ['Risk assessment', 'Security architecture review', 'Incident response planning'] },
    ],
  },
];

export function generateStaticParams() {
  return serviceCategories.map((s) => ({ slug: s.id }));
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = serviceCategories.find(s => s.id === slug);

  if (!service) {
    notFound();
  }

  const Icon = service!.icon;

  return (
    <div className="bg-white dark:bg-slate-950">
      <PageHeader
        title={service.title}
        description={service.desc}
        breadcrumbs={[
          { name: 'Services', href: '/services' },
          { name: service.title }
        ]}
      />

      <section className="py-20 md:py-32">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand/10 border border-brand/20 rounded-full text-brand text-xs font-bold uppercase tracking-widest">
                <Icon size={14} /> Comprehensive Advisory
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tighter">
                Elevate Your Operations with Expert <span className="text-brand">Guidance</span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {service.richContent}
              </p>
              
              <div className="space-y-4 pt-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Key Benefits:</h3>
                {service.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <CheckCircle2 className="text-brand shrink-0" size={20} />
                    <span className="font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-50 dark:border-slate-900">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] p-10 md:p-16 border border-slate-100 dark:border-slate-800">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                Our Areas of <span className="text-brand">Expertise</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                We provide targeted solutions across specialized domains to ensure comprehensive coverage of your organizational needs.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {service.details.map((detail, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-950 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-brand/30 transition-all group">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 group-hover:text-primary-blue transition-colors">{detail.sub}</h3>
                  <ul className="space-y-4">
                    {detail.items.map((item, jdx) => (
                      <li key={jdx} className="flex items-start gap-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        <CheckCircle2 size={16} className="text-brand/50 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 relative text-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img src="/images/bottombanner.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary-blue/85" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tighter">
              Ready to Transform Your <span className="text-brand">Business?</span>
            </h2>
            <p className="text-lg text-slate-300 font-medium">
              Schedule a consultation with our experts to discuss how our {service.title} services can drive value for your organization.
            </p>
            <div className="pt-4">
                <Link href="/contact">
                <Button className="bg-brand hover:bg-brand-dark text-white font-bold rounded-full h-14 px-10 shadow-xl active:scale-95 transition-all text-sm">
                  Talk to an Expert <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
