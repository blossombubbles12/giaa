'use client';

import { useState } from 'react';
import { Building2, Wifi, Coffee, MonitorPlay, Users, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { InquiryModal } from '@/components/frontend/spaces/InquiryModal';

import { PageHeader } from '@/components/frontend/layout/PageHeader';

export default function SpacesPage() {
    const [selectedSpace, setSelectedSpace] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleInquiry = (space: any) => {
        setSelectedSpace(space);
        setIsModalOpen(true);
    };

    const spaces = [
        {
            id: 'boardroom',
            title: 'Executive Boardrooms',
            desc: 'Perfect for high-level meetings, presentations, and corporate strategy sessions. Equipped with premium conferencing technology.',
            img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
            capacity: 'Up to 15 people',
            price: 100000
        },
        {
            id: 'training-room',
            title: 'Training & Seminar Rooms',
            desc: 'Spacious, acoustically treated rooms ideal for workshops, seminars, and certification courses. Features smart boards and projectors.',
            img: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&q=80&w=800',
            capacity: 'Up to 50 people',
            price: 250000
        },
        {
            id: 'private-office',
            title: 'Private Offices',
            desc: 'Quiet, fully furnished private offices perfect for focused work, one-on-one consulting, or temporary regional headquartering.',
            img: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800',
            capacity: '1 - 4 people',
            price: 50000
        }
    ];

    return (
        <div className="bg-white dark:bg-[#020617] min-h-screen transition-colors duration-500">
            <PageHeader 
                title="Premium Workspace & Training Facilities"
                description="Elevate your business presence or host your next training in our state-of-the-art corporate environments. Book a tour today."
                breadcrumbs={[{ name: 'Workspace Rent' }]}
            />

            <div className="container mx-auto px-4 md:px-10 -mt-10 relative z-20 flex justify-center">
                <Button
                    onClick={() => handleInquiry({ id: 'general', title: 'Facility Tour' })}
                    size="lg"
                    className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-brand dark:hover:bg-brand hover:text-white rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-[10px] md:text-xs shadow-xl active:scale-95 transition-all"
                >
                    Request a Facility Tour <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>

            {/* Amenities Section */}
            <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { icon: Wifi, text: 'High-Speed Internet' },
                            { icon: Coffee, text: 'Complimentary Coffee' },
                            { icon: MonitorPlay, text: 'A/V Equipment' },
                            { icon: Users, text: 'Dedicated Staff' },
                        ].map((amenity, i) => (
                            <div key={i} className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm text-center">
                                <amenity.icon size={36} className="text-brand mb-4 opacity-80" />
                                <span className="font-bold text-slate-900 dark:text-white">{amenity.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Spaces List */}
            <section className="py-24">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="space-y-16">
                        {spaces.map((space, i) => (
                            <div key={i} className={`flex flex-col ${i % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 bg-white dark:bg-slate-950 p-6 md:p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl group`}>
                                <div className="w-full lg:w-1/2 overflow-hidden rounded-[2.5rem]">
                                    <img src={space.img} alt={space.title} className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700" />
                                </div>
                                <div className="w-full lg:w-1/2 space-y-6 px-4">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-black uppercase tracking-widest">
                                        <Users size={14} className="text-brand" /> {space.capacity}
                                    </div>
                                    <h3 className="text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white leading-[1.1]">{space.title}</h3>
                                    <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{space.desc}</p>
                                    <div className="flex items-end gap-2 my-2">
                                        <span className="text-3xl font-black text-brand">₦{space.price.toLocaleString()}</span>
                                        <span className="text-slate-400 font-bold mb-1">/ day</span>
                                    </div>
                                    <ul className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                        {['Flexible booking (Hourly, Daily, Monthly)', 'Secure access & ample parking', 'On-site technical support'].map((feature, j) => (
                                            <li key={j} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium">
                                                <CheckCircle2 size={18} className="text-emerald-500" /> {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="pt-6">
                                        <Button
                                            onClick={() => handleInquiry(space)}
                                            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-brand dark:hover:bg-brand hover:text-white rounded-2xl h-14 font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all outline-none"
                                        >
                                            Book Visitation <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {selectedSpace && (
                <InquiryModal
                    space={selectedSpace}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
}
