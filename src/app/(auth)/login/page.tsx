'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, BookOpen, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

import Image from 'next/image';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        setLoading(true);
        const result = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false,
        });

        setLoading(false);

        if (result?.error) {
            toast.error('Invalid email or password. Please try again.');
        } else {
            toast.success('Welcome back!');
            const session = await getSession();

            if (session?.user?.role === 'ADMIN') {
                router.push('/admin');
            } else {
                router.push('/dashboard');
            }
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center mb-4 shrink-0 w-full max-w-[280px] mx-auto">
                        <Image
                            src="/gialogo.png"
                            alt="GIA Advisory"
                            width={280}
                            height={80}
                            style={{ width: '100%', height: 'auto' }}
                            priority
                        />
                    </div>
                    <p className="text-slate-400 text-sm mt-4 font-medium tracking-wide">Training & Course Management</p>
                </div>

                {/* Card */}
                <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                    <div className="flex items-center gap-2 mb-6">
                        <ShieldCheck className="w-5 h-5 text-blue-400" />
                        <h2 className="text-lg font-semibold text-white">Sign in to your account</h2>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-300 text-sm font-medium">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@giaadvisory.com"
                                {...register('email')}
                                className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 h-11"
                            />
                            {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-slate-300 text-sm font-medium">Password</Label>
                                <a href="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                                    Forgot password?
                                </a>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                {...register('password')}
                                className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 h-11"
                            />
                            {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
                        </div>

                        <Button
                            type="submit"
                            id="login-submit"
                            disabled={loading}
                            className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 mt-2"
                        >
                            {loading ? (
                                <><Loader2 className="w-4 h-4 animate-spin mr-2" />Signing in...</>
                            ) : (
                                'Sign in'
                            )}
                        </Button>
                    </form>

                    <p className="text-center text-slate-500 text-xs mt-6">
                        Don&apos;t have an account?{' '}
                        <a href="/register" className="text-blue-400 hover:text-blue-300 transition-colors">Register here</a>
                    </p>
                </div>

                <p className="text-center text-slate-600 text-xs mt-6">
                    © {new Date().getFullYear()} GIA Advisory Consulting Services. All rights reserved.
                </p>
            </div>
        </div>
    );
}
