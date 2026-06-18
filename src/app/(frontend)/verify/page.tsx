'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Search, ArrowRight, Award, CheckCircle2, QrCode, Lock, BookOpen, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function VerifyLandingPage() {
  const [hash, setHash] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hash.trim()) return;
    setLoading(true);
    router.push(`/verify/${hash.trim()}`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero */}
      <section className="relative bg-primary-blue overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, #a13938 0%, transparent 50%), radial-gradient(circle at 70% 60%, #a13938 0%, transparent 50%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white dark:from-slate-950 to-transparent" />
        <div className="container relative z-10 text-center pt-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-white/70 text-[11px] font-bold uppercase tracking-widest mb-6">
              <ShieldCheck size={14} className="text-brand" /> Secure Credential Verification
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.05] tracking-tighter mb-4">
              Verify a <span className="text-brand">Certificate</span>
            </h1>
            <p className="text-base md:text-lg text-slate-300 font-medium max-w-xl mx-auto">
              Enter the unique verification code from your certificate to confirm its authenticity in real time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Card */}
      <section className="container -mt-20 relative z-20 pb-24">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-white dark:bg-slate-950 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 md:p-12 space-y-8"
          >
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-brand/10 flex items-center justify-center text-brand mx-auto">
                <Search size={28} />
              </div>
              <h2 className="text-xl font-bold text-primary-blue dark:text-white">Enter Verification Code</h2>
              <p className="text-sm text-slate-500">Paste the hash from your certificate document below</p>
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. a3f8b2c1d4e5..."
                  value={hash}
                  onChange={(e) => setHash(e.target.value)}
                  className="w-full h-14 pl-5 pr-36 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-medium focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                />
                <div className="absolute inset-y-2 right-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-full px-6 bg-brand hover:bg-brand-dark text-white rounded-xl font-bold text-xs gap-2 shadow-lg active:scale-95 transition-all"
                  >
                    {loading ? 'Verifying...' : <>Verify <ArrowRight size={14} /></>}
                  </Button>
                </div>
              </div>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              {[
                { icon: CheckCircle2, label: 'Authenticity', desc: '100% Genuine', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                { icon: Award, label: 'Accredited', desc: 'GIA Certified', color: 'text-blue-500', bg: 'bg-blue-500/10' },
                { icon: Lock, label: 'Secure', desc: 'Instant Check', color: 'text-purple-500', bg: 'bg-purple-500/10' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                  <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center ${item.color} shrink-0`}>
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400">{item.label}</p>
                    <p className="text-xs font-bold text-primary-blue dark:text-white">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* How it works */}
          <div className="mt-16 text-center">
            <h3 className="text-sm font-bold text-primary-blue dark:text-white mb-8">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '01', icon: QrCode, title: 'Locate Code', desc: 'Find the unique verification hash on your certificate document.' },
                { step: '02', icon: Search, title: 'Enter Hash', desc: 'Type or paste the code into the field above and click Verify.' },
                { step: '03', icon: UserCheck, title: 'Instant Result', desc: 'Our system instantly confirms the credential\'s authenticity.' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center space-y-3"
                >
                  <div className="text-5xl font-black text-brand/10">{item.step}</div>
                  <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center text-brand mx-auto">
                    <item.icon size={22} />
                  </div>
                  <h4 className="text-sm font-bold text-primary-blue dark:text-white">{item.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-[220px] mx-auto">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}