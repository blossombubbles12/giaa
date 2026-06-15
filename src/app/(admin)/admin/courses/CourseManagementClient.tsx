'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
    Plus,
    BookOpen,
    Eye,
    EyeOff,
    Edit,
    FileText,
    Calendar,
    Tag,
    Search,
    Filter,
    FilterX,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Loader2,
    MapPin,
    Clock,
    Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function CourseManagementClient({
    initialCourses,
    categories,
    tags,
    currencySymbol
}: {
    initialCourses: any,
    categories: any[],
    tags: any[],
    currencySymbol: string
}) {
    // We expect initialCourses to eventually come in the new format { data, pagination }
    // but we'll handle the first load from the server component and subsequent loads here.
    const [courses, setCourses] = useState<any[]>(initialCourses?.data || initialCourses || []);
    const [pagination, setPagination] = useState(initialCourses?.pagination || { page: 1, limit: 10, totalCount: 0, totalPages: 1 });
    const [loading, setLoading] = useState(false);

    // Filters
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedTag, setSelectedTag] = useState<string>('all');
    const [selectedType, setSelectedType] = useState<string>('all');

    // New Filters
    const [venue, setVenue] = useState('');
    const [year, setYear] = useState<string>('all');
    const [month, setMonth] = useState<string>('all');

    const fetchCourses = useCallback(async (page = 1, limit = pagination.limit) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                search,
                categoryId: selectedCategory === 'all' ? '' : selectedCategory,
                type: selectedType === 'all' ? '' : selectedType,
                venue: venue,
                year: year === 'all' ? '' : year,
                month: month === 'all' ? '' : month,
                published: selectedStatus === 'published' ? 'true' : selectedStatus === 'draft' ? 'false' : '',
            });

            // Note: In a real app, you'd add status, tags, venue, year, month to the API too.
            // For now, I'll update the API later or filter client-side if needed, 
            // but the prompt asked for server-side pagination.

            const res = await fetch(`/api/admin/courses?${params.toString()}`);
            if (res.ok) {
                const result = await res.json();
                setCourses(result.data);
                setPagination(result.pagination);
            }
        } catch (err) {
            toast.error('Failed to load courses');
        } finally {
            setLoading(false);
        }
    }, [search, selectedCategory, selectedType, selectedStatus, venue, year, month, pagination.limit]);

    // Initial fetch to sync with new API structure if initialCourses was old
    useEffect(() => {
        if (!initialCourses?.pagination) {
            fetchCourses(1);
        }
    }, []);

    // Fetch on filter change
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchCourses(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [search, selectedCategory, selectedStatus, selectedTag, selectedType, venue, year, month]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchCourses(newPage);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;

        try {
            const res = await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Course deleted successfully');
                fetchCourses(pagination.page);
            } else {
                toast.error('Failed to delete course');
            }
        } catch (err) {
            toast.error('An error occurred');
        }
    };

    const resetFilters = () => {
        setSearch('');
        setSelectedCategory('all');
        setSelectedStatus('all');
        setSelectedTag('all');
        setSelectedType('all');
        setVenue('');
        setYear('all');
        setMonth('all');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white uppercase tracking-tight italic text-blue-500">Course Management</h1>
                    <p className="text-slate-400 text-sm mt-1">Showing {courses.length} of {pagination.totalCount} courses</p>
                </div>
                <Link href="/admin/courses/new">
                    <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white rounded-xl gap-2 shadow-md shadow-blue-600/25 h-12 px-6 text-[10px] font-black uppercase tracking-widest">
                        <Plus size={16} />
                        Create Course
                    </Button>
                </Link>
            </div>

            {/* Advanced Filters */}
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-[2rem] space-y-4 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="relative group lg:col-span-2">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by title..."
                            className="bg-slate-950 border-slate-800 pl-12 h-12 rounded-2xl focus:ring-blue-600/50 text-white font-bold placeholder:text-slate-600"
                        />
                    </div>

                    {/* Category */}
                    <div className="relative">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full h-12 bg-slate-950 border border-slate-800 rounded-2xl px-4 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-blue-600/50 appearance-none cursor-pointer"
                        >
                            <option value="all">Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
                    </div>

                    {/* Status */}
                    <div className="relative">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full h-12 bg-slate-950 border border-slate-800 rounded-2xl px-4 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-blue-600/50 appearance-none cursor-pointer"
                        >
                            <option value="all">Any Status</option>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                        </select>
                        <Eye className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
                    </div>
                </div>

                {/* Additional Filters Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                    <div className="relative">
                        <Input
                            value={venue}
                            onChange={(e) => setVenue(e.target.value)}
                            placeholder="Filter by Venue"
                            className="bg-slate-950 border-slate-800 h-10 rounded-xl text-[10px] font-bold text-white pl-8"
                        />
                        <MapPin size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    </div>

                    <div className="relative">
                        <select
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="w-full h-10 bg-slate-950 border border-slate-800 rounded-xl px-3 text-[10px] font-bold text-white outline-none appearance-none"
                        >
                            <option value="all">Year</option>
                            {[2024, 2025, 2026].map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>

                    <div className="relative">
                        <select
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="w-full h-10 bg-slate-950 border border-slate-800 rounded-xl px-3 text-[10px] font-bold text-white outline-none appearance-none"
                        >
                            <option value="all">Month</option>
                            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        {(search || selectedCategory !== 'all' || selectedStatus !== 'all' || venue || year !== 'all' || month !== 'all') && (
                            <button
                                onClick={resetFilters}
                                className="flex items-center gap-2 text-rose-500 hover:text-rose-400 text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-rose-500/10 rounded-xl transition-all border border-rose-500/20 w-full justify-center"
                            >
                                <FilterX size={14} />
                                Reset
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Pagination Controls Top */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/30 border border-slate-800 rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Per Page</span>
                        <select
                            value={pagination.limit}
                            onChange={(e) => fetchCourses(1, parseInt(e.target.value))}
                            className="bg-slate-950 border border-slate-800 rounded-lg text-[10px] font-bold text-white px-2 py-1 outline-none"
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={pagination.page <= 1 || loading}
                        onClick={() => handlePageChange(pagination.page - 1)}
                        className="h-8 w-8 p-0 bg-slate-950 border-slate-800 text-slate-400 rounded-lg"
                    >
                        <ChevronLeft size={16} />
                    </Button>
                    <span className="text-[10px] font-black text-white bg-blue-600/20 border border-blue-500/30 w-8 h-8 flex items-center justify-center rounded-lg">
                        {pagination.page}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={pagination.page >= pagination.totalPages || loading}
                        onClick={() => handlePageChange(pagination.page + 1)}
                        className="h-8 w-8 p-0 bg-slate-950 border-slate-800 text-slate-400 rounded-lg"
                    >
                        <ChevronRight size={16} />
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Synchronizing Inventory...</p>
                </div>
            ) : (
                <>
                    {/* Listing (Mobile Cards) */}
                    <div className="grid grid-cols-1 gap-4 lg:hidden">
                        {courses.map((course: any) => (
                            <div key={course.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 relative overflow-hidden group shadow-lg">
                                <div className="flex gap-4">
                                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                                        {course.thumbnail ? (
                                            <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-600">
                                                <BookOpen size={24} />
                                            </div>
                                        )}
                                        {!course.published && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                <EyeOff size={16} className="text-rose-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-black truncate group-hover:text-blue-400 transition-colors uppercase italic">{course.title}</h3>
                                        <div className="flex flex-wrap items-center gap-2 mt-1">
                                            <span className="text-sm text-blue-500 font-black">{currencySymbol}{Number(course.price).toLocaleString()}</span>
                                            {course.category && (
                                                <span className="text-[8px] text-white bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 font-black uppercase">
                                                    {course.category.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 text-[8px] font-black uppercase tracking-tight text-slate-500 border-t border-slate-800 pt-3">
                                    <div className="flex flex-col items-center gap-1">
                                        <FileText size={12} className="text-blue-500" />
                                        {course.materials?.length || 0} Docs
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <Clock size={12} className="text-emerald-500" />
                                        {course.duration || 'N/A'}
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <MapPin size={12} className="text-rose-500" />
                                        {course.venue || 'Online'}
                                    </div>
                                </div>

                                <div className="flex gap-2 ">
                                    <Link href={`/admin/courses/${course.id}/edit`} className="flex-1">
                                        <Button className="w-full bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white rounded-xl h-10 text-[10px] font-black uppercase tracking-widest gap-2">
                                            <Edit size={14} />
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button
                                        onClick={() => handleDelete(course.id, course.title)}
                                        variant="outline"
                                        className="bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl h-10 px-3"
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Listing (Desktop Table) */}
                    <div className="hidden lg:block bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-800 bg-slate-800/10">
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Inventory Item</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Logistics</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Certification</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Control</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {courses.map((course: any) => (
                                        <tr key={course.id} className="hover:bg-slate-800/20 transition-all group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800 shadow-inner">
                                                        {course.thumbnail ? (
                                                            <img src={course.thumbnail} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-slate-700">
                                                                <BookOpen size={24} />
                                                            </div>
                                                        )}
                                                        {!course.published && (
                                                            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                                                                <EyeOff size={16} className="text-rose-500" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-white font-black text-sm tracking-tight truncate max-w-[280px] group-hover:text-blue-400 transition-colors uppercase italic">
                                                            {course.title}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <p className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-md">{currencySymbol}{Number(course.price).toLocaleString()}</p>
                                                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{course.type}</span>
                                                        </div>
                                                        <p className="text-slate-500 text-[10px] font-mono mt-1 group-hover:text-slate-400 transition-colors">/{course.slug}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="flex items-center gap-2 text-slate-400">
                                                        <MapPin size={12} className="text-rose-500" />
                                                        <span className="text-[10px] font-black uppercase">{course.venue || 'Global/Online'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-slate-400">
                                                        <Clock size={12} className="text-emerald-500" />
                                                        <span className="text-[10px] font-black uppercase">{course.duration || 'Self-paced'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                {course.certificationType ? (
                                                    <div className="flex items-center gap-2">
                                                        <Award size={14} className="text-amber-500" />
                                                        <span className="text-[10px] font-black text-white uppercase italic">{course.certificationType.name}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] text-slate-700 font-bold uppercase tracking-widest">No Certificate</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-6">
                                                <span className={cn(
                                                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] border",
                                                    course.published
                                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                        : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                                )}>
                                                    {course.published ? 'Live' : 'Draft'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/admin/courses/${course.id}/edit`}>
                                                        <Button variant="outline" size="sm" className="bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl h-9 text-[10px] font-black uppercase tracking-widest px-4 shadow-sm group">
                                                            <Edit size={12} className="group-hover:scale-110 transition-transform" />
                                                            Edit
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        onClick={() => handleDelete(course.id, course.title)}
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-9 w-9 bg-rose-500/5 hover:bg-rose-500/20 text-rose-500/50 hover:text-rose-500 rounded-xl border border-transparent hover:border-rose-500/20"
                                                    >
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {courses.length === 0 && (
                            <div className="p-32 text-center text-slate-500 italic">
                                <FilterX size={32} className="mx-auto mb-4 opacity-20" />
                                <p className="uppercase tracking-widest text-xs font-black">Null Inventory Match</p>
                                <button onClick={resetFilters} className="mt-4 text-blue-500 hover:underline text-[10px] font-black uppercase">Revert Filter Overrides</button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
