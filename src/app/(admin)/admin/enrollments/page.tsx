'use client';

import { useState, useEffect } from 'react';
import {
    BookMarked,
    Search,
    Loader2,
    CheckCircle2,
    User,
    BookOpen,
    Trash2,
    Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

type Enrollment = {
    id: string;
    status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
    createdAt: string;
    user: {
        name: string | null;
        email: string;
    };
    course: {
        title: string;
    };
};

export default function AdminEnrollmentsPage() {
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchEnrollments = async () => {
        try {
            const res = await fetch('/api/admin/enrollments');
            if (res.ok) {
                const data = await res.json();
                setEnrollments(data);
            }
        } catch (err) {
            toast.error('Failed to load enrollments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const filteredEnrollments = enrollments.filter(e =>
        e.user.email.toLowerCase().includes(search.toLowerCase()) ||
        e.user.name?.toLowerCase().includes(search.toLowerCase()) ||
        e.course.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Active Enrollments</h1>
                    <p className="text-slate-400 text-sm mt-1">Monitor student registrations and learning progress.</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2 flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Total Students</span>
                        <span className="text-lg font-black text-white">{enrollments.length}</span>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-slate-800 bg-slate-800/10">
                    <div className="relative max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <Input
                            placeholder="Search by student name, email, or course..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-12 bg-slate-950 border-slate-800 text-sm h-12 rounded-2xl focus:ring-blue-600 focus:border-blue-600 shadow-inner"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-32 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">Retriving registrations...</p>
                    </div>
                ) : filteredEnrollments.length === 0 ? (
                    <div className="p-32 text-center space-y-4">
                        <div className="w-20 h-20 bg-slate-800/50 rounded-3xl flex items-center justify-center mx-auto border border-slate-700 shadow-inner">
                            <BookMarked className="text-slate-600" size={32} />
                        </div>
                        <h3 className="text-white font-bold text-lg uppercase tracking-tight">No enrollments found</h3>
                        <p className="text-slate-500 text-sm italic max-w-xs mx-auto opacity-70">
                            When students successfully register or pay for a course, their enrollment will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-800/20">
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Student Details</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Course Name</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Enrollment Date</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredEnrollments.map((enrollment) => (
                                    <tr key={enrollment.id} className="hover:bg-slate-800/30 transition-all group">
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 shrink-0 border border-slate-700 shadow-sm group-hover:bg-blue-600/10 group-hover:text-blue-500 transition-colors">
                                                    <User size={18} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-white font-bold text-sm tracking-tight truncate">
                                                        {enrollment.user.name || 'Anonymous Student'}
                                                    </p>
                                                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider truncate">
                                                        {enrollment.user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-2">
                                                <BookOpen size={14} className="text-blue-500" />
                                                <p className="text-white font-bold text-sm leading-tight uppercase tracking-tight italic">
                                                    {enrollment.course.title}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 font-medium text-slate-500 text-[10px] uppercase flex items-center gap-2 mt-4">
                                            <Calendar size={12} className="opacity-50" />
                                            {new Date(enrollment.createdAt).toLocaleDateString(undefined, {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600/10 text-blue-400 border border-blue-600/20 text-[10px] font-black uppercase tracking-widest">
                                                <CheckCircle2 size={12} />
                                                {enrollment.status}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="w-10 h-10 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
