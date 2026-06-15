'use client';

import { useState, useEffect } from 'react';
import { 
    Search, 
    Mail, 
    Phone, 
    Calendar, 
    MoreHorizontal, 
    CheckCircle2, 
    XCircle, 
    Clock, 
    Trash2, 
    Eye,
    Loader2,
    Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

type Lead = {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    subject: string | null;
    message: string;
    source: string | null;
    status: string;
    courseId: string | null;
    createdAt: string;
    course?: {
        title: string;
    };
};

export default function AdminLeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchLeads = async () => {
        try {
            const res = await fetch('/api/admin/leads');
            if (res.ok) {
                const data = await res.json();
                setLeads(data);
            }
        } catch (err) {
            toast.error('Failed to load leads');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        setIsUpdating(true);
        try {
            const res = await fetch(`/api/admin/leads/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                toast.success(`Lead marked as ${status.toLowerCase()}`);
                fetchLeads();
                if (selectedLead?.id === id) {
                    setSelectedLead({ ...selectedLead, status });
                }
            }
        } catch (err) {
            toast.error('Failed to update status');
        } finally {
            setIsUpdating(false);
        }
    };

    const deleteLead = async (id: string) => {
        if (!confirm('Are you sure you want to delete this lead?')) return;
        try {
            const res = await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Lead deleted');
                fetchLeads();
                setIsViewOpen(false);
            }
        } catch (err) {
            toast.error('Failed to delete lead');
        }
    };

    const filteredLeads = leads.filter(l => 
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.email.toLowerCase().includes(search.toLowerCase()) ||
        l.subject?.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'NEW': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'CONTACTED': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'RESOLVED': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Leads & Inquiries</h1>
                <p className="text-slate-400 text-sm mt-1">Track and manage potential students and corporate inquiries.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                <div className="p-5 border-b border-slate-800 bg-slate-800/10 flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <Input
                            placeholder="Search by name, email or subject..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 bg-slate-950 border-slate-800 text-sm h-11 rounded-xl focus:ring-blue-600"
                        />
                    </div>
                    <Button variant="outline" className="rounded-xl border-slate-800 bg-slate-950 text-slate-400 hover:text-white h-11 px-4 gap-2">
                        <Filter size={16} /> Filter
                    </Button>
                </div>

                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        <p className="text-slate-500 animate-pulse text-sm">Fetching inquiries...</p>
                    </div>
                ) : filteredLeads.length === 0 ? (
                    <div className="p-20 text-center">
                        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-700">
                            <Mail className="text-slate-600" size={24} />
                        </div>
                        <h3 className="text-white font-bold">No leads found</h3>
                        <p className="text-slate-500 text-sm mt-1">When someone fills a contact form, they will appear here.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-800/20">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Sender</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Subject / Source</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredLeads.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-slate-800/40 transition-all group">
                                        <td className="px-6 py-5">
                                            <div className="space-y-0.5">
                                                <p className="text-white font-bold text-sm tracking-tight">{lead.name}</p>
                                                <p className="text-slate-500 text-[11px] flex items-center gap-1">
                                                    <Mail size={10} /> {lead.email}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="space-y-0.5 max-w-[200px]">
                                                <p className="text-slate-300 text-xs font-medium truncate">{lead.subject || 'No Subject'}</p>
                                                <Badge variant="outline" className="text-[9px] h-4 font-black uppercase tracking-tighter px-1.5 py-0 border-slate-800 bg-slate-900/50 text-slate-500">
                                                    {lead.source?.replace('_', ' ') || 'DIRECT'}
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <Badge className={`text-[10px] font-bold rounded-lg px-2 py-0.5 border ${getStatusColor(lead.status)}`}>
                                                {lead.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-slate-500 text-xs font-medium uppercase tracking-tighter">
                                                {new Date(lead.createdAt).toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => { setSelectedLead(lead); setIsViewOpen(true); }}
                                                    className="w-8 h-8 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-400/10"
                                                >
                                                    <Eye size={14} />
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-slate-500">
                                                            <MoreHorizontal size={14} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-white w-48">
                                                        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => updateStatus(lead.id, 'NEW')} className="gap-2">
                                                            <Clock size={14} className="text-blue-500" /> Mark as New
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => updateStatus(lead.id, 'CONTACTED')} className="gap-2">
                                                            <Phone size={14} className="text-amber-500" /> Mark as Contacted
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => updateStatus(lead.id, 'RESOLVED')} className="gap-2">
                                                            <CheckCircle2 size={14} className="text-emerald-500" /> Mark as Resolved
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-slate-800" />
                                                        <DropdownMenuItem onClick={() => deleteLead(lead.id)} className="text-red-400 gap-2">
                                                            <Trash2 size={14} /> Delete Inquiry
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* View Modal */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="bg-slate-950 border-slate-800 text-white sm:max-w-[600px] rounded-[2rem] p-0 overflow-hidden shadow-2xl">
                    {selectedLead && (
                        <div className="flex flex-col h-full">
                            <div className="p-8 border-b border-slate-900 bg-slate-900/20">
                                <div className="flex items-center justify-between mb-4">
                                    <Badge className={`text-[10px] font-bold rounded-lg px-2 py-0.5 border ${getStatusColor(selectedLead.status)}`}>
                                        {selectedLead.status}
                                    </Badge>
                                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                                        <Calendar size={12} />
                                        {new Date(selectedLead.createdAt).toLocaleString()}
                                    </div>
                                </div>
                                <h2 className="text-2xl font-black tracking-tight text-white uppercase">{selectedLead.name}</h2>
                                <p className="text-slate-400 font-medium">{selectedLead.email}</p>
                                {selectedLead.phone && (
                                    <p className="text-slate-500 text-sm mt-1 flex items-center gap-1.5">
                                        <Phone size={14} className="text-brand" /> {selectedLead.phone}
                                    </p>
                                )}
                            </div>

                            <div className="p-8 space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Subject / Interest</label>
                                    <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-slate-200 font-bold">
                                        {selectedLead.subject || 'No Subject Provided'}
                                        {selectedLead.course && (
                                            <p className="text-[10px] text-blue-500 mt-1 uppercase">Relates to: {selectedLead.course.title}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Message Body</label>
                                    <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
                                        {selectedLead.message}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-900/20 border-t border-slate-900 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <Button 
                                        variant="outline" 
                                        onClick={() => updateStatus(selectedLead.id, 'CONTACTED')}
                                        disabled={isUpdating}
                                        className="rounded-xl border-slate-800 bg-slate-950 text-slate-400 hover:text-white h-11 px-4 gap-2"
                                    >
                                        <Phone size={14} /> Contacted
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        onClick={() => updateStatus(selectedLead.id, 'RESOLVED')}
                                        disabled={isUpdating}
                                        className="rounded-xl border-slate-800 bg-slate-950 text-slate-400 hover:text-white h-11 px-4 gap-2"
                                    >
                                        <CheckCircle2 size={14} /> Resolve
                                    </Button>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    onClick={() => deleteLead(selectedLead.id)}
                                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl"
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
