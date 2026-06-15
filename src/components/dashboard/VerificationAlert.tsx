'use client';

import { useState } from 'react';
import { ShieldAlert, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface VerificationAlertProps {
    isVerified: Date | null | undefined;
}

export function VerificationAlert({ isVerified }: VerificationAlertProps) {
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    if (isVerified) return null;

    const resendVerification = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/auth/resend-verification', {
                method: 'POST',
            });
            
            if (res.ok) {
                toast.success('Verification email sent! Please check your inbox.');
                setSent(true);
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to send verification email');
            }
        } catch (err) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-[2.5rem] p-6 mb-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-amber-500/5 animate-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-5 text-center md:text-left">
                <div className="w-14 h-14 bg-amber-500/20 border border-amber-500/30 rounded-2xl flex items-center justify-center shrink-0">
                    <ShieldAlert className="text-amber-500" size={28} />
                </div>
                <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight mb-1">Verify Your Digital Identity</h3>
                    <p className="text-slate-400 text-xs font-bold max-w-lg">
                        To activate full enrollment privileges and secure your academic record, please confirm your email address. Initial access is limited until verification.
                    </p>
                </div>
            </div>
            
            <Button 
                onClick={resendVerification}
                disabled={loading || sent}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl px-8 h-12 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50"
            >
                {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing...</>
                ) : sent ? (
                    <><CheckCircle className="w-4 h-4 mr-2" /> Link Dispatched</>
                ) : (
                    'Resend Verification Link'
                )}
            </Button>
        </div>
    );
}
