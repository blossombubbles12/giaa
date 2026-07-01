import { db } from '@/db';
import { certificates } from '@/db/schema';
import { eq, or } from 'drizzle-orm';
import { ShieldCheck, XCircle, CheckCircle2, User, BookOpen, Calendar, ArrowLeft, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { VerifyActions } from '@/components/frontend/verify/VerifyActions';

export default async function VerifyPage({ params }: { params: Promise<{ hash: string }> }) {
  const { hash } = await params;
  const cleanHash = hash.replace(/-/g, ''); // Strip dashes for short code lookup

  const certificate = await db.query.certificates.findFirst({
    where: or(eq(certificates.verifyHash, hash), eq(certificates.shortCode, cleanHash)),
    with: { user: true, course: true },
  });

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pb-24">
      {/* Header */}
      <section className="relative bg-primary-blue overflow-hidden pt-16 pb-32">
        <div className="absolute inset-0" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1920)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-primary-blue/85" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-slate-950 to-transparent" />
        <div className="container relative z-10 text-center pt-8">
          <Link href="/verify" className="inline-flex items-center gap-1.5 text-white/50 hover:text-brand text-xs font-bold uppercase tracking-widest mb-6 transition-colors">
            <ArrowLeft size={12} /> Back to Verification
          </Link>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-[1.05] tracking-tighter">
            Certificate <span className="text-brand">Validation</span>
          </h1>
        </div>
      </section>

      {/* Result */}
      <section className="container -mt-20 relative z-20">
        <div className="max-w-3xl mx-auto">
          {certificate ? (
            <div className="bg-white dark:bg-slate-950 rounded-3xl shadow-2xl border border-emerald-200 dark:border-emerald-900/30 overflow-hidden">
              {/* Top accent */}
              <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600" />

              <div className="p-8 md:p-12 space-y-10">
                {/* Status header */}
                <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                  <div className="w-20 h-20 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 shrink-0">
                    <ShieldCheck size={40} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-primary-blue dark:text-white tracking-tight">Authentic Credential</h2>
                    <div className="flex items-center gap-2 mt-2">
                      <CheckCircle2 size={16} className="text-emerald-500" />
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Certificate Verified Successfully</span>
                    </div>
                  </div>
                </div>

                {/* Certificate details */}
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-8 space-y-8 border border-slate-100 dark:border-slate-800">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Recipient</p>
                        <div className="flex items-center gap-3">
                          <User size={16} className="text-brand shrink-0" />
                          <span className="text-lg font-black text-primary-blue dark:text-white">{certificate.user?.name ?? certificate.recipientName}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Credential</p>
                        <div className="flex items-center gap-3">
                          <BookOpen size={16} className="text-blue-500 shrink-0" />
                          <span className="text-lg font-black text-primary-blue dark:text-white">{certificate.course.title}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Issue Date</p>
                        <div className="flex items-center gap-3">
                          <Calendar size={16} className="text-purple-500 shrink-0" />
                          <span className="text-lg font-black text-primary-blue dark:text-white">
                            {new Date(certificate.issuedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Verification Code</p>
                        <div className="flex items-center gap-3">
                          <Hash size={16} className="text-amber-500 shrink-0" />
                          <span className="text-2xl font-black tracking-[0.3em] text-primary-blue dark:text-white select-all">
                            {certificate.shortCode.slice(0, 3)}-{certificate.shortCode.slice(3)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <VerifyActions certId={certificate.id} shortCode={certificate.shortCode} />

                {/* Seal */}
                <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    GIA Advisory Consulting Services &mdash; Verified Credential
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-950 rounded-3xl shadow-2xl border border-red-200 dark:border-red-900/30 overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-red-400 via-red-500 to-red-600" />
              <div className="p-8 md:p-12 text-center space-y-8">
                <div className="w-20 h-20 rounded-2xl bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-500/20 mx-auto">
                  <XCircle size={40} />
                </div>
                <div className="space-y-3">
                  <h2 className="text-2xl font-black text-primary-blue dark:text-white tracking-tight">Verification Failed</h2>
                  <p className="text-slate-500 font-medium max-w-md mx-auto">
                    The provided certificate hash could not be found in our secure database. Please verify the code and try again.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <Link href="/verify">
                    <Button className="bg-brand hover:bg-brand-dark text-white rounded-xl h-12 px-8 font-bold text-xs shadow-lg active:scale-95 transition-all">
                      Try Again
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" className="rounded-xl h-12 px-8 font-bold text-xs border-slate-200 dark:border-slate-700 active:scale-95 transition-all">
                      Return Home
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}