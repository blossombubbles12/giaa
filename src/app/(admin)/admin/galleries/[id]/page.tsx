'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, CloudUpload, File as FileIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { use } from 'react';

type GalleryImage = {
    url: string;
    publicId: string;
};

// Helper inside
const getFileIcon = (url: string) => {
    if (url.match(/\.(mp4|webm|ogg|mov)$/i)) return <span className="font-black text-xs">VIDEO</span>;
    if (url.match(/\.(pdf|doc|docx|zip)$/i)) return <span className="font-black text-xs">DOC</span>;
    return <span className="font-black text-xs">IMG</span>;
};

export default function EditGalleryPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);

    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [existingImages, setExistingImages] = useState<GalleryImage[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const res = await fetch(`/api/admin/galleries/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setTitle(data.title);
                    setDescription(data.description || '');
                    setExistingImages(data.images || []);
                } else {
                    toast.error('Gallery not found');
                    router.push('/admin/galleries');
                }
            } catch (err) {
                toast.error('An error occurred loading the gallery');
            } finally {
                setLoading(false);
            }
        };

        fetchGallery();
    }, [id, router]);

    const handleSaveGallery = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error('Please enter an album title');
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);

            formData.append('existingImages', JSON.stringify(existingImages));
            newImages.forEach(file => {
                formData.append('newImages', file);
            });

            const res = await fetch(`/api/admin/galleries/${id}`, {
                method: 'PATCH',
                body: formData,
            });

            if (res.ok) {
                toast.success('Album updated successfully!');
                router.push('/admin/galleries');
            } else {
                toast.error('Failed to update gallery');
            }
        } catch (err) {
            toast.error('An error occurred during upload. Files may be too heavy.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const removeNewFile = (index: number) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-6">
                <Link href="/admin/galleries">
                    <Button variant="outline" size="sm" className="bg-slate-900 border-slate-800 text-slate-400 hover:text-white rounded-xl gap-2 h-9 px-4">
                        <ArrowLeft size={14} /> Back to Albums
                    </Button>
                </Link>

                <div>
                    <h1 className="text-2xl font-bold text-white uppercase tracking-tight italic">Edit Cloudinary Album</h1>
                    <p className="text-slate-400 text-sm mt-1">Review existing media or upload new files seamlessly.</p>
                </div>
            </div>

            <form onSubmit={handleSaveGallery} className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 md:p-10 space-y-8 shadow-2xl">
                {/* Text Fields */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Album Title *</Label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. 2024 Tech Summit Keynote"
                            className="bg-slate-950 border-slate-800 h-14 rounded-2xl focus:ring-blue-600 outline-none placeholder:text-slate-700 text-lg px-6"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Description</Label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief overview of the media uploaded..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 h-32 text-sm focus:ring-2 focus:ring-blue-600 outline-none resize-none placeholder:text-slate-700"
                        />
                    </div>
                </div>

                {/* Existing Images Visualizer */}
                {existingImages.length > 0 && (
                    <div className="space-y-2 mt-4 border-t border-slate-800 pt-6">
                        <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest block mb-2">Live Cloudinary Media ({existingImages.length})</Label>
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                            {existingImages.map((img, i) => {
                                const isVideo = img.url.match(/\.(mp4|webm|ogg|mov)$/i);
                                const isDoc = img.url.match(/\.(pdf|doc|docx|zip)$/i);

                                return (
                                    <div key={i} className="relative group rounded-xl overflow-hidden aspect-square border border-slate-800 bg-slate-950 flex flex-col items-center justify-center">
                                        {isVideo || isDoc ? (
                                            <div className="flex flex-col items-center justify-center text-blue-500 space-y-2 text-center p-2 truncate w-full">
                                                <FileIcon className="shrink-0" />
                                                <span className="text-[8px] text-slate-400 font-medium truncate w-full px-2" title={img.url.split('/').pop()}>{img.url.split('/').pop()}</span>
                                            </div>
                                        ) : (
                                            <img src={img.url} alt="Gallery image" className="object-cover w-full h-full opacity-80" />
                                        )}

                                        <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-sm px-2 py-0.5 rounded-md border border-slate-800 shadow-sm z-10">
                                            {getFileIcon(img.url)}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setExistingImages(prev => prev.filter((_, idx) => idx !== i))}
                                            className="absolute inset-0 m-auto w-10 h-10 bg-red-600/95 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity active:scale-95 shadow-xl z-20"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                        <p className="text-xs text-slate-500 italic mt-2 font-medium">Hover over an item and click the X to remove it automatically.</p>
                    </div>
                )}

                {/* Upload Zone */}
                <div className="space-y-4 pt-6 mt-6 border-t border-slate-800">
                    <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest block">
                        Add New Cloudinary Media
                    </Label>

                    <div className="relative group overflow-hidden rounded-3xl bg-slate-950 border-2 border-dashed border-slate-700 hover:border-blue-500 transition-colors">
                        <Input
                            type="file"
                            accept="image/*,video/*,.pdf,.doc,.docx,.zip,.raw"
                            multiple
                            onChange={(e) => {
                                if (e.target.files) {
                                    setNewImages(prev => [...prev, ...Array.from(e.target.files!)]);
                                }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-4 pointer-events-none group-hover:-translate-y-2 transition-transform duration-500">
                            <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                <CloudUpload className="w-8 h-8" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-lg">Drop supplemental files here</h4>
                                <p className="text-slate-500 text-sm mt-1">Images, Videos, and Rich Documents up to <span className="font-bold text-slate-400">100MB</span> each.</p>
                            </div>
                        </div>
                    </div>

                    {/* Pending Upload visualizer */}
                    {newImages.length > 0 && (
                        <div className="pt-6">
                            <h4 className="text-white font-bold text-sm mb-4">Pending Uploads ({newImages.length})</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {newImages.map((file, i) => (
                                    <div key={i} className="relative group bg-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-2 overflow-hidden aspect-square border border-slate-700">
                                        {file.type.startsWith('image/') ? (
                                            <img src={URL.createObjectURL(file)} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                                        ) : (
                                            <FileIcon className="w-8 h-8 text-blue-400 relative z-10" />
                                        )}

                                        <p className="text-[10px] font-bold text-white relative z-10 truncate w-full px-2" title={file.name}>
                                            {file.name}
                                        </p>
                                        <p className="text-[9px] text-slate-400 relative z-10 uppercase font-black">
                                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                                        </p>

                                        <button
                                            type="button"
                                            onClick={() => removeNewFile(i)}
                                            className="absolute top-2 right-2 w-6 h-6 bg-red-600/90 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-lg"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500 h-16 rounded-2xl font-black uppercase tracking-widest mt-8 text-sm shadow-xl shadow-blue-600/20 active:scale-[0.98] transition-transform"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="animate-spin mr-2" /> Saving via Cloudinary API...
                        </>
                    ) : (
                        'Save Live Album Updates'
                    )}
                </Button>
            </form>
        </div>
    );
}
