'use client';

import { useState, useEffect } from 'react';
import {
    FileText,
    Search,
    Loader2,
    Edit,
    Save,
    ChevronRight,
    Globe,
    ArrowLeft,
    Monitor,
    Smartphone,
    Layout
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

type PageContent = {
    id: string;
    key: string;
    value: string;
    updatedAt: string;
};

export default function AdminPagesCMS() {
    const [contents, setContents] = useState<PageContent[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');
    const [saving, setSaving] = useState(false);

    const fetchContents = async () => {
        try {
            const res = await fetch('/api/admin/pages');
            if (res.ok) {
                const data = await res.json();
                setContents(data);
            }
        } catch (err) {
            toast.error('Failed to load content blocks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContents();
    }, []);

    const handleSave = async (id: string) => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/pages', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, value: editValue }),
            });
            if (res.ok) {
                toast.success('Content updated successfully');
                setEditingId(null);
                fetchContents();
            } else {
                toast.error('Failed to update content');
            }
        } catch (err) {
            toast.error('An error occurred');
        } finally {
            setSaving(false);
        }
    };

    const startEditing = (block: PageContent) => {
        setEditingId(block.id);
        setEditValue(block.value);
    };

    const filtered = contents.filter(c =>
        c.key.toLowerCase().includes(search.toLowerCase()) ||
        c.value.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white uppercase tracking-tight italic">CMS Content Manager</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage global website copy and dynamic marketing blocks.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1">
                        <Button variant="ghost" className="h-9 px-3 rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-600/20"><Monitor size={16} /></Button>
                        <Button variant="ghost" className="h-9 px-3 rounded-lg text-slate-500 hover:text-white"><Smartphone size={16} /></Button>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-slate-800 bg-slate-800/10">
                    <div className="relative max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <Input
                            placeholder="Find specific copy or content keys..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-12 bg-slate-950 border-slate-800 text-sm h-12 rounded-2xl focus:ring-blue-600 focus:border-blue-600 shadow-inner"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-32 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">Syncing marketing blocks...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="p-32 text-center space-y-4">
                        <div className="w-20 h-20 bg-slate-800/50 rounded-3xl flex items-center justify-center mx-auto border border-slate-700 shadow-inner">
                            <Layout className="text-slate-600" size={32} />
                        </div>
                        <h3 className="text-white font-bold text-lg uppercase tracking-tight italic">No content found</h3>
                        <p className="text-slate-500 text-sm italic max-w-xs mx-auto opacity-70 font-semibold">
                            Once global page keys are defined in the system, you can manage their content here.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-800">
                        {filtered.map((block) => (
                            <div key={block.id} className="p-8 group hover:bg-slate-800/20 transition-all flex flex-col lg:flex-row gap-8">
                                <div className="lg:w-1/4 space-y-2 shrink-0">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
                                        <p className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">{block.key.split('_')[0] || 'Content'}</p>
                                    </div>
                                    <p className="text-white font-black uppercase tracking-tighter text-lg">{block.key.replace(/_/g, ' ')}</p>
                                    <div className="flex items-center gap-2 group-hover:text-slate-400 text-slate-600 transition-colors">
                                        <Globe size={11} />
                                        <p className="text-[10px] font-bold uppercase tracking-widest">Global Key Path</p>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-4">
                                    {editingId === block.id ? (
                                        <div className="space-y-4 animate-in fade-in slide-in-from-top duration-300">
                                            <RichTextEditor
                                                value={editValue}
                                                onChange={setEditValue}
                                                placeholder="Write something amazing..."
                                                className="mb-4"
                                            />
                                            <div className="flex gap-2 justify-end">
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => setEditingId(null)}
                                                    className="rounded-xl px-6 h-11 text-slate-500 font-bold uppercase text-[10px] tracking-widest hover:text-white"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    onClick={() => handleSave(block.id)}
                                                    disabled={saving}
                                                    className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-8 h-11 font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-blue-600/30 gap-2"
                                                >
                                                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                                    Apply Update
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative group/content">
                                            <div className="bg-slate-950/50 border border-slate-900 rounded-2xl p-6 group-hover:bg-slate-950 group-hover:border-slate-800 transition-all min-h-[100px]">
                                                <div
                                                    className="text-slate-400 text-sm leading-relaxed italic max-w-3xl font-medium prose prose-slate dark:prose-invert prose-sm"
                                                    dangerouslySetInnerHTML={{ __html: block.value || '<span class="opacity-20">No content provided...</span>' }}
                                                />
                                            </div>
                                            <Button
                                                onClick={() => startEditing(block)}
                                                variant="ghost"
                                                className="absolute top-4 right-4 h-10 w-10 p-0 rounded-xl bg-slate-900 border border-slate-800 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 text-blue-500 hover:bg-blue-600 hover:text-white"
                                            >
                                                <Edit size={16} />
                                            </Button>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-600">
                                        <span className="flex items-center gap-1.5"><ChevronRight size={10} className="text-blue-500" /> JSON Block ID: {block.id.split('-')[0]}</span>
                                        <span className="flex items-center gap-1.5"><ChevronRight size={10} className="text-blue-500" /> Ref: {new Date(block.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="bg-blue-600/5 border border-blue-600/10 rounded-[2rem] p-8 flex items-start gap-4 shadow-inner">
                <FileText className="text-blue-500 shrink-0 mt-1" size={20} />
                <div>
                    <p className="text-sm font-bold text-white uppercase tracking-tight mb-1 italic">Content Injection Note</p>
                    <p className="text-slate-500 text-xs leading-relaxed font-semibold italic opacity-80">
                        Changes to these blocks will propagate across the platform instantly. Ensure all HTML tags are closed and text is proofread before applying updates to production keys.
                    </p>
                </div>
            </div>
        </div>
    );
}
