import { db } from '@/db';
import { posts } from '@/db/schema';
import { eq, desc, not, and } from 'drizzle-orm';
import { Calendar, User, ArrowLeft, Tag, Share2, Facebook, Twitter, Linkedin, Copy, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = await db.query.posts.findFirst({
        where: eq(posts.slug, slug),
    });

    if (!post) return { title: 'Post Not Found' };

    return {
        title: `${post.title} | GIA Insights`,
        description: post.excerpt || 'Read the latest insights from GIA Academy.',
        openGraph: {
            title: post.title,
            description: post.excerpt || undefined,
            images: post.thumbnail ? [post.thumbnail] : [],
            type: 'article',
            publishedTime: post.createdAt.toISOString(),
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt || undefined,
            images: post.thumbnail ? [post.thumbnail] : [],
        }
    };
}

export const dynamic = 'force-dynamic';

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const post = await db.query.posts.findFirst({
        where: eq(posts.slug, slug),
        with: {
            category: true,
            author: true,
            postTags: {
                with: {
                    tag: true
                }
            }
        }
    });

    if (!post || !post.published) return notFound();

    // Fetch related/more posts
    const relatedPosts = await db.query.posts.findMany({
        where: and(
            eq(posts.published, true),
            not(eq(posts.id, post.id)),
            post.categoryId ? eq(posts.categoryId, post.categoryId) : undefined
        ),
        limit: 3,
        with: {
            category: true,
            author: true,
        },
        orderBy: [desc(posts.createdAt)],
    });

    return (
        <div className="bg-white dark:bg-slate-950 pb-32">
            {/* Post Hero Section - Contained & Professional with Image */}
            <div className="container mx-auto px-4 md:px-6 pt-10">
                <section className="relative py-14 md:py-20 rounded-[3rem] overflow-hidden group shadow-2xl border border-slate-200/50 dark:border-slate-800/50">
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0 z-0">
                        <img 
                            src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=2000" 
                            className="w-full h-full object-cover brightness-[0.2] group-hover:scale-105 transition-transform duration-[2s]" 
                            alt="Professional Background" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                        </div>
                    </div>

                    <div className="relative z-10 px-8 md:px-16">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                            <div className="flex-1 space-y-6 text-left">
                                <Link href="/blog">
                                    <Button variant="ghost" className="h-8 p-0 text-slate-400 uppercase font-black tracking-widest text-[8px] hover:text-brand transition-colors flex items-center gap-2 mb-2">
                                        <ArrowLeft size={10} />
                                        Back to Insights
                                    </Button>
                                </Link>

                                <div className="space-y-4">
                                    {post.category && (
                                        <span className="text-brand font-black uppercase tracking-[0.3em] text-[10px] bg-brand/10 px-4 py-1.5 rounded-full border border-brand/20">
                                            {post.category.name}
                                        </span>
                                    )}
                                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight uppercase tracking-tight">
                                        {post.title}
                                    </h1>
                                </div>

                                <div className="flex items-center gap-8 pt-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    <div className="flex items-center gap-2.5">
                                        <Calendar size={14} className="text-brand" />
                                        {new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <User size={14} className="text-brand" />
                                        By {post.author?.name || 'Admin'}
                                    </div>
                                </div>
                            </div>

                            {/* Social Share Buttons */}
                            <div className="flex items-center gap-3">
                                <Button variant="outline" size="icon" className="w-10 h-10 rounded-xl bg-white/5 border-white/10 text-white hover:bg-brand hover:border-brand transition-all"><Facebook size={18} /></Button>
                                <Button variant="outline" size="icon" className="w-10 h-10 rounded-xl bg-white/5 border-white/10 text-white hover:bg-blue-400 hover:border-blue-400 transition-all"><Twitter size={18} /></Button>
                                <Button variant="outline" size="icon" className="w-10 h-10 rounded-xl bg-white/5 border-white/10 text-white hover:bg-blue-800 hover:border-blue-800 transition-all"><Linkedin size={18} /></Button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Post Content Layout - Shifted away from overlap */}
            <section className="container mx-auto px-4 md:px-6 pt-16 relative z-20">
                <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto">
                    {/* Main Reading Column */}
                    <div className="flex-1 max-w-4xl lg:max-w-3xl">
                        {/* Featured Image */}
                        <div className="bg-slate-200 dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl mb-12 aspect-video border-8 border-white dark:border-slate-950">
                            {post.thumbnail ? (
                                <img src={post.thumbnail} className="w-full h-full object-cover" alt={post.title} />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 opacity-20">
                                    <Tag size={120} />
                                </div>
                            )}
                        </div>

                        {/* Article Text Content */}
                        <div
                            className="prose prose-lg dark:prose-invert prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-p:font-medium prose-p:leading-relaxed prose-p:text-slate-600 dark:prose-p:text-slate-400 max-w-none px-4 md:px-0"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* Article Footer / Tags */}
                        <div className="mt-20 pt-10 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex flex-wrap gap-2">
                                {post.postTags?.map(pt => (
                                    <span key={pt.tagId} className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-slate-100 dark:border-slate-800">
                                        #{pt.tag?.name}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-2">Share this:</span>
                                <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-brand hover:bg-brand hover:text-white transition-all shadow-sm"><Facebook size={18} /></Button>
                                <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-blue-400 hover:bg-blue-400 hover:text-white transition-all shadow-sm"><Twitter size={18} /></Button>
                                <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-blue-800 hover:bg-blue-800 hover:text-white transition-all shadow-sm"><Linkedin size={18} /></Button>
                            </div>
                        </div>

                        {/* Author/Next Steps */}
                        <div className="mt-16 bg-brand rounded-[2.5rem] p-10 text-white shadow-2xl flex flex-col md:flex-row items-center gap-10">
                            <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0">
                                <User size={40} className="opacity-50" />
                            </div>
                            <div className="space-y-3 text-center md:text-left">
                                <h4 className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60">Published By</h4>
                                <h3 className="text-2xl font-black uppercase tracking-tight italic">{post.author?.name || 'GIA Editorial'}</h3>
                                <p className="text-orange-50 font-medium leading-relaxed max-w-lg text-sm">
                                    Committed to excellence in aviation and business consulting.
                                    Stay connected for more expert insights and industry updates.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / More Reading (Desktop Only) */}
                    <div className="hidden lg:block w-80 space-y-10">
                        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 space-y-8 sticky top-32">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand border-b border-slate-100 dark:border-slate-800 pb-4">Continue Reading</h4>

                            <div className="space-y-8">
                                {relatedPosts.slice(0, 2).map(more => (
                                    <Link key={more.id} href={`/blog/${more.slug}`} className="group block space-y-4">
                                        <div className="h-32 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900">
                                            {more.thumbnail ? (
                                                <img src={more.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={more.title} />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center opacity-10"><Tag size={32} /></div>
                                            )}
                                        </div>
                                        <h5 className="text-sm font-black uppercase tracking-tight leading-tight group-hover:text-brand transition-colors line-clamp-2 italic">{more.title}</h5>
                                        <span className="text-[9px] font-bold text-slate-400 block tracking-widest uppercase">{new Date(more.createdAt).toLocaleDateString()}</span>
                                    </Link>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                                <Link href="/blog">
                                    <Button variant="outline" className="w-full rounded-2xl h-12 uppercase font-black text-[9px] tracking-widest text-slate-500 hover:text-brand hover:border-brand transition-all">View All Blog Posts</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Posts Bottom Section */}
            {relatedPosts.length > 0 && (
                <section className="container mx-auto px-4 md:px-6 mt-32">
                    <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12 border-b border-slate-100 dark:border-slate-800 pb-10">
                        <div className="space-y-3">
                            <span className="text-brand font-black uppercase tracking-[.3em] text-[10px]">Deep Dive</span>
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">
                                Related <span className="text-brand">Insights</span>
                            </h2>
                        </div>
                        <Link href="/blog">
                            <Button variant="ghost" className="rounded-2xl font-black uppercase tracking-widest text-[10px] gap-2 group">
                                Explore All Articles <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {relatedPosts.map((rp) => (rp.id && (
                            <Link
                                key={rp.id}
                                href={`/blog/${rp.slug}`}
                                className="group flex flex-col space-y-6"
                            >
                                <div className="aspect-[16/10] rounded-[2.5rem] overflow-hidden bg-slate-100 dark:bg-slate-900 border-4 border-white dark:border-slate-900 shadow-xl group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500">
                                    {rp.thumbnail ? (
                                        <img src={rp.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={rp.title} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center opacity-10"><Tag size={48} /></div>
                                    )}
                                </div>
                                <div className="space-y-3 px-4">
                                    <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                        {rp.category && <span className="text-brand">{rp.category.name}</span>}
                                        <div className="w-1 h-1 rounded-full bg-slate-300" />
                                        <span>{new Date(rp.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="text-lg font-black uppercase italic tracking-tight text-slate-900 dark:text-white leading-tight group-hover:text-brand transition-colors line-clamp-2">
                                        {rp.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 pt-2">
                                        By {rp.author?.name || 'Admin'}
                                    </div>
                                </div>
                            </Link>
                        )))}
                    </div>
                </section>
            )}
        </div>
    );
}
