'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Loader2,
    ArrowLeft,
    Upload,
    BookOpen,
    Plus,
    Trash2,
    Calendar,
    Clock,
    Link as LinkIcon,
    Users as UsersIcon,
    Target,
    Tag,
    FileText,
    Globe,
    MapPin,
    ExternalLink,
    Type,
    Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Link from 'next/link';
import { useActionToast } from '@/hooks/use-action-toast';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

import { Controller } from 'react-hook-form';
import { CategorySelect } from '@/components/admin/courses/category-select';
import { TagMultiSelect } from '@/components/admin/courses/tag-multi-select';
import { CertificationSelect } from '@/components/admin/courses/certification-select';

const scheduleSchema = z.object({
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    location: z.string().optional(),
    capacity: z.coerce.number().optional(),
});

const courseSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    slug: z.string().min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase letters, numbers, and hyphens'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    price: z.coerce.number().min(0, 'Price must be 0 or more'),
    type: z.enum(['ONLINE', 'OFFLINE']),
    duration: z.string().optional(),
    venue: z.string().optional(),
    certificationTypeId: z.string().nullable().optional(),
    year: z.string().optional(),
    month: z.string().optional(),
    accessLink: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    categoryId: z.string().nullable().optional(),
    tagIds: z.array(z.string()).optional(),
    targetAudience: z.string().optional(),
    learningOutcomes: z.string().optional(),
    published: z.boolean().optional(),
    schedules: z.array(scheduleSchema).optional(),
});

type CourseForm = z.infer<typeof courseSchema>;

