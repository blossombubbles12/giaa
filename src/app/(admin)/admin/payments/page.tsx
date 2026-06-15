'use client';

import { useState, useEffect } from 'react';
import {
    CreditCard,
    Search,
    Loader2,
    CheckCircle2,
    XCircle,
    Clock,
    ExternalLink,
    User,
    BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

type Payment = {
    id: string;
    amount: number;
    status: 'PENDING' | 'SUCCESS' | 'FAILED';
    transactionId: string | null;
    createdAt: string;
    user: {
        name: string | null;
        email: string;
    };
    course: {
        title: string;
    };
};

export default function AdminPaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [currencySymbol, setCurrencySymbol] = useState('£');

    const fetchPayments = async () => {
        try {
            const [payRes, setRes] = await Promise.all([
                fetch('/api/admin/payments'),
                fetch('/api/settings/localization')
            ]);

            if (payRes.ok) {
                const data = await payRes.json();
                setPayments(data);
            }

            if (setRes.ok) {
                const data = await setRes.json();
                setCurrencySymbol(data.currencySymbol);
            }
        } catch (err) {
            toast.error('Failed to load financial data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const filteredPayments = payments.filter(p =>
        p.user.email.toLowerCase().includes(search.toLowerCase()) ||
        p.user.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.course.title.toLowerCase().includes(search.toLowerCase()) ||
        p.transactionId?.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'SUCCESS': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
            case 'FAILED': return <XCircle className="w-4 h-4 text-rose-500" />;
            default: return <Clock className="w-4 h-4 text-amber-500" />;
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'SUCCESS': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'FAILED': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            default: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Financial Transactions</h1>
                    <p className="text-slate-400 text-sm mt-1">Review and manage all course payments and revenue.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2 flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Total Revenue</span>
                        <span className="text-lg font-black text-white">
                            {currencySymbol}{payments.reduce((acc, p) => p.status === 'SUCCESS' ? acc + p.amount : acc, 0).toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-slate-800 bg-slate-800/10 flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative flex-1 w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <Input
                            placeholder="Find by user, email, course, or transaction ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-12 bg-slate-950 border-slate-800 text-sm h-12 rounded-2xl focus:ring-blue-600 focus:border-blue-600 shadow-inner"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-32 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">Syncing transactions...</p>
                    </div>
                ) : filteredPayments.length === 0 ? (
                    <div className="p-32 text-center space-y-4">
                        <div className="w-20 h-20 bg-slate-800/50 rounded-3xl flex items-center justify-center mx-auto border border-slate-700 shadow-inner">
                            <CreditCard className="text-slate-600" size={32} />
                        </div>
                        <h3 className="text-white font-bold text-lg uppercase tracking-tight">No transactions found</h3>
                        <p className="text-slate-500 text-sm italic max-w-xs mx-auto opacity-70">
                            When students enroll in courses using Paystack, their transactions will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-800/20">
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Customer & Course</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Transaction ID</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Amount</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredPayments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-slate-800/30 transition-all group">
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 shrink-0 border border-slate-700 shadow-sm group-hover:bg-blue-600/10 group-hover:text-blue-500 transition-colors">
                                                    <User size={18} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-white font-bold text-sm tracking-tight truncate">
                                                        {payment.user.name || 'Anonymous User'}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <BookOpen size={10} className="text-blue-500" />
                                                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider truncate">
                                                            {payment.course.title}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 font-mono text-[10px] text-slate-500 tracking-tighter">
                                            {payment.transactionId ? (
                                                <div className="flex items-center gap-2 group/id cursor-pointer">
                                                    <span className="group-hover/id:text-slate-300 transition-colors">{payment.transactionId}</span>
                                                    <ExternalLink size={10} className="opacity-0 group-hover/id:opacity-100 transition-opacity" />
                                                </div>
                                            ) : (
                                                <span className="italic opacity-30">N/A</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-6">
                                            <p className="text-white font-black text-sm">{currencySymbol}{Number(payment.amount).toLocaleString()}</p>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusStyles(payment.status)}`}>
                                                {getStatusIcon(payment.status)}
                                                {payment.status}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-tight">
                                                {new Date(payment.createdAt).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                            <p className="text-slate-600 text-[9px] font-medium uppercase mt-0.5 tracking-tighter italic">
                                                {new Date(payment.createdAt).toLocaleTimeString(undefined, {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
