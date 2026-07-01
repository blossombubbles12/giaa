'use client';

import { useState } from 'react';
import {
    X,
    Calendar,
    User,
    Mail,
    Phone,
    MessageSquare,
    Send,
    Loader2,
    CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface InquiryModalProps {
    space: {
        id: string;
        title: string;
    };
    isOpen: boolean;
    onClose: () => void;
}

export function InquiryModal({ space, isOpen, onClose }: InquiryModalProps) {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        preferredDate: '',
        message: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/spaces/inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    spaceName: space.title
                }),
            });

            if (res.ok) {
                setSubmitted(true);
                toast.success('Tour request sent successfully!');
                setTimeout(() => {
                    onClose();
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', preferredDate: '', message: '' });
                }, 3000);
            } else {
                const data = await res.json();
                throw new Error(data.error || 'Failed to send request');
            }
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-5 duration-500">
                {/* Header */}
                <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Schedule a Tour</h2>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Visit: {space.title}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8">
                    {submitted ? (
                        <div className="py-12 flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in-95">
                            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center shadow-inner">
                                <CheckCircle2 size={40} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Request Received!</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 max-w-[280px] mx-auto">
                                    Our facility manager will contact you shortly to confirm your visitation.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Full Name</Label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand transition-colors" />
                                        <Input
                                            required
                                            placeholder="Your name"
                                            className="pl-12 h-14 bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-brand focus:border-brand transition-all font-bold"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Email</Label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand transition-colors" />
                                        <Input
                                            required
                                            type="email"
                                            placeholder="you@email.com"
                                            className="pl-12 h-14 bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-brand focus:border-brand transition-all font-bold"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Phone Number</Label>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand transition-colors" />
                                        <Input
                                            required
                                            placeholder="+234 707 057 9947"
                                            className="pl-12 h-14 bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-brand focus:border-brand transition-all font-bold"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Preferred Date</Label>
                                    <div className="relative group">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand transition-colors" />
                                        <Input
                                            required
                                            type="date"
                                            className="pl-12 h-14 bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-brand focus:border-brand transition-all font-bold text-slate-500"
                                            value={formData.preferredDate}
                                            onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Special Requirements (Optional)</Label>
                                <div className="relative group">
                                    <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-slate-400 group-focus-within:text-brand transition-colors" />
                                    <textarea
                                        rows={3}
                                        placeholder="e.g. Accessibility needs, specific time..."
                                        className="w-full pl-12 pt-4 bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-brand focus:border-brand transition-all font-bold outline-none resize-none"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-16 bg-slate-900 dark:bg-brand text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-brand/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin h-5 w-5" />
                                ) : (
                                    <>
                                        Schedule Visitation <Send size={18} />
                                    </>
                                )}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
