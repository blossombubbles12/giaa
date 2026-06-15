'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';

const forgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordForm) => {
        setLoading(true);
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setSuccess(true);
                toast.success('Password reset link sent! Check your inbox.');
            } else {
                const errorData = await res.json();
                toast.error(errorData.error || 'Failed to send reset link');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center mb-4 shrink-0 w-full max-w-[280px] mx-auto">
                        <Image
                            src="/gialogo.png"
                            alt="GIA Logo"
                            width={280}
                            height={80}
                            style={{ width: '100%', height: 'auto' }}
                            priority
                        />
                    </div>
                </div>

                {/* Card */}
                <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-500">
                    <div className="flex flex-col items-center gap-3 mb-6 text-center">
                        <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
                            <KeyRound className="w-6 h-6 text-blue-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Forgot Password?</h2>
                        {!success && (
                            <p className="text-slate-400 text-sm">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>
                        )}
                    </div>

                    {success ? (
                        <div className="text-center space-y-6">
                            <p className="text-slate-300 text-sm bg-slate-800/50 p-4 border border-slate-700 rounded-xl">
                                If an account exists with that email address, an email with a password reset link has been sent. Check your spam folder if you don't receive it within a few minutes.
                            </p>
                            <Link href="/login" className="block">
                                <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg">
                                    Return to Login
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-300 text-sm font-medium">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    {...register('email')}
                                    className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 h-11"
                                />
                                {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 mt-2"
                            >
                                {loading ? (
                                    <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Sending link...</>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </Button>
                        </form>
                    )}

                    <p className="text-center text-slate-500 text-xs mt-6">
                        Remembered your password?{' '}
                        <a href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">Sign in here</a>
                    </p>
                </div>

                <p className="text-center text-slate-600 text-xs mt-6">
                    © 2026 GIA Advisory. All rights reserved.
                </p>
            </div>
        </div>
    );
}
