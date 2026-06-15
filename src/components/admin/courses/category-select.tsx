'use client';

import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, Plus, Loader2, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

type Category = {
    id: string;
    name: string;
};

interface CategorySelectProps {
    value?: string | null;
    onChange: (value: string | null) => void;
}

export function CategorySelect({ value, onChange }: CategorySelectProps) {
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [creating, setCreating] = useState(false);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/categories');
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (err) {
            console.error('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open && categories.length === 0) {
            fetchCategories();
        }
    }, [open]);

    const filteredCategories = categories.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleCreate = async () => {
        if (!search.trim()) return;
        setCreating(true);
        try {
            const res = await fetch('/api/admin/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: search }),
            });
            if (res.ok) {
                const newCat = await res.json();
                setCategories((prev) => [newCat, ...prev]);
                onChange(newCat.id);
                setOpen(false);
                setSearch('');
                toast.success(`Category "${newCat.name}" created`);
            } else {
                toast.error('Failed to create category');
            }
        } catch (err) {
            toast.error('An error occurred');
        } finally {
            setCreating(false);
        }
    };

    const selectedCategory = categories.find((c) => c.id === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between bg-slate-800/50 border-slate-700 text-white h-12 rounded-xl px-4 hover:bg-slate-800 transition-all font-normal"
                >
                    {selectedCategory ? (
                        <span className="truncate">{selectedCategory.name}</span>
                    ) : (
                        <span className="text-slate-500">Select category...</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-slate-900 border-slate-800 overflow-hidden shadow-2xl rounded-xl">
                <div className="p-2 border-b border-slate-800 bg-slate-900/50">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                        <Input
                            placeholder="Search or create category..."
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
                            {filteredCategories.length === 0 && search && (
                                <button
                                    onClick={handleCreate}
                                    disabled={creating}
                                    className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-blue-400 hover:bg-blue-600/10 rounded-lg transition-colors text-left"
                                >
                                    {creating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus size={14} />}
                                    Create "{search}"
                                </button>
                            )}
                            {filteredCategories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => {
                                        onChange(category.id === value ? null : category.id);
                                        setOpen(false);
                                    }}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2.5 text-xs rounded-lg transition-colors text-left",
                                        value === category.id
                                            ? "bg-blue-600 text-white"
                                            : "text-slate-300 hover:bg-slate-800"
                                    )}
                                >
                                    {category.name}
                                    {value === category.id && <Check className="h-3.5 w-3.5" />}
                                </button>
                            ))}
                            {filteredCategories.length === 0 && !search && (
                                <p className="py-6 text-center text-xs text-slate-500 font-medium">No categories found</p>
                            )}
                        </>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
