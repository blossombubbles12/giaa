'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Tag as TagIcon, Edit, Trash2, Loader2 } from 'lucide-react';
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

type Tag = {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
};

export default function TagsPage() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newName, setNewName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchTags = async () => {
        try {
            const res = await fetch('/api/admin/tags');
            if (res.ok) {
                const data = await res.json();
                setTags(data);
            }
        } catch (err) {
            toast.error('Failed to load tags');
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

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/admin/tags', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName }),
            });
            if (res.ok) {
                toast.success('Tag created successfully');
                setIsCreateOpen(false);
                setNewName('');
                fetchTags();
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to create tag');
            }
        } catch (err) {
            toast.error('An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Course Tags</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage tags for better course filtering and search</p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl gap-2 shadow-md shadow-blue-600/25">
                            <Plus size={16} />
                            Add Tag
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-[400px]">
                        <form onSubmit={handleCreate}>
                            <DialogHeader>
                                <DialogTitle>Create New Tag</DialogTitle>
                                <DialogDescription className="text-slate-400">
                                    Add a new tag to help students discover relevant courses.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Tag Name</label>
                                    <Input
                                        placeholder="e.g. Certification, Safety, Beginner"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="bg-slate-950 border-slate-800 text-white rounded-xl h-11 focus:ring-blue-600 focus:border-blue-600"
                                        required
                                    />
                                    <p className="text-[10px] text-slate-500 px-1 italic">A slug will be automatically generated from the name.</p>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl h-11 shadow-lg shadow-blue-600/20 gap-2"
                                >
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus size={16} />}
                                    Create Tag
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl text-white">
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
                            <TagIcon className="text-slate-600" size={24} />
                        </div>
                        <h3 className="text-white font-bold">No tags found</h3>
                        <p className="text-slate-500 text-sm mt-1">Start by adding descriptive tags for your courses.</p>
                    </div>
                ) : (
                    <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredTags.map((tag) => (
                                <div
                                    key={tag.id}
                                    className="group relative bg-slate-950 border border-slate-800 rounded-xl p-4 hover:border-blue-600/50 hover:bg-slate-800/20 transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-600/10 rounded-lg flex items-center justify-center text-blue-500">
                                            <TagIcon size={14} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-bold text-white truncate">{tag.name}</p>
                                            <p className="text-[10px] text-slate-500 font-mono italic">#{tag.slug}</p>
                                        </div>
                                    </div>

                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-md transition-colors">
                                            <Edit size={12} />
                                        </button>
                                        <button className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors">
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
