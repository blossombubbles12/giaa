import { Metadata } from 'next';
import { ArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/db';
import { pageContent } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const metadata: Metadata = {
    title: 'Terms & Conditions | GIA Advisory',
    description: 'Terms and Conditions of use for GIA Advisory services and applications.',
};

export default async function TermsConditionsPage() {
    const content = await db.query.pageContent.findFirst({
        where: eq(pageContent.key, 'TERMS_AND_CONDITIONS')
    });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-navy py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">

                <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-brand transition-colors mb-8 group font-medium">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-sm space-y-10">

                    <div className="space-y-4 border-b border-slate-100 dark:border-slate-800 pb-8">
                        <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mb-6">
                            <FileText className="w-8 h-8 text-brand" />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                            Terms & <span className="text-brand">Conditions</span>
                        </h1>
                        <p className="text-slate-500 font-medium">Effective Date: {new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
                    </div>

                    <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-slate-600 dark:text-slate-300">
                        {content ? (
                            <div dangerouslySetInnerHTML={{ __html: content.value }} />
                        ) : (
                            <>
                                <section className="space-y-4">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. Agreement to Terms</h2>
                                    <p>
                                        By accessing or using the GIA Advisory website, services, and applications, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the service.
                                    </p>
                                </section>

                                <section className="space-y-4">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. Intellectual Property Rights</h2>
                                    <p>
                                        Other than the content you own, under these Terms, GIA Advisory and/or its licensors own all the intellectual property rights and materials contained in this Website. You are granted limited license only for purposes of viewing the material contained on this Website.
                                    </p>
                                </section>

                                <section className="space-y-4">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. Restrictions</h2>
                                    <p>You are specifically restricted from all of the following:</p>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>publishing any Website material in any other media;</li>
                                        <li>selling, sublicensing and/or otherwise commercializing any Website material;</li>
                                        <li>publicly performing and/or showing any Website material;</li>
                                        <li>using this Website in any way that is or may be damaging to this Website;</li>
                                        <li>using this Website in any way that impacts user access to this Website;</li>
                                        <li>using this Website contrary to applicable laws and regulations, or in any way may cause harm to the Website, or to any person or business entity.</li>
                                    </ul>
                                </section>

                                <section className="space-y-4">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. Facility Bookings & Enrollment</h2>
                                    <p>
                                        If you enroll in a course or book a workspace facility through GIA Advisory, you agree to comply with all applicable terms, schedules, rules, and payment obligations. Space rentals are subject to availability and payment confirmation. Course enrollments grant access to study materials which are non-transferable.
                                    </p>
                                    <p>
                                        All payments are securely processed. Refund policies vary by product and may be subject to administrative fees. Please refer to individual booking forms for detailed cancellation policies.
                                    </p>
                                </section>

                                <section className="space-y-4">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">5. Limitation of Liability</h2>
                                    <p>
                                        In no event shall GIA Advisory, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. GIA Advisory, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.
                                    </p>
                                </section>

                                <section className="space-y-4">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">6. Governing Law & Jurisdiction</h2>
                                    <p>
                                        These Terms will be governed by and interpreted in accordance with the laws of the Federal Republic of Nigeria, and you submit to the non-exclusive jurisdiction of the state and federal courts located in Nigeria for the resolution of any disputes.
                                    </p>
                                </section>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
