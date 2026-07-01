'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePaystackPayment } from 'react-paystack';
import { useSession, signIn } from 'next-auth/react';
import {
    Loader2,
    CreditCard,
    ShieldCheck,
    CheckCircle2,
    ArrowLeft,
    User,
    Mail,
    Lock,
    Phone,
    Briefcase,
    Building2,
    Check,
    MapPin,
    AlertCircle,
    Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import Link from 'next/link';

export default function CheckoutPage() {
    const { data: session, status } = useSession();
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [course, setCourse] = useState<any>(null);
    const [currencySymbol, setCurrencySymbol] = useState('£');
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);
    const [gateway, setGateway] = useState<'PAYSTACK' | 'OFFLINE'>('PAYSTACK');

    // Auth State
    const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('REGISTER');
    const [authLoading, setAuthLoading] = useState(false);

    // Terms Consent
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    // Billing Form
    const [billingData, setBillingData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        city: '',
        billingEmail: '',
        paymentType: 'SELF', // SELF or COMPANY
        participantsCount: 1,
    });

    const [offlineSuccess, setOfflineSuccess] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [courseRes, settingsRes] = await Promise.all([
                    fetch(`/api/courses/${slug}`),
                    fetch('/api/settings/localization')
                ]);

                if (!courseRes.ok) throw new Error('Course not found');
                const courseData = await courseRes.json();
                const settingsData = await settingsRes.json();

                setCourse(courseData);
                setCurrencySymbol(settingsData.currencySymbol || '£');

                // Prefill if logged in
                if (session?.user) {
                    setBillingData(prev => ({
                        ...prev,
                        name: session.user.name || '',
                        email: session.user.email || ''
                    }));
                }
            } catch (err) {
                toast.error('Failed to load checkout details');
                router.push('/');
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchData();
    }, [slug, router, session]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthLoading(true);

        try {
            if (authMode === 'REGISTER') {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: billingData.name,
                        email: billingData.email,
                        password: billingData.password
                    }),
                });

                if (!res.ok) {
                    const error = await res.json();
                    throw new Error(error.error || 'Registration failed');
                }

                toast.success('Account created successfully!');
            }

            // Login after register or if mode is Login
            const result = await signIn('credentials', {
                email: billingData.email,
                password: billingData.password,
                redirect: false,
            });

            if (result?.error) {
                throw new Error('Invalid email or password');
            }

            toast.success('Signed in successfully');
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setAuthLoading(false);
        }
    };

    const config = {
        reference: (new Date()).getTime().toString(),
        email: session?.user?.email || billingData.email,
        amount: course ? Math.round(course.price * billingData.participantsCount * 100) : 0,
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
        currency: 'NGN',
        metadata: {
            custom_fields: [
                { display_name: "Payment Type", variable_name: "payment_type", value: billingData.paymentType },
                { display_name: "Billing Email", variable_name: "billing_email", value: billingData.billingEmail || billingData.email },
                { display_name: "Billing Address", variable_name: "billing_address", value: `${billingData.address}, ${billingData.city}` }
            ]
        }
    };

    const initializePayment = usePaystackPayment(config);

    const onSuccess = async (reference: any) => {
        setVerifying(true);
        try {
            const res = await fetch('/api/payments/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reference: reference.reference,
                    courseId: course.id,
                    paymentType: billingData.paymentType,
                    billingEmail: billingData.billingEmail || billingData.email,
                    billingAddress: `${billingData.address}, ${billingData.city}`
                }),
            });

            if (res.ok) {
                toast.success('Payment successful! Enrollment confirmed.');
                router.push(`/dashboard/courses/${course.id}`);
            } else {
                toast.error('Payment verification failed. Please contact support.');
            }
        } catch (err) {
            toast.error('An error occurred during verification.');
        } finally {
            setVerifying(false);
        }
    };

    const handleOfflinePayment = async () => {
        if (!acceptedTerms) {
            toast.error('Please accept the terms and conditions');
            return;
        }

        setVerifying(true);
        try {
            const res = await fetch('/api/checkout/offline', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseId: course.id,
                    paymentType: billingData.paymentType,
                    billingEmail: billingData.billingEmail || billingData.email,
                    billingAddress: `${billingData.address}, ${billingData.city}`,
                    phone: billingData.phone,
                    participantsCount: billingData.participantsCount
                }),
            });

            if (res.ok) {
                toast.success('Course enrollment requested! Please see payment instructions below.');
                setOfflineSuccess(true);
            } else {
                const error = await res.json();
                toast.error(error.error || 'Failed to process offline payment request');
            }
        } catch (err) {
            toast.error('An error occurred. Please try again.');
        } finally {
            setVerifying(false);
        }
    };

    const onClose = () => {
        toast.info('Payment window closed');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Preparing Secure Checkout...</p>
            </div>
        );
    }

    if (!course) return null;

    if (offlineSuccess) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center py-20 px-4">
                <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 max-w-2xl w-full shadow-2xl text-center space-y-8">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500/20">
                        <CheckCircle2 className="text-emerald-500 w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter">Enrollment Received!</h2>
                    <p className="text-slate-400 font-medium">Your request for <strong>{course.title}</strong> has been submitted to GIA Advisory. A copy of the invoice has also been sent to your email.</p>
                    
                    <div className="bg-slate-950 rounded-[2rem] p-8 border border-slate-800 text-left space-y-6">
                        <h3 className="text-sm font-black text-amber-500 uppercase tracking-widest border-b border-slate-800 pb-4">Payment Instructions</h3>
                        <p className="text-xs text-slate-400">Please make the payment of <strong className="text-white">{currencySymbol}{(Number(course.price) * billingData.participantsCount).toLocaleString()}</strong> to the following account:</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Bank Name</p>
                                <p className="text-sm font-black text-white">First Bank of Nigeria</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Account Name</p>
                                <p className="text-sm font-black text-white">GIA Advisory</p>
                            </div>
                            <div className="space-y-1 sm:col-span-2">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Account Number</p>
                                <p className="text-2xl font-black text-emerald-500 tracking-widest">1234567890</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-800">
                        <p className="text-[10px] font-medium text-slate-500">Once payment is made, your enrollment will be verified and approved by our team.</p>
                        <Link href="/dashboard/enrollments" className="block">
                            <Button className="w-full bg-blue-600 hover:bg-blue-500 rounded-2xl h-14 text-xs font-black uppercase tracking-widest">
                                Go to My Enrollments
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30 font-sans pb-20">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <Link href={`/courses/${slug}`} className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-all group w-fit">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-slate-700 transition-all">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">Back to Course</span>
                    </Link>

                    <div className="flex items-center gap-4 bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-3">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest text-blue-600">Secure Payment</span>
                            <span className="text-white font-black text-sm tracking-tight">Paystack Gateway</span>
                        </div>
                        <div className="w-px h-8 bg-slate-800" />
                        <ShieldCheck className="text-emerald-500 w-6 h-6" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* ——— Left: Account & Billing (8 cols) ——— */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* 1. Account Setup */}
                        {!session ? (
                            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                                <div className="flex border-b border-slate-800">
                                    <button
                                        onClick={() => setAuthMode('REGISTER')}
                                        className={`flex-1 py-6 text-xs font-black uppercase tracking-widest transition-all ${authMode === 'REGISTER' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        Create Account
                                    </button>
                                    <button
                                        onClick={() => setAuthMode('LOGIN')}
                                        className={`flex-1 py-6 text-xs font-black uppercase tracking-widest transition-all ${authMode === 'LOGIN' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        Already a Student? Login
                                    </button>
                                </div>
                                <div className="p-10 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {authMode === 'REGISTER' && (
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</Label>
                                                <div className="relative group">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                                    <Input
                                                        placeholder="Enter your name"
                                                        className="pl-12 h-14 bg-slate-950 border-slate-800 rounded-2xl focus:border-blue-600 transition-all font-bold placeholder:font-normal"
                                                        value={billingData.name}
                                                        onChange={e => setBillingData({ ...billingData, name: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <div className={`space-y-3 ${authMode === 'LOGIN' ? 'md:col-span-2' : ''}`}>
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</Label>
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                                <Input
                                                    type="email"
                                                    placeholder="Enter your email"
                                                    className="pl-12 h-14 bg-slate-950 border-slate-800 rounded-2xl focus:border-blue-600 transition-all font-bold placeholder:font-normal"
                                                    value={billingData.email}
                                                    onChange={e => setBillingData({ ...billingData, email: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3 md:col-span-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</Label>
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                                <Input
                                                    type="password"
                                                    placeholder="Enter your password"
                                                    className="pl-12 h-14 bg-slate-950 border-slate-800 rounded-2xl focus:border-blue-600 transition-all font-bold placeholder:font-normal"
                                                    value={billingData.password}
                                                    onChange={e => setBillingData({ ...billingData, password: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={handleAuth}
                                        disabled={authLoading}
                                        className="w-full h-16 bg-blue-600 hover:bg-blue-500 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 active:scale-95 transition-all"
                                    >
                                        {authLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : `${authMode === 'REGISTER' ? 'Register Now' : 'Sign In To Proceed'}`}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2rem] p-8 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-white font-black shadow-lg shadow-emerald-500/20">
                                        {session.user.name?.[0]?.toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Logged In As</p>
                                        <p className="text-xl font-black text-white">{session.user.name}</p>
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">{session.user.email}</p>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                    <Check size={20} />
                                </div>
                            </div>
                        )}

                        {/* 2. Billing Information */}
                        <div className={`bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 space-y-10 transition-all duration-700 ${!session ? 'opacity-40 grayscale pointer-events-none scale-[0.98]' : ''}`}>
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-black uppercase tracking-tight">Billing Information</h2>
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20">Step 2 of 2</span>
                            </div>

                            <div className="space-y-8">
                                <RadioGroup
                                    defaultValue="SELF"
                                    onValueChange={(val) => setBillingData({ ...billingData, paymentType: val })}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                    <Label
                                        htmlFor="self"
                                        className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all cursor-pointer ${billingData.paymentType === 'SELF' ? 'border-blue-600 bg-blue-600/5' : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <Briefcase className={billingData.paymentType === 'SELF' ? 'text-blue-500' : 'text-slate-500'} />
                                            <div>
                                                <p className="font-black text-xs uppercase tracking-widest">Self Funded</p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight mt-1 truncate max-w-[150px]">Personal enrollment</p>
                                            </div>
                                        </div>
                                        <RadioGroupItem value="SELF" id="self" className="border-slate-700 text-blue-600" />
                                    </Label>

                                    <Label
                                        htmlFor="company"
                                        className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all cursor-pointer ${billingData.paymentType === 'COMPANY' ? 'border-amber-600 bg-amber-600/5' : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <Building2 className={billingData.paymentType === 'COMPANY' ? 'text-amber-500' : 'text-slate-500'} />
                                            <div>
                                                <p className="font-black text-xs uppercase tracking-widest">Company Paid</p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight mt-1 truncate max-w-[150px]">Paid by your organization</p>
                                            </div>
                                        </div>
                                        <RadioGroupItem value="COMPANY" id="company" className="border-slate-700 text-amber-600" />
                                    </Label>
                                </RadioGroup>

                                {billingData.paymentType === 'COMPANY' && (
                                    <div className="space-y-3 pt-4 border-t border-slate-800">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-amber-500">Number of Participants</Label>
                                        <div className="relative">
                                            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <Input
                                                type="number"
                                                min="1"
                                                className="pl-12 h-14 bg-slate-950 border-slate-800 rounded-2xl focus:border-amber-600 transition-all font-bold text-amber-500"
                                                value={billingData.participantsCount}
                                                onChange={e => setBillingData({ ...billingData, participantsCount: Math.max(1, parseInt(e.target.value) || 1) })}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone Number</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <Input
                                                placeholder="e.g. +234 707 057 9947"
                                                className="pl-12 h-14 bg-slate-950 border-slate-800 rounded-2xl focus:border-blue-600 transition-all font-bold"
                                                value={billingData.phone}
                                                onChange={e => setBillingData({ ...billingData, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Billing Email (Optional)</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <Input
                                                type="email"
                                                placeholder="accounts@company.com"
                                                className="pl-12 h-14 bg-slate-950 border-slate-800 rounded-2xl focus:border-blue-600 transition-all font-bold"
                                                value={billingData.billingEmail}
                                                onChange={e => setBillingData({ ...billingData, billingEmail: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3 md:col-span-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Street Address</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <Input
                                                placeholder="123 Academic Street"
                                                className="pl-12 h-14 bg-slate-950 border-slate-800 rounded-2xl focus:border-blue-600 transition-all font-bold"
                                                value={billingData.address}
                                                onChange={e => setBillingData({ ...billingData, address: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3 md:col-span-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">City / State / Country</Label>
                                        <div className="relative">
                                            <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <Input
                                                placeholder="London, UK"
                                                className="pl-12 h-14 bg-slate-950 border-slate-800 rounded-2xl focus:border-blue-600 transition-all font-bold"
                                                value={billingData.city}
                                                onChange={e => setBillingData({ ...billingData, city: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ——— Right: Order Summary (4 cols) ——— */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="lg:sticky lg:top-8 animate-in fade-in slide-in-from-right duration-700">

                            <div className="bg-white rounded-[3rem] p-10 text-slate-950 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />

                                <div className="relative">
                                    <div className="flex gap-4 items-start mb-8 border-b border-slate-100 pb-8">
                                        <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden bg-slate-950 border border-slate-900 shrink-0 shadow-xl">
                                            {course.thumbnail ? (
                                                <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-600">
                                                    <CreditCard size={24} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest">{course.category?.name || 'Academic'}</span>
                                            <h2 className="text-lg font-black leading-tight uppercase tracking-tight">{course.title}</h2>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-10">
                                        <div className="flex justify-between text-xs font-bold uppercase tracking-tight text-slate-400">
                                            <span>Subtotal Access</span>
                                            <span className="text-slate-950 font-black">{currencySymbol}{(Number(course.price) * billingData.participantsCount).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-bold uppercase tracking-tight text-slate-400">
                                            <span>Processing Fee</span>
                                            <span className="text-emerald-600 font-extrabold">Calculated</span>
                                        </div>
                                        <div className="pt-6 border-t border-slate-100 flex justify-between items-baseline">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Amount</span>
                                                <span className="text-xs text-blue-600 font-black">All Taxes Included</span>
                                            </div>
                                            <span className="text-4xl font-black tracking-tighter">{currencySymbol}{(Number(course.price) * billingData.participantsCount).toLocaleString()}</span>
                                        </div>
                                    </div>

                                    {/* Consent & Payment */}
                                    <div className="space-y-6">
                                        <div className="flex gap-3 items-start p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div className="pt-1">
                                                <input
                                                    type="checkbox"
                                                    id="terms"
                                                    className="w-5 h-5 rounded-lg border-2 border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                    checked={acceptedTerms}
                                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                                />
                                            </div>
                                            <Label htmlFor="terms" className="flex-1 text-[10px] font-bold leading-relaxed text-slate-500 cursor-pointer select-none">
                                                I have read and agree to the{' '}
                                                <Link href="/terms-conditions" className="text-blue-600 hover:underline">Terms &amp; Conditions</Link>
                                                {' '}and{' '}
                                                <Link href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                                            </Label>
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select Gateway</Label>
                                            <RadioGroup
                                                value={gateway}
                                                onValueChange={(val: any) => setGateway(val)}
                                                className="grid grid-cols-2 gap-3"
                                            >
                                                <Label
                                                    htmlFor="paystack"
                                                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all cursor-pointer gap-2 ${gateway === 'PAYSTACK' ? 'border-blue-600 bg-blue-600/5' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}
                                                >
                                                    <CreditCard className={gateway === 'PAYSTACK' ? 'text-blue-500' : 'text-slate-400'} size={20} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Paystack</span>
                                                    <RadioGroupItem value="PAYSTACK" id="paystack" className="sr-only" />
                                                </Label>
                                                <Label
                                                    htmlFor="offline"
                                                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all cursor-pointer gap-2 ${gateway === 'OFFLINE' ? 'border-amber-600 bg-amber-600/5' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}
                                                >
                                                    <Building2 className={gateway === 'OFFLINE' ? 'text-amber-500' : 'text-slate-400'} size={20} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Offline</span>
                                                    <RadioGroupItem value="OFFLINE" id="offline" className="sr-only" />
                                                </Label>
                                            </RadioGroup>
                                        </div>

                                        <Button
                                            disabled={!session || verifying || !acceptedTerms}
                                            onClick={() => gateway === 'PAYSTACK' ? initializePayment({ onSuccess: onSuccess as any, onClose }) : handleOfflinePayment()}
                                            className="w-full bg-slate-950 hover:bg-slate-900 text-white rounded-[1.5rem] h-20 text-xs font-black uppercase tracking-widest shadow-2xl shadow-slate-950/40 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
                                        >
                                            {verifying ? (
                                                <div className="flex items-center gap-3">
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    {gateway === 'OFFLINE' ? 'Processing Request...' : 'Finalizing Enrollment...'}
                                                </div>
                                            ) : !session ? (
                                                'Complete Profile First'
                                            ) : !acceptedTerms ? (
                                                'Accept Terms to Proceed'
                                            ) : gateway === 'OFFLINE' ? (
                                                `SUBMIT OFFLINE ORDER`
                                            ) : (
                                                `PAY ${currencySymbol}{(Number(course.price) * billingData.participantsCount).toLocaleString()} NOW`
                                            )}
                                        </Button>

                                        <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-tight px-6 opacity-70">
                                            By proceeding, you agree to our{' '}
                                            <Link href="/terms-conditions" className="text-blue-500 hover:underline">Terms &amp; Conditions</Link>
                                            {' '}and{' '}
                                            <Link href="/privacy-policy" className="text-blue-500 hover:underline">Privacy Policy</Link>.
                                        </p>
                                    </div>

                                    <div className="mt-12 flex flex-col items-center gap-6">
                                        <div className="flex items-center gap-3 bg-slate-50 px-8 py-3 rounded-full border border-slate-100">
                                            <img src="/paystack-wc.png" className="h-10" alt="Secure Paystack Interface" />
                                        </div>
                                        <div className="flex items-center gap-8 grayscale opacity-40">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg" className="h-4" alt="Visa" />
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {!acceptedTerms && session && (
                                <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3 animate-pulse">
                                    <AlertCircle className="text-amber-500 w-5 h-5 shrink-0" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">Please accept the terms to complete payment</p>
                                </div>
                            )}

                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="p-5 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
                                    <div className="w-8 h-8 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 mb-4 border border-blue-500/20">
                                        <CheckCircle2 size={16} />
                                    </div>
                                    <p className="text-[10px] font-black text-white uppercase tracking-wider">LIFETIME ACCESS</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight mt-1">Full Certification</p>
                                </div>
                                <div className="p-5 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
                                    <div className="w-8 h-8 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 mb-4 border border-amber-500/20">
                                        <CheckCircle2 size={16} />
                                    </div>
                                    <p className="text-[10px] font-black text-white uppercase tracking-wider">VERIFIED CREDENTIAL</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight mt-1">ISO Recognized</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
