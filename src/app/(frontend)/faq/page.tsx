import { Metadata } from 'next';
import { ArrowLeft, MessageCircleQuestion } from 'lucide-react';
import Link from 'next/link';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

import { PageHeader } from '@/components/frontend/layout/PageHeader';

export const metadata: Metadata = {
    title: 'FAQ | GIA Advisory',
    description: 'Frequently Asked Questions about our courses and services.',
};

export default function FAQPage() {
    const faqs = [
        {
            question: "How do I register for a course?",
            answer: "You can register for a course by browsing our Course catalog, clicking on your desired course, and selecting 'Enroll Now'. You will be guided through a secure payment checkout to complete your enrollment."
        },
        {
            question: "Are your certificates globally recognized?",
            answer: "Yes, our certifications are globally recognized and fully accredited by leading international bodies ensuring that they hold weight worldwide."
        },
        {
            question: "Can I book a training space without taking a course?",
            answer: "Absolutely! Our Executive Boardrooms, Training Rooms, and Private Offices are available for rent to both individuals and organizations. Visit our Workspace Rent page to reserve a facility."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major Credit and Debit cards, Bank Transfers, and USSD secure payments via our Paystack gateway integration."
        },
        {
            question: "Do you offer tailored in-house training for organizations?",
            answer: "Yes, we specialize in corporate engagements and can fully customize our curriculum and bring our expert facilitators directly to your office (or host you at ours). Please submit an In-House Proposal request from the footer."
        },
        {
            question: "How long do I have access to course materials?",
            answer: "Enrollment in our online courses grants you full lifetime access to all learning materials, recorded videos, and downloadable resources."
        }
    ];

    return (
        <div className="bg-white dark:bg-[#020617] pb-32 transition-colors duration-500">
            <PageHeader 
                title="Frequently Asked Questions"
                description="Everything you need to know about GIA Advisory, our services, and our processes."
                breadcrumbs={[{ name: 'FAQ' }]}
            />

            <div className="container -mt-10 relative z-20">
                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-sm space-y-10">


                    <div className="max-w-3xl mx-auto">
                        <Accordion type="single" collapsible className="w-full space-y-4">
                            {faqs.map((faq, index) => (
                                <AccordionItem
                                    key={index}
                                    value={`item-${index}`}
                                    className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 data-[state=open]:border-brand/40 data-[state=open]:bg-white dark:data-[state=open]:bg-slate-900 transition-all shadow-sm"
                                >
                                    <AccordionTrigger className="text-left font-bold text-slate-900 dark:text-white hover:no-underline py-6">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed pb-6 pt-2">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>

                    <div className="bg-slate-900 dark:bg-slate-950 text-white rounded-[2rem] p-8 md:p-10 mt-12 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand/30 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                        <h3 className="text-2xl font-black uppercase tracking-tight mb-4 relative z-10">Still have questions?</h3>
                        <p className="text-slate-400 mb-8 max-w-lg mx-auto relative z-10">
                            Can't find the answer you're looking for? Please chat with our friendly team or reach out to us directly.
                        </p>
                        <a href="mailto:info@giaadvisory.com" className="inline-block relative z-10">
                            <button className="bg-brand hover:bg-brand/90 text-white rounded-xl h-14 px-8 font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">
                                Get in touch
                            </button>
                        </a>
                    </div>

                </div>
            </div>
        </div>
    );
}
