'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

export default function NewCoursePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [materials, setMaterials] = useState<File[]>([]);
    const [currencySymbol, setCurrencySymbol] = useState('£');
    const materialInputRef = useRef<HTMLInputElement>(null);
    const { execute } = useActionToast();

    useEffect(() => {
        const fetchSettings = async () => {
            const res = await fetch('/api/settings/localization');
            if (res.ok) {
                const data = await res.json();
                setCurrencySymbol(data.currencySymbol);
            }
        };
        fetchSettings();
    }, []);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        formState: { errors }
    } = useForm<CourseForm>({
        resolver: zodResolver(courseSchema) as any,
        defaultValues: {
            type: 'ONLINE',
            published: false,
            schedules: [],
            title: '',
            slug: '',
            description: '',
            price: 0,
            categoryId: null,
            tagIds: [],
            duration: '',
            venue: '',
            certificationTypeId: null,
            year: new Date().getFullYear().toString(),
            month: '',
            accessLink: '',
            targetAudience: '',
            learningOutcomes: ''
        },
    });

    const slugify = (text: string) =>
        text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-');

    const { fields, append, remove } = useFieldArray({
        control,
        name: "schedules"
    });

    const courseType = watch('type');
    const isPublished = watch('published');
    const title = watch('title');

    useEffect(() => {
        if (title) {
            setValue('slug', slugify(title), { shouldValidate: true });
        }
    }, [title, setValue]);

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
            setMaterials(prev => [...prev, ...newFiles]);
        }
    };

    const removeMaterial = (index: number) => {
        setMaterials(prev => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: CourseForm) => {
        setLoading(true);

        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (key === 'schedules' || key === 'tagIds') {
                formData.append(key, JSON.stringify(value));
            } else if (value !== undefined && value !== null) {
                formData.append(key, String(value));
            }
        });

        if (thumbnail) formData.append('thumbnail', thumbnail);
        materials.forEach(file => formData.append('materials', file));

        const { error } = await execute(
            fetch('/api/admin/courses', { method: 'POST', body: formData }).then(async res => {
                if (!res.ok) {
                    const result = await res.json();
                    throw new Error(result.error || 'Failed to create course');
                }
                return res.json();
            }),
            {
                loading: 'Creating course...',
                success: 'Course created successfully!',
                error: (err) => err.message
            }
        );

        setLoading(false);
        if (!error) {
            router.push('/admin/courses');
            router.refresh();
        }
    };

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
                    <h1 className="text-2xl font-bold text-white">New Course</h1>
                    <p className="text-slate-400 text-sm mt-0.5">Fill in the details to add a new premium course</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Basic Info Section */}
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
                                        placeholder="e.g. Advanced Health & Safety Management"
                                        className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-600 focus:border-blue-500 h-12 rounded-xl transition-all"
                                    />
                                    {errors.title && <p className="text-rose-400 text-xs mt-1">{errors.title.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug" className="text-slate-300 text-sm font-medium">URL Slug (SEO)</Label>
                                    <Input
                                        id="slug"
                                        {...register('slug')}
                                        placeholder="course-url-slug"
                                        className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-600 focus:border-blue-500 h-12 rounded-xl transition-all font-mono text-xs"
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
                                            placeholder="Provide a detailed overview of the course content and objectives..."
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

                        {/* Extended Details Section */}
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                            <h2 className="text-white font-semibold flex items-center gap-2 text-lg">
                                <Target size={20} className="text-purple-500" />
                                Enhanced Details
                            </h2>

                            <div className="space-y-2">
                                <Label htmlFor="targetAudience" className="text-slate-300 text-sm font-medium">Who is this course for?</Label>
                                <Controller
                                    control={control}
                                    name="targetAudience"
                                    render={({ field }) => (
                                        <RichTextEditor
                                            value={field.value || ''}
                                            onChange={field.onChange}
                                            placeholder="e.g. Environmental health officers, project managers..."
                                            className="min-h-[100px]"
                                        />
                                    )}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="learningOutcomes" className="text-slate-300 text-sm font-medium">What will participants learn?</Label>
                                <Controller
                                    control={control}
                                    name="learningOutcomes"
                                    render={({ field }) => (
                                        <RichTextEditor
                                            value={field.value || ''}
                                            onChange={field.onChange}
                                            placeholder="List key learning outcomes..."
                                            className="min-h-[150px]"
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* Schedules Section */}
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <h2 className="text-white font-semibold flex items-center gap-2 text-lg">
                                    <Calendar size={20} className="text-amber-500" />
                                    Upcoming Sessions
                                </h2>
                                <Button
                                    type="button"
                                    onClick={() => append({ startDate: '', endDate: '', location: '', capacity: undefined })}
                                    variant="outline"
                                    size="sm"
                                    className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 text-white rounded-xl h-9"
                                >
                                    <Plus size={16} className="mr-1" /> Add Session
                                </Button>
                            </div>

                            {fields.length === 0 && (
                                <div className="border-2 border-dashed border-slate-800 rounded-2xl py-10 flex flex-col items-center justify-center text-slate-500">
                                    <Calendar size={32} className="mb-2 opacity-20" />
                                    <p className="text-sm">No sessions added yet</p>
                                </div>
                            )}

                            <div className="space-y-4">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-4 sm:p-5 relative group">
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="absolute top-4 right-4 text-slate-500 hover:text-rose-500 transition-colors p-1"
                                        >
                                            <Trash2 size={16} />
                                        </button>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-[11px] uppercase tracking-wider text-slate-500 font-bold ml-1">Start Date/Time</Label>
                                                <Input
                                                    type="datetime-local"
                                                    {...register(`schedules.${index}.startDate` as const)}
                                                    className="bg-slate-900/50 border-slate-700 text-white text-xs h-10 px-3 rounded-lg"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-[11px] uppercase tracking-wider text-slate-500 font-bold ml-1">End Date/Time</Label>
                                                <Input
                                                    type="datetime-local"
                                                    {...register(`schedules.${index}.endDate` as const)}
                                                    className="bg-slate-900/50 border-slate-700 text-white text-xs h-10 px-3 rounded-lg"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-[11px] uppercase tracking-wider text-slate-500 font-bold ml-1">Location (Optional)</Label>
                                                <div className="relative">
                                                    <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                                                    <Input
                                                        placeholder="Online / Office HQ"
                                                        {...register(`schedules.${index}.location` as const)}
                                                        className="bg-slate-900/50 border-slate-700 text-white text-xs h-10 pl-9 pr-3 rounded-lg"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-[11px] uppercase tracking-wider text-slate-500 font-bold ml-1">Capacity</Label>
                                                <div className="relative">
                                                    <UsersIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                                                    <Input
                                                        type="number"
                                                        placeholder="Infinite"
                                                        {...register(`schedules.${index}.capacity` as const)}
                                                        className="bg-slate-900/50 border-slate-700 text-white text-xs h-10 pl-9 pr-3 rounded-lg"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Settings & Uploads) */}
                    <div className="space-y-8">

                        {/* Delivery Type & Links */}
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-sm">
                            <h2 className="text-white font-semibold flex items-center gap-2 text-base">
                                <Globe size={18} className="text-emerald-500" />
                                Delivery & Pricing
                            </h2>

                            <div className="space-y-3">
                                <Label className="text-slate-300 text-xs">Course Type</Label>
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

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="price" className="text-slate-300 text-xs font-medium">Price ({currencySymbol})</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        {...register('price')}
                                        className="bg-slate-800/50 border-slate-700 text-white h-11 rounded-xl"
                                    />
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

                                {courseType === 'ONLINE' && (
                                    <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
                                        <Label htmlFor="accessLink" className="text-slate-300 text-xs font-medium flex items-center gap-1.5">
                                            <LinkIcon size={12} className="text-slate-500" /> Access Link (Zoom/LMS)
                                        </Label>
                                        <Input
                                            id="accessLink"
                                            {...register('accessLink')}
                                            placeholder="https://zoom.us/j/..."
                                            className="bg-slate-800/50 border-slate-700 text-white h-11 rounded-xl placeholder:text-slate-600"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Thumbnail Upload */}
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
                            <h2 className="text-white font-semibold flex items-center gap-2 text-base">
                                <Upload size={18} className="text-blue-500" />
                                Thumbnail
                            </h2>
                            {thumbnailPreview ? (
                                <div className="relative rounded-2xl overflow-hidden group">
                                    <img src={thumbnailPreview} alt="Preview" className="w-full h-44 object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => { setThumbnail(null); setThumbnailPreview(null); }}
                                            className="rounded-xl"
                                        >
                                            <Trash2 size={14} className="mr-1.5" /> Remove
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center h-44 border-2 border-dashed border-slate-800 hover:border-blue-500/50 bg-slate-800/20 rounded-2xl cursor-pointer transition-all">
                                    <Upload size={32} className="text-slate-700 mb-3" />
                                    <p className="text-slate-400 text-xs font-medium">Upload Course Banner</p>
                                    <p className="text-slate-600 text-[10px] mt-1 uppercase tracking-tighter">JPG, PNG (max 5MB)</p>
                                    <input type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
                                </label>
                            )}
                        </div>

                        {/* Materials Upload */}
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <h2 className="text-white font-semibold flex items-center gap-2 text-base">
                                    <FileText size={18} className="text-rose-500" />
                                    Materials
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => materialInputRef.current?.click()}
                                    className="text-slate-500 hover:text-white transition-colors"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>

                            <input
                                type="file"
                                multiple
                                accept=".pdf,.doc,.docx"
                                ref={materialInputRef}
                                onChange={handleMaterialChange}
                                className="hidden"
                            />

                            {materials.length === 0 ? (
                                <p className="text-slate-600 text-[11px] text-center py-4 border border-dashed border-slate-800 rounded-xl">
                                    Support documents (PDFs)
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {materials.map((file, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-slate-800/50 px-3 py-2 rounded-xl border border-slate-700/50">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <FileText size={14} className="text-slate-500 shrink-0" />
                                                <span className="text-[11px] text-slate-300 truncate font-medium">{file.name}</span>
                                            </div>
                                            <button type="button" onClick={() => removeMaterial(idx)} className="text-slate-500 hover:text-rose-500">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Status & Final Action */}
                        <div className="bg-slate-900 border-2 border-blue-600/20 rounded-3xl p-6 space-y-4 shadow-lg shadow-blue-600/5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${isPublished ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-600'}`} />
                                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                                        {isPublished ? 'Live' : 'Draft'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setValue('published', !isPublished)}
                                    className={`relative w-12 h-6.5 rounded-full transition-all duration-300 flex items-center px-1 ${isPublished ? 'bg-blue-600' : 'bg-slate-700'}`}
                                >
                                    <div className={`w-4.5 h-4.5 bg-white rounded-full transition-all duration-300 shadow-sm ${isPublished ? 'translate-x-5.5' : 'translate-x-0'}`} />
                                </button>
                                <span className="text-xs text-slate-400 font-medium">
                                    {isPublished ? 'Course will be visible to students' : 'Private to admins only'}
                                </span>
                            </div>

                            <div className="pt-2 flex flex-col gap-2">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-2xl h-12 font-bold gap-2 shadow-xl shadow-blue-600/20 active:scale-95 transition-all text-sm"
                                >
                                    {loading ? <><Loader2 size={16} className="animate-spin" /> Publishing...</> : 'Create & Publish'}
                                </Button>
                                <Link href="/admin/courses" className="w-full">
                                    <Button variant="ghost" className="w-full text-slate-500 hover:text-white rounded-2xl text-xs font-medium">
                                        Discard Changes
                                    </Button>
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </form>
        </div>
    );
}
