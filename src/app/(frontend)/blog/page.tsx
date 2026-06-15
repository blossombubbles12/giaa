import { db } from '@/db';
import { posts, postCategories } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { Calendar, User, ArrowRight, Tag, BookOpen, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Metadata } from 'next';
import { PageHeader } from '@/components/frontend/layout/PageHeader';

export const metadata: Metadata = {
    title: 'Insights | GIA Academy Blog',
    description: 'Expert commentary, industry trends, and practical guides for the modern aviation and business professional. Stay updated with the latest insights from GIA.',
    openGraph: {
        title: 'Insights | GIA Academy Blog',
        description: 'Expert commentary, industry trends, and practical guides for the modern aviation and business professional.',
        images: ['https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=1200'],
    },
};

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
    const [allPosts, categories] = await Promise.all([
        db.query.posts.findMany({
            where: eq(posts.published, true),
            orderBy: [desc(posts.createdAt)],
            with: {
                category: true,
                author: true,
            }
        }),
        db.query.postCategories.findMany()
    ]);

    return (
        <div className="bg-white dark:bg-slate-950 pb-32">
            <PageHeader 
                title="Expert Insights"
                description="Strategic intelligence and operational excellence guides from our network of aviation and business professionals."
                breadcrumbs={[{ name: 'Blog & Insights' }]}
            />

            {/* Category Filter Section */}
            <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 py-6">
                <div className="container flex flex-wrap items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-2">Topics:</span>
                    <Link href="/blog">
                        <span className="px-5 py-2.5 bg-brand text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-brand/20 cursor-pointer hover:bg-slate-900 transition-all">All Posts</span>
                    </Link>
                    {categories.map(cat => (
                        <Link key={cat.id} href={`/blog?category=${cat.id}`}>
                            <span className="px-5 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:border-brand hover:text-brand transition-all cursor-pointer">
                                {cat.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Posts Grid - Now more compact and separate */}
            <section className="container pt-16 relative z-20">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                    {allPosts.length > 0 ? allPosts.map((post) => (
                        <Link
                            href={`/blog/${post.slug}`}
                            key={post.id}
                            className="group bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden hover:border-brand hover:shadow-2xl transition-all duration-500 shadow-sm flex flex-col h-full"
                        >
                            {/* Card Image */}
                            <div className="relative h-60 overflow-hidden bg-slate-100 dark:bg-slate-900">
                                {post.thumbnail ? (
                                    <img
                                        src={post.thumbnail}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 group-hover:brightness-50"
                                        alt={post.title}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center opacity-20">
                                        <BookOpen size={64} />
                                    </div>
                                )}

                                <div className="absolute top-6 left-6">
                                    <div className="bg-white/90 backdrop-blur-md text-brand text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2">
                                        {post.category?.name || 'Article'}
                                    </div>
                                </div>

                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                                    <span className="bg-brand text-white font-black text-[9px] uppercase tracking-widest px-8 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2 -translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                        Read Article <ArrowRight size={14} />
                                    </span>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-8 space-y-5 flex-1 flex flex-col">
                                <div className="flex items-center gap-6 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-brand" />
                                        {new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User size={14} className="text-brand" />
                                        {post.author?.name || 'Admin'}
                                    </div>
                                </div>

                                <div className="space-y-3 flex-1">
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight uppercase group-hover:text-brand transition-colors tracking-tight line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                                        {post.excerpt || 'Access expert insights and professional updates from GIA Advisory contributor network.'}
                                    </p>
                                </div>

                                <div className="pt-4 mt-auto border-t border-slate-100 dark:border-slate-800 group-hover:border-brand/20 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-brand group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                                            Continue Reading <ArrowRight size={14} />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )) : (
                        <div className="col-span-full py-40 border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[5rem] text-center space-y-8">
                            <BookOpen size={80} className="mx-auto text-slate-200" />
                            <div className="space-y-2">
                                <h3 className="text-3xl font-black text-slate-400 uppercase tracking-tighter">No Articles Yet</h3>
                                <p className="text-sm font-medium text-slate-400">Our editorial team is currently preparing new expert content for you.</p>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
