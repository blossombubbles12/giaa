import { HelpCircle, MessagesSquare, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

import { PageHeader } from '@/components/frontend/layout/PageHeader';

export default function FAQsPage() {
    return (
        <div className="bg-white dark:bg-[#020617] min-h-screen transition-colors duration-500">
            <PageHeader 
                title="Frequently Asked Questions"
                description="Everything you need to know about GIA Advisory, our services, and our processes. Search through our knowledge base or reach out to our team."
                breadcrumbs={[{ name: 'FAQs' }]}
            />

            <div className="container -mt-10 relative z-20 flex justify-center">
                <div className="relative max-w-2xl w-full group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={20} />
                    <Input
                        placeholder="Search for answers..."
                        className="h-16 bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl pl-16 pr-8 text-sm md:text-base font-bold shadow-2xl focus-visible:ring-brand/20 focus-visible:border-brand transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                    />
                </div>
            </div>

            {/* FAQs Accordion Replacement List */}
            <section className="py-24 relative z-20">
                <div className="container max-w-4xl">
                    <div className="space-y-6">
                        {[
                            { q: 'How do I register for a course?', a: 'You can register for any course directly from our Courses page. Click on the desired course, and follow the simple checkout process.' },
                            { q: 'Are your certificates internationally recognized?', a: 'Yes! Our programs are accredited by global organizations such as NEBOSH, ensuring that your certification holds weight anywhere in the world.' },
                            { q: 'Can I take courses online?', a: 'Absolutely. We offer flexible learning modes including full online, offline (in-person), and hybrid options.' },
                            { q: 'Do you offer corporate training?', a: 'Yes, we provide bespoke in-house training proposals tailored to meet the specific safety and operational needs of your organization.' },
                            { q: 'What payment methods do you accept?', a: 'We accept secure payments via major credit/debit cards, direct bank transfers, and Paystack.' },
                        ].map((faq, i) => (
                            <details key={i} className="group bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 open:shadow-xl transition-all duration-300">
                                <summary className="flex items-center justify-between cursor-pointer list-none font-bold text-xl lg:text-2xl text-slate-900 dark:text-white uppercase tracking-tighter hover:text-amber-500 transition-colors">
                                    {faq.q}
                                    <span className="w-10 h-10 bg-white dark:bg-slate-950 rounded-xl flex items-center justify-center border border-slate-100 dark:border-slate-800 text-slate-400 group-open:rotate-180 group-open:bg-amber-500 group-open:text-white group-open:border-amber-500 transition-all">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </span>
                                </summary>
                                <div className="mt-6 text-slate-500 dark:text-slate-400 text-lg leading-relaxed font-medium pl-6 border-l-4 border-amber-500/20">
                                    <p>{faq.a}</p>
                                </div>
                            </details>
                        ))}
                    </div>

                    {/* Support Block */}
                    <div className="mt-20 p-10 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[3rem] text-center shadow-lg">
                        <MessagesSquare size={48} className="text-slate-300 dark:text-slate-700 mx-auto mb-6" />
                        <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white mb-2">Still have questions?</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">If you cannot find the answer to your question in our FAQ, you can always contact our friendly support team.</p>
                        <a href="/contact">
                            <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-amber-500 dark:hover:bg-amber-500 hover:text-white rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">
                                Contact Support
                            </button>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
