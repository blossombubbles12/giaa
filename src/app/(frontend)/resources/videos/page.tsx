import { PlayCircle, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { PageHeader } from '@/components/frontend/layout/PageHeader';

export default function VideosGalleryPage() {
    return (
        <div className="bg-white dark:bg-[#020617] min-h-screen transition-colors duration-500">
            <PageHeader 
                title="Media & Gallery"
                description="Watch snippets from our corporate training sessions, webinars, and take a visual tour of our facilities."
                breadcrumbs={[
                    { name: 'Resources', href: '/resources' },
                    { name: 'Videos' }
                ]}
            />

            {/* Videos Grid */}
            <section className="py-24">
                <div className="container">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900 dark:text-white flex items-center gap-3">
                            <PlayCircle size={28} className="text-rose-500" /> Latest Videos
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="group relative overflow-hidden rounded-[2.5rem] bg-slate-900 aspect-video shadow-xl cursor-pointer">
                                <img src={`https://images.unsplash.com/photo-${1515000000000 + i * 2000}?auto=format&fit=crop&q=80&w=800`} alt="Video Thumbnail" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex flex-col items-center justify-center p-6 text-center">
                                    <div className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center text-white mb-4 group-hover:scale-110 shadow-lg shadow-rose-500/30 transition-transform duration-500">
                                        <PlayCircle size={32} />
                                    </div>
                                    <h3 className="text-xl font-black uppercase text-white tracking-widest leading-tight">GIA Strategic Training Webinar {i}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Photo Gallery Grid */}
            <section className="py-24 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
                <div className="container">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900 dark:text-white flex items-center gap-3">
                            <ImageIcon size={28} className="text-rose-500" /> Photo Gallery
                        </h2>
                    </div>
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="group relative overflow-hidden rounded-[2rem] bg-slate-200 dark:bg-slate-800 shadow-md cursor-pointer border-4 border-white dark:border-slate-800 inline-block w-full">
                                <img src={`https://images.unsplash.com/photo-${1555000000000 + i * 3000}?auto=format&fit=crop&q=80&w=600`} alt="Gallery Highlight" className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <p className="text-white font-black uppercase tracking-widest text-xs">Facility Tour {2024 + i}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
