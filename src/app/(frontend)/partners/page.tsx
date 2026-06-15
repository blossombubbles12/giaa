import { Metadata } from 'next';
import { ArrowLeft, Handshake } from 'lucide-react';
import Link from 'next/link';

import { PageHeader } from '@/components/frontend/layout/PageHeader';

export const metadata: Metadata = {
    title: 'Our Partners | GIA Advisory',
    description: 'Our esteemed global and local partners.',
};

export default function OurPartnersPage() {
    const partners = [
        { id: 1, ext: 'webp' },
        { id: 2, ext: 'webp' },
        { id: 3, ext: 'png' },
        { id: 4, ext: 'png' },
        { id: 5, ext: 'png' },
        { id: 6, ext: 'png' },
    ];

    return (
        <div className="bg-white dark:bg-[#020617] pb-32 transition-colors duration-500">
            <PageHeader 
                title="Our Global Partners"
                description="We work closely with globally recognized institutions and technical bodies to certify our programs and deliver unparalleled corporate quality."
                breadcrumbs={[{ name: 'Our Partners' }]}
            />

            <div className="container -mt-10 relative z-20">
                <div className="max-w-7xl mx-auto space-y-16 pt-16">
                    {/* Partner Grid */}
                    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-10 md:p-16 shadow-xl shadow-brand/5 relative overflow-hidden">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand/5 blur-[100px] rounded-full pointer-events-none" />

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 relative z-10">
                            {partners.map((partner) => (
                                <div
                                    key={partner.id}
                                    className="group bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-8 flex items-center justify-center border border-slate-100 dark:border-slate-800 hover:border-brand/40 hover:bg-white dark:hover:bg-slate-900 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-brand/10 hover:-translate-y-1 aspect-square md:aspect-auto md:h-48"
                                >
                                    <img
                                        src={`/partner${partner.id}.${partner.ext}`}
                                        alt={`Partner ${partner.id}`}
                                        className="max-w-[140px] md:max-w-[180px] w-full object-contain transition-transform duration-700 hover:scale-110"
                                    />
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
