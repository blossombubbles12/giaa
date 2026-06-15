import { Metadata } from 'next';
import { db } from '@/db';
import { galleries } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { Camera, Video, File as FileIcon, Eye } from 'lucide-react';
import Link from 'next/link';

import { PageHeader } from '@/components/frontend/layout/PageHeader';

export const metadata: Metadata = {
    title: 'Resources & Media Gallery | GIA Advisory',
    description: 'Explore our latest event highlights, masterclass recordings, and official documents.',
};

const getFileIcon = (url: string) => {
    if (url.match(/\.(mp4|webm|ogg|mov)$/i)) return <Video className="w-8 h-8 md:w-12 md:h-12 text-slate-300 dark:text-slate-600" />;
    if (url.match(/\.(pdf|doc|docx|zip)$/i)) return <FileIcon className="w-8 h-8 md:w-12 md:h-12 text-slate-300 dark:text-slate-600" />;
    return <Camera className="w-8 h-8 md:w-12 md:h-12 text-slate-300 dark:text-slate-600" />;
};

export default async function ResourcesPage() {
    const allGalleries = await db.query.galleries.findMany({
        orderBy: [desc(galleries.createdAt)],
    });

    return (
        <div className="bg-white dark:bg-[#020617] pb-32 transition-colors duration-500">
            <PageHeader 
                title="Our Resources & Media"
                description="Explore our extensive library of masterclass recordings, event highlights, and essential professional documents natively hosted on our platform."
                breadcrumbs={[{ name: 'Resources' }]}
            />

            <div className="container py-12 relative z-20">
                <div className="max-w-7xl mx-auto space-y-16 pt-16">


                {allGalleries.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center shadow-sm">
                        <Camera className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-700 mb-6" />
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No Media Published Yet</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">Check back soon for high quality event photos, webinar recordings, and official documents.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {allGalleries.map((gallery) => {
                            const images = (gallery.images as { url: string }[]) || [];
                            const isVideoOrDoc = images[0]?.url?.match(/\.(mp4|webm|ogg|mov|pdf|doc|docx|zip)$/i);
                            const itemCount = images.length;
                            const createdDate = new Date(gallery.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

                            return (
                                <Link
                                    href={`/resources/${gallery.id}`}
                                    key={gallery.id}
                                    className="group flex flex-col bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-brand/5 hover:-translate-y-2 transition-all duration-500"
                                >
                                    {/* Thumbnail Preview */}
                                    <div className="h-56 bg-slate-100 dark:bg-slate-900 relative overflow-hidden flex items-center justify-center">
                                        <div className="absolute inset-0 bg-slate-900/10 dark:bg-slate-900/50 group-hover:bg-transparent transition-colors z-10" />

                                        {itemCount >= 1 ? (
                                            isVideoOrDoc ? (
                                                <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-800 group-hover:scale-105 transition-transform duration-700">
                                                    {getFileIcon(images[0].url)}
                                                </div>
                                            ) : (
                                                <img
                                                    src={images[0].url}
                                                    alt={gallery.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            )
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-800 group-hover:scale-105 transition-transform duration-700">
                                                <Camera className="w-12 h-12 text-slate-300 dark:text-slate-700" />
                                            </div>
                                        )}

                                        {/* Album Badge */}
                                        <div className="absolute top-4 right-4 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2">
                                            {isVideoOrDoc ? <FileIcon className="w-4 h-4 text-brand" /> : <Camera className="w-4 h-4 text-brand" />}
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">
                                                {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                                            </span>
                                        </div>

                                        {/* Hover View Button */}
                                        <div className="absolute inset-0 m-auto w-16 h-16 bg-brand/90 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-y-4 group-hover:translate-y-0 shadow-2xl transition-all duration-300 z-30">
                                            <Eye className="w-6 h-6" />
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-1">
                                        <span className="text-brand font-black text-[10px] uppercase tracking-widest mb-3 block">
                                            {createdDate}
                                        </span>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-brand transition-colors">
                                            {gallery.title}
                                        </h3>
                                        {gallery.description && (
                                            <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed">
                                                {gallery.description}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    </div>
);
}
