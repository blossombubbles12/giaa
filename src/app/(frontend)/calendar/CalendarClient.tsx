'use client';

import { useState } from 'react';
import { MapPin, Clock, ChevronRight, Search, X, Calendar as CalendarIcon, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { toast } from 'sonner';

export default function CalendarClient({ initialSchedules }: { initialSchedules: any[] }) {
    const [search, setSearch] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('all');
    const [selectedMonth, setSelectedMonth] = useState('all');
    const [generating, setGenerating] = useState(false);

    const downloadCalendar = async () => {
        setGenerating(true);
        try {
            const { buildCalendarPDF } = await import('@/lib/pdf-utils');
            const pdf = await buildCalendarPDF(filteredSchedules);
            pdf.save('training-calendar-2026.pdf');
            toast.success('Calendar downloaded');
        } catch (e) {
            console.error(e);
            toast.error('Download failed');
        } finally {
            setGenerating(false);
        }
    };

    const locations = Array.from(new Set(initialSchedules.map(s => s.location || 'Online')));
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const filteredSchedules = initialSchedules.filter(s => {
        const matchesSearch = s.course.title.toLowerCase().includes(search.toLowerCase());
        const matchesLocation = selectedLocation === 'all' || (s.location || 'Online') === selectedLocation;
        const matchesMonth = selectedMonth === 'all' || new Date(s.startDate).toLocaleString('en-GB', { month: 'long' }) === selectedMonth;
        return matchesSearch && matchesLocation && matchesMonth;
    });

    return (
        <div className="space-y-12">
            {/* Download Button */}
            <div className="flex justify-center pb-8 border-b border-slate-100 dark:border-slate-800">
                <Button 
                    onClick={downloadCalendar}
                    disabled={generating}
                    className="bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-brand dark:hover:bg-brand hover:text-white rounded-[2rem] h-16 px-12 font-black uppercase tracking-widest text-xs shadow-2xl active:scale-95 transition-all gap-3"
                >
                    {generating ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
                    {generating ? 'Generating PDF...' : 'Download Course Schedule (PDF)'}
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center gap-4 shadow-sm">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input 
                        placeholder="Search courses..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-12 h-14 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-brand"
                    />
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <select 
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="h-14 px-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand/20 appearance-none min-w-[140px]"
                    >
                        <option value="all">All Locations</option>
                        {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                    </select>

                    <select 
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="h-14 px-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand/20 appearance-none min-w-[140px]"
                    >
                        <option value="all">All Months</option>
                        {months.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>

                    {(search || selectedLocation !== 'all' || selectedMonth !== 'all') && (
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => { setSearch(''); setSelectedLocation('all'); setSelectedMonth('all'); }}
                            className="h-14 w-14 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-rose-500 hover:text-rose-600"
                        >
                            <X size={20} />
                        </Button>
                    )}
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                {filteredSchedules.length > 0 ? filteredSchedules.map((s) => (
                    <div key={s.id} className="group p-6 md:p-8 bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:border-brand hover:shadow-2xl hover:shadow-brand/5 transition-all duration-500 flex flex-col lg:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6 md:gap-8 w-full lg:w-auto">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 dark:bg-slate-900 rounded-3xl flex flex-col items-center justify-center border border-slate-100 dark:border-slate-800 shadow-sm shrink-0 group-hover:bg-brand transition-colors">
                                <span className="text-[9px] md:text-[10px] font-black uppercase text-brand group-hover:text-white tracking-widest">{new Date(s.startDate).toLocaleDateString('en-GB', { month: 'short' })}</span>
                                <span className="text-xl md:text-2xl font-black text-slate-900 dark:text-white group-hover:text-white leading-none">{new Date(s.startDate).getDate()}</span>
                            </div>
                            <div className="space-y-2">
                                <Link href={`/courses/${s.course.slug}`} className="text-lg md:text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight hover:text-brand transition-colors leading-tight">
                                    {s.course.title}
                                </Link>
                                <div className="flex flex-wrap gap-x-6 gap-y-2">
                                    <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <MapPin size={12} className="text-brand" /> {s.location || 'Online'}
                                    </div>
                                    <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <Clock size={12} className="text-blue-500" /> {s.course.duration || 'Flexible'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 w-full lg:w-auto">
                            <Link href={`/checkout/${s.course.slug}`} className="flex-1 lg:flex-none">
                                <Button className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-brand dark:hover:bg-brand hover:text-white rounded-xl h-12 md:h-14 px-8 font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">
                                    Enroll Now
                                </Button>
                            </Link>
                            <Link href={`/courses/${s.course.slug}`}>
                                <Button variant="outline" className="rounded-xl h-12 w-12 md:h-14 md:w-14 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all p-0">
                                    <ChevronRight size={20} />
                                </Button>
                            </Link>
                        </div>
                    </div>
                )) : (
                    <div className="p-20 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[4rem] text-center space-y-6 bg-slate-50/50 dark:bg-slate-900/10">
                        <CalendarIcon size={64} className="mx-auto text-slate-200" />
                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-slate-400 uppercase tracking-tighter">No sessions found</h3>
                            <p className="text-xs text-slate-400 font-medium">Try adjusting your filters or search terms.</p>
                        </div>
                        <Button 
                            variant="link" 
                            onClick={() => { setSearch(''); setSelectedLocation('all'); setSelectedMonth('all'); }}
                            className="text-brand font-black uppercase text-[10px] tracking-widest"
                        >
                            Reset Filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
