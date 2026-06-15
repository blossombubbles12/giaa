'use client';

import { useState, useEffect } from 'react';
import {
    Star,
    Search,
    Loader2,
    CheckCircle2,
    XCircle,
    Trash2,
    User,
    Quote,
    Filter,
    Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type Testimonial = {
    id: string;
    content: string;
    rating: number;
    approved: boolean;
    createdAt: string;
    user: {
        id: string;
        name: string | null;
        email: string;
    };
};

type PlatformUser = {
    id: string;
    name: string | null;
    email: string;
};

export default function AdminTestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [users, setUsers] = useState<PlatformUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'ALL' | 'APPROVED' | 'PENDING'>('ALL');
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);

    // Form state
    const [newContent, setNewContent] = useState('');
    const [newRating, setNewRating] = useState(5);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [isCustom, setIsCustom] = useState(false);
    const [customName, setCustomName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchTestimonials = async () => {
        try {
            const res = await fetch('/api/admin/testimonials');
            if (res.ok) {
                const data = await res.json();
                setTestimonials(data);
            }
        } catch (err) {
            toast.error('Failed to load testimonials');
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (err) { }
    };

    useEffect(() => {
        fetchTestimonials();
        fetchUsers();
    }, []);

    const handleAddTestimonial = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!isCustom && !selectedUserId) || (isCustom && !customName) || !newContent) {
            toast.error('Please provide a student name and content');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/admin/testimonials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: newContent,
                    rating: newRating,
                    userId: !isCustom ? selectedUserId : undefined,
                    customName: isCustom ? customName : undefined,
                    approved: true
                }),
            });

            if (res.ok) {
                toast.success('Testimonial created successfully');
                setIsAddOpen(false);
                setNewContent('');
                setNewRating(5);
                setSelectedUserId('');
                setCustomName('');
                fetchTestimonials();
            } else {
                toast.error('Failed to create testimonial');
            }
        } catch (err) {
            toast.error('An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleApproval = async (id: string, currentlyApproved: boolean) => {
        setProcessingId(id);
        try {
            const res = await fetch(`/api/admin/testimonials/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ approved: !currentlyApproved }),
            });
            if (res.ok) {
                toast.success(!currentlyApproved ? 'Feedback approved and published' : 'Feedback moved to pending');
                fetchTestimonials();
            }
        } catch (err) {
            toast.error('Moderation action failed');
        } finally {
            setProcessingId(null);
        }
    };

    const deleteTestimonial = async (id: string) => {
        if (!confirm('Are you sure you want to permanently delete this testimonial?')) return;

        setProcessingId(id);
        try {
            const res = await fetch(`/api/admin/testimonials/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                toast.success('Testimonial removed');
                fetchTestimonials();
            }
        } catch (err) {
            toast.error('Deletion failed');
        } finally {
            setProcessingId(null);
        }
    };

    const filtered = testimonials.filter(t => {
        const matchesSearch = t.user.email.toLowerCase().includes(search.toLowerCase()) ||
            t.user.name?.toLowerCase().includes(search.toLowerCase()) ||
            t.content.toLowerCase().includes(search.toLowerCase());

        if (filter === 'APPROVED') return matchesSearch && t.approved;
        if (filter === 'PENDING') return matchesSearch && !t.approved;
        return matchesSearch;
    });

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={10} className={i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-800'} />
        ));
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white uppercase tracking-tight italic">Student Voices</h1>
                    <p className="text-slate-400 text-sm mt-1">Moderate and curate student experiences for the web showcase.</p>
                </div>

                <div className="flex items-center gap-4">
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-6 h-10 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-600/20 gap-2 text-wrap">
                                <Plus size={14} />
                                Create Testimonial
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-900 border-slate-800 text-white rounded-[2rem] max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-black uppercase tracking-tight italic">New Feedback Entry</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleAddTestimonial} className="space-y-6 pt-4">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Attributed Student</Label>
                                        <button
                                            type="button"
                                            onClick={() => { setIsCustom(!isCustom); setSelectedUserId(''); setCustomName(''); }}
                                            className="text-[10px] font-bold text-blue-500 hover:text-blue-400 uppercase tracking-widest"
                                        >
                                            {isCustom ? 'Select Existing' : 'Enter Custom Name'}
                                        </button>
                                    </div>
                                    {isCustom ? (
                                        <Input
                                            value={customName}
                                            onChange={(e) => setCustomName(e.target.value)}
                                            placeholder="Enter student's full name"
                                            className="w-full bg-slate-950 border-slate-800 h-12 rounded-xl focus:ring-blue-600 focus:border-blue-600 outline-none"
                                            required={isCustom}
                                        />
                                    ) : (
                                        <select
                                            value={selectedUserId}
                                            onChange={(e) => setSelectedUserId(e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl h-12 px-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                                            required={!isCustom}
                                        >
                                            <option value="">Select a student...</option>
                                            {users.map(u => (
                                                <option key={u.id} value={u.id}>{u.name || u.email}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Star Rating</Label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map(r => (
                                            <button
                                                key={r}
                                                type="button"
                                                onClick={() => setNewRating(r)}
                                                className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all ${newRating >= r ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'bg-slate-950 border-slate-800 text-slate-600'}`}
                                            >
                                                <Star size={16} fill={newRating >= r ? 'currentColor' : 'none'} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Feedback Content</Label>
                                    <textarea
                                        value={newContent}
                                        onChange={(e) => setNewContent(e.target.value)}
                                        placeholder="Enter the student's testimonial here..."
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 h-32 text-sm focus:ring-2 focus:ring-blue-600 outline-none resize-none"
                                        required
                                    />
                                </div>
                                <Button
                                    className="w-full bg-blue-600 hover:bg-blue-500 h-12 rounded-xl font-black uppercase tracking-widest"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : 'Publish Testimonial'}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <div className="flex bg-slate-900 border border-slate-800 rounded-2xl p-1">
                        {(['ALL', 'APPROVED', 'PENDING'] as const).map((f) => (
                            <Button
                                key={f}
                                variant="ghost"
                                onClick={() => setFilter(f)}
                                className={`h-9 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500'
                                    }`}
                            >
                                {f}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-slate-800 bg-slate-800/10 flex items-center gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <Input
                            placeholder="Find feedback by keywords or student names..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-12 bg-slate-950 border-slate-800 h-12 rounded-2xl focus:ring-blue-600 focus:border-blue-600 shadow-inner italic"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-32 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] animate-pulse">Scanning student logs...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="p-32 text-center space-y-4">
                        <div className="w-20 h-20 bg-slate-800/50 rounded-3xl flex items-center justify-center mx-auto border border-slate-700 shadow-inner">
                            <Quote className="text-slate-600" size={32} />
                        </div>
                        <h3 className="text-white font-bold text-lg uppercase tracking-tight">No feedback found</h3>
                        <p className="text-slate-500 text-sm italic max-w-xs mx-auto opacity-70">New testimonials will appear here for moderation.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-0 divide-x divide-y divide-slate-800 border-collapse">
                        {filtered.map((t) => (
                            <div key={t.id} className="p-8 group hover:bg-slate-800/20 transition-all flex flex-col h-full bg-slate-900/50">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-blue-500 group-hover:border-blue-500/50 transition-colors shadow-inner">
                                            <User size={18} />
                                        </div>
                                        <div>
                                            <p className="text-white font-black text-[13px] uppercase tracking-tighter italic leading-none">{t.user.name || 'Student'}</p>
                                            <div className="flex gap-1 mt-1.5">{renderStars(t.rating)}</div>
                                        </div>
                                    </div>
                                    <div className={`w-2.5 h-2.5 rounded-full ${t.approved ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'}`} />
                                </div>

                                <div className="flex-1 relative">
                                    <Quote size={40} className="absolute -top-2 -left-2 text-slate-800/50 -z-1" />
                                    <p className="text-slate-400 text-sm leading-relaxed italic font-medium relative z-10 pl-2">
                                        "{t.content}"
                                    </p>
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-800/50 flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => toggleApproval(t.id, t.approved)}
                                            disabled={!!processingId}
                                            variant="ghost"
                                            className={`rounded-xl h-10 px-4 text-[10px] font-black uppercase tracking-widest gap-2 transition-all ${t.approved
                                                ? 'text-amber-500 hover:text-amber-400 hover:bg-amber-500/10'
                                                : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/20'
                                                }`}
                                        >
                                            {processingId === t.id ? <Loader2 size={12} className="animate-spin" /> : t.approved ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
                                            {t.approved ? 'Reject' : 'Approve'}
                                        </Button>
                                    </div>
                                    <Button
                                        onClick={() => deleteTestimonial(t.id)}
                                        disabled={!!processingId}
                                        variant="ghost"
                                        className="h-10 w-10 p-0 rounded-xl text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="bg-blue-600/5 border border-blue-600/10 rounded-[2rem] p-8 flex items-start gap-4 shadow-inner">
                <Quote className="text-blue-500 shrink-0 mt-1" size={20} />
                <div>
                    <p className="text-sm font-bold text-white uppercase tracking-tight mb-1 italic">Moderation Protocol</p>
                    <p className="text-slate-500 text-xs leading-relaxed font-semibold italic opacity-80">
                        Approved testimonials are automatically mirrored to the high-traffic landing page. Students receive a push notification the moment their feedback is verified by the admin team.
                    </p>
                </div>
            </div>
        </div>
    );
}
