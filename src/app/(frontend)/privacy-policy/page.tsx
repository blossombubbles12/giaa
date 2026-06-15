import { Metadata } from 'next';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/db';
import { pageContent } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const metadata: Metadata = {
    title: 'Privacy Policy | GIA Advisory',
    description: 'Privacy Policy and data handling practices for GIA Advisory.',
};

export default async function PrivacyPolicyPage() {
    const content = await db.query.pageContent.findFirst({
        where: eq(pageContent.key, 'PRIVACY_POLICY')
    });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-navy py-16 md:py-24">
            <div className="container max-w-4xl">

                <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-brand transition-colors mb-8 group font-medium">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-sm space-y-10">

                    <div className="space-y-4 border-b border-slate-100 dark:border-slate-800 pb-8">
                        <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mb-6">
                            <ShieldCheck className="w-8 h-8 text-brand" />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                            Privacy <span className="text-brand">Policy</span>
                        </h1>
                        <p className="text-slate-500 font-medium">Effective Date: {new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
                    </div>

                    <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-slate-600 dark:text-slate-300">
                        {content ? (
                            <div dangerouslySetInnerHTML={{ __html: content.value }} />
                        ) : (
                            <>
                                <section className="space-y-4">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. Introduction</h2>
                                    <p>
                                        Welcome to GIA Advisory. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.
                                    </p>
                                    <p>
                                        When you visit our website, and use our services, you trust us with your personal information. We take your privacy very seriously. In this privacy policy, we seek to explain to you in the clearest way possible what information we collect, how we use it and what rights you have in relation to it.
                                    </p>
                                </section>

                                <section className="space-y-4">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. Information We Collect</h2>
                                    <p>
                                        We collect personal information that you provide to us such as name, address, contact information, passwords and security data, and payment information.
                                    </p>
                                    <p>
                                        We collect personal information that you voluntarily provide to us when registering on the website expressing an interest in obtaining information about us or our products and services, when participating in activities on the website or otherwise contacting us.
                                    </p>
                                </section>

                                <section className="space-y-4">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. How We Use Your Information</h2>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li><strong>To facilitate account creation and logon process:</strong> If you choose to link your account with us to a third party account (such as your Google or Facebook account), we use the information you allowed us to collect from those third parties to facilitate account creation and logon process.</li>
                                        <li><strong>To send administrative information to you:</strong> We may use your personal information to send you product, service and new feature information and/or information about changes to our terms, conditions, and policies.</li>
                                        <li><strong>To fulfill and manage your orders:</strong> We may use your information to fulfill and manage your orders, payments, returns, and exchanges made through the website.</li>
                                    </ul>
                                </section>

                                <section className="space-y-4">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. Will Your Information Be Shared With Anyone?</h2>
                                    <p>
                                        We only share and disclose your information in the following situations:
                                    </p>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li><strong>Compliance with Laws:</strong> We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process.</li>
                                        <li><strong>Vital Interests and Legal Rights:</strong> We may disclose your information where we believe it is necessary to investigate, prevent, or take action regarding potential violations of our policies, suspected fraud, situations involving potential threats to the safety of any person and illegal activities, or as evidence in litigation in which we are involved.</li>
                                        <li><strong>Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
                                    </ul>
                                </section>

                                <section className="space-y-4">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">5. Contact Us</h2>
                                    <p>
                                        If you have questions or comments about this policy, you may email us at info@giaadvisory.com or by post to our office in Abuja.
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
