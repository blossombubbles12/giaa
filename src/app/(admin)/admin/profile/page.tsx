'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Lock,
    Shield,
    Mail,
    Save,
    RefreshCcw,
    Eye,
    EyeOff,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import axios from 'axios';

export default function AdminProfilePage() {
    const { data: session, update } = useSession();
    const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
    const [isLoading, setIsLoading] = useState(false);
    const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

    const [profileData, setProfileData] = useState({
        name: '',
        email: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (session?.user) {
            setProfileData({
                name: session.user.name || '',
                email: session.user.email || ''
            });
        }
    }, [session]);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.patch('/api/admin/profile', profileData);
            toast.success(response.data.message);
            // Update session client-side
            await update({
                ...session,
                user: {
                    ...session?.user,
                    name: profileData.name,
                    email: profileData.email
                }
            });
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.patch('/api/admin/profile/password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            toast.success(response.data.message);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to update password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-white italic">Institutional Vault : Profile</h1>
                <p className="text-slate-400">Manage your administrative credentials and security layer.</p>
            </div>

            <div className="flex space-x-1 sm:space-x-2 p-1 bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-xl w-full sm:w-fit">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex-1 sm:flex-none flex items-center justify-center sm:justify-start space-x-2 px-4 sm:px-6 py-2.5 rounded-lg transition-all duration-300 text-xs sm:text-sm ${activeTab === 'profile' ? 'bg-white text-black font-bold shadow-lg scale-[1.02]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                >
                    <User size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span>General</span>
                </button>
                <button
                    onClick={() => setActiveTab('security')}
                    className={`flex-1 sm:flex-none flex items-center justify-center sm:justify-start space-x-2 px-4 sm:px-6 py-2.5 rounded-lg transition-all duration-300 text-xs sm:text-sm ${activeTab === 'security' ? 'bg-white text-black font-bold shadow-lg scale-[1.02]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                >
                    <Lock size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span>Security</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Stats / Status Card */}
                <div className="space-y-6">
                    <Card className="bg-slate-900/40 border-white/5 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="text-lg text-white font-semibold">Account Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400 text-sm">Privilege</span>
                                <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded text-xs font-bold uppercase tracking-widest">{session?.user?.role}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400 text-sm">Verified</span>
                                <CheckCircle2 size={16} className="text-emerald-500" />
                            </div>
                            <div className="pt-4 border-t border-white/5">
                                <div className="flex items-center space-x-3 text-slate-300">
                                    <Shield size={20} className="text-white/40" />
                                    <span className="text-xs uppercase tracking-tighter opacity-50 italic">Full Access Vault Enabled</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/40 border-white/5 backdrop-blur-xl">
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex items-center space-x-4 opacity-50">
                                <AlertCircle size={20} className="text-amber-500" />
                                <p className="text-xs text-slate-300 italic leading-relaxed">
                                    Changing your email will require a system log-out and re-authentication to ensure session integrity.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Forms */}
                <div className="md:col-span-2">
                    <AnimatePresence mode="wait">
                        {activeTab === 'profile' ? (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                            >
                                <Card className="bg-slate-900/40 border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden relative group">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <User size={120} />
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="text-xl text-white italic">General Information</CardTitle>
                                        <CardDescription>Update your public identity within the institution.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleProfileUpdate} className="space-y-6">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label className="text-slate-200">Legal Full Name</Label>
                                                    <div className="relative">
                                                        <User className="absolute left-3 top-3 text-slate-500" size={18} />
                                                        <Input
                                                            value={profileData.name}
                                                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                            className="bg-slate-950/50 border-white/10 pl-10 h-12 text-white focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-inner"
                                                            placeholder="John Doe"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-slate-200">Institutional Email Address</Label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-3 text-slate-500" size={18} />
                                                        <Input
                                                            type="email"
                                                            value={profileData.email}
                                                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                            className="bg-slate-950/50 border-white/10 pl-10 h-12 text-white italic focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-inner"
                                                            placeholder="admin@giaadvisory.com"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <Button
                                                disabled={isLoading}
                                                className="w-full h-12 bg-white hover:bg-slate-200 text-black font-bold uppercase tracking-widest text-xs transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                                            >
                                                {isLoading ? <RefreshCcw className="animate-spin mr-2" size={16} /> : <Save className="mr-2" size={16} />}
                                                Sync Vault Profile
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="security"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                            >
                                <Card className="bg-slate-900/40 border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden relative group">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Lock size={120} />
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="text-xl text-white italic">Security Layer</CardTitle>
                                        <CardDescription>Rotate your cryptographic interrogation password.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handlePasswordUpdate} className="space-y-6">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label className="text-slate-200">Current Vault Key</Label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-3 top-3 text-slate-500" size={18} />
                                                        <Input
                                                            type={showPasswords.current ? "text" : "password"}
                                                            value={passwordData.currentPassword}
                                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                            className="bg-slate-950/50 border-white/10 pl-10 pr-10 h-12 text-white focus:ring-indigo-500 focus:border-indigo-500"
                                                            placeholder="••••••••"
                                                            required
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                                            className="absolute right-3 top-3.5 text-slate-500 hover:text-white transition-colors"
                                                        >
                                                            {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="space-y-2 pt-2">
                                                    <Label className="text-slate-200">New Vault Key</Label>
                                                    <div className="relative">
                                                        <Shield className="absolute left-3 top-3 text-slate-500" size={18} />
                                                        <Input
                                                            type={showPasswords.new ? "text" : "password"}
                                                            value={passwordData.newPassword}
                                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                            className="bg-slate-950/50 border-white/10 pl-10 pr-10 h-12 text-white focus:ring-indigo-500 focus:border-indigo-500 shadow-inner"
                                                            placeholder="New Secure Password"
                                                            required
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                                            className="absolute right-3 top-3.5 text-slate-500 hover:text-white transition-colors"
                                                        >
                                                            {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="space-y-2 text-sm italic opacity-40 leading-none">
                                                    <p>Password must be at least 6 characters with a mix of protocols.</p>
                                                </div>

                                                <div className="space-y-2 pt-2">
                                                    <Label className="text-slate-200">Confirm Vault Key</Label>
                                                    <div className="relative">
                                                        <RefreshCcw className="absolute left-3 top-3 text-slate-500" size={18} />
                                                        <Input
                                                            type={showPasswords.confirm ? "text" : "password"}
                                                            value={passwordData.confirmPassword}
                                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                            className="bg-slate-950/50 border-white/10 pl-10 pr-10 h-12 text-white focus:ring-indigo-500 focus:border-indigo-500 shadow-inner"
                                                            placeholder="Repeat New Password"
                                                            required
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                                            className="absolute right-3 top-3.5 text-slate-500 hover:text-white transition-colors"
                                                        >
                                                            {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <Button
                                                disabled={isLoading}
                                                className="w-full h-12 bg-white border-2 border-transparent hover:bg-black hover:text-white hover:border-white text-black font-bold uppercase tracking-widest text-xs transition-all active:scale-[0.98] shadow-lg"
                                            >
                                                {isLoading ? <RefreshCcw className="animate-spin mr-2" size={16} /> : <RefreshCcw className="mr-2" size={16} />}
                                                Rotate Security Key
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
