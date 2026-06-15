'use client';

import { useState, useEffect } from 'react';
import {
    Settings,
    Save,
    Shield,
    Bell,
    Globe,
    Lock,
    Palette,
    HelpCircle,
    Loader2,
    CheckCircle2,
    Eye,
    EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type Setting = {
    group: string;
    key: string;
    value: string;
};

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState('GENERAL');
    const [settings, setSettings] = useState<Setting[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showSecret, setShowSecret] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings');
            if (res.ok) {
                const data = await res.json();
                setSettings(data);
            }
        } catch (err) {
            toast.error('Failed to load system settings');
        } finally {
            setLoading(false);
        }
    };

    const getVal = (key: string, fallback: string = "") => {
        return settings.find(s => s.key === key)?.value || fallback;
    };

    const updateSetting = async (group: string, key: string, value: string) => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ group, key, value }),
            });
            if (res.ok) {
                // Update local state
                setSettings(prev => {
                    const exists = prev.find(s => s.key === key);
                    if (exists) {
                        return prev.map(s => s.key === key ? { ...s, value } : s);
                    }
                    return [...prev, { group, key, value }];
                });
                toast.success(`${key.replace(/_/g, ' ')} updated`);
            } else {
                toast.error('Failed to update setting');
            }
        } catch (err) {
            toast.error('Network error occurred');
        } finally {
            setSaving(false);
        }
    };

    const renderHeader = (title: string, desc: string, icon: any) => (
        <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-600/20 text-blue-500 shadow-inner">
                    {icon}
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight italic">{title}</h2>
            </div>
            <p className="text-slate-500 text-sm font-medium italic opacity-80">{desc}</p>
        </div>
    );

    const renderInput = (group: string, label: string, key: string, placeholder: string = "", type: string = "text") => (
        <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] px-1">{label}</Label>
            <div className="flex gap-2">
                <Input
                    type={type === 'password' && showSecret ? 'text' : type}
                    placeholder={placeholder}
                    value={getVal(key)}
                    onChange={(e) => {
                        const val = e.target.value;
                        setSettings(prev => {
                            const exists = prev.find(s => s.key === key);
                            if (exists) return prev.map(s => s.key === key ? { ...s, value: val } : s);
                            return [...prev, { group, key, value: val }];
                        });
                    }}
                    className="bg-slate-950 border-slate-800 h-14 rounded-2xl focus:ring-blue-600 focus:border-blue-600 transition-all font-bold text-white shadow-inner"
                />
                <Button
                    onClick={() => updateSetting(group, key, getVal(key))}
                    disabled={saving}
                    className="h-14 w-14 rounded-2xl bg-slate-950 border border-slate-800 hover:bg-blue-600 hover:text-white transition-all shrink-0 p-0"
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                </Button>
            </div>
        </div>
    );

    const renderSelect = (group: string, label: string, key: string, options: { value: string, label: string }[]) => (
        <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] px-1">{label}</Label>
            <div className="flex gap-2">
                <select
                    value={getVal(key)}
                    onChange={(e) => {
                        const val = e.target.value;
                        setSettings(prev => {
                            const exists = prev.find(s => s.key === key);
                            if (exists) return prev.map(s => s.key === key ? { ...s, value: val } : s);
                            return [...prev, { group, key, value: val }];
                        });
                    }}
                    className="flex-1 bg-slate-950 border-slate-800 h-14 rounded-2xl focus:ring-blue-600 focus:border-blue-600 transition-all font-bold text-white px-4 appearance-none shadow-inner"
                >
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value} className="bg-slate-900">{opt.label}</option>
                    ))}
                </select>
                <Button
                    onClick={() => updateSetting(group, key, getVal(key))}
                    disabled={saving}
                    className="h-14 w-14 rounded-2xl bg-slate-950 border border-slate-800 hover:bg-blue-600 hover:text-white transition-all shrink-0 p-0"
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                </Button>
            </div>
        </div>
    );

    const tabs = [
        { id: 'GENERAL', label: 'General', icon: Settings },
        { id: 'SECURITY', label: 'Security', icon: Shield },
        { id: 'NOTIFICATIONS', label: 'Notifications', icon: Bell },
        { id: 'LOCALIZATION', label: 'Localization', icon: Globe },
        { id: 'INTEGRATION', label: 'Integration', icon: Lock },
        { id: 'BRANDING', label: 'Branding', icon: Palette },
    ];

    if (loading) {
        return (
            <div className="p-32 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] animate-pulse">Initializing System Prefs...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-white uppercase tracking-tight italic">Platform Orchestration</h1>
                <p className="text-slate-400 text-sm mt-1">Global overrides and structural configuration for the GIA Ecosystem.</p>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-4 gap-8">
                {/* Responsive Tabs */}
                <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-2 lg:space-y-1 no-scrollbar scroll-smooth snap-x">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-shrink-0 lg:w-full flex items-center justify-between gap-3 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 snap-start ${activeTab === tab.id
                                ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30 lg:-translate-x-1'
                                : 'text-slate-600 hover:text-slate-300 hover:bg-slate-900 border border-transparent hover:border-slate-800'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <tab.icon size={16} />
                                <span className="whitespace-nowrap">{tab.label}</span>
                            </div>
                            <CheckCircle2 size={12} className={cn("hidden lg:block opacity-60", activeTab === tab.id ? "opacity-60" : "opacity-0")} />
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                        {/* Background subtle glow */}
                        <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-600/5 blur-[120px] rounded-full" />

                        {activeTab === 'GENERAL' && (
                            <div className="space-y-8 animate-in slide-in-from-right duration-500">
                                {renderHeader('General Settings', 'Core application identification and support parameters.', <Settings size={20} />)}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {renderInput('GENERAL', 'Platform Name', 'APP_NAME', 'GIA Advisory')}
                                    {renderInput('GENERAL', 'Support Email', 'SUPPORT_EMAIL', 'support@giaadvisory.com')}
                                </div>
                                {renderInput('GENERAL', 'Welcome Message', 'WELCOME_MSG', 'Ready to advance your career?')}
                            </div>
                        )}

                        {activeTab === 'SECURITY' && (
                            <div className="space-y-8 animate-in slide-in-from-right duration-500">
                                {renderHeader('System Security', 'Authentication policies and global access controls.', <Shield size={20} />)}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {renderInput('SECURITY', 'Maintenance Mode (ON/OFF)', 'MAINTENANCE_MODE', 'OFF')}
                                    {renderInput('SECURITY', 'User Registration (YES/NO)', 'REG_ENABLED', 'YES')}
                                </div>
                                {renderInput('SECURITY', 'Admin IP Whitelist', 'ADMIN_IP_RESTRICT', '0.0.0.0 (Global)')}
                            </div>
                        )}

                        {activeTab === 'NOTIFICATIONS' && (
                            <div className="space-y-8 animate-in slide-in-from-right duration-500">
                                {renderHeader('Alert & Notify', 'Automated email and platform notification triggers.', <Bell size={20} />)}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {renderInput('NOTIFICATIONS', 'Email on Payment', 'NOTIFY_PAYMENT', 'ENABLED')}
                                    {renderInput('NOTIFICATIONS', 'Email on Enrollment', 'NOTIFY_ENROLL', 'ENABLED')}
                                </div>
                                {renderInput('NOTIFICATIONS', 'Admin Digest Frequency', 'ADMIN_DIGEST', 'Daily')}
                            </div>
                        )}

                        {activeTab === 'LOCALIZATION' && (
                            <div className="space-y-8 animate-in slide-in-from-right duration-500">
                                {renderHeader('Global Localization', 'Region-specific formatting and currency display.', <Globe size={20} />)}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {renderSelect('LOCALIZATION', 'Base Currency', 'CURRENCY_CODE', [
                                        { value: 'USD', label: 'USD ($)' },
                                        { value: 'GBP', label: 'GBP (£)' },
                                        { value: 'NGN', label: 'NGN (₦)' },
                                        { value: 'GHS', label: 'GHS (₵)' },
                                        { value: 'XOF', label: 'XOF (CFA)' },
                                        { value: 'EUR', label: 'EUR (€)' },
                                        { value: 'SLL', label: 'SLL (Le)' },
                                        { value: 'GMD', label: 'GMD (D)' },
                                    ])}
                                    {renderInput('LOCALIZATION', 'Long Date Format', 'DATE_FORMAT', 'DD MMM YYYY')}
                                </div>
                                {renderInput('LOCALIZATION', 'Default Timezone', 'TIMEZONE', 'UTC+1 (Lagos/London)')}
                            </div>
                        )}

                        {activeTab === 'INTEGRATION' && (
                            <div className="space-y-8 animate-in slide-in-from-right duration-500">
                                {renderHeader('API Integrations', 'Connect external services and payment gateways.', <Lock size={20} />)}
                                <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-500 font-bold italic border border-blue-600/20 shadow-inner">P</div>
                                        <span className="text-xs font-black uppercase text-white tracking-widest italic">Paystack Credentials</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        onClick={() => setShowSecret(!showSecret)}
                                        className="h-9 px-4 rounded-xl text-[10px] font-bold uppercase text-slate-500 hover:text-white"
                                    >
                                        {showSecret ? <EyeOff size={14} className="mr-2" /> : <Eye size={14} className="mr-2" />}
                                        {showSecret ? 'Mask Keys' : 'Reveal Keys'}
                                    </Button>
                                </div>
                                <div className="space-y-6">
                                    {renderInput('INTEGRATION', 'Public Key', 'PAYSTACK_PUB_KEY', 'pk_test_...', 'password')}
                                    {renderInput('INTEGRATION', 'Secret Key', 'PAYSTACK_SEC_KEY', 'sk_test_...', 'password')}
                                </div>
                            </div>
                        )}

                        {activeTab === 'BRANDING' && (
                            <div className="space-y-8 animate-in slide-in-from-right duration-500">
                                {renderHeader('Visual Branding', 'Custom appearance and identity assets.', <Palette size={20} />)}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {renderInput('BRANDING', 'Primary Accent Color', 'PRIMARY_COLOR', '#2563eb')}
                                    {renderInput('BRANDING', 'Platform Logo Target', 'LOGO_URL', 'Default')}
                                </div>
                                {renderInput('BRANDING', 'Favicon Destination', 'FAVICON_URL', 'Default')}
                            </div>
                        )}
                    </div>

                    <div className="bg-blue-600/5 border border-blue-600/10 rounded-[2.5rem] p-8 flex items-start gap-4 shadow-inner group hover:bg-blue-600/[0.08] transition-all">
                        <HelpCircle className="text-blue-500 shrink-0 mt-1" size={20} />
                        <div>
                            <p className="text-sm font-bold text-white uppercase tracking-tight mb-1 italic">Propagation Notice</p>
                            <p className="text-slate-500 text-xs leading-relaxed font-semibold italic opacity-80 group-hover:opacity-100 transition-opacity">
                                Updating these system parameters will affect the live production environment immediately. Sensitive keys like API secrets are encrypted at rest.
                                <span className="text-blue-500 ml-1 cursor-pointer hover:underline">Read the Dev Docs &rarr;</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
