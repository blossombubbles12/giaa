import { db } from '@/db';
import { certificates, users, courses } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { ShieldCheck, XCircle, CheckCircle2, Award, Calendar, User, BookOpen, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function VerifyPage({ params }: { params: Promise<{ hash: string }> }) {
    const { hash } = await params;

    const certificate = await db.query.certificates.findFirst({
        where: eq(certificates.verifyHash, hash),
        with: {
            user: true,
            course: true
        }
    });

    return (
        <div className="bg-white dark:bg-navy min-h-screen pb-32">

            {/* Header */}
            <section className="pt-24 pb-48 bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
                </div>
                <div className="container mx-auto px-4 md:px-6 relative z-10 text-center space-y-8">
                    <h4 className="text-brand font-black uppercase tracking-[0.4em] text-xs">Credential Verification</h4>
                    <h1 className="text-6xl md:text-9xl font-black text-white leading-[0.8] tracking-tighter uppercase">
                        Validate <span className="text-brand">Identity</span>
                    </h1>
                </div>
            </section>

            {/* Result Section */}
            <section className="container mx-auto px-4 md:px-6 -mt-24 relative z-20">
                <div className="max-w-4xl mx-auto">
                    {certificate ? (
                        <div className="bg-white dark:bg-slate-950 p-10 md:p-20 rounded-[4rem] shadow-2xl border border-emerald-500/20 dark:border-emerald-500/10 space-y-12 relative overflow-hidden group">

                            {/* Success Accent */}
                            <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full" />

                            <div className="flex flex-col md:flex-row items-center gap-10 text-center md:text-left">
                                <div className="w-24 h-24 bg-emerald-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
                                    <ShieldCheck size={48} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">Authentic Credential</h3>
                                    <p className="text-sm font-black uppercase tracking-widest text-emerald-600">Certificate Verified Successfully</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-12 border-y border-slate-100 dark:border-slate-800">
                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Student Name</p>
                                        <div className="flex items-center gap-3">
                                            <User className="w-4 h-4 text-brand" />
                                            <span className="text-xl font-black uppercase text-slate-900 dark:text-white">{certificate.user.name}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Course / Certification</p>
                                        <div className="flex items-center gap-3">
                                            <BookOpen className="w-4 h-4 text-blue-500" />
                                            <span className="text-xl font-black uppercase text-slate-900 dark:text-white">{certificate.course.title}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Issue Date</p>
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-4 h-4 text-purple-500" />
                                            <span className="text-xl font-black uppercase text-slate-900 dark:text-white">
                                                {new Date(certificate.issuedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verification Hash</p>
                                        <code className="text-xs font-bold text-slate-400 block bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-xl mt-2 select-all">
                                            {certificate.verifyHash}
                                        </code>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <Button className="bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-brand dark:hover:bg-brand hover:text-white rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all gap-2">
                                    Download PDF <Download size={16} />
                                </Button>
                                <Button variant="outline" className="rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-xs border-slate-200 dark:border-slate-800 transition-all gap-2">
                                    Share Proof <Share2 size={16} />
                                </Button>
                            </div>

                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-950 p-10 md:p-20 rounded-[4rem] shadow-2xl border border-red-500/20 dark:border-red-500/10 text-center space-y-8 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-2 bg-red-500" />
                            <div className="w-24 h-24 bg-red-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-red-500/20 mx-auto">
                                <XCircle size={48} />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">Verification Failed</h3>
                                <p className="text-lg text-slate-500 font-medium max-w-sm mx-auto">
                                    The provided certificate hash could not be found in our secure database.
                                    Please verify the code and try again.
                                </p>
                            </div>
                            <div className="pt-6">
                                <Link href="/">
                                    <Button className="bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-2xl h-14 px-10 font-black uppercase tracking-widest text-xs active:scale-95 transition-all">
                                        Return Home
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </section>

        </div>
    );
}
