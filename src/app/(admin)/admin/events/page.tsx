'use client';

import { useState, useEffect } from 'react';
import {
    CalendarDays,
    MapPin,
    Users,
    Plus,
    Trash2,
    Edit2,
    Loader2,
    Clock,
    Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';

type Event = {
    id: string;
    title: string;
    description: string | null;
    location: string | null;
    capacity: number;
    startDate: string;
    endDate: string;
    thumbnail: string | null;
};

export default function AdminEventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchEvents = async () => {
        try {
            const res = await fetch('/api/admin/events');
            if (res.ok) {
                const data = await res.json();
                setEvents(data);
            }
        } catch (err) {
            toast.error('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleDeleteEvent = async (id: string) => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        setProcessingId(id);
        try {
            const res = await fetch(`/api/admin/events/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                toast.success('Event Deleted');
                fetchEvents();
            } else {
                toast.error('Deletion failed');
            }
        } catch (err) {
            toast.error('An error occurred');
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Events & Webinars</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage scheduled masterclasses, seminars and offline events.</p>
                </div>

                <Link href="/admin/events/new">
                    <Button className="bg-blue-600 hover:bg-blue-500 text-white h-11 px-6 rounded-xl font-medium shadow-sm shadow-blue-600/20">
                        <Plus className="mr-2 h-4 w-4" /> Schedule New Event
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="animate-spin text-blue-600" />
                </div>
            ) : events.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-sm">
                    <CalendarDays className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Events Scheduled</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">Click "Schedule New Event" to create your first session.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {events.map((event) => {
                        const start = new Date(event.startDate);
                        const end = new Date(event.endDate);

                        return (
                            <div key={event.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm hover:shadow-md transition-shadow relative group flex flex-col">
                                {event.thumbnail ? (
                                    <div className="h-40 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-4 overflow-hidden relative">
                                        <img src={event.thumbnail} alt="" className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="h-40 bg-slate-50 dark:bg-slate-950/50 rounded-2xl mb-4 flex items-center justify-center border border-slate-100 dark:border-slate-800/50">
                                        <ImageIcon className="text-slate-300 dark:text-slate-700 w-12 h-12" />
                                    </div>
                                )}

                                <div className="space-y-4 flex-1">
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white text-lg line-clamp-1">{event.title}</h3>
                                        {event.description && (
                                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 hidden md:block">{event.description}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/50 rounded-xl p-3">
                                        <div className="flex items-center gap-2">
                                            <CalendarDays size={14} className="text-blue-500 shrink-0" />
                                            <span className="truncate">{start.toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} className="text-orange-500 shrink-0" />
                                            <span>
                                                {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin size={14} className="text-emerald-500 shrink-0" />
                                            <span className="truncate">{event.location || 'Online / Remote'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users size={14} className="text-purple-500 shrink-0" />
                                            <span>{event.capacity} Spots Limit</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <Link href={`/admin/events/${event.id}`} className="flex-1">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full h-9 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                                        >
                                            <Edit2 className="w-3.5 h-3.5 mr-2" /> Edit Event
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleDeleteEvent(event.id)}
                                        disabled={processingId === event.id}
                                        className="h-9 w-9 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                                    >
                                        {processingId === event.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
