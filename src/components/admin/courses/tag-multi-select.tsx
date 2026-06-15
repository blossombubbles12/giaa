'use client';

import { useState, useEffect } from 'react';
import { Check, Plus, Loader2, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

type Tag = {
    id: string;
    name: string;
};

interface TagMultiSelectProps {
    value: string[]; // Array of Tag IDs
    onChange: (value: string[]) => void;
}

export function TagMultiSelect({ value, onChange }: TagMultiSelectProps) {
    const [open, setOpen] = useState(false);
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [creating, setCreating] = useState(false);

    const fetchTags = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/tags');
            if (res.ok) {
                const data = await res.json();
                setTags(data);
            }
        } catch (err) {
            console.error('Failed to fetch tags');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open && tags.length === 0) {
            fetchTags();
        }
    }, [open]);

    const filteredTags = tags.filter((t) =>
        t.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleCreate = async () => {
        if (!search.trim()) return;
        setCreating(true);
        try {
            const res = await fetch('/api/admin/tags', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: search }),
            });
            if (res.ok) {
                const newTag = await res.json();
                setTags((prev) => [newTag, ...prev]);
                onChange([...value, newTag.id]);
                setSearch('');
                toast.success(`Tag "${newTag.name}" created`);
            } else {
                toast.error('Failed to create tag');
            }
        } catch (err) {
            toast.error('An error occurred');
        } finally {
            setCreating(false);
        }
    };

    const toggleTag = (id: string) => {
        const newValue = value.includes(id)
            ? value.filter((v) => v !== id)
            : [...value, id];
        onChange(newValue);
    };

    const selectedTags = tags.filter((t) => value.includes(t.id));

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-2 min-h-[44px] p-2 bg-slate-800/30 border border-slate-800 rounded-xl">
                {selectedTags.length === 0 && (
                    <span className="text-slate-600 text-xs px-2 py-1.5 font-medium italic">No tags selected...</span>
                )}
                {selectedTags.map((tag) => (
                    <Badge
                        key={tag.id}
                        variant="secondary"
                        className="bg-blue-600/20 text-blue-400 border-blue-600/30 hover:bg-blue-600/30 px-2 py-1 rounded-lg flex items-center gap-1 group transition-all"
                    >
                        {tag.name}
                        <button
                            type="button"
                            onClick={() => toggleTag(tag.id)}
                            className="bg-blue-600/20 rounded-md p-0.5 hover:bg-blue-600/40 text-blue-400/50 hover:text-blue-200 transition-colors"
                        >
                            <X size={10} />
                        </button>
                    </Badge>
                ))}

                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <button
                            type="button"
                            className="h-7 w-7 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all border border-slate-700 active:scale-90"
                        >
                            <Plus size={14} />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-0 bg-slate-900 border-slate-800 overflow-hidden shadow-2xl rounded-xl z-[60]">
                        <div className="p-2 border-b border-slate-800 bg-slate-900/50">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={12} />
                                <Input
                                    placeholder="Add tag..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-8 h-8 bg-slate-950 border-slate-800 text-[10px] rounded-lg focus:ring-blue-600"
                                />
                            </div>
                        </div>
                        <div className="max-h-48 overflow-y-auto p-1 custom-scrollbar">
                            {loading ? (
                                <div className="flex items-center justify-center py-4">
                                    <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
                                </div>
                            ) : (
                                <>
                                    {filteredTags.length === 0 && search && (
                                        <button
                                            onClick={handleCreate}
                                            disabled={creating}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-[10px] text-blue-400 hover:bg-blue-600/10 rounded-lg transition-colors text-left font-medium"
                                        >
                                            {creating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus size={12} />}
                                            Create "{search}"
                                        </button>
                                    )}
                                    {filteredTags.map((tag) => {
                                        const isSelected = value.includes(tag.id);
                                        return (
                                            <button
                                                key={tag.id}
                                                onClick={() => toggleTag(tag.id)}
                                                className={cn(
                                                    "w-full flex items-center justify-between px-3 py-2 text-[10px] rounded-lg transition-colors text-left mb-0.5",
                                                    isSelected
                                                        ? "bg-blue-600/20 text-blue-400 font-bold"
                                                        : "text-slate-400 hover:bg-slate-800"
                                                )}
                                            >
                                                {tag.name}
                                                {isSelected && <Check className="h-3 w-3" />}
                                            </button>
                                        );
                                    })}
                                    {filteredTags.length === 0 && !search && (
                                        <p className="py-4 text-center text-[10px] text-slate-500 font-medium italic">No tags found</p>
                                    )}
                                </>
                            )}
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}
