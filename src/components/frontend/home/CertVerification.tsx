'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Search, ArrowRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function CertVerification() {
    const [hash, setHash] = useState('');
    const router = useRouter();

    const handleVerify = () => {
        if (!hash.trim()) return;
        router.push(`/verify/${hash}`);
    };

    return (
        <section className="py-16 bg-[#020617] relative overflow-hidden">
            {/* Design accents */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-10">

                    <div className="lg:w-1/2 space-y-8 text-white text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.34em]">
                            Global Verification
                        </div>

                        <h2 className="text-2xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                            Validate Your <br />
                            <span className="text-white/20">GIA</span> Credentials
                        </h2>

                        <p className="text-base font-medium opacity-80 max-w-xl mx-auto lg:mx-0">
                            Our secure blockchain-backed certificate verification ensures the authenticity
                            of every graduate. Employers can instantly verify credentials worldwide.
                        </p>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-10 opacity-70">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="h-6 w-6" />
                                <span className="text-xs font-black uppercase tracking-widest">Secure</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Search className="h-6 w-6" />
                                <span className="text-xs font-black uppercase tracking-widest">Instant</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Download className="h-6 w-6" />
                                <span className="text-xs font-black uppercase tracking-widest">Legitimate</span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/2 w-full">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 sm:p-10 rounded-[3rem] shadow-2xl flex flex-col gap-6"
                        >
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-white uppercase">Verify Certificate</h3>
                                <p className="text-sm font-medium text-white/70 leading-relaxed">Enter the 16-character unique certificate hash code provided below the signature.</p>
                            </div>

                            <div className="relative group">
                                <Input
                                    value={hash}
                                    onChange={(e) => setHash(e.target.value)}
                                    placeholder="Enter Hash Code (e.g. DW-2026-XQ...)"
                                    className="h-16 rounded-[2rem] bg-white border-0 text-slate-900 font-bold placeholder:text-slate-400 pl-8 pr-32 focus-visible:ring-offset-0 focus-visible:ring-brand shadow-lg"
                                />
                                <Button
                                    onClick={handleVerify}
                                    className="absolute right-2 top-2 bottom-2 bg-brand text-white rounded-[1.5rem] px-8 font-black uppercase tracking-widest text-xs hover:bg-slate-900 shadow-xl shadow-brand/20 active:scale-95 transition-all"
                                >
                                    Verify <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>

                            <div className="pt-4 flex items-center justify-between">
                                <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Verified over 12,000 alumni credentials globally</span>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
