import { Metadata } from 'next';
import { db } from '@/db';
import { galleries } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { Camera, Video, File as FileIcon, ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';

import { PageHeader } from '@/components/frontend/layout/PageHeader';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const gallery = await db.query.galleries.findFirst({
        where: eq(galleries.id, id),
    });

    if (!gallery) return { title: 'Not Found' };

    return {
        title: `${gallery.title} | GIA Advisory`,
        description: gallery.description || 'View multimedia resources.',
    };
}

export default async function ResourceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const gallery = await db.query.galleries.findFirst({
        where: eq(galleries.id, id),
    });

    if (!gallery) {
        return notFound();
    }

    const createdDate = new Date(gallery.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    const imagesList = gallery.images as { url: string; publicId: string }[];

    return (
        <div className="bg-white dark:bg-[#020617] min-h-screen transition-colors duration-500">
            <PageHeader 
                title={gallery.title}
                description={gallery.description || "Multimedia and official documentation highlights powered by GIA Advisory."}
                breadcrumbs={[
                    { name: 'Resources', href: '/resources' },
                    { name: gallery.title }
                ]}
            />

            <div className="container mx-auto px-4 md:px-10 -mt-10 relative z-20">
                <div className="max-w-7xl mx-auto space-y-16 pt-16">
                    {/* Media Count Card */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <div className="md:col-span-1 bg-white dark:bg-slate-950 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-brand/5 flex items-center gap-6">
                            <div className="w-14 h-14 bg-brand/10 text-brand rounded-2xl flex items-center justify-center shrink-0">
                                <Camera className="w-7 h-7" />
                            </div>
                            <div>
                                <h4 className="text-slate-900 dark:text-white font-black text-2xl uppercase tracking-tighter">
                                    {imagesList.length} Items
                                </h4>
                                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Media Resources Attached</p>
                            </div>
                        </div>
                    </div>


                {/* Media Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {imagesList.map((item, i) => {
                        const isVideo = item.url.match(/\.(mp4|webm|ogg|mov)$/i);
                        const isDoc = item.url.match(/\.(pdf|doc|docx|zip)$/i);
                        const fileName = item.url.split('/').pop() || 'Download File';

                        return (
                            <div key={i} className="group flex flex-col bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-brand/10 transition-all duration-500">

                                <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-900 flex items-center justify-center relative overflow-hidden p-6 group-hover:scale-[1.02] transition-transform duration-500">
                                    {isVideo ? (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-center">
                                            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
                                                <Video className="w-10 h-10" />
                                            </div>
                                            <h4 className="text-slate-900 dark:text-white font-bold text-lg mb-2 truncate max-w-full">
                                                Video Recording
                                            </h4>
                                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl mt-2 transition-colors">
                                                Watch Native <ArrowLeft className="w-4 h-4 rotate-135" />
                                            </a>
                                        </div>
                                    ) : isDoc ? (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-center">
                                            <div className="w-20 h-20 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                                                <FileIcon className="w-10 h-10" />
                                            </div>
                                            <h4 className="text-slate-900 dark:text-white font-bold text-lg mb-2 truncate max-w-full px-4" title={fileName}>
                                                {fileName}
                                            </h4>
                                            <a href={item.url} download target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl mt-2 transition-colors">
                                                Download Doc <Download className="w-4 h-4" />
                                            </a>
                                        </div>
                                    ) : (
                                        <img src={item.url} alt="Gallery item" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    )}

                                    {/* Overlay for standard images */}
                                    {!isVideo && !isDoc && (
                                        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/60 transition-colors z-10 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="bg-white/95 text-slate-900 hover:bg-brand hover:text-white font-bold text-sm px-6 py-3 rounded-xl flex items-center gap-2 shadow-2xl scale-95 group-hover:scale-100 transition-all duration-300">
                                                <Download className="w-4 h-4" /> View Full HD
                                            </a>
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        Cloudinary Sync
                                    </span>
                                    {isVideo && <span className="bg-emerald-500/10 text-emerald-600 font-bold text-[9px] uppercase tracking-widest px-2 py-1 rounded-md">Video File</span>}
                                    {isDoc && <span className="bg-blue-500/10 text-blue-600 font-bold text-[9px] uppercase tracking-widest px-2 py-1 rounded-md">Raw File</span>}
                                    {!isVideo && !isDoc && <span className="bg-brand/10 text-brand font-bold text-[9px] uppercase tracking-widest px-2 py-1 rounded-md">Image</span>}
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    </div>
);
}
