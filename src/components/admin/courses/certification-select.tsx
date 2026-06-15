'use client';

import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, Plus, Loader2, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

type CertificationType = {
    id: string;
    name: string;
};

interface CertificationSelectProps {
    value?: string | null;
    onChange: (value: string | null) => void;
}

export function CertificationSelect({ value, onChange }: CertificationSelectProps) {
    const [open, setOpen] = useState(false);
    const [certifications, setCertifications] = useState<CertificationType[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [creating, setCreating] = useState(false);

    const fetchCertifications = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/certification-types');
            if (res.ok) {
                const data = await res.json();
                setCertifications(data);
            }
        } catch (err) {
            console.error('Failed to fetch certifications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open && certifications.length === 0) {
            fetchCertifications();
        }
    }, [open]);

    const filteredCerts = certifications.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleCreate = async () => {
        if (!search.trim()) return;
        setCreating(true);
        try {
            const res = await fetch('/api/admin/certification-types', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: search }),
            });
            if (res.ok) {
                const newCert = await res.json();
                setCertifications((prev) => [newCert, ...prev]);
                onChange(newCert.id);
                setOpen(false);
                setSearch('');
                toast.success(`Certification "${newCert.name}" created`);
            } else {
                toast.error('Failed to create certification');
            }
        } catch (err) {
            toast.error('An error occurred');
        } finally {
            setCreating(false);
        }
    };

    const selectedCert = certifications.find((c) => c.id === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between bg-slate-800/50 border-slate-700 text-white h-12 rounded-xl px-4 hover:bg-slate-800 transition-all font-normal"
                >
                    {selectedCert ? (
                        <span className="truncate">{selectedCert.name}</span>
                    ) : (
                        <span className="text-slate-500">Select certification...</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-slate-900 border-slate-800 overflow-hidden shadow-2xl rounded-xl">
                <div className="p-2 border-b border-slate-800 bg-slate-900/50">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                        <Input
                            placeholder="Search or create certification..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 h-9 bg-slate-950 border-slate-800 text-xs rounded-lg focus:ring-blue-600"
                        />
                    </div>
                </div>
                <div className="max-h-[240px] overflow-y-auto p-1 custom-scrollbar">
                    {loading ? (
                        <div className="flex items-center justify-center py-6">
                            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                        </div>
                    ) : (
                        <>
                            {filteredCerts.length === 0 && search && (
                                <button
                                    onClick={handleCreate}
                                    disabled={creating}
                                    className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-blue-400 hover:bg-blue-600/10 rounded-lg transition-colors text-left"
                                >
                                    {creating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus size={14} />}
                                    Create "{search}"
                                </button>
                            )}
                            {filteredCerts.map((cert) => (
                                <button
                                    key={cert.id}
                                    onClick={() => {
                                        onChange(cert.id === value ? null : cert.id);
                                        setOpen(false);
                                    }}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2.5 text-xs rounded-lg transition-colors text-left",
                                        value === cert.id
                                            ? "bg-blue-600 text-white"
                                            : "text-slate-300 hover:bg-slate-800"
                                    )}
                                >
                                    {cert.name}
                                    {value === cert.id && <Check className="h-3.5 w-3.5" />}
                                </button>
                            ))}
                            <button
                                onClick={() => {
                                    onChange(null);
                                    setOpen(false);
                                }}
                                className={cn(
                                    "w-full flex items-center justify-between px-3 py-2.5 text-xs rounded-lg transition-colors text-left text-slate-500 italic hover:bg-slate-800"
                                )}
                            >
                                No Certification
                            </button>
                            {filteredCerts.length === 0 && !search && (
                                <p className="py-6 text-center text-xs text-slate-500 font-medium">No certifications found</p>
                            )}
                        </>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
