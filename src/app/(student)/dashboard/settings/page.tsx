'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
    User,
    Lock,
    Bell,
    Shield,
    Save,
    Loader2,
    Eye,
    EyeOff,
    CheckCircle2,
    Settings,
    ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function StudentSettingsPage() {
    const { data: session, update } = useSession();
    const [activeTab, setActiveTab] = useState('PROFILE');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Profile State
    const [profile, setProfile] = useState({
        name: '',
        email: '',
    });

    // Password State
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: '',
    });

    useEffect(() => {
        if (session?.user) {
            setProfile({
                name: session.user.name || '',
                email: session.user.email || '',
            });
        }
    }, [session]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile),
            });

            if (res.ok) {
                await update({ name: profile.name });
                toast.success('Institutional profile updated successfully');
            } else {
                const data = await res.json();
                toast.error(data.message || 'Failed to update profile');
            }
        } catch (err) {
            toast.error('Network error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            return toast.error('New passwords do not match');
        }

        setLoading(true);
        try {
            const res = await fetch('/api/user/password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwords.current,
                    newPassword: passwords.new,
                }),
            });

            if (res.ok) {
                setPasswords({ current: '', new: '', confirm: '' });
                toast.success('Security credentials updated');
            } else {
                const data = await res.json();
                toast.error(data.message || 'Failed to update password');
            }
        } catch (err) {
            toast.error('Network error occurred');
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'PROFILE', label: 'Identity', icon: User },
        { id: 'SECURITY', label: 'Security', icon: Shield },
        { id: 'NOTIFICATIONS', label: 'Alerts', icon: Bell },
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">Settings & Identity</h1>
                <p className="text-slate-500 font-bold italic opacity-80 text-sm mt-1">Manage your professional credentials and platform preferences.</p>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-4 gap-8">
                {/* Tabs */}
                <div className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scroll-smooth no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-shrink-0 lg:w-full flex items-center justify-between gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${activeTab === tab.id
                                ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30'
                                : 'text-slate-600 hover:text-slate-300 hover:bg-slate-900 border border-transparent hover:border-slate-800'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <tab.icon size={16} />
                                <span className="whitespace-nowrap">{tab.label}</span>
                            </div>
                            <CheckCircle2 size={12} className={activeTab === tab.id ? 'opacity-60' : 'opacity-0'} />
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                        {/* Profile Identity */}
                        {activeTab === 'PROFILE' && (
                            <form onSubmit={handleUpdateProfile} className="space-y-8 animate-in slide-in-from-right duration-500">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 bg-blue-600/10 border border-blue-600/20 rounded-2xl flex items-center justify-center text-blue-500 shadow-inner">
                                            <User size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black text-white uppercase italic tracking-tight leading-tight">Institutional Profile</h2>
                                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest opacity-80 mt-1">Global identification across the ecosystem</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.25em] px-1">Full Name</Label>
                                            <Input
                                                value={profile.name}
                                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                                className="bg-slate-950 border-slate-800 h-14 rounded-2xl focus:ring-blue-600 focus:border-blue-600 transition-all font-bold text-white shadow-inner italic"
                                                placeholder="e.g. John Doe"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.25em] px-1">Email Address</Label>
                                            <Input
                                                value={profile.email}
                                                disabled
                                                className="bg-slate-900 border-slate-800/50 h-14 rounded-2xl font-bold text-slate-500 shadow-inner italic cursor-not-allowed"
                                                placeholder="e.g. john@example.com"
                                            />
                                            <p className="text-[9px] text-slate-600 font-bold italic px-1">Institutional emails cannot be modified autonomously.</p>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl px-10 h-14 font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 active:scale-95 transition-all text-xs"
                                >
                                    {loading ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} className="mr-2" /> Commit Changes</>}
                                </Button>
                            </form>
                        )}

                        {/* Security */}
                        {activeTab === 'SECURITY' && (
                            <form onSubmit={handleUpdatePassword} className="space-y-8 animate-in slide-in-from-right duration-500">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 bg-rose-600/10 border border-rose-600/20 rounded-2xl flex items-center justify-center text-rose-500 shadow-inner">
                                            <Shield size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black text-white uppercase italic tracking-tight leading-tight">Access Control</h2>
                                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest opacity-80 mt-1">Management of cryptographic authentication</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6 max-w-xl">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.25em] px-1">Current Password</Label>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={passwords.current}
                                                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                                    className="bg-slate-950 border-slate-800 h-14 rounded-2xl focus:ring-blue-600 focus:border-blue-600 transition-all font-bold text-white shadow-inner italic pr-12"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.25em] px-1">New Password</Label>
                                                <Input
                                                    type="password"
                                                    value={passwords.new}
                                                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                                    className="bg-slate-950 border-slate-800 h-14 rounded-2xl focus:ring-blue-600 focus:border-blue-600 transition-all font-bold text-white shadow-inner italic"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.25em] px-1">Confirm Identity</Label>
                                                <Input
                                                    type="password"
                                                    value={passwords.confirm}
                                                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                                    className="bg-slate-950 border-slate-800 h-14 rounded-2xl focus:ring-blue-600 focus:border-blue-600 transition-all font-bold text-white shadow-inner italic"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-white text-slate-950 hover:bg-slate-100 rounded-2xl px-10 h-14 font-black uppercase tracking-widest shadow-xl shadow-white/10 active:scale-95 transition-all text-xs"
                                >
                                    {loading ? <Loader2 size={18} className="animate-spin" /> : <><Lock size={18} className="mr-2" /> Revise Access Codes</>}
                                </Button>
                            </form>
                        )}

                        {activeTab === 'NOTIFICATIONS' && (
                            <div className="space-y-8 animate-in slide-in-from-right duration-500">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 bg-amber-600/10 border border-amber-600/20 rounded-2xl flex items-center justify-center text-amber-500 shadow-inner">
                                            <Bell size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black text-white uppercase italic tracking-tight leading-tight">Alert Preferences</h2>
                                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest opacity-80 mt-1">Management of real-time event triggers</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {[
                                            { title: 'Payment Confirmations', desc: 'Secure alerts for all institutional transactions.', enabled: true },
                                            { title: 'New Course Enrollment', desc: 'Automatic notification upon access grant.', enabled: true },
                                            { title: 'Academic Messages', desc: 'Communications from authorized curators.', enabled: false },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between p-6 bg-slate-950 rounded-3xl border border-slate-800 group hover:border-slate-700 transition-all">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-black text-white uppercase italic">{item.title}</p>
                                                    <p className="text-[10px] text-slate-600 font-bold italic">{item.desc}</p>
                                                </div>
                                                <div className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-all duration-300 ${item.enabled ? 'bg-blue-600' : 'bg-slate-800'}`}>
                                                    <div className={`w-6 h-6 rounded-full bg-white shadow-lg transition-transform duration-300 ${item.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-blue-600/5 border border-blue-600/10 rounded-[2.5rem] p-8 flex items-start gap-5 shadow-inner">
                        <div className="w-12 h-12 bg-blue-600/20 border border-blue-600/30 rounded-2xl flex items-center justify-center shrink-0">
                            <ShieldCheck className="text-blue-500" size={24} />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-white uppercase tracking-tight italic mb-1">Institutional Ledger Integrity</h4>
                            <p className="text-slate-500 text-[10px] leading-relaxed font-bold italic opacity-80 max-w-2xl">
                                Changes to your identity markers or authentication credentials are logged for auditing. We recommend rotating your access codes quarterly to maintain maximum vault security.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
