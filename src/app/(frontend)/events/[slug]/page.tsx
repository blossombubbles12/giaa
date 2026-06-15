import { db } from '@/db';
import { events, bookings } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/frontend/layout/PageHeader';
import { Calendar, MapPin, Clock, Users, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { EventBookingBox } from '@/components/frontend/events/EventBookingBox';

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const session = await getServerSession(authOptions);
    
    const event = await db.query.events.findFirst({
        where: eq(events.slug, slug),
        with: {
            bookings: true
        }
    });

    if (!event) {
        notFound();
    }

    const isBooked = session?.user?.id ? event.bookings.some(b => b.userId === session.user.id) : false;
    const isPast = new Date(event.startDate) < new Date();
    const remainingSeats = event.capacity - event.bookings.length;

    return (
        <div className="bg-transparent pb-32">
            <PageHeader 
                title={event.title}
                description="Join this professional session to expand your knowledge and network with industry leaders."
                breadcrumbs={[
                    { name: 'Events', href: '/events' },
                    { name: event.title }
                ]}
            />

            <section className="container mx-auto px-4 md:px-6 py-12 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        <div className="bg-white dark:bg-slate-950 rounded-[3.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">
                            {event.thumbnail ? (
                                <img 
                                    src={event.thumbnail} 
                                    alt={event.title}
                                    className="w-full h-[400px] object-cover"
                                />
                            ) : (
                                <div className="w-full h-[400px] bg-slate-100 dark:bg-slate-900 flex items-center justify-center opacity-10">
                                    <Calendar size={120} />
                                </div>
                            )}
                            
                            <div className="p-10 md:p-16 space-y-8">
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">About This Event</h2>
                                    <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                                        {event.description || "No detailed description provided for this event."}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-start gap-5">
                                        <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center shrink-0">
                                            <Calendar className="text-brand" size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Date</p>
                                            <p className="text-slate-900 dark:text-white font-bold">
                                                {new Date(event.startDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-5">
                                        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center shrink-0">
                                            <Clock className="text-blue-500" size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Time</p>
                                            <p className="text-slate-900 dark:text-white font-bold">
                                                {new Date(event.startDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} - {new Date(event.endDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-5">
                                        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center shrink-0">
                                            <MapPin className="text-emerald-500" size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Location</p>
                                            <p className="text-slate-900 dark:text-white font-bold">{event.location || 'Virtual Session'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-5">
                                        <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center shrink-0">
                                            <Users className="text-amber-500" size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Attendance</p>
                                            <p className="text-slate-900 dark:text-white font-bold">{event.capacity} Total Capacity</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link href="/events" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-brand transition-colors">
                            <ArrowLeft size={16} /> Back to All Events
                        </Link>
                    </div>

                    {/* Sidebar: Booking */}
                    <div className="space-y-8">
                        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-2xl sticky top-32">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Event Registration</h3>
                                    <p className="text-xs font-medium text-slate-500">Secure your spot for this session.</p>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 space-y-4">
                                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                                        <span className="text-slate-400">Availability</span>
                                        <span className={remainingSeats > 0 ? 'text-emerald-500' : 'text-red-500'}>
                                            {remainingSeats > 0 ? `${remainingSeats} Seats Left` : 'Sold Out'}
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                        <div 
                                            className="bg-brand h-full transition-all duration-1000" 
                                            style={{ width: `${Math.min(100, (event.bookings.length / event.capacity) * 100)}%` }}
                                        />
                                    </div>
                                </div>

                                {isPast ? (
                                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 flex items-center gap-4">
                                        <AlertCircle className="text-amber-500 shrink-0" size={20} />
                                        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-tight">This event has already concluded.</p>
                                    </div>
                                ) : isBooked ? (
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 flex items-center gap-4">
                                        <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-tight">You are Registered</p>
                                            <p className="text-[9px] text-emerald-600/70 font-medium leading-tight">Your seat is secured. Check your dashboard for details.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <EventBookingBox 
                                            eventId={event.id} 
                                            eventSlug={event.slug} 
                                            remainingSeats={remainingSeats} 
                                            isAuthenticated={!!session} 
                                        />
                                        <p className="text-[9px] text-slate-400 text-center font-medium">By registering, you agree to our professional code of conduct.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-4 shadow-xl border border-white/5">
                            <h4 className="text-sm font-black uppercase tracking-widest">Need In-house Training?</h4>
                            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">We can deliver this session specifically for your organization at your preferred venue.</p>
                            <Link href="/contact" className="block">
                                <Button variant="outline" className="w-full border-white/10 hover:bg-white hover:text-slate-950 rounded-xl h-10 font-black uppercase tracking-widest text-[9px] transition-all">
                                    Request Corporate Quote
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
