'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, ArrowLeft, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

type Category = { id: string; name: string };
type Tag = { id: string; name: string };

interface BlogFormProps {
    initialData?: any;
    id?: string;
}

export default function BlogForm({ initialData, id }: BlogFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);

    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string>(initialData?.thumbnail || '');

    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        content: initialData?.content || '',
        excerpt: initialData?.excerpt || '',
        categoryId: initialData?.categoryId || '',
        published: initialData?.published || false,
        tagIds: initialData?.postTags?.map((pt: any) => pt.tagId) || [],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, tagRes] = await Promise.all([
                    fetch('/api/admin/blog/categories'),
                    fetch('/api/admin/blog/tags')
                ]);
                if (catRes.ok) setCategories(await catRes.json());
                if (tagRes.ok) setTags(await tagRes.json());
            } catch (err) {
                toast.error('Failed to load form requirements');
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = id ? `/api/admin/blog/posts/${id}` : '/api/admin/blog/posts';
            const method = id ? 'PATCH' : 'POST';

            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('content', formData.content);
            submitData.append('excerpt', formData.excerpt);
            submitData.append('categoryId', formData.categoryId);
            submitData.append('published', String(formData.published));
            submitData.append('tagIds', JSON.stringify(formData.tagIds));

            if (thumbnailFile) {
                submitData.append('thumbnail', thumbnailFile);
            }

            const res = await fetch(url, {
                method,
                body: submitData,
            });

            if (res.ok) {
                toast.success(id ? 'Post updated' : 'Post created');
                router.push('/admin/blog');
                router.refresh();
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to save post');
            }
        } catch (err) {
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setThumbnailFile(file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const toggleTag = (tagId: string) => {
        setFormData(prev => ({
            ...prev,
            tagIds: prev.tagIds.includes(tagId)
                ? prev.tagIds.filter((id: string) => id !== tagId)
                : [...prev.tagIds, tagId]
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
            <div className="flex items-center justify-between">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.back()}
                    className="text-slate-400 hover:text-white gap-2"
                >
                    <ArrowLeft size={16} /> Back
                </Button>
                <Button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl gap-2 shadow-lg shadow-blue-600/20 px-8"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
                    {id ? 'Update Post' : 'Publish Post'}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Post Title</label>
                            <Input
                                placeholder="Enter a catchy title..."
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="bg-slate-950 border-slate-800 text-white text-lg font-bold rounded-xl h-14 focus:ring-blue-600"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Excerpt / Summary</label>
                            <textarea
                                placeholder="A brief summary for previews..."
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-4 h-24 text-sm focus:ring-blue-600 focus:outline-none resize-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Full Content</label>
                            <RichTextEditor
                                value={formData.content}
                                onChange={(val) => setFormData({ ...formData, content: val })}
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar Settings */}
                <div className="space-y-6">
                    {/* Status & Options */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                        <h3 className="text-white font-bold text-sm border-b border-slate-800 pb-3">Publication Settings</h3>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400">Published Status</span>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, published: !formData.published })}
                                className={`w-12 h-6 rounded-full transition-colors relative ${formData.published ? 'bg-blue-600' : 'bg-slate-800'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.published ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Category</label>
                            <select
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl h-11 px-4 text-sm focus:ring-blue-600 outline-none appearance-none"
                            >
                                <option value="">Uncategorized</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Thumbnail */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                        <h3 className="text-white font-bold text-sm border-b border-slate-800 pb-3">Featured Image</h3>

                        <div className="space-y-4 pt-4 text-center cursor-pointer relative group">
                            {thumbnailPreview ? (
                                <div className="relative group">
                                    <img
                                        src={thumbnailPreview}
                                        className="w-full h-40 object-cover rounded-xl border border-slate-800"
                                        alt="Preview"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                                        <p className="text-white text-xs font-bold">Change Image</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setThumbnailFile(null);
                                            setThumbnailPreview('');
                                        }}
                                        className="absolute -top-2 -right-2 bg-red-600 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-slate-800 rounded-2xl p-8 hover:border-blue-500 transition-colors">
                                    <ImageIcon className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Select Thumbnail</p>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                        </div>
                        <p className="text-[10px] text-slate-500 text-center italic">Supported: PNG, JPG, WEBP.</p>
                    </div>

                    {/* Tags */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                        <h3 className="text-white font-bold text-sm border-b border-slate-800 pb-3">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {tags.length === 0 ? (
                                <p className="text-slate-600 text-xs italic">No tags available</p>
                            ) : (
                                tags.map(tag => (
                                    <button
                                        key={tag.id}
                                        type="button"
                                        onClick={() => toggleTag(tag.id)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${formData.tagIds.includes(tag.id)
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                                            : 'bg-slate-950 text-slate-500 border border-slate-800 hover:text-slate-300'
                                            }`}
                                    >
                                        #{tag.name}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
