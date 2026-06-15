'use client';

import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Lock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

const resetPasswordSchema = z.object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

function ResetPasswordFormContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordForm>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async (data: ResetPasswordForm) => {
        if (!token) {
            toast.error('Invalid or missing reset token.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/auth/reset-password/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password: data.password }),
            });

            if (res.ok) {
                setSuccess(true);
                toast.success('Password updated successfully!');
            } else {
                const errorData = await res.json();
                toast.error(errorData.error || 'Failed to reset password');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="text-center space-y-4 py-6">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white">Invalid Reset Link</h3>
                <p className="text-slate-400 text-sm">
                    This password reset link is invalid or has expired. Please request a new one.
                </p>
                <Link href="/forgot-password" className="block mt-6">
                    <Button className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl">
                        Request New Link
                    </Button>
                </Link>
            </div>
        );
    }

    if (success) {
        return (
            <div className="text-center space-y-4 py-6">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-white">Password Reset Successful</h3>
                <p className="text-slate-400 text-sm">
                    Your password has been successfully updated. You can now log in with your new password.
                </p>
                <Link href="/login" className="block mt-6">
                    <Button className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl">
                        Proceed to Login
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col items-center gap-3 mb-6 text-center">
                <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
                    <Lock className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Create New Password</h2>
                <p className="text-slate-400 text-sm">
                    Please enter your new password below.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-300 text-sm font-medium">New Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        {...register('password')}
                        className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 h-11"
                    />
                    {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-slate-300 text-sm font-medium">Confirm New Password</Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        {...register('confirmPassword')}
                        className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 h-11"
                    />
                    {errors.confirmPassword && <p className="text-red-400 text-xs">{errors.confirmPassword.message}</p>}
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 mt-2"
                >
                    {loading ? (
                        <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Resetting...</>
                    ) : (
                        'Set New Password'
                    )}
                </Button>
            </form>
        </>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
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

                <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-700">
                    <Suspense fallback={<div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>}>
                        <ResetPasswordFormContent />
                    </Suspense>
                </div>

                <p className="text-center text-slate-600 text-xs mt-6">
                    © 2026 GIA Advisory. All rights reserved.
                </p>
            </div>
        </div>
    );
}
