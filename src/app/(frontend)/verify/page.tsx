'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Search, Loader2, ArrowRight, Award, CheckCircle2, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

import { PageHeader } from '@/components/frontend/layout/PageHeader';

export default function VerifyLandingPage() {
    const [hash, setHash] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        if (!hash.trim()) {
            toast.error('Please enter a verification hash');
            return;
        }
        setLoading(true);
        router.push(`/verify/${hash.trim()}`);
    };

    return (
        <div className="bg-white dark:bg-[#020617] min-h-screen transition-colors duration-500">
            <PageHeader 
                title="Validate Your Credentials"
                description="Ensure the authenticity of your GIA certifications and professional identities through our global verification infrastructure."
                breadcrumbs={[{ name: 'Verify' }]}
            />

            {/* Verification Form Section */}
            <section className="container -mt-24 relative z-20 pb-32">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white dark:bg-slate-950 p-8 md:p-16 rounded-[4rem] shadow-2xl border border-slate-100 dark:border-slate-800 space-y-10 animate-in fade-in slide-in-from-bottom-16 duration-700 delay-300">
                        <div className="space-y-2 text-center md:text-left">
                            <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">Enter Security Hash</h3>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Provide the unique verification code from your document</p>
                        </div>

                        <form onSubmit={handleVerify} className="relative group">
                            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                                <Search className="w-5 h-5 text-slate-400 group-focus-within:text-brand transition-colors" />
                            </div>
                            <Input
                                placeholder="e.g. cert_7k92m..."
                                className="h-20 pl-16 pr-48 rounded-3xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xl font-black tracking-tight focus:ring-brand focus:border-brand transition-all shadow-inner"
                                value={hash}
                                onChange={(e) => setHash(e.target.value)}
                            />
                            <div className="absolute inset-y-2 right-2 flex items-center">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="h-full px-8 bg-slate-900 dark:bg-brand text-white rounded-2xl font-black uppercase tracking-widest text-xs gap-2 shadow-xl active:scale-95 transition-all"
                                >
                                    {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <>Validate <ArrowRight size={14} /></>}
                                </Button>
                            </div>
                        </form>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black uppercase text-slate-400">Authenticity</p>
                                    <p className="text-xs font-bold text-slate-900 dark:text-white uppercase">100% Genuine</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                                    <Award size={24} />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black uppercase text-slate-400">Accredited</p>
                                    <p className="text-xs font-bold text-slate-900 dark:text-white uppercase">GIA Certified</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
                                    <QrCode size={24} />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black uppercase text-slate-400">Dynamic</p>
                                    <p className="text-xs font-bold text-slate-900 dark:text-white uppercase">Instant Check</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 text-center space-y-4">
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Trusted by global partners and institutions</p>
                        <div className="flex justify-center flex-wrap gap-8 opacity-40 grayscale group hover:opacity-100 hover:grayscale-0 transition-all duration-700">
                            {/* Logo placeholders - assuming some standard ones or just stylized text */}
                            <span className="text-sm font-black text-slate-400 uppercase tracking-tighter">TPS Offices</span>
                            <span className="text-sm font-black text-slate-400 uppercase tracking-tighter">Maina Court</span>
                            <span className="text-sm font-black text-slate-400 uppercase tracking-tighter">Lagos Board</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
