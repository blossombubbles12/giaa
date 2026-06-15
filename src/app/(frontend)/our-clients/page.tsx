import { Metadata } from 'next';
import { ArrowLeft, Building2 } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Our Clients | GIA Advisory',
    description: 'Trusted by leading organizations globally.',
};

export default function OurClientsPage() {
    const clients = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-navy py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">

                <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-brand transition-colors mb-8 group font-medium max-w-7xl mx-auto w-full">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <div className="max-w-7xl mx-auto space-y-16">
                    {/* Header */}
                    <div className="text-center max-w-3xl mx-auto space-y-6">
                        <div className="w-20 h-20 bg-brand/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-brand/20">
                            <Building2 className="w-10 h-10 text-brand" />
                        </div>
                        <h4 className="text-brand font-black uppercase tracking-[.3em] text-xs">Trusted Globally</h4>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">
                            Our <span className="text-brand">Clients</span>
                        </h1>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed">
                            We collaborate with industry leaders and forward-thinking organizations to deliver transformative educational and enterprise solutions.
                        </p>
                    </div>

                    {/* Partner Grid */}
                    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-10 md:p-16 shadow-xl shadow-brand/5 relative overflow-hidden">
                        {/* Decorative background blur */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand/5 blur-[100px] rounded-full pointer-events-none" />

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12 relative z-10">
                            {clients.map((num) => (
                                <div
                                    key={num}
                                    className="group bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-8 flex items-center justify-center border border-slate-100 dark:border-slate-800 hover:border-brand/40 hover:bg-white dark:hover:bg-slate-900 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-brand/10 hover:-translate-y-1 aspect-square md:aspect-auto md:h-48"
                                >
                                    <img
                                        src={`/client${num}.${num === 4 ? 'png' : 'webp'}`}
                                        alt={`Client ${num}`}
                                        className="max-w-[120px] md:max-w-[160px] w-full object-contain transition-transform duration-700 hover:scale-110"
                                    />
                                </div>
                            ))}
                        </div>

                    </div>

                    {/* Bottom CTA */}
                    <div className="text-center pt-8">
                        <Link href="/contact" className="inline-flex">
                            <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-brand dark:hover:bg-brand hover:text-white rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">
                                Work With Us
                            </button>
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
