'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Plus,
    Calendar,
    MapPin,
    Trash2,
    Edit,
    Search,
    ChevronLeft,
    ChevronRight,
    Loader2,
    X,
    Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

export default function ScheduleManagementClient({
    initialSchedules,
    courses
}: {
    initialSchedules: any,
    courses: any[]
}) {
    const [schedules, setSchedules] = useState<any[]>(initialSchedules.data);
    const [pagination, setPagination] = useState(initialSchedules.pagination);
    const [loading, setLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [editingSchedule, setEditingSchedule] = useState<any>(null);

    // Form State
    const [formData, setFormData] = useState({
        courseId: '',
        startDate: '',
        endDate: '',
        location: '',
        capacity: ''
    });

    const fetchSchedules = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/courses/schedules?page=${page}&limit=${pagination.limit}`);
            if (res.ok) {
                const result = await res.json();
                setSchedules(result.data);
                setPagination(result.pagination);
            }
        } catch (err) {
            toast.error('Failed to load schedules');
        } finally {
            setLoading(false);
        }
    }, [pagination.limit]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = editingSchedule 
                ? `/api/admin/courses/schedules/${editingSchedule.id}`
                : '/api/admin/courses/schedules';
            
            const res = await fetch(url, {
                method: editingSchedule ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success(editingSchedule ? 'Schedule updated' : 'Schedule created');
                setIsDialogOpen(false);
                fetchSchedules(pagination.page);
            } else {
                toast.error('Failed to save schedule');
            }
        } catch (err) {
            toast.error('Error saving schedule');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        setIsDeleting(id);
        try {
            const res = await fetch(`/api/admin/courses/schedules/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Schedule deleted');
                fetchSchedules(pagination.page);
            }
        } catch (err) {
            toast.error('Failed to delete schedule');
        } finally {
            setIsDeleting(null);
        }
    };

    const openCreateDialog = () => {
        setEditingSchedule(null);
        setFormData({
            courseId: '',
            startDate: '',
            endDate: '',
            location: '',
            capacity: ''
        });
        setIsDialogOpen(true);
    };

    const openEditDialog = (schedule: any) => {
        setEditingSchedule(schedule);
        setFormData({
            courseId: schedule.courseId,
            startDate: new Date(schedule.startDate).toISOString().slice(0, 16),
            endDate: new Date(schedule.endDate).toISOString().slice(0, 16),
            location: schedule.location || '',
            capacity: schedule.capacity?.toString() || ''
        });
        setIsDialogOpen(true);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="space-y-1">
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Course Schedules</h1>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">Manage training calendar & sessions</p>
                </div>
                <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2 font-bold px-6">
                    <Plus size={18} /> Add New Session
                </Button>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Course</th>
                                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Date & Time</th>
                                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Location</th>
                                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Capacity</th>
                                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center">
                                        <Loader2 className="animate-spin mx-auto text-blue-600" size={32} />
                                    </td>
                                </tr>
                            ) : schedules.length > 0 ? schedules.map((s) => (
                                <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600 shrink-0">
                                                <Calendar size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{s.course.title}</span>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                                {new Date(s.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                            <p className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                                                <Clock size={10} />
                                                {new Date(s.startDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                                            <MapPin size={14} className="text-emerald-500" />
                                            {s.location || 'Online'}
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                            {s.capacity || 'Unlimited'}
                                        </span>
                                    </td>
                                    <td className="p-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => openEditDialog(s)}
                                                className="h-9 w-9 rounded-xl hover:bg-blue-50 hover:text-blue-600"
                                            >
                                                <Edit size={16} />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => handleDelete(s.id)}
                                                disabled={isDeleting === s.id}
                                                className="h-9 w-9 rounded-xl hover:bg-rose-50 hover:text-rose-600"
                                            >
                                                {isDeleting === s.id ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center space-y-4">
                                        <Calendar size={48} className="mx-auto text-slate-200" />
                                        <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">No schedules found</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {pagination.totalPages > 1 && (
                    <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <p className="text-xs font-medium text-slate-400">
                            Showing page {pagination.page} of {pagination.totalPages}
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => fetchSchedules(pagination.page - 1)}
                                disabled={pagination.page <= 1 || loading}
                                className="h-9 w-9 rounded-xl"
                            >
                                <ChevronLeft size={16} />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => fetchSchedules(pagination.page + 1)}
                                disabled={pagination.page >= pagination.totalPages || loading}
                                className="h-9 w-9 rounded-xl"
                            >
                                <ChevronRight size={16} />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-slate-800">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase tracking-tight">
                            {editingSchedule ? 'Edit Session' : 'Add New Session'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select Course</label>
                            <select 
                                value={formData.courseId} 
                                onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                                required
                                className="w-full h-12 rounded-xl border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                            >
                                <option value="" disabled>Select a course...</option>
                                {courses.map((c) => (
                                    <option key={c.id} value={c.id}>{c.title}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Start Date</label>
                                <Input 
                                    type="datetime-local"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                    className="h-12 rounded-xl border-slate-200"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">End Date</label>
                                <Input 
                                    type="datetime-local"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                    className="h-12 rounded-xl border-slate-200"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location / Venue</label>
                            <Input 
                                placeholder="e.g. Lagos Hub or Virtual"
                                value={formData.location}
                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                                className="h-12 rounded-xl border-slate-200"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Capacity</label>
                            <Input 
                                type="number"
                                placeholder="Number of spots"
                                value={formData.capacity}
                                onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                                className="h-12 rounded-xl border-slate-200"
                            />
                        </div>

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl h-12">Cancel</Button>
                            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 px-8 font-bold">
                                {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                                {editingSchedule ? 'Update Session' : 'Create Session'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
