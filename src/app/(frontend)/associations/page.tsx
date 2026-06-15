import { Metadata } from 'next';
import { ArrowLeft, Award, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

import { PageHeader } from '@/components/frontend/layout/PageHeader';

export const metadata: Metadata = {
    title: 'Associations & Accreditations | GIA Advisory',
    description: 'Learn about GIA Advisory global associations, memberships, and certifications.',
};

export default function AssociationsPage() {
    return (
        <div className="bg-white dark:bg-[#020617] pb-32 transition-colors duration-500">
            <PageHeader 
                title="Our Associations & Accreditations"
                description="GIA Advisory is proud to meet the gold standard of professional training and corporate strategy, recognized by leading international organizations."
                breadcrumbs={[{ name: 'Associations' }]}
            />

            <div className="container -mt-10 relative z-20">
                <div className="max-w-7xl mx-auto space-y-16 pt-16">
                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                        {/* Association 1 */}
                        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:border-brand/40 transition-all duration-500 shadow-sm hover:translate-y-[-4px] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 blur-3xl group-hover:bg-brand/10 transition-colors" />
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-slate-900 flex items-center justify-center mb-6 text-blue-500 border border-blue-100 dark:border-slate-800">
                                <Award size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">ISO 9001:2015 Certified</h3>
                            <p className="text-sm text-slate-500 leading-relaxed mb-6">
                                We operate strictly under a certified Quality Management System that ensures consistent and superior outcome delivery.
                            </p>
                        </div>

                        {/* Association 2 */}
                        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:border-brand/40 transition-all duration-500 shadow-sm hover:translate-y-[-4px] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 blur-3xl group-hover:bg-brand/10 transition-colors" />
                            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-slate-900 flex items-center justify-center mb-6 text-emerald-500 border border-emerald-100 dark:border-slate-800">
                                <CheckCircle2 size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Global Training Consortium</h3>
                            <p className="text-sm text-slate-500 leading-relaxed mb-6">
                                Recognized standard-bearers ensuring our technical, leadership, and operational curriculum remains top-tier worldwide.
                            </p>
                        </div>

                        {/* Association 3 */}
                        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:border-brand/40 transition-all duration-500 shadow-sm hover:translate-y-[-4px] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 blur-3xl group-hover:bg-brand/10 transition-colors" />
                            <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-slate-900 flex items-center justify-center mb-6 text-purple-500 border border-purple-100 dark:border-slate-800">
                                <Award size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Management Institute</h3>
                            <p className="text-sm text-slate-500 leading-relaxed mb-6">
                                Providing access to extensive research data, modern organizational tactics, and premium management frameworks.
                            </p>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}
