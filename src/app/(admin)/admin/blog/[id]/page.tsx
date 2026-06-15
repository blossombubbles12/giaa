'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import { Loader2 } from 'lucide-react';
import BlogForm from '@/components/admin/blog-form';
import { toast } from 'sonner';

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`/api/admin/blog/posts/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setPost(data);
                } else {
                    toast.error('Post not found');
                }
            } catch (err) {
                toast.error('Failed to load post');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                <p className="text-slate-500 animate-pulse font-medium tracking-tight">Loading post details...</p>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 text-center">
                <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-700 mb-2">
                    404
                </div>
                <h1 className="text-white text-xl font-bold">Post Not Found</h1>
                <p className="text-slate-500 text-sm">The post you are trying to edit does not exist or has been deleted.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Edit Post</h1>
                <p className="text-slate-400 text-sm mt-1">Make changes to your published content or draft</p>
            </div>
            <BlogForm initialData={post} id={id} />
        </div>
    );
}
