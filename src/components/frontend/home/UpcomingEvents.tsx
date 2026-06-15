import Link from 'next/link';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function UpcomingEvents({ events }: { events: any[] }) {
    if (!events || events.length === 0) return null;

    return (
        <section className="py-24 bg-transparent relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="max-w-2xl space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand/10 border border-brand/20 text-brand text-[10px] font-black uppercase tracking-widest">
                            <Calendar className="w-3 h-3" />
                            <span>Professional Forum</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">
                            Upcoming <span className="text-brand">Sessions</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base max-w-lg leading-relaxed">
                            Join our industry experts for live masterclasses, webinars, and exclusive networking events.
                        </p>
                    </div>

                    <Link href="/events">
                        <Button variant="outline" className="h-12 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white uppercase font-black tracking-widest text-[10px] hover:bg-brand hover:text-white hover:border-brand rounded-xl px-8 transition-all group">
                            Explore All Events <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {events.map((event) => {
                        const date = new Date(event.startDate);

                        return (
                            <Link 
                                href={`/events/${event.slug}`}
                                key={event.id} 
                                className="group flex flex-col bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:border-brand/30 transition-all duration-500"
                            >
                                <div className="h-48 overflow-hidden relative bg-slate-100 dark:bg-slate-900">
                                    {event.thumbnail ? (
                                        <img
                                            src={event.thumbnail}
                                            alt={event.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center opacity-10">
                                            <Calendar size={48} />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 flex flex-col items-center justify-center min-w-[50px] shadow-lg">
                                        <span className="text-brand font-black text-lg leading-none">{date.getDate()}</span>
                                        <span className="text-slate-900 dark:text-white text-[9px] uppercase font-black tracking-widest">{date.toLocaleDateString('en-GB', { month: 'short' })}</span>
                                    </div>
                                    <div className="absolute bottom-4 right-4 z-20">
                                        <div className="bg-slate-900/80 backdrop-blur-md text-white text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg">
                                            {event.location || 'Virtual'}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col flex-1">
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-3 line-clamp-2 uppercase tracking-tight group-hover:text-brand transition-colors">
                                        {event.title}
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 leading-relaxed font-medium mb-6">
                                        {event.description}
                                    </p>
                                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-brand tracking-widest">
                                            <Users size={12} />
                                            {event.capacity} Slots
                                        </div>
                                        <div className="text-[9px] font-black uppercase text-slate-400 tracking-widest group-hover:text-brand transition-colors">
                                            Register Now
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
