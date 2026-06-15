'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, BookOpen, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

import Image from 'next/image';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterForm) => {
        setLoading(true);
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.error || 'Registration failed');

            toast.success('Account created! Accessing dashboard...');

            // Automatically sign in
            const signResult = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (signResult?.error) {
                toast.error('Account created but login failed. Please sign in manually.');
                router.push('/login');
            } else {
                router.push('/dashboard');
            }
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
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

                <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                    <div className="flex items-center gap-2 mb-6">
                        <UserPlus className="w-5 h-5 text-blue-400" />
                        <h2 className="text-lg font-semibold text-white">Create an account</h2>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-slate-300 text-sm font-medium">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                {...register('name')}
                                className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 h-11"
                            />
                            {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-300 text-sm font-medium">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                {...register('email')}
                                className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 h-11"
                            />
                            {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-300 text-sm font-medium">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                {...register('password')}
                                className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 h-11"
                            />
                            {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-slate-300 text-sm font-medium">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                {...register('confirmPassword')}
                                className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 h-11"
                            />
                            {errors.confirmPassword && <p className="text-red-400 text-xs">{errors.confirmPassword.message}</p>}
                        </div>

                        <Button
                            type="submit"
                            id="register-submit"
                            disabled={loading}
                            className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/30 mt-2"
                        >
                            {loading ? (
                                <><Loader2 className="w-4 h-4 animate-spin mr-2" />Creating account...</>
                            ) : (
                                'Create Account'
                            )}
                        </Button>
                    </form>

                    <p className="text-center text-slate-500 text-xs mt-6">
                        Already have an account?{' '}
                        <a href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">Sign in</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
