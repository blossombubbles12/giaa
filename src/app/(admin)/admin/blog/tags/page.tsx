'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Tag, Edit, Trash2, Loader2 } from 'lucide-react';
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

type TagType = {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
};

export default function BlogTagsPage() {
    const [tags, setTags] = useState<TagType[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingTag, setEditingTag] = useState<TagType | null>(null);
    const [formData, setFormData] = useState({ name: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchTags = async () => {
        try {
            const res = await fetch('/api/admin/blog/tags');
            if (res.ok) {
                const data = await res.json();
                setTags(data);
            }
        } catch (err) {
            toast.error('Failed to load blog tags');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    const filteredTags = tags.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const url = editingTag
                ? `/api/admin/blog/tags/${editingTag.id}`
                : '/api/admin/blog/tags';
            const method = editingTag ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success(editingTag ? 'Tag updated' : 'Tag created');
                setIsCreateOpen(false);
                setEditingTag(null);
                setFormData({ name: '' });
                fetchTags();
            } else {
                const data = await res.json();
                toast.error(data.error || 'Operation failed');
            }
        } catch (err) {
            toast.error('An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this tag?')) return;
        try {
            const res = await fetch(`/api/admin/blog/tags/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Tag deleted');
                fetchTags();
            } else {
                toast.error('Failed to delete tag');
            }
        } catch (err) {
            toast.error('An error occurred');
        }
    };

    const openEdit = (tag: TagType) => {
        setEditingTag(tag);
        setFormData({ name: tag.name });
        setIsCreateOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Blog Tags</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage tags for flexible blog post categorization</p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={(open) => {
                    setIsCreateOpen(open);
                    if (!open) {
                        setEditingTag(null);
                        setFormData({ name: '' });
                    }
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl gap-2 shadow-md shadow-blue-600/25">
                            <Plus size={16} />
                            Add Tag
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-[425px]">
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle>{editingTag ? 'Edit Tag' : 'Create Tag'}</DialogTitle>
                                <DialogDescription className="text-slate-400">
                                    {editingTag ? 'Update tag details' : 'Add a new tag for your blog posts.'}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Tag Name</label>
                                    <Input
                                        placeholder="e.g. Tutorial"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="bg-slate-950 border-slate-800 text-white rounded-xl h-11 focus:ring-blue-600 focus:border-blue-600"
                                        required
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl h-11 shadow-lg shadow-blue-600/20 gap-2"
                                >
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editingTag ? <Edit size={16} /> : <Plus size={16} />}
                                    {editingTag ? 'Update Tag' : 'Create Tag'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-4 border-b border-slate-800 bg-slate-800/10 flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <Input
                            placeholder="Search tags..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 bg-slate-950 border-slate-800 text-sm h-10 rounded-xl focus:ring-blue-600"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        <p className="text-slate-500 animate-pulse text-sm">Fetching tags...</p>
                    </div>
                ) : filteredTags.length === 0 ? (
                    <div className="p-20 text-center">
                        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-700">
                            <Tag className="text-slate-600" size={24} />
                        </div>
                        <h3 className="text-white font-bold">No tags found</h3>
                        <p className="text-slate-500 text-sm mt-1">Start by creating a new tag for your blog posts.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-800/20">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Name & Slug</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date Created</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredTags.map((t) => (
                                    <tr key={t.id} className="hover:bg-slate-800/40 transition-all group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-blue-600/10 rounded-lg flex items-center justify-center text-blue-500">
                                                    <Tag size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold text-sm tracking-tight">{t.name}</p>
                                                    <p className="text-slate-500 text-[10px] font-mono mt-0.5">#{t.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-slate-500 text-xs font-medium uppercase tracking-tighter">
                                                {new Date(t.createdAt).toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openEdit(t)}
                                                    className="w-8 h-8 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800"
                                                >
                                                    <Edit size={14} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(t.id)}
                                                    className="w-8 h-8 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10"
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
