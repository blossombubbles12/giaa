'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Award, Edit, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from 'sonner';

type CertificationType = {
    id: string;
    name: string;
    description: string | null;
    createdAt: string;
};

export default function CertificationsPage() {
    const [certifications, setCertifications] = useState<CertificationType[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newCert, setNewCert] = useState({ name: '', description: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchCertifications = async () => {
        try {
            const res = await fetch('/api/admin/certification-types');
            if (res.ok) {
                const data = await res.json();
                setCertifications(data);
            }
        } catch (err) {
            toast.error('Failed to load certifications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCertifications();
    }, []);

    const filteredCerts = certifications.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/admin/certification-types', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCert),
            });
            if (res.ok) {
                toast.success('Certification created successfully');
                setIsCreateOpen(false);
                setNewCert({ name: '', description: '' });
                fetchCertifications();
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to create certification');
            }
        } catch (err) {
            toast.error('An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? This may affect courses using this certification.')) return;
        try {
            const res = await fetch(`/api/admin/certification-types/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Certification deleted');
                fetchCertifications();
            } else {
                toast.error('Failed to delete');
            }
        } catch (err) {
            toast.error('An error occurred');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Certification Types</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage standard certifications (e.g., NEBOSH, IOSH) for your courses</p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl gap-2 shadow-md shadow-blue-600/25">
                            <Plus size={16} />
                            Add Certification
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-[425px]">
                        <form onSubmit={handleCreate}>
                            <DialogHeader>
                                <DialogTitle>Create Certification</DialogTitle>
                                <DialogDescription className="text-slate-400">
                                    Add a new professional certification type to the platform.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Name</label>
                                    <Input
                                        placeholder="e.g. NEBOSH IGC"
                                        value={newCert.name}
                                        onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                                        className="bg-slate-950 border-slate-800 text-white rounded-xl h-11 focus:ring-blue-600"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Description (Optional)</label>
                                    <textarea
                                        placeholder="Brief summary..."
                                        value={newCert.description}
                                        onChange={(e) => setNewCert({ ...newCert, description: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 h-24 text-sm focus:ring-blue-600 resize-none shadow-inner"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl h-11"
                                >
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus size={16} />}
                                    Create Certification
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-4 border-b border-slate-800 bg-slate-800/10">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <Input
                            placeholder="Search certifications..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 bg-slate-950 border-slate-800 text-sm h-10 rounded-xl"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        <p className="text-slate-500 text-sm">Fetching certifications...</p>
                    </div>
                ) : filteredCerts.length === 0 ? (
                    <div className="p-20 text-center">
                        <Award className="text-slate-600 mx-auto mb-4" size={48} />
                        <h3 className="text-white font-bold">No certifications found</h3>
                        <p className="text-slate-500 text-sm mt-1">Start by adding professional certification types.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-800/20">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Name</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Description</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date Created</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredCerts.map((cert) => (
                                    <tr key={cert.id} className="hover:bg-slate-800/40 transition-all group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-blue-600/10 rounded-lg flex items-center justify-center text-blue-500">
                                                    <Award size={18} />
                                                </div>
                                                <span className="text-white font-bold text-sm">{cert.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-slate-400 text-sm line-clamp-1 max-w-sm italic">
                                            {cert.description || 'N/A'}
                                        </td>
                                        <td className="px-6 py-5 text-slate-500 text-xs font-medium uppercase">
                                            {new Date(cert.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(cert.id)}
                                                    className="w-8 h-8 rounded-lg text-slate-500 hover:text-red-400"
                                                >
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
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
