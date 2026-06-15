import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/db';
import { bookings, events } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';
import {
    Calendar,
    MapPin,
    ArrowRight,
    Users,
    Clock,
    Search,
    Filter,
    ShieldCheck,
    Globe,
    FileCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

export default async function MyBookingsPage() {
    const session = await getServerSession(authOptions);
    const userId = session!.user.id;

    const myBookings = await db.query.bookings.findMany({
        where: eq(bookings.userId, userId),
        with: {
            event: true
        },
        orderBy: [desc(bookings.createdAt)]
    });

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">Event Ledger</h1>
                    <p className="text-slate-500 font-bold italic opacity-80 text-sm">Persistent tracking for all institutional events and professional sessions.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={16} />
                        <Input
                            placeholder="Find an event..."
                            className="pl-10 bg-slate-900 border-slate-800 text-sm h-11 rounded-2xl w-full md:w-64 focus:ring-blue-600 focus:border-blue-600 italic shadow-inner"
                        />
                    </div>
                </div>
            </div>

            {/* Bookings List */}
            {myBookings.length === 0 ? (
                <div className="bg-slate-900/40 border-2 border-dashed border-slate-800 rounded-[3rem] p-24 text-center">
                    <div className="w-20 h-20 bg-slate-800/50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <Calendar className="text-slate-600 w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight italic">No Active Reservations</h3>
                    <p className="text-slate-500 mt-3 max-w-sm mx-auto italic font-medium">Your event itinerary is currently clear. Attend upcoming workshops or seminars to stay ahead.</p>
                    <Link href="/events" className="mt-10 inline-block">
                        <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl px-10 h-14 font-black uppercase tracking-widest shadow-2xl shadow-blue-600/30 active:scale-95 transition-all">
                            Browse Events
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {myBookings.map((booking) => {
                        const event = booking.event;
                        const isPast = new Date(event.endDate) < new Date();

                        return (
                            <div key={booking.id} className="group relative bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col gap-6 shadow-sm hover:border-slate-700 transition-all duration-500">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${isPast ? 'bg-slate-800 text-slate-500' : 'bg-blue-600/20 text-blue-500 shadow-blue-500/10'}`}>
                                                <Calendar size={24} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Confirmed Reservation</p>
                                                <p className="text-xl font-extrabold text-white uppercase italic tracking-tight">{event.title}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-5">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 border border-slate-800 bg-slate-900/50 px-3 py-1.5 rounded-xl uppercase tracking-widest">
                                                <Clock size={14} className="text-blue-500" />
                                                {format(new Date(event.startDate), 'MMMM d · h:mm a')}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 border border-slate-800 bg-slate-900/50 px-3 py-1.5 rounded-xl uppercase tracking-widest">
                                                <MapPin size={14} className="text-amber-500" />
                                                {event.location || 'Remote Access'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`text-[9px] font-black px-4 py-2 rounded-2xl uppercase tracking-[0.2em] border ${isPast ? 'bg-slate-800 text-slate-600 border-slate-700' : 'bg-blue-600/10 text-blue-500 border-blue-600/10 shadow-[0_0_12px_rgba(59,130,246,0.1)]'}`}>
                                        {isPast ? 'Archived' : 'Active'}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-slate-500 text-xs italic leading-relaxed font-medium line-clamp-3 opacity-80">
                                        {event.description || 'Professional session organized by GIA Advisory for verified students.'}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center text-slate-600 bg-slate-900 shadow-inner">
                                            <FileCheck size={14} />
                                        </div>
                                        <p className="text-[9px] font-black uppercase text-slate-600 tracking-widest">Secured Entry Code: #{booking.id.slice(0, 8).toUpperCase()}</p>
                                    </div>

                                    {!isPast && (
                                        <Button className="bg-white text-slate-950 hover:bg-slate-100 rounded-xl px-6 h-10 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-white/5 active:scale-95 transition-all">
                                            Event Area <ArrowRight size={14} className="ml-1" />
                                        </Button>
                                    )}
                                </div>

                                <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem] pointer-events-none" />
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="bg-blue-600/5 border border-blue-600/10 rounded-[2.5rem] p-8 mt-12 flex items-start gap-5 shadow-inner">
                <div className="w-12 h-12 bg-blue-600/20 border border-blue-600/30 rounded-2xl flex items-center justify-center shrink-0">
                    <ShieldCheck className="text-blue-500" size={24} />
                </div>
                <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-tight italic mb-1">Reservation Policy</h4>
                    <p className="text-slate-500 text-[10px] leading-relaxed font-bold italic opacity-80 max-w-2xl">
                        Your bookings are institutionally non-transferable. For cancellation or rescheduling, please contact your academic curator at least 24 hours prior to the session start time.
                    </p>
                </div>
            </div>
        </div>
    );
}
