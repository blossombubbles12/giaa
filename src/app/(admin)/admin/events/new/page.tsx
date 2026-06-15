'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, CalendarDays, MapPin, Users, Clock, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function NewEventPage() {
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [capacity, setCapacity] = useState<number>(50);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSaveEvent = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !startDate || !endDate) {
            toast.error('Please fill in required fields (Title, Start Date, End Date)');
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('location', location);
            formData.append('capacity', capacity.toString());
            formData.append('startDate', startDate);
            formData.append('endDate', endDate);

            if (thumbnail) {
                formData.append('thumbnail', thumbnail);
            }

            const res = await fetch('/api/admin/events', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                toast.success('Event scheduled successfully');
                router.push('/admin/events');
            } else {
                toast.error('Failed to create event');
            }
        } catch (err) {
            toast.error('An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-6">
                <Link href="/admin/events">
                    <Button variant="outline" size="sm" className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl gap-2 h-9 px-4">
                        <ArrowLeft size={14} /> Back to Events
                    </Button>
                </Link>

                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight italic">Schedule New Event</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Fill out the form below to publish a new webinar, masterclass, or offline event.</p>
                </div>
            </div>

            <form onSubmit={handleSaveEvent} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 md:p-10 space-y-8 shadow-sm">

                <div className="space-y-6">
                    <div className="space-y-2 relative">
                        <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Event Title *</Label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. 2024 Tech Summit Seminar"
                            className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 h-14 rounded-2xl focus:ring-blue-600 outline-none text-lg px-6"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 relative">
                        <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2"><CalendarDays size={12} className="text-blue-500" /> Start Date & Time *</Label>
                        <Input
                            type="datetime-local"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full bg-slate-50 border-slate-200 dark:bg-slate-950 dark:border-slate-800 h-14 rounded-2xl px-6 focus:ring-blue-600 outline-none"
                            required
                        />
                    </div>
                    <div className="space-y-2 relative">
                        <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2"><Clock size={12} className="text-orange-500" /> End Date & Time *</Label>
                        <Input
                            type="datetime-local"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full bg-slate-50 border-slate-200 dark:bg-slate-950 dark:border-slate-800 h-14 rounded-2xl px-6 focus:ring-blue-600 outline-none"
                            required
                        />
                    </div>
                    <div className="space-y-2 relative">
                        <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2"><MapPin size={12} className="text-emerald-500" /> Location / Link</Label>
                        <Input
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="e.g. Zoom or physical address"
                            className="w-full bg-slate-50 border-slate-200 dark:bg-slate-950 dark:border-slate-800 h-14 rounded-2xl px-6 focus:ring-blue-600 outline-none"
                        />
                    </div>
                    <div className="space-y-2 relative">
                        <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2"><Users size={12} className="text-purple-500" /> Capacity Limit</Label>
                        <Input
                            type="number"
                            min="1"
                            value={capacity}
                            onChange={(e) => setCapacity(parseInt(e.target.value))}
                            className="w-full bg-slate-50 border-slate-200 dark:bg-slate-950 dark:border-slate-800 h-14 rounded-2xl px-6 focus:ring-blue-600 outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Description</Label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Brief overview and details..."
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 h-32 text-sm focus:ring-2 focus:ring-blue-600 outline-none resize-none placeholder:text-slate-400 dark:placeholder:text-slate-700"
                    />
                </div>

                <div className="space-y-2 pt-6 border-t border-slate-100 dark:border-slate-800 relative group overflow-hidden bg-slate-50 dark:bg-slate-950 border-2 border-dashed rounded-3xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                    <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest block mb-4">
                        Event Thumbnail / Graphic
                    </Label>
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-500 flex items-center justify-center pointer-events-none group-hover:-translate-y-2 transition-transform duration-500">
                            <ImageIcon className="w-8 h-8" />
                        </div>
                    </div>
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files) {
                                setThumbnail(e.target.files[0]);
                            }
                        }}
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                    />
                    <div className="pointer-events-none group-hover:-translate-y-2 transition-transform duration-500">
                        {thumbnail ? (
                            <div className="bg-slate-200 dark:bg-slate-900 inline-block px-4 py-2 rounded-xl text-slate-700 dark:text-slate-300 font-bold mb-2 break-all max-w-[90%]">
                                Selected: {thumbnail.name}
                            </div>
                        ) : (
                            <h4 className="text-slate-900 dark:text-white font-bold text-lg">Click to Browse Thumbnail Image</h4>
                        )}
                        <p className="text-slate-500 dark:text-slate-500 text-sm mt-1">Must be an image format (PNG, JPG, WEBP).</p>
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white h-16 rounded-2xl font-black uppercase tracking-widest mt-8 text-sm shadow-xl shadow-blue-600/20 active:scale-[0.98] transition-transform"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="animate-spin mr-2" /> Saving Event details...
                        </>
                    ) : (
                        'Schedule New Event'
                    )}
                </Button>
            </form>
        </div>
    );
}
