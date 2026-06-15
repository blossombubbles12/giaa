'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, CloudUpload, File as FileIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function NewGalleryPage() {
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [newImages, setNewImages] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSaveGallery = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error('Please enter an album title');
            return;
        }

        if (newImages.length === 0) {
            toast.error('Please upload at least one item to create an album');
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);

            newImages.forEach(file => {
                formData.append('images', file);
            });

            const res = await fetch('/api/admin/galleries', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                toast.success('Album created successfully!');
                router.push('/admin/galleries');
            } else {
                toast.error('Failed to save gallery');
            }
        } catch (err) {
            toast.error('An error occurred during upload. Files may be too heavy.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const removeFile = (index: number) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
    };

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
                    <h1 className="text-2xl font-bold text-white uppercase tracking-tight italic">Create New Album</h1>
                    <p className="text-slate-400 text-sm mt-1">Upload standard images, videos, or raw documents up to <span className="text-blue-500 font-bold">100MB</span> each directly to Cloudinary.</p>
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

                {/* Upload Zone */}
                <div className="space-y-4 pt-6 mt-6 border-t border-slate-800">
                    <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest block">
                        Upload Media Files *
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
                                <h4 className="text-white font-bold text-lg">Drop files out here or click to browse</h4>
                                <p className="text-slate-500 text-sm mt-1">Supports Images, Videos (MP4/MOV), and Documents up to <span className="font-bold text-slate-400">100MB</span> each.</p>
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
                                            onClick={() => removeFile(i)}
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
                            <Loader2 className="animate-spin mr-2" /> Uploading to Cloudinary...
                        </>
                    ) : (
                        'Upload Media & Create Album'
                    )}
                </Button>
            </form>
        </div>
    );
}
