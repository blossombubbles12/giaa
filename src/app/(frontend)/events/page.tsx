import { db } from '@/db';
import { events } from '@/db/schema';
import { gte, desc } from 'drizzle-orm';
import { Calendar, MapPin, Clock, ArrowRight, Share2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import { PageHeader } from '@/components/frontend/layout/PageHeader';

export default async function EventsPage() {
    const upcomingEvents = await db.query.events.findMany({
        orderBy: [desc(events.startDate)],
        limit: 12
    });

    return (
        <div className="bg-transparent pb-32 transition-colors duration-500">

            <PageHeader 
                title="The Forum: Professional Events"
                description="Stay updated with our latest workshops, webinars, and graduation ceremonies. Join the community of elite professionals."
                breadcrumbs={[{ name: 'Events' }]}
            />

            {/* Events Grid */}
            <section className="container py-12 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {upcomingEvents.length > 0 ? upcomingEvents.map((event, i) => (
                        <div key={event.id} className="group bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden hover:border-brand transition-all duration-500 shadow-sm flex flex-col h-full">

                            {/* Card Image */}
                            <div className="relative h-56 overflow-hidden bg-slate-100 dark:bg-slate-900">
                                {event.thumbnail ? (
                                    <img 
                                        src={event.thumbnail} 
                                        alt={event.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center opacity-10">
                                        <Calendar size={64} />
                                    </div>
                                )}
                                
                                <div className="absolute top-5 left-5">
                                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-950 dark:text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                                        {new Date(event.startDate) > new Date() ? 'Upcoming' : 'Past Event'}
                                    </div>
                                </div>

                                {event.capacity > 0 && (
                                    <div className="absolute bottom-5 right-5">
                                        <div className="bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-xl">
                                            Capacity: {event.capacity}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Card Content */}
                            <div className="p-8 space-y-6 flex-1 flex flex-col">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand">
                                        <Calendar size={12} />
                                        {new Date(event.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight uppercase group-hover:text-brand transition-colors tracking-tight">
                                        {event.title}
                                    </h3>
                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 opacity-80">
                                        {event.description}
                                    </p>
                                </div>

                                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3 mt-auto">
                                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                        <MapPin size={14} className="text-brand" />
                                        <span className="truncate">{event.location || 'Virtual Session'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                        <Clock size={14} className="text-blue-500" />
                                        <span>{new Date(event.startDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Link href={`/events/${event.slug}`}>
                                        <Button className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-brand dark:hover:bg-brand hover:text-white rounded-xl h-12 font-black uppercase tracking-widest text-[10px] shadow-sm active:scale-95 transition-all">
                                            View Event <ArrowRight className="ml-2 h-3.5 w-3.5" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full py-40 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[4rem] text-center space-y-6">
                            <Tag size={64} className="mx-auto text-slate-200" />
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-slate-400 uppercase tracking-tighter">No Current Events</h3>
                                <p className="text-xs font-medium text-slate-400">Our team is currently preparing new professional sessions for you.</p>
                            </div>
                        </div>
                    )}
                </div>
            </section>

        </div>
    );
}
