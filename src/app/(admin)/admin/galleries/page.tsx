'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Loader2, Plus, Edit2, Trash2, Camera, Video, File as FileIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

type GalleryImage = {
    url: string;
    publicId: string;
};

type Gallery = {
    id: string;
    title: string;
    description: string | null;
    images: GalleryImage[];
    createdAt: string;
};

// Helper to determine icon based on file extension
const getFileIcon = (url: string) => {
    if (url.match(/\.(mp4|webm|ogg|mov)$/i)) return <Video className="w-8 h-8" />;
    if (url.match(/\.(pdf|doc|docx|zip)$/i)) return <FileIcon className="w-8 h-8" />;
    return <Camera className="w-8 h-8" />;
};

export default function AdminGalleriesPage() {
    const [galleries, setGalleries] = useState<Gallery[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchGalleries = async () => {
        try {
            const res = await fetch('/api/admin/galleries');
            if (res.ok) {
                const data = await res.json();
                setGalleries(data);
            }
        } catch (err) {
            toast.error('Failed to load galleries');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGalleries();
    }, []);

    const handleDeleteGallery = async (id: string) => {
        if (!confirm('Are you sure you want to permanently delete this entire gallery? This will delete all media items on Cloudinary and cannot be undone.')) return;

        setProcessingId(id);
        try {
            const res = await fetch(`/api/admin/galleries/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                toast.success('Gallery Deleted');
                fetchGalleries();
            } else {
                toast.error('Deletion failed');
            }
        } catch (err) {
            toast.error('An error occurred');
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white uppercase tracking-tight italic">Cloudinary Albums</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage, categorize, and dynamically serve optimized rich media.</p>
                </div>

                <Link href="/admin/galleries/new">
                    <Button className="bg-blue-600 hover:bg-blue-500 h-11 px-6 rounded-xl font-bold gap-2">
                        <Plus size={14} />
                        New Album
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
                </div>
            ) : galleries.length === 0 ? (
                <div className="bg-slate-900/50 border border-slate-800/50 rounded-3xl p-16 text-center space-y-4">
                    <div className="w-20 h-20 bg-slate-800/50 rounded-full flex flex-col items-center justify-center mx-auto mb-4 border border-slate-700/50">
                        <Camera className="text-slate-500" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight">No Albums Found</h3>
                    <p className="text-slate-400 max-w-sm mx-auto">Upload media up to 100MB per file straight to Cloudinary to create your first album.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {galleries.map((gallery) => {
                        const isVideoOrDoc = gallery.images[0]?.url.match(/\.(mp4|webm|ogg|mov|pdf|doc|docx|zip)$/i);

                        return (
                            <div key={gallery.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-4 relative group hover:border-blue-500/30 transition-all flex flex-col">
                                {/* Thumbnail */}
                                <div className="w-full h-40 mb-4 rounded-xl overflow-hidden bg-slate-950 grid grid-cols-2 gap-1 relative group-hover:opacity-100 opacity-90 transition-opacity">
                                    {gallery.images.length >= 1 ? (
                                        isVideoOrDoc ? (
                                            <div className="col-span-2 row-span-2 flex items-center justify-center text-slate-800 bg-slate-900">
                                                {getFileIcon(gallery.images[0].url)}
                                            </div>
                                        ) : (
                                            <img src={gallery.images[0]?.url} alt="" className="w-full h-full object-cover col-span-2 row-span-2" />
                                        )
                                    ) : (
                                        <div className="col-span-2 row-span-2 flex items-center justify-center text-slate-800">
                                            <Camera className="w-8 h-8" />
                                        </div>
                                    )}

                                    {/* Item count overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent flex items-end p-3">
                                        <span className="bg-slate-900/80 backdrop-blur-sm text-slate-300 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg">
                                            {gallery.images.length} Items
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2 flex-1 pt-1 pb-2">
                                    <h3 className="text-sm font-bold text-white capitalize line-clamp-1">{gallery.title}</h3>
                                    {gallery.description && (
                                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{gallery.description}</p>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 pt-2 border-t border-slate-800/50 mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link href={`/admin/galleries/${gallery.id}`} className="flex-1">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full h-8 bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 hover:bg-slate-700 text-xs font-bold"
                                        >
                                            <Edit2 size={12} className="mr-2" /> Edit Album
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleDeleteGallery(gallery.id)}
                                        disabled={processingId === gallery.id}
                                        className="h-8 w-8 bg-slate-800 border-slate-700 text-slate-300 hover:bg-red-500 hover:text-white hover:border-red-500"
                                    >
                                        {processingId === gallery.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
