'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function MonthView({ schedules }: { schedules: any[] }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);

    const days = [];
    for (let i = 0; i < startDay; i++) {
        days.push(null);
    }
    for (let i = 1; i <= totalDays; i++) {
        days.push(new Date(year, month, i));
    }

    const getSchedulesForDay = (date: Date) => {
        return schedules.filter(s => {
            const sDate = new Date(s.startDate);
            return sDate.getDate() === date.getDate() &&
                   sDate.getMonth() === date.getMonth() &&
                   sDate.getFullYear() === date.getFullYear();
        });
    };

    return (
        <div className="bg-white dark:bg-slate-950 rounded-[3.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            {/* Calendar Header */}
            <div className="p-8 md:p-12 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                        {currentDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                    </h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand">Monthly Training Schedule</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={prevMonth} className="h-12 w-12 rounded-2xl border-slate-200 dark:border-slate-800">
                        <ChevronLeft size={20} />
                    </Button>
                    <Button variant="outline" onClick={nextMonth} className="h-12 w-12 rounded-2xl border-slate-200 dark:border-slate-800">
                        <ChevronRight size={20} />
                    </Button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-r border-slate-100 dark:border-slate-800 last:border-r-0">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 auto-rows-[140px] md:auto-rows-[180px]">
                {days.map((date, i) => {
                    const daySchedules = date ? getSchedulesForDay(date) : [];
                    const isToday = date && date.toDateString() === new Date().toDateString();

                    return (
                        <div 
                            key={i} 
                            className={cn(
                                "p-3 md:p-5 border-r border-b border-slate-100 dark:border-slate-800 last:border-r-0 relative transition-colors group",
                                !date ? "bg-slate-50/30 dark:bg-slate-900/10" : "hover:bg-slate-50 dark:hover:bg-slate-900/50"
                            )}
                        >
                            {date && (
                                <>
                                    <span className={cn(
                                        "text-sm font-black transition-colors",
                                        isToday ? "text-brand" : "text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"
                                    )}>
                                        {date.getDate()}
                                    </span>
                                    
                                    <div className="mt-2 space-y-1.5 overflow-y-auto max-h-[100px] md:max-h-[130px] custom-scrollbar">
                                        {daySchedules.map((s) => (
                                            <Link 
                                                href={`/courses/${s.course.slug}`} 
                                                key={s.id}
                                                className="block p-2 bg-blue-600/10 dark:bg-blue-600/20 border-l-2 border-brand rounded-lg hover:bg-brand hover:text-white transition-all group/item"
                                            >
                                                <p className="text-[9px] font-black uppercase leading-tight line-clamp-2">{s.course.title}</p>
                                                <div className="flex items-center gap-1 mt-1 opacity-60 text-[7px] font-bold">
                                                    <Clock size={8} />
                                                    {new Date(s.startDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
