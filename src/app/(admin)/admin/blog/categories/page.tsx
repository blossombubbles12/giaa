'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Layers, Edit, Trash2, Loader2 } from 'lucide-react';
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

type Category = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    createdAt: string;
};

export default function BlogCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({ name: '', slug: '', description: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const slugify = (text: string) =>
        text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-');

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/blog/categories');
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (err) {
            toast.error('Failed to load blog categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const url = editingCategory
                ? `/api/admin/blog/categories/${editingCategory.id}`
                : '/api/admin/blog/categories';
            const method = editingCategory ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success(editingCategory ? 'Category updated' : 'Category created');
                setIsCreateOpen(false);
                setEditingCategory(null);
                setFormData({ name: '', slug: '', description: '' });
                fetchCategories();
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
        if (!confirm('Are you sure you want to delete this category?')) return;
        try {
            const res = await fetch(`/api/admin/blog/categories/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Category deleted');
                fetchCategories();
            } else {
                toast.error('Failed to delete category');
            }
        } catch (err) {
            toast.error('An error occurred');
        }
    };

    const openEdit = (category: Category) => {
        setEditingCategory(category);
        setFormData({ 
            name: category.name, 
            slug: category.slug, 
            description: category.description || '' 
        });
        setIsCreateOpen(true);
    };

    const handleNameChange = (name: string) => {
        setFormData(prev => ({
            ...prev,
            name,
            slug: slugify(name)
        }));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Blog Categories</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage categories to organize your blog posts</p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={(open) => {
                    setIsCreateOpen(open);
                    if (!open) {
                        setEditingCategory(null);
                        setFormData({ name: '', slug: '', description: '' });
                    }
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl gap-2 shadow-md shadow-blue-600/25">
                            <Plus size={16} />
                            Add Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-[425px]">
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle>{editingCategory ? 'Edit Category' : 'Create Category'}</DialogTitle>
                                <DialogDescription className="text-slate-400">
                                    {editingCategory ? 'Update category details' : 'Add a new category for your blog posts.'}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Category Name</label>
                                    <Input
                                        placeholder="e.g. Technology"
                                        value={formData.name}
                                        onChange={(e) => handleNameChange(e.target.value)}
                                        className="bg-slate-950 border-slate-800 text-white rounded-xl h-11 focus:ring-blue-600 focus:border-blue-600"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Slug</label>
                                    <Input
                                        placeholder="category-slug"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        className="bg-slate-950 border-slate-800 text-white rounded-xl h-11 focus:ring-blue-600 focus:border-blue-600 font-mono text-xs"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Description (Optional)</label>
                                    <textarea
                                        placeholder="Brief summary..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 h-24 text-sm focus:ring-blue-600 focus:border-blue-600 focus:outline-none resize-none transition-all placeholder:text-slate-600 shadow-inner"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl h-11 shadow-lg shadow-blue-600/20 gap-2"
                                >
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editingCategory ? <Edit size={16} /> : <Plus size={16} />}
                                    {editingCategory ? 'Update Category' : 'Create Category'}
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
                            placeholder="Search categories..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 bg-slate-950 border-slate-800 text-sm h-10 rounded-xl focus:ring-blue-600"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        <p className="text-slate-500 animate-pulse text-sm">Fetching categories...</p>
                    </div>
                ) : filteredCategories.length === 0 ? (
                    <div className="p-20 text-center">
                        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-700">
                            <Layers className="text-slate-600" size={24} />
                        </div>
                        <h3 className="text-white font-bold">No categories found</h3>
                        <p className="text-slate-500 text-sm mt-1">Start by creating a new category for your blog.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-800/20">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Name & Slug</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Description</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date Created</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredCategories.map((category) => (
                                    <tr key={category.id} className="hover:bg-slate-800/40 transition-all group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-blue-600/10 rounded-lg flex items-center justify-center text-blue-500">
                                                    <Layers size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold text-sm tracking-tight">{category.name}</p>
                                                    <p className="text-slate-500 text-[10px] font-mono mt-0.5">/{category.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-slate-400 text-sm line-clamp-1 max-w-sm italic">
                                                {category.description || 'No description provided'}
                                            </p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-slate-500 text-xs font-medium uppercase tracking-tighter">
                                                {new Date(category.createdAt).toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openEdit(category)}
                                                    className="w-8 h-8 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800"
                                                >
                                                    <Edit size={14} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(category.id)}
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
