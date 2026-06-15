import { db } from '@/db';
import { posts } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { ArrowRight, Calendar, User, Tag } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export async function HomeBlog() {
    const latestPosts = await db.query.posts.findMany({
        where: eq(posts.published, true),
        orderBy: [desc(posts.createdAt)],
        limit: 3,
        with: {
            category: true,
            author: true
        }
    });

    if (latestPosts.length === 0) return null;

    return (
        <section className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div className="max-w-2xl space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="h-0.5 w-6 bg-brand rounded-full" />
                            <h4 className="text-brand font-black uppercase tracking-[0.4em] text-[10px]">Knowledge Hub</h4>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">
                            Latest <span className="text-brand">Insights</span> & Global News
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base max-w-lg leading-relaxed">
                            Stay up to date with the latest trends in aviation, management, and professional development from our expert contributors.
                        </p>
                    </div>

                    <Link href="/blog" className="shrink-0">
                        <Button variant="outline" className="h-12 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white uppercase font-black tracking-widest text-[10px] hover:bg-brand hover:text-white hover:border-brand w-full md:w-auto mt-4 md:mt-0 shadow-sm transition-all duration-300 group rounded-2xl">
                            All Insights <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {latestPosts.map((post) => (
                        <Link
                            href={`/blog/${post.slug}`}
                            key={post.id}
                            className="group flex flex-col bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:border-brand/30 transition-all duration-500"
                        >
                            <div className="h-64 relative overflow-hidden bg-slate-200 dark:bg-slate-800">
                                {post.thumbnail ? (
                                    <img
                                        src={post.thumbnail}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center opacity-10">
                                        <Tag className="w-16 h-16" />
                                    </div>
                                )}

                                {post.category && (
                                    <div className="absolute top-6 left-6 z-20">
                                        <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-2xl shadow-xl text-[9px] font-black uppercase tracking-widest text-brand">
                                            {post.category.name}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="p-8 flex flex-col flex-1">
                                <div className="flex items-center gap-6 mb-5 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                    <span className="flex items-center gap-2">
                                        <Calendar size={14} className="text-brand" />
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <User size={14} className="text-brand" />
                                        {post.author?.name || 'Admin'}
                                    </span>
                                </div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 line-clamp-2 leading-tight group-hover:text-brand transition-colors uppercase tracking-tight">
                                    {post.title}
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 leading-relaxed font-medium mb-6">
                                    {post.excerpt || 'Read the latest updates and insights from GIA Advisory expert team.'}
                                </p>
                                <div className="mt-auto flex items-center text-brand font-black text-[9px] uppercase tracking-widest gap-2 group-hover:translate-x-1 transition-all">
                                    Continue Reading <ArrowRight size={14} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
