'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, ArrowLeft, Mail, User, Shield, GraduationCap, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface UserFormProps {
    initialData?: any;
}

export default function UserForm({ initialData }: UserFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        email: initialData?.email || '',
        password: '', // Password always blank for new/edit (should handle securely)
        role: initialData?.role || 'STUDENT',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const isEdit = !!initialData?.id;
            const res = await fetch('/api/admin/users', {
                method: isEdit ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    id: initialData?.id
                }),
            });

            if (res.ok) {
                toast.success(isEdit ? 'Account updated successfully' : 'Account created successfully');
                router.push('/admin/users');
                router.refresh();
            } else {
                const data = await res.json();
                toast.error(data.error || `Failed to ${isEdit ? 'update' : 'create'} user`);
            }
        } catch (err) {
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Form Header */}
            <div className="flex items-center justify-between sticky top-0 bg-slate-950/80 backdrop-blur-md z-30 py-4 -mx-4 px-4 rounded-b-3xl border-b border-slate-800">
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="w-10 h-10 rounded-xl border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-xl font-black text-white uppercase tracking-tight">{initialData ? 'Edit Account' : 'Create Account'}</h1>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{initialData ? 'Modify platform access' : 'Provision new platform credentials'}</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => router.back()}
                        className="rounded-xl text-slate-400 hover:text-white px-6 hidden sm:flex"
                    >
                        Discard
                    </Button>
                    <Button
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl h-11 px-8 font-black uppercase tracking-widest text-xs gap-2 shadow-lg shadow-blue-600/20"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {initialData ? 'Save Changes' : 'Commit Access'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Main Identity Information */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 space-y-10">
                        <div className="space-y-4">
                            <h3 className="text-white font-black uppercase tracking-tighter text-lg border-b border-slate-800 pb-4">Personal Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                                        <User size={12} className="text-blue-500" />
                                        Full Name
                                    </label>
                                    <Input
                                        placeholder="e.g. John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="bg-slate-950 border-slate-800 h-14 rounded-2xl px-6 focus:ring-blue-600 transition-all font-medium text-white shadow-inner"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                                        <Mail size={12} className="text-blue-500" />
                                        Email Address
                                    </label>
                                    <Input
                                        type="email"
                                        required
                                        placeholder="user@giaadvisory.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="bg-slate-950 border-slate-800 h-14 rounded-2xl px-6 focus:ring-blue-600 transition-all font-medium text-white shadow-inner"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-white font-black uppercase tracking-tighter text-lg border-b border-slate-800 pb-4">Security Access</h3>
                            <div className="pt-4">
                                <div className="space-y-2 max-w-md">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                                        <Lock size={12} className="text-amber-500" />
                                        Access Password
                                    </label>
                                    <Input
                                        type="password"
                                        required={!initialData}
                                        placeholder={initialData ? "Leave blank to keep current" : "Generate a robust password"}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="bg-slate-950 border-slate-800 h-14 rounded-2xl px-6 focus:ring-blue-600 transition-all font-medium text-white shadow-inner"
                                    />
                                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-2 pl-1 leading-relaxed">
                                        Ensure the password is secure and follows corporate standards.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Permissions Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 space-y-6 shadow-xl">
                        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                            <Shield size={18} className="text-blue-500" />
                            <h3 className="text-white font-black uppercase tracking-tight text-sm">Permissions</h3>
                        </div>

                        <div className="space-y-4 pt-2">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Authority Level</label>
                                <div className="grid grid-cols-1 gap-3">
                                    {[
                                        { id: 'STUDENT', label: 'Student Access', desc: 'Standard platform use', icon: GraduationCap, color: 'text-blue-400' },
                                        { id: 'ADMIN', label: 'Administrative', desc: 'Full authority control', icon: Shield, color: 'text-rose-400' }
                                    ].map((role) => (
                                        <button
                                            key={role.id}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: role.id })}
                                            className={`flex items-start gap-4 p-5 rounded-[2rem] border transition-all text-left group ${formData.role === role.id
                                                ? 'bg-blue-600/10 border-blue-600/50 shadow-lg shadow-blue-600/5'
                                                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                                                }`}
                                        >
                                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${formData.role === role.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-900 text-slate-500'}`}>
                                                <role.icon size={20} />
                                            </div>
                                            <div className="space-y-1 pt-0.5">
                                                <p className={`text-[10px] font-black uppercase tracking-widest ${formData.role === role.id ? 'text-white' : 'text-slate-400'}`}>{role.label}</p>
                                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight opacity-70 group-hover:opacity-100 transition-opacity">{role.desc}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800/20 rounded-2xl p-4 border border-slate-800 mt-6">
                            <div className="flex items-center gap-3 text-amber-500 mb-2">
                                <Shield size={14} className="animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-widest leading-none">Global Impact</span>
                            </div>
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight leading-relaxed">
                                Administrative accounts can modify critical system configurations and access encrypted student data.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
