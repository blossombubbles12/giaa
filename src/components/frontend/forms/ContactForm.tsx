'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface ContactFormProps {
    source?: string;
    courseId?: string;
    defaultSubject?: string;
    className?: string;
}

export function ContactForm({ source = 'CONTACT_PAGE', courseId, defaultSubject, className }: ContactFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: defaultSubject || '',
        message: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    source,
                    courseId,
                }),
            });

            if (res.ok) {
                setIsSubmitted(true);
                toast.success('Message sent successfully!');
                setFormData({ name: '', email: '', phone: '', subject: defaultSubject || '', message: '' });
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to send message');
            }
        } catch (err) {
            toast.error('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
                    <CheckCircle2 size={40} />
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">Message Received!</h3>
                    <p className="text-slate-500 font-medium">Thank you for reaching out. One of our consultants will get back to you shortly.</p>
                </div>
                <Button 
                    variant="outline" 
                    onClick={() => setIsSubmitted(false)}
                    className="rounded-xl border-slate-200 dark:border-slate-800"
                >
                    Send Another Message
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className={`grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 ${className}`}>
            <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">Full Name</label>
                <Input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe" 
                    className="h-12 md:h-16 rounded-xl md:rounded-2xl bg-slate-50 dark:bg-slate-900 border-0 px-5 md:px-6 font-bold" 
                />
            </div>
            <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">Email Address</label>
                <Input 
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com" 
                    className="h-12 md:h-16 rounded-xl md:rounded-2xl bg-slate-50 dark:bg-slate-900 border-0 px-5 md:px-6 font-bold" 
                />
            </div>
            <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">Phone Number</label>
                <Input 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+234 ..." 
                    className="h-12 md:h-16 rounded-xl md:rounded-2xl bg-slate-50 dark:bg-slate-900 border-0 px-5 md:px-6 font-bold" 
                />
            </div>
            <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">Subject</label>
                <Input 
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Inquiry Subject" 
                    className="h-12 md:h-16 rounded-xl md:rounded-2xl bg-slate-50 dark:bg-slate-900 border-0 px-5 md:px-6 font-bold" 
                />
            </div>
            <div className="space-y-2 md:col-span-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">Your Message</label>
                <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your training needs..."
                    className="w-full h-32 md:h-48 rounded-2xl md:rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 border-0 px-6 md:px-8 py-4 md:py-6 font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-brand outline-none transition-all resize-none"
                />
            </div>
            <div className="md:col-span-2 pt-2 md:pt-4">
                <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto bg-brand hover:bg-slate-900 text-white rounded-xl md:rounded-2xl h-14 md:h-16 px-8 md:px-10 font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all gap-2"
                >
                    {isSubmitting ? (
                        <><Loader2 className="animate-spin" size={16} /> Processing...</>
                    ) : (
                        <>{courseId ? 'Submit Inquiry' : 'Send Message'} <Send size={16} /></>
                    )}
                </Button>
            </div>
        </form>
    );
}
