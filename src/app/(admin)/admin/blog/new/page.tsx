'use client';

import BlogForm from '@/components/admin/blog-form';

export default function NewPostPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Create New Post</h1>
                <p className="text-slate-400 text-sm mt-1">Compose a new article or announcement for your audience</p>
            </div>
            <BlogForm />
        </div>
    );
}
