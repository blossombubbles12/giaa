export const dynamic = 'force-dynamic';

import { db } from '@/db';
import { users } from '@/db/schema';
import { desc } from 'drizzle-orm';
import {
    Users,
    Mail,
    Shield,
    GraduationCap,
    Search,
    Calendar,
    ArrowUpRight,
    UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { UserActions } from '@/components/admin/user-actions';

export default async function UsersPage() {
    const allUsers = await db.query.users.findMany({
        orderBy: [desc(users.createdAt)],
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Platform Accounts</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage student credentials and administrative access levels.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2 items-center gap-3 h-12">
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest leading-none">Total Active</span>
                        <span className="text-xl font-black text-white leading-none">{allUsers.length}</span>
                    </div>

                    <Link href="/admin/users/new">
                        <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl h-12 px-6 font-black uppercase tracking-widest text-xs gap-3 shadow-lg shadow-blue-600/20 group">
                            <UserPlus size={16} className="group-hover:scale-110 transition-transform" />
                            Provision Account
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-slate-800 bg-slate-800/10 flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative flex-1 w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <Input
                            placeholder="Find accounts by name, email, or role..."
                            className="pl-12 bg-slate-950 border-slate-800 h-12 rounded-2xl focus:ring-blue-600 focus:border-blue-600 shadow-inner"
                        />
                    </div>
                </div>

                {allUsers.length === 0 ? (
                    <div className="p-32 text-center space-y-4">
                        <div className="w-20 h-20 bg-slate-800/50 rounded-3xl flex items-center justify-center mx-auto border border-slate-700 shadow-inner">
                            <Users className="text-slate-600" size={32} />
                        </div>
                        <h3 className="text-white font-bold text-lg uppercase tracking-tight">No accounts registered</h3>
                        <p className="text-slate-500 text-sm max-w-xs mx-auto opacity-70">New registrations will appear here automatically.</p>
                    </div>
                ) : (
                    <>
                        {/* Mobile View - Cards */}
                        <div className="grid grid-cols-1 divide-y divide-slate-800 lg:hidden">
                            {allUsers.map((user) => (
                                <div key={user.id} className="p-6 space-y-4 hover:bg-slate-800/20 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-base font-black shadow-lg shadow-blue-600/20 shrink-0">
                                            {user.name?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-white font-black text-sm tracking-tight truncate uppercase">
                                                {user.name ?? 'Unverified User'}
                                            </p>
                                            <div className="flex items-center gap-2 mt-0.5 text-slate-500 text-[10px] font-bold uppercase tracking-widest truncate">
                                                <Mail size={10} className="text-slate-600" />
                                                {user.email}
                                            </div>
                                        </div>
                                        <UserActions user={user} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${user.role === 'ADMIN'
                                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                            }`}>
                                            {user.role === 'ADMIN' ? <Shield size={12} /> : <GraduationCap size={12} />}
                                            {user.role}
                                        </span>
                                        <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-tight">
                                            <Calendar size={12} className="opacity-40" />
                                            {new Date(user.createdAt).toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop View - Table */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-800 bg-slate-800/20">
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Profile Identity</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Access Level</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Registration Date</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {allUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-800/30 transition-all group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-base font-black shadow-lg shadow-blue-600/20 shrink-0 transform group-hover:scale-105 transition-transform">
                                                        {user.name?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-white font-black text-sm tracking-tight truncate group-hover:text-blue-500 transition-colors uppercase">
                                                            {user.name ?? 'Unverified User'}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-0.5 text-slate-500 text-[10px] font-bold uppercase tracking-widest truncate">
                                                            <Mail size={10} className="text-slate-600" />
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${user.role === 'ADMIN'
                                                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
                                                    : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                    }`}>
                                                    {user.role === 'ADMIN' ? <Shield size={12} /> : <GraduationCap size={12} />}
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-tight">
                                                    <Calendar size={12} className="opacity-40" />
                                                    {new Date(user.createdAt).toLocaleDateString('en-GB', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 text-right">
                                                <UserActions user={user} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 shadow-inner border border-blue-600/20">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-white font-bold text-sm tracking-tight uppercase">Security & Oversight</p>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">Account modifications are tracked for security purposes.</p>
                    </div>
                </div>
                <Button variant="outline" className="border-slate-800 text-slate-400 hover:text-white rounded-xl h-11 px-6 text-[10px] font-black uppercase tracking-widest gap-2 group transition-all">
                    Export User Data
                    <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Button>
            </div>
        </div>
    );
}
