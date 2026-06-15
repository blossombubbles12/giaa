import { db } from '@/db';
import { galleries } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { Camera, Video, File as FileIcon, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const getFileIcon = (url: string) => {
    if (url.match(/\.(mp4|webm|ogg|mov)$/i)) return <Video className="w-8 h-8 md:w-10 md:h-10 text-brand group-hover:scale-110 transition-transform duration-500" />;
    if (url.match(/\.(pdf|doc|docx|zip)$/i)) return <FileIcon className="w-8 h-8 md:w-10 md:h-10 text-brand group-hover:scale-110 transition-transform duration-500" />;
    return <Camera className="w-8 h-8 md:w-10 md:h-10 text-brand group-hover:scale-110 transition-transform duration-500" />;
};

export async function HomeResources() {
    // Fetch only the latest 3 galleries for the homepage display
    const latestGalleries = await db.query.galleries.findMany({
        orderBy: [desc(galleries.createdAt)],
        limit: 3,
    });

    if (latestGalleries.length === 0) return null;

    return (
        <section className="py-20 md:py-32 bg-slate-50 dark:bg-navy relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div className="max-w-2xl space-y-4">
                        <span className="text-brand font-black uppercase tracking-[.3em] text-[10px] bg-brand/10 dark:bg-brand/20 px-3 py-1.5 rounded-full">Explore Our Vault</span>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">
                            Latest <span className="text-brand">Resources</span> & Media
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base max-w-lg leading-relaxed">
                            Access our official masterclass recordings, high-quality event photos, and essential professional documents natively hosted for your convenience.
                        </p>
                    </div>

                    <Link href="/resources" className="shrink-0">
                        <Button variant="outline" className="h-12 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white uppercase font-bold tracking-widest text-xs hover:bg-brand hover:text-white hover:border-brand w-full md:w-auto mt-4 md:mt-0 shadow-sm transition-all duration-300 group">
                            View All Resources <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {latestGalleries.map((gallery) => {
                        const images = (gallery.images as { url: string }[] | null) || [];
                        const isVideoOrDoc = images[0]?.url.match(/\.(mp4|webm|ogg|mov|pdf|doc|docx|zip)$/i);
                        const itemCount = images.length;

                        return (
                            <Link
                                href={`/resources/${gallery.id}`}
                                key={gallery.id}
                                className="group flex flex-col bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 hover:border-brand/30"
                            >
                                <div className="h-56 bg-slate-100 dark:bg-slate-900 relative overflow-hidden flex items-center justify-center">
                                    {itemCount >= 1 ? (
                                        isVideoOrDoc ? (
                                            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 group-hover:bg-slate-200 dark:group-hover:bg-slate-800 transition-colors duration-700">
                                                <div className="w-20 h-20 bg-white dark:bg-slate-950 rounded-full flex items-center justify-center shadow-xl mb-4 group-hover:scale-110 transition-transform duration-500">
                                                    {getFileIcon(images[0]?.url || '')}
                                                </div>
                                            </div>
                                        ) : (
                                            <img
                                                src={images[0]?.url}
                                                alt={gallery.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 group-hover:brightness-50"
                                            />
                                        )
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-900">
                                            <Camera className="w-12 h-12 text-slate-300 dark:text-slate-700" />
                                        </div>
                                    )}

                                    {/* Action Hover */}
                                    {!isVideoOrDoc && itemCount >= 1 && (
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                                            <span className="bg-brand text-white font-black text-xs uppercase tracking-widest px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 -translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                                Browse Gallery <ArrowRight size={14} />
                                            </span>
                                        </div>
                                    )}

                                    {/* Item Count Badge */}
                                    <div className="absolute top-4 left-4 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">
                                            {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 md:p-8 flex flex-col flex-1">
                                    <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 md:line-clamp-1 group-hover:text-brand transition-colors">
                                        {gallery.title}
                                    </h3>
                                    {gallery.description ? (
                                        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-[13px] line-clamp-2 leading-relaxed font-medium">
                                            {gallery.description}
                                        </p>
                                    ) : (
                                        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-[13px] font-medium">No description provided.</p>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
