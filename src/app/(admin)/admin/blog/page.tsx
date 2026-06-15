'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, FileText, Edit, Trash2, Loader2, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { toast } from 'sonner';

type Post = {
    id: string;
    title: string;
    slug: string;
    published: boolean;
    createdAt: string;
    category: { name: string } | null;
};

export default function BlogPostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/admin/blog/posts');
            if (res.ok) {
                const data = await res.json();
                setPosts(data);
            }
        } catch (err) {
            toast.error('Failed to load blog posts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const filteredPosts = posts.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        try {
            const res = await fetch(`/api/admin/blog/posts/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Post deleted');
                fetchPosts();
            } else {
                toast.error('Failed to delete post');
            }
        } catch (err) {
            toast.error('An error occurred');
        }
    };

    const togglePublished = async (post: Post) => {
        try {
            const res = await fetch(`/api/admin/blog/posts/${post.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ published: !post.published }),
            });
            if (res.ok) {
                toast.success(post.published ? 'Post unpublished' : 'Post published');
                fetchPosts();
            }
        } catch (err) {
            toast.error('Failed to update post status');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
                    <p className="text-slate-400 text-sm mt-1">Create and manage your articles/announcements</p>
                </div>

                <Link href="/admin/blog/new">
                    <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl gap-2 shadow-md shadow-blue-600/25">
                        <Plus size={16} />
                        New Post
                    </Button>
                </Link>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-4 border-b border-slate-800 bg-slate-800/10 flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <Input
                            placeholder="Search posts..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 bg-slate-950 border-slate-800 text-sm h-10 rounded-xl focus:ring-blue-600"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        <p className="text-slate-500 animate-pulse text-sm">Fetching posts...</p>
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <div className="p-20 text-center">
                        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-700">
                            <FileText className="text-slate-600" size={24} />
                        </div>
                        <h3 className="text-white font-bold">No posts found</h3>
                        <p className="text-slate-500 text-sm mt-1">Get started by creating your first blog post.</p>
                        <Link href="/admin/blog/new" className="mt-4 inline-block">
                            <Button variant="outline" className="text-blue-500 border-blue-500/30 hover:bg-blue-500/10">Create Post</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-800/20">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Post Title</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Category</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date Created</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredPosts.map((post) => (
                                    <tr key={post.id} className="hover:bg-slate-800/40 transition-all group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-blue-600/10 rounded-lg flex items-center justify-center text-blue-500">
                                                    <FileText size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold text-sm tracking-tight line-clamp-1">{post.title}</p>
                                                    <p className="text-slate-500 text-[10px] font-mono mt-0.5">/{post.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="px-2 py-1 bg-slate-800 rounded-md text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                {post.category?.name || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <button
                                                onClick={() => togglePublished(post)}
                                                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all ${post.published
                                                        ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                                        : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                                    }`}
                                            >
                                                <div className={`w-1.5 h-1.5 rounded-full ${post.published ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                                                {post.published ? 'Published' : 'Draft'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-slate-500 text-xs font-medium uppercase tracking-tighter">
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/blog/${post.slug}`} target="_blank">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="w-8 h-8 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800"
                                                    >
                                                        <ExternalLink size={14} />
                                                    </Button>
                                                </Link>
                                                <Link href={`/admin/blog/${post.id}`}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="w-8 h-8 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800"
                                                    >
                                                        <Edit size={14} />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(post.id)}
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