export default function EditCoursePage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [currencySymbol, setCurrencySymbol] = useState('£');
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [existingMaterials, setExistingMaterials] = useState<any[]>([]);
    const [newMaterials, setNewMaterials] = useState<File[]>([]);
    const materialInputRef = useRef<HTMLInputElement>(null);
    const { execute } = useActionToast();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        reset,
        formState: { errors }
    } = useForm<CourseForm>({
        resolver: zodResolver(courseSchema) as any,
        defaultValues: {
            type: 'ONLINE',
            published: false,
            schedules: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "schedules"
    });

    const courseType = watch('type');
    const isPublished = watch('published');
    const title = watch('title');

    const slugify = (text: string) =>
        text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-');

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const [cRes, sRes] = await Promise.all([
                    fetch(`/api/admin/courses/${id}`),
                    fetch('/api/settings/localization')
                ]);

                if (!cRes.ok) throw new Error('Failed to fetch course');
                const data = await cRes.json();

                if (sRes.ok) {
                    const sData = await sRes.json();
                    setCurrencySymbol(sData.currencySymbol);
                }

                reset({
                    title: data.title,
                    slug: data.slug,
                    description: data.description,
                    price: data.price,
                    type: data.type,
                    duration: data.duration || '',
                    venue: data.venue || '',
                    certificationTypeId: data.certificationTypeId || null,
                    year: data.year || new Date().getFullYear().toString(),
                    month: data.month || '',
                    accessLink: data.accessLink || '',
                    categoryId: data.categoryId,
                    tagIds: data.courseTags?.map((ct: any) => ct.tagId) || [],
                    targetAudience: data.targetAudience || '',
                    learningOutcomes: data.learningOutcomes || '',
                    published: data.published,
                    schedules: data.schedules?.map((s: any) => ({
                        startDate: new Date(s.startDate).toISOString().slice(0, 16),
                        endDate: new Date(s.endDate).toISOString().slice(0, 16),
                        location: s.location || '',
                        capacity: s.capacity || undefined,
                    })) || []
                });

                setThumbnailPreview(data.thumbnail);
                setExistingMaterials(data.materials || []);
            } catch (err) {
                toast.error('Could not load course data');
                router.push('/admin/courses');
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id, reset, router]);

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setThumbnail(file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const handleMaterialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setNewMaterials(prev => [...prev, ...newFiles]);
        }
    };

    const removeNewMaterial = (index: number) => {
        setNewMaterials(prev => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: CourseForm) => {
        setSaving(true);

        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (key === 'schedules' || key === 'tagIds') {
                formData.append(key, JSON.stringify(value));
            } else if (value !== undefined && value !== null) {
                formData.append(key, String(value));
            } else if (key === 'categoryId' && value === null) {
                formData.append(key, 'null');
            }
        });

        if (thumbnail) formData.append('thumbnail', thumbnail);
        newMaterials.forEach(file => formData.append('materials', file));

        const { error } = await execute(
            fetch(`/api/admin/courses/${id}`, { method: 'PATCH', body: formData }).then(async res => {
                if (!res.ok) {
                    const result = await res.json();
                    throw new Error(result.error || 'Failed to update course');
                }
                return res.json();
            }),
            {
                loading: 'Updating course...',
                success: 'Course updated successfully!',
                error: (err) => err.message
            }
        );

        setSaving(false);
        if (!error) {
            router.refresh();
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 size={40} className="text-blue-500 animate-spin" />
                <p className="text-slate-400 animate-pulse font-medium">Loading course data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-7xl pb-10 px-4 sm:px-0 mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/courses">
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl">
                        <ArrowLeft size={18} />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Edit Course</h1>
                    <p className="text-slate-400 text-sm mt-0.5">Update your course content and parameters</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Column */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                            <h2 className="text-white font-semibold flex items-center gap-2 text-lg">
                                <BookOpen size={20} className="text-blue-500" />
                                Core Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-slate-300 text-sm font-medium">Course Title</Label>
                                    <Input
                                        id="title"
                                        {...register('title')}
                                        className="bg-slate-800/50 border-slate-700 text-white h-12 rounded-xl"
                                    />
                                    {errors.title && <p className="text-rose-400 text-xs mt-1">{errors.title.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug" className="text-slate-300 text-sm font-medium">URL Slug (SEO)</Label>
                                    <Input
                                        id="slug"
                                        {...register('slug')}
                                        className="bg-slate-800/50 border-slate-700 text-white h-12 rounded-xl font-mono text-xs"
                                    />
                                    {errors.slug && <p className="text-rose-400 text-xs mt-1">{errors.slug.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-slate-300 text-sm font-medium">Description</Label>
                                <Controller
                                    control={control}
                                    name="description"
                                    render={({ field }) => (
                                        <RichTextEditor
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Provide a detailed overview of the course content..."
                                        />
                                    )}
                                />
                                {errors.description && <p className="text-rose-400 text-xs mt-1">{errors.description.message}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-slate-300 text-sm font-medium">Category</Label>
                                    <Controller
                                        control={control}
                                        name="categoryId"
                                        render={({ field }) => (
                                            <CategorySelect value={field.value} onChange={field.onChange} />
                                        )}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300 text-sm font-medium">Tags</Label>
                                    <Controller
                                        control={control}
                                        name="tagIds"
                                        render={({ field }) => (
                                            <TagMultiSelect value={field.value || []} onChange={field.onChange} />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                            <h2 className="text-white font-semibold flex items-center gap-2 text-lg">
                                <Calendar size={20} className="text-amber-500" />
                                Schedules
                            </h2>
                            <div className="space-y-4">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="bg-slate-800/30 border border-slate-700 rounded-2xl p-4 sm:p-5 relative">
                                        <button type="button" onClick={() => remove(index)} className="absolute top-4 right-4 text-slate-500 hover:text-rose-500"><Trash2 size={16} /></button>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] uppercase text-slate-500 font-bold">Start</Label>
                                                <Input type="datetime-local" {...register(`schedules.${index}.startDate` as const)} className="bg-slate-900/50 border-slate-700 text-white text-xs h-10 rounded-lg" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] uppercase text-slate-500 font-bold">End</Label>
                                                <Input type="datetime-local" {...register(`schedules.${index}.endDate` as const)} className="bg-slate-900/50 border-slate-700 text-white text-xs h-10 rounded-lg" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <Button type="button" onClick={() => append({ startDate: '', endDate: '', location: '' })} variant="outline" className="w-full bg-slate-800/50 border-dashed border-slate-700 text-slate-400 hover:text-white rounded-xl h-12">
                                    <Plus size={16} className="mr-2" /> Add Session Slot
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-3">
                                    <Label className="text-slate-300 text-xs font-medium">Course Delivery Type</Label>
                                    <div className="flex gap-2 p-1.5 bg-slate-800/50 border border-slate-700 rounded-2xl">
                                        {['ONLINE', 'OFFLINE'].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setValue('type', type as 'ONLINE' | 'OFFLINE')}
                                                className={`flex-1 h-10 rounded-xl text-xs font-bold transition-all ${courseType === type
                                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {courseType === 'ONLINE' && (
                                    <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                                        <Label htmlFor="accessLink" className="text-slate-300 text-xs font-medium flex items-center gap-1.5">
                                            <LinkIcon size={12} className="text-blue-500" /> Course Access Link
                                        </Label>
                                        <Input
                                            id="accessLink"
                                            {...register('accessLink')}
                                            placeholder="https://..."
                                            className="bg-slate-800/50 border-slate-700 text-white h-11 rounded-xl placeholder:text-slate-600 font-mono text-[10px]"
                                        />
                                    </div>
                                )}

                                <div className="space-y-1.5">
                                    <Label htmlFor="price" className="text-slate-300 text-xs font-medium">Price ({currencySymbol})</Label>
                                    <Input type="number" step="0.01" {...register('price')} className="bg-slate-800/50 border-slate-700 text-white h-11 rounded-xl" />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="duration" className="text-slate-300 text-xs font-medium flex items-center gap-1.5">
                                        <Clock size={12} className="text-slate-500" /> Duration
                                    </Label>
                                    <Input
                                        id="duration"
                                        {...register('duration')}
                                        placeholder="e.g. 4 Weeks, 3 Days"
                                        className="bg-slate-800/50 border-slate-700 text-white h-11 rounded-xl placeholder:text-slate-600"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="venue" className="text-slate-300 text-xs font-medium flex items-center gap-1.5">
                                        <MapPin size={12} className="text-slate-500" /> Venue / Location
                                    </Label>
                                    <Input
                                        id="venue"
                                        {...register('venue')}
                                        placeholder="e.g. Lagos, Nigeria"
                                        className="bg-slate-800/50 border-slate-700 text-white h-11 rounded-xl placeholder:text-slate-600"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="year" className="text-slate-300 text-xs font-medium">Scheduled Year</Label>
                                        <select
                                            id="year"
                                            {...register('year')}
                                            className="w-full bg-slate-800/50 border-slate-700 text-white h-11 rounded-xl text-xs px-3 outline-none focus:ring-2 focus:ring-blue-600/20 appearance-none"
                                        >
                                            {[2024, 2025, 2026, 2027].map(y => (
                                                <option key={y} value={y}>{y}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="month" className="text-slate-300 text-xs font-medium">Scheduled Month</Label>
                                        <select
                                            id="month"
                                            {...register('month')}
                                            className="w-full bg-slate-800/50 border-slate-700 text-white h-11 rounded-xl text-xs px-3 outline-none focus:ring-2 focus:ring-blue-600/20 appearance-none"
                                        >
                                            <option value="">Month</option>
                                            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                                                <option key={m} value={m}>{m}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-slate-300 text-xs font-medium flex items-center gap-1.5">
                                        <Award size={12} className="text-amber-500" /> Certification
                                    </Label>
                                    <CertificationSelect
                                        value={watch('certificationTypeId')}
                                        onChange={(val) => setValue('certificationTypeId', val)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
                            <h2 className="text-white font-semibold flex items-center gap-2 text-base"><Upload size={18} className="text-blue-500" />Thumbnail</h2>
                            {thumbnailPreview && (
                                <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
                                    <img src={thumbnailPreview} alt="Preview" className="w-full h-40 object-cover" />
                                </div>
                            )}
                            <label className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-700 hover:border-blue-500/50 rounded-2xl cursor-pointer">
                                <span className="text-xs text-slate-400">Change Banner</span>
                                <input type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
                            </label>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                            <h2 className="text-white font-semibold flex items-center justify-between text-base">
                                <span>Materials</span>
                                <button type="button" onClick={() => materialInputRef.current?.click()} className="text-blue-500 hover:text-blue-400"><Plus size={18} /></button>
                            </h2>

                            <input type="file" multiple ref={materialInputRef} onChange={handleMaterialChange} className="hidden" />

                            <div className="space-y-2">
                                {existingMaterials.map((m, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-slate-800/50 px-3 py-2 rounded-xl border border-slate-700/50 group">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <FileText size={14} className="text-blue-500 shrink-0" />
                                            <span className="text-[11px] text-slate-300 truncate">{m.title}</span>
                                        </div>
                                        <a href={m.fileUrl} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white"><ExternalLink size={12} /></a>
                                    </div>
                                ))}
                                {newMaterials.map((file, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-emerald-900/20 px-3 py-2 rounded-xl border border-emerald-500/30">
                                        <div className="flex items-center gap-2 min-w-0 font-bold">
                                            <Plus size={14} className="text-emerald-500 shrink-0" />
                                            <span className="text-[11px] text-emerald-400 truncate">{file.name}</span>
                                        </div>
                                        <button type="button" onClick={() => removeNewMaterial(idx)} className="text-emerald-500 hover:text-rose-500"><Trash2 size={12} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-900 border-2 border-blue-600/20 rounded-3xl p-6 space-y-6">
                            <div className="flex items-center gap-3">
                                <button type="button" onClick={() => setValue('published', !isPublished)} className={`relative w-12 h-6.5 rounded-full transition-all ${isPublished ? 'bg-blue-600' : 'bg-slate-700'}`}>
                                    <div className={`w-4.5 h-4.5 bg-white rounded-full transition-all ${isPublished ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                </button>
                                <span className="text-xs text-slate-400 font-bold">{isPublished ? 'Live' : 'Hidden'}</span>
                            </div>
                            <Button type="submit" disabled={saving} className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-2xl h-12 font-bold shadow-blue-600/20 transition-all">
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
