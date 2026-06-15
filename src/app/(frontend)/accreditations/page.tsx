import { CheckCircle2, ShieldCheck, Award, FileCheck2, Globe2 } from 'lucide-react';

import { PageHeader } from '@/components/frontend/layout/PageHeader';

export default function AccreditationsPage() {
    return (
        <div className="bg-white dark:bg-[#020617] min-h-screen transition-colors duration-500">
            <PageHeader 
                title="Our Accreditations"
                description="Our services meet the highest standards of professional excellence, recognized by leading international and local regulatory bodies."
                breadcrumbs={[{ name: 'Accreditations' }]}
            />

            {/* Accreditations List */}
            <section className="py-24 relative z-20">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: 'ISO 9001:2015', desc: 'Certified for Quality Management Systems, ensuring our services meet statutory and regulatory requirements.', icon: ShieldCheck, color: 'text-brand' },
                            { title: 'NEBOSH Partner', desc: 'Gold learning partner for the National Examination Board in Occupational Safety and Health.', icon: Award, color: 'text-blue-500' },
                            { title: 'ISPON Registered', desc: 'Fully registered and compliant with the Institute of Safety Professionals of Nigeria.', icon: CheckCircle2, color: 'text-emerald-500' },
                            { title: 'DPR Licensed', desc: 'Licensed by the Department of Petroleum Resources for specialized oil & gas training.', icon: FileCheck2, color: 'text-rose-500' },
                            { title: 'Global Standards', desc: 'Aligning our curriculum to meet international best practices across all sectors.', icon: Globe2, color: 'text-purple-500' },
                        ].map((v, i) => (
                            <div key={i} className="group p-10 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] space-y-6 hover:shadow-2xl hover:border-brand/30 transition-all duration-500">
                                <div className={`w-16 h-16 ${v.color}/10 rounded-2xl flex items-center justify-center ${v.color} group-hover:scale-110 transition-transform`}>
                                    <v.icon size={32} />
                                </div>
                                <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">{v.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                    {v.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
