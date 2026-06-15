'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Clock, Globe2, MapPin, ArrowRight, X, SlidersHorizontal,
    Star, BookOpen, Tag, ChevronDown, ChevronUp, Filter, LayoutGrid, List
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/frontend/layout/PageHeader';

interface CoursesClientProps {
    initialCourses: any[];
    categories: any[];
    tags: any[];
    certificationTypes: any[];
    currencySymbol: string;
}

const ITEMS_PER_PAGE = 20;

interface FilterSidebarProps {
    isMobile?: boolean;
    search: string;
    setSearch: (val: string) => void;
    categories: any[];
    initialCourses: any[];
    getCategoryCount: (catId: string) => number;
    selectedCategory: string | null;
    setSelectedCategory: (val: string | null) => void;
    expandedSections: any;
    toggleSection: (key: any) => void;
    selectedType: string | null;
    setSelectedType: (val: string | null) => void;
    getTypeCount: (type: string) => number;
    certificationTypes: any[];
    selectedCert: string | null;
    setSelectedCert: (val: string | null) => void;
    selectedYear: string | null;
    setSelectedYear: (val: string | null) => void;
    selectedMonth: string | null;
    setSelectedMonth: (val: string | null) => void;
    selectedVenues: string[];
    toggleVenue: (venue: string) => void;
    availableVenues: string[];
    selectedDurations: string[];
    toggleDuration: (duration: string) => void;
    availableDurations: string[];
    priceRange: string | null;
    setPriceRange: (val: string | null) => void;
    currencySymbol: string;
    tags: any[];
    selectedTags: string[];
    toggleTag: (tagId: string) => void;
    activeFilterCount: number;
    clearAllFilters: () => void;
    showSuggestions: boolean;
    setShowSuggestions: (val: boolean) => void;
    suggestions: any[];
}

export function CoursesClient({ initialCourses, categories, tags, certificationTypes, currencySymbol }: CoursesClientProps) {
    const searchParams = useSearchParams();
    const categoryFromUrl = searchParams.get('category');

    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryFromUrl);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [selectedCert, setSelectedCert] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
    const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
    const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState('newest');
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const suggestions = useMemo(() => {
        if (!search || search.length < 2) return [];
        return initialCourses
            .filter(c => c.title.toLowerCase().includes(search.toLowerCase()))
            .slice(0, 5);
    }, [search, initialCourses]);

    // Sync category from URL
    useEffect(() => {
        setSelectedCategory(categoryFromUrl);
        setVisibleCount(ITEMS_PER_PAGE);
    }, [categoryFromUrl]);

    // Reset pagination when filters change
    useEffect(() => {
        setVisibleCount(ITEMS_PER_PAGE);
    }, [search, selectedCategory, selectedType, selectedTags, selectedCert, selectedYear, selectedMonth, selectedVenues, selectedDurations, priceRange, sortBy]);

    // Collapsed states for filter sections
    const [expandedSections, setExpandedSections] = useState({
        category: false,
        type: false,
        certification: false,
        timing: false,
        location: false,
        duration: false,
        price: false,
        tags: false,
    });

    const toggleSection = (key: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleVenue = (venue: string) => {
        setSelectedVenues(prev =>
            prev.includes(venue) ? prev.filter(v => v !== venue) : [...prev, venue]
        );
    };

    const toggleDuration = (duration: string) => {
        setSelectedDurations(prev =>
            prev.includes(duration) ? prev.filter(d => d !== duration) : [...prev, duration]
        );
    };

    const toggleTag = (tagId: string) => {
        setSelectedTags(prev =>
            prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
        );
    };

    const prices = initialCourses.map(c => Number(c.price));
    const maxPrice = Math.max(...prices, 0);

    const availableVenues = useMemo(() => {
        const venues = initialCourses
            .map(c => c.venue)
            .filter(Boolean)
            .map(v => v.trim());
        return Array.from(new Set(venues)).sort();
    }, [initialCourses]);

    const availableDurations = useMemo(() => {
        const durations = initialCourses
            .map(c => c.duration)
            .filter(Boolean)
            .map(d => d.trim());
        return Array.from(new Set(durations)).sort();
    }, [initialCourses]);

    const filteredCourses = useMemo(() => {
        let results = initialCourses.filter((course: any) => {
            const matchesSearch = !search ||
                course.title.toLowerCase().includes(search.toLowerCase()) ||
                course.description?.toLowerCase().includes(search.toLowerCase());

            const matchesCategory = !selectedCategory || course.categoryId === selectedCategory;

            const matchesType = !selectedType || course.type === selectedType;

            const matchesTags = selectedTags.length === 0 ||
                course.courseTags?.some((ct: any) => selectedTags.includes(ct.tagId));

            const matchesCert = !selectedCert || course.certificationTypeId === selectedCert;
            const matchesYear = !selectedYear || String(course.year) === selectedYear;
            const matchesMonth = !selectedMonth || course.month === selectedMonth;
            const matchesVenues = selectedVenues.length === 0 || (course.venue && selectedVenues.includes(course.venue.trim()));
            const matchesDurations = selectedDurations.length === 0 || (course.duration && selectedDurations.includes(course.duration.trim()));

            let matchesPrice = true;
            const price = Number(course.price);
            if (priceRange === 'free') matchesPrice = price === 0;
            else if (priceRange === 'under100k') matchesPrice = price > 0 && price < 100000;
            else if (priceRange === '100k-500k') matchesPrice = price >= 100000 && price <= 500000;
            else if (priceRange === 'above500k') matchesPrice = price > 500000;

            return matchesSearch && matchesCategory && matchesType && matchesTags && matchesCert && matchesYear && matchesMonth && matchesVenues && matchesDurations && matchesPrice;
        });

        // Sort
        if (sortBy === 'price-low') results.sort((a, b) => Number(a.price) - Number(b.price));
        else if (sortBy === 'price-high') results.sort((a, b) => Number(b.price) - Number(a.price));
        else if (sortBy === 'title') results.sort((a, b) => a.title.localeCompare(b.title));
        // newest is default order

        return results;
    }, [search, selectedCategory, selectedType, selectedTags, selectedCert, selectedYear, selectedMonth, selectedVenues, selectedDurations, priceRange, sortBy, initialCourses]);

    const activeFilterCount = [selectedCategory, selectedType, priceRange].filter(Boolean).length + selectedTags.length + selectedVenues.length + selectedDurations.length;

    const clearAllFilters = () => {
        setSearch('');
        setSelectedCategory(null);
        setSelectedTags([]);
        setSelectedType(null);
        setSelectedCert(null);
        setSelectedYear(null);
        setSelectedMonth(null);
        setSelectedVenues([]);
        setSelectedDurations([]);
        setPriceRange(null);
        setSortBy('newest');
        setVisibleCount(ITEMS_PER_PAGE);
    };

    const getCategoryCountLocal = (catId: string) =>
        initialCourses.filter((course: any) => course.categoryId === catId).length;

    const getTypeCountLocal = (type: string) =>
        initialCourses.filter((course: any) => course.type === type).length;

    const visibleCourses = filteredCourses.slice(0, visibleCount);
    const hasMore = visibleCount < filteredCourses.length;

    const sidebarProps: FilterSidebarProps = {
        search, setSearch, categories, initialCourses,
        getCategoryCount: getCategoryCountLocal,
        selectedCategory, setSelectedCategory,
        expandedSections, toggleSection, selectedType, setSelectedType,
        getTypeCount: getTypeCountLocal,
        certificationTypes,
        selectedCert, setSelectedCert, selectedYear, setSelectedYear, selectedMonth, setSelectedMonth,
        selectedVenues, toggleVenue, availableVenues, selectedDurations, toggleDuration, availableDurations,
        priceRange, setPriceRange, currencySymbol, tags, selectedTags, toggleTag,
        activeFilterCount, clearAllFilters, showSuggestions, setShowSuggestions, suggestions
    };

    return (
        <div className="bg-white dark:bg-navy min-h-screen">

            <PageHeader 
                title="Professional Courses"
                description="Browse accredited professional certifications designed by industry veterans. Invest in your career growth today."
                breadcrumbs={[{ name: 'Training Courses' }]}
            />

            {/* ═══ Toolbar ═══ */}
            <div className="border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-navy sticky top-16 z-30 shadow-sm">
                <div className="container flex flex-row flex-nowrap items-center justify-between py-3 gap-2 sm:gap-4 overflow-hidden">
                    <div className="flex items-center gap-3">
                        {/* Mobile filter toggle */}
                        <Button variant="outline" onClick={() => setShowMobileFilters(!showMobileFilters)} className="lg:hidden rounded-lg gap-2 text-xs font-semibold border-slate-200 dark:border-slate-700">
                            <SlidersHorizontal size={14} />
                            Filters
                            {activeFilterCount > 0 && (
                                <span className="w-5 h-5 rounded-full bg-primary-blue text-white text-[10px] flex items-center justify-center font-bold">{activeFilterCount}</span>
                            )}
                        </Button>
                        <span className="text-sm text-slate-500 font-medium hidden sm:inline">
                            <strong className="text-slate-900 dark:text-white">{filteredCourses.length}</strong> results
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="text-sm font-medium bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
                        >
                            <option value="newest">Newest First</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="title">A–Z</option>
                        </select>

                        {/* View toggle */}
                        <div className="hidden sm:flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={cn("p-2 transition-colors", viewMode === 'grid' ? "bg-primary-blue text-white" : "text-slate-400 hover:text-slate-600")}
                            >
                                <LayoutGrid size={16} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={cn("p-2 transition-colors", viewMode === 'list' ? "bg-primary-blue text-white" : "text-slate-400 hover:text-slate-600")}
                            >
                                <List size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══ Content Area ═══ */}
            <div className="container py-8">
                <div className="flex gap-8">

                    {/* ——— Desktop Sidebar ——— */}
                    <aside className="hidden lg:block w-[260px] shrink-0">
                        <FilterSidebar {...sidebarProps} />
                    </aside>

                    {/* ——— Mobile Filter Drawer ——— */}
                    <AnimatePresence>
                        {showMobileFilters && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] lg:hidden"
                                    onClick={() => setShowMobileFilters(false)}
                                />
                                <motion.div
                                    initial={{ x: '100%' }}
                                    animate={{ x: 0 }}
                                    exit={{ x: '100%' }}
                                    transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                                    className="fixed top-0 right-0 bottom-0 w-full max-w-[340px] bg-white dark:bg-navy z-[101] shadow-2xl lg:hidden flex flex-col"
                                >
                                    {/* Mobile Drawer Header */}
                                    <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
                                        <div className="flex items-center gap-2">
                                            <Filter size={18} className="text-primary-blue" />
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Filter Courses</h3>
                                        </div>
                                        <button
                                            onClick={() => setShowMobileFilters(false)}
                                            className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                        >
                                            <X size={22} />
                                        </button>
                                    </div>

                                    {/* Mobile Drawer Content */}
                                    <div className="flex-1 overflow-y-auto px-5 py-6">
                                        <FilterSidebar {...sidebarProps} isMobile />
                                    </div>

                                    {/* Mobile Drawer Footer (Sticky Actions) */}
                                    <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-navy shrink-0 flex items-center gap-3">
                                        <Button
                                            variant="outline"
                                            onClick={clearAllFilters}
                                            className="flex-1 h-12 rounded-xl text-xs font-bold border-slate-200 dark:border-slate-700"
                                            disabled={activeFilterCount === 0}
                                        >
                                            Reset All
                                        </Button>
                                        <Button
                                            onClick={() => setShowMobileFilters(false)}
                                            className="flex-1 h-12 rounded-xl bg-primary-blue hover:bg-primary-blue/90 text-white text-xs font-bold shadow-lg shadow-primary-blue/20"
                                        >
                                            Apply Filters
                                        </Button>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    {/* ——— Course Grid / List ——— */}
                    <div className="flex-1 min-w-0">

                        {/* Active filters display */}
                        {activeFilterCount > 0 && (
                            <div className="flex flex-wrap items-center gap-2 mb-6">
                                {selectedCategory && (
                                    <Badge variant="secondary" className="gap-1.5 pr-1.5 rounded-lg">
                                        {categories.find(c => c.id === selectedCategory)?.name}
                                        <button onClick={() => setSelectedCategory(null)} className="ml-1 hover:text-red-500"><X size={12} /></button>
                                    </Badge>
                                )}
                                {selectedType && (
                                    <Badge variant="secondary" className="gap-1.5 pr-1.5 rounded-lg">
                                        {selectedType === 'ONLINE' ? 'Online' : 'In-Person'}
                                        <button onClick={() => setSelectedType(null)} className="ml-1 hover:text-red-500"><X size={12} /></button>
                                    </Badge>
                                )}
                                {selectedCert && (
                                    <Badge variant="secondary" className="gap-1.5 pr-1.5 rounded-lg">
                                        {certificationTypes.find(c => c.id === selectedCert)?.name}
                                        <button onClick={() => setSelectedCert(null)} className="ml-1 hover:text-red-500"><X size={12} /></button>
                                    </Badge>
                                )}
                                {selectedYear && (
                                    <Badge variant="secondary" className="gap-1.5 pr-1.5 rounded-lg">
                                        Year: {selectedYear}
                                        <button onClick={() => setSelectedYear(null)} className="ml-1 hover:text-red-500"><X size={12} /></button>
                                    </Badge>
                                )}
                                {selectedMonth && (
                                    <Badge variant="secondary" className="gap-1.5 pr-1.5 rounded-lg">
                                        Month: {selectedMonth}
                                        <button onClick={() => setSelectedMonth(null)} className="ml-1 hover:text-red-500"><X size={12} /></button>
                                    </Badge>
                                )}
                                {selectedVenues.map(venue => (
                                    <Badge key={venue} variant="secondary" className="gap-1.5 pr-1.5 rounded-lg">
                                        Venue: {venue}
                                        <button onClick={() => toggleVenue(venue)} className="ml-1 hover:text-red-500"><X size={12} /></button>
                                    </Badge>
                                ))}
                                {selectedDurations.map(duration => (
                                    <Badge key={duration} variant="secondary" className="gap-1.5 pr-1.5 rounded-lg">
                                        Duration: {duration}
                                        <button onClick={() => toggleDuration(duration)} className="ml-1 hover:text-red-500"><X size={12} /></button>
                                    </Badge>
                                ))}
                                {priceRange && (
                                    <Badge variant="secondary" className="gap-1.5 pr-1.5 rounded-lg">
                                        {priceRange}
                                        <button onClick={() => setPriceRange(null)} className="ml-1 hover:text-red-500"><X size={12} /></button>
                                    </Badge>
                                )}
                                {selectedTags.map(tagId => {
                                    const tag = tags.find(t => t.id === tagId);
                                    return tag ? (
                                        <Badge key={tagId} variant="secondary" className="gap-1.5 pr-1.5 rounded-lg">
                                            {tag.name}
                                            <button onClick={() => toggleTag(tagId)} className="ml-1 hover:text-red-500"><X size={12} /></button>
                                        </Badge>
                                    ) : null;
                                })}
                                <button onClick={clearAllFilters} className="text-xs text-primary-blue font-semibold hover:underline ml-2">
                                    Clear all
                                </button>
                            </div>
                        )}

                        {/* Grid View */}
                        {viewMode === 'grid' ? (
                            <motion.div layout className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                                <AnimatePresence mode="popLayout">
                                    {visibleCourses.map((course: any) => (
                                        <motion.div
                                            key={course.id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Link href={`/courses/${course.slug}`} className="block group">
                                                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:shadow-lg hover:border-primary-blue/30 transition-all duration-300 h-full flex flex-col">
                                                    {/* Image */}
                                                    <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-900">
                                                        {course.thumbnail ? (
                                                            <img
                                                                src={course.thumbnail}
                                                                alt={course.title}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                                <BookOpen size={40} />
                                                            </div>
                                                        )}
                                                        <div className="absolute top-3 left-3">
                                                            <Badge className="bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-semibold border-0 rounded-md shadow-sm">
                                                                {course.category?.name || 'Professional'}
                                                            </Badge>
                                                        </div>
                                                    </div>

                                                    {/* Content */}
                                                    <div className="p-5 flex-1 flex flex-col">
                                                        <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-primary-blue transition-colors line-clamp-2 mb-2">
                                                            {course.title}
                                                        </h3>
                                                        <div
                                                            className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1"
                                                            dangerouslySetInnerHTML={{ __html: course.description }}
                                                        />

                                                        {/* Meta row */}
                                                        <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                                                            <span className="flex items-center gap-1">
                                                                <Clock size={12} /> {course.duration || 'Flexible'}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                {course.type === 'ONLINE' ? <Globe2 size={12} /> : <MapPin size={12} />}
                                                                {course.type === 'ONLINE' ? 'Online' : 'In-Person'}
                                                            </span>
                                                        </div>

                                                        {/* Price + Rating */}
                                                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                                                            <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                                                                {currencySymbol}{Number(course.price).toLocaleString()}
                                                            </span>
                                                            <div className="flex items-center gap-1 text-brand">
                                                                <Star size={14} className="fill-current" />
                                                                <span className="text-sm font-bold">4.8</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        ) : (
                            /* List View */
                            <div className="space-y-4">
                                <AnimatePresence mode="popLayout">
                                    {visibleCourses.map((course: any) => (
                                        <motion.div
                                            key={course.id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Link href={`/courses/${course.slug}`} className="block group">
                                                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:shadow-lg hover:border-primary-blue/30 transition-all duration-300 flex flex-col sm:flex-row">
                                                    {/* Image */}
                                                    <div className="relative sm:w-64 h-48 sm:h-auto shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-900">
                                                        {course.thumbnail ? (
                                                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                                <BookOpen size={40} />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="p-5 flex-1 flex flex-col justify-between min-w-0">
                                                        <div>
                                                            <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-semibold border-0 rounded-md mb-2">
                                                                {course.category?.name || 'Professional'}
                                                            </Badge>
                                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-primary-blue transition-colors mb-1">
                                                                {course.title}
                                                            </h3>
                                                            <div
                                                                className="text-sm text-slate-500 line-clamp-2 mb-3"
                                                                dangerouslySetInnerHTML={{ __html: course.description }}
                                                            />
                                                            <div className="flex items-center gap-4 text-xs text-slate-400">
                                                                <span className="flex items-center gap-1"><Clock size={12} /> {course.duration || 'Flexible'}</span>
                                                                <span className="flex items-center gap-1">
                                                                    {course.type === 'ONLINE' ? <Globe2 size={12} /> : <MapPin size={12} />}
                                                                    {course.type === 'ONLINE' ? 'Online' : 'In-Person'}
                                                                </span>
                                                                {course.schedules?.length > 0 && (
                                                                    <span className="flex items-center gap-1 text-primary-blue font-medium">
                                                                        {course.schedules.length} session{course.schedules.length > 1 ? 's' : ''}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                                                            <span className="text-xl font-extrabold text-slate-900 dark:text-white">{currencySymbol}{Number(course.price).toLocaleString()}</span>
                                                            <div className="flex items-center gap-1 text-brand">
                                                                <Star size={14} className="fill-current" />
                                                                <span className="text-sm font-bold">4.8</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* Load More */}
                        {hasMore && filteredCourses.length > 0 && (
                            <div className="text-center pt-10">
                                <Button
                                    variant="outline"
                                    onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
                                    className="rounded-xl px-10 h-12 font-bold text-sm border-slate-300 dark:border-slate-700 hover:bg-primary-blue hover:text-white hover:border-primary-blue transition-all"
                                >
                                    Load More Courses ({filteredCourses.length - visibleCount} remaining)
                                </Button>
                            </div>
                        )}

                        {/* Empty state */}
                        {filteredCourses.length === 0 && (
                            <div className="text-center py-20">
                                <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No courses found</h3>
                                <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
                                    Try adjusting your filters or search term to find what you're looking for.
                                </p>
                                <Button variant="outline" onClick={clearAllFilters} className="rounded-lg gap-2">
                                    <X size={14} /> Clear All Filters
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}

// ——— Sidebar Filter Component ———
const FilterSidebar = ({
    isMobile = false,
    search, setSearch, categories, initialCourses, getCategoryCount, selectedCategory, setSelectedCategory,
    expandedSections, toggleSection, selectedType, setSelectedType, getTypeCount, certificationTypes,
    selectedCert, setSelectedCert, selectedYear, setSelectedYear, selectedMonth, setSelectedMonth,
    selectedVenues, toggleVenue, availableVenues, selectedDurations, toggleDuration, availableDurations,
    priceRange, setPriceRange, currencySymbol, tags, selectedTags, toggleTag,
    activeFilterCount, clearAllFilters, showSuggestions, setShowSuggestions, suggestions
}: FilterSidebarProps) => (
    <div className={cn(
        "space-y-4",
        isMobile ? "" : "sticky top-28"
    )}>
        {/* Search */}
        <div className="pb-5 border-b border-slate-100 dark:border-slate-800">
            {!isMobile && <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 block ml-1">Search</span>}
            <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary-blue" size={18} />
                <Input
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="Search courses..."
                    className="h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-10 font-medium text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:ring-4 focus:ring-primary-blue/5 focus:border-primary-blue transition-all"
                />
                {search && (
                    <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1">
                        <X size={16} />
                    </button>
                )}

                <AnimatePresence>
                    {showSuggestions && suggestions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-navy border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden"
                        >
                            <div className="p-2 space-y-0.5">
                                {suggestions.map((course) => (
                                    <button
                                        key={course.id}
                                        onClick={() => {
                                            setSearch(course.title);
                                            setShowSuggestions(false);
                                        }}
                                        className="w-full text-left px-4 py-3 rounded-xl text-[13px] hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center justify-between group transition-colors"
                                    >
                                        <span className="truncate font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary-blue">{course.title}</span>
                                        <ArrowRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 shrink-0 ml-2" />
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>

        {/* Category Filter */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <button onClick={() => toggleSection('category')} className="flex items-center justify-between w-full py-3 text-sm font-bold text-slate-900 dark:text-white group">
                Category
                <div className={cn("transition-transform duration-200", expandedSections.category && "rotate-180")}>
                    <ChevronDown size={16} className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
                </div>
            </button>
            <AnimatePresence initial={false}>
                {expandedSections.category && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden space-y-1 mt-1 mb-3"
                    >
                        <button
                            className={cn(
                                "flex items-center justify-between w-full p-2.5 rounded-xl text-[13px] transition-all",
                                !selectedCategory ? "bg-primary-blue/10 text-primary-blue font-bold" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                            )}
                            onClick={() => setSelectedCategory(null)}
                        >
                            <span>All Categories</span>
                            <span className="text-xs opacity-60">{initialCourses.length}</span>
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                className={cn(
                                    "flex items-center justify-between w-full p-2.5 rounded-xl text-[13px] transition-all",
                                    selectedCategory === cat.id ? "bg-primary-blue/10 text-primary-blue font-bold" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                                )}
                                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                            >
                                <span className="text-left truncate pr-4">{cat.name}</span>
                                <span className="text-xs opacity-60">{getCategoryCount(cat.id)}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* Delivery Type Filter */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <button onClick={() => toggleSection('type')} className="flex items-center justify-between w-full py-3 text-sm font-bold text-slate-900 dark:text-white group">
                Delivery Mode
                <div className={cn("transition-transform duration-200", expandedSections.type && "rotate-180")}>
                    <ChevronDown size={16} className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
                </div>
            </button>
            <AnimatePresence initial={false}>
                {expandedSections.type && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden space-y-1 mt-1 mb-3"
                    >
                        {[
                            { value: null, label: 'All Modes', icon: BookOpen },
                            { value: 'ONLINE', label: 'Online', icon: Globe2 },
                            { value: 'OFFLINE', label: 'In-Person', icon: MapPin },
                        ].map((opt) => (
                            <button
                                key={opt.label || 'all'}
                                className={cn(
                                    "flex items-center justify-between w-full p-2.5 rounded-xl text-[13px] transition-all",
                                    selectedType === opt.value ? "bg-primary-blue/10 text-primary-blue font-bold" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                                )}
                                onClick={() => setSelectedType(opt.value)}
                            >
                                <div className="flex items-center gap-3">
                                    <opt.icon size={15} className={cn(selectedType === opt.value ? "text-primary-blue" : "text-slate-400")} />
                                    <span>{opt.label}</span>
                                </div>
                                {opt.value && <span className="text-xs opacity-60">{getTypeCount(opt.value)}</span>}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* Certification Filter */}
        {certificationTypes.length > 0 && (
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <button onClick={() => toggleSection('certification')} className="flex items-center justify-between w-full py-3 text-sm font-bold text-slate-900 dark:text-white group">
                    Certificate Type
                    <div className={cn("transition-transform duration-200", expandedSections.certification && "rotate-180")}>
                        <ChevronDown size={16} className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
                    </div>
                </button>
                <AnimatePresence initial={false}>
                    {expandedSections.certification && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden space-y-1 mt-1 mb-3"
                        >
                            <button
                                className={cn(
                                    "flex items-center justify-between w-full p-2.5 rounded-xl text-[13px] transition-all",
                                    !selectedCert ? "bg-primary-blue/10 text-primary-blue font-bold" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                                )}
                                onClick={() => setSelectedCert(null)}
                            >
                                <span>No Preference</span>
                            </button>
                            {certificationTypes.map((cert) => (
                                <button
                                    key={cert.id}
                                    className={cn(
                                        "flex items-center justify-between w-full p-2.5 rounded-xl text-[13px] transition-all",
                                        selectedCert === cert.id ? "bg-primary-blue/10 text-primary-blue font-bold" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                                    )}
                                    onClick={() => setSelectedCert(selectedCert === cert.id ? null : cert.id)}
                                >
                                    <span>{cert.name}</span>
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        )}

        {/* Timing Filter */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <button onClick={() => toggleSection('timing')} className="flex items-center justify-between w-full py-3 text-sm font-bold text-slate-900 dark:text-white group">
                Timing
                <div className={cn("transition-transform duration-200", expandedSections.timing && "rotate-180")}>
                    <ChevronDown size={16} className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
                </div>
            </button>
            <AnimatePresence initial={false}>
                {expandedSections.timing && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden space-y-4 mt-2 mb-4 px-1"
                    >
                        <div className="space-y-2">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block ml-1">Year</span>
                            <div className="grid grid-cols-4 gap-1.5">
                                {[null, '2024', '2025', '2026'].map(y => (
                                    <button
                                        key={y || 'all'}
                                        onClick={() => setSelectedYear(y)}
                                        className={cn(
                                            "h-9 rounded-lg text-xs font-bold border transition-all",
                                            selectedYear === y
                                                ? "bg-primary-blue border-primary-blue text-white shadow-md shadow-primary-blue/20"
                                                : "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500 hover:border-slate-200"
                                        )}
                                    >
                                        {y || 'Any'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block ml-1">Month</span>
                            <select
                                value={selectedMonth || ''}
                                onChange={(e) => setSelectedMonth(e.target.value || null)}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl h-11 px-4 text-[13px] font-medium outline-none focus:ring-4 focus:ring-primary-blue/5 focus:border-primary-blue transition-all"
                            >
                                <option value="">Any Month</option>
                                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* Price Filter */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <button onClick={() => toggleSection('price')} className="flex items-center justify-between w-full py-3 text-sm font-bold text-slate-900 dark:text-white group">
                Price Range
                <div className={cn("transition-transform duration-200", expandedSections.price && "rotate-180")}>
                    <ChevronDown size={16} className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
                </div>
            </button>
            <AnimatePresence initial={false}>
                {expandedSections.price && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden space-y-1 mt-1 mb-3"
                    >
                        {[
                            { value: null, label: 'Any Price' },
                            { value: 'free', label: 'Free' },
                            { value: 'under100k', label: `Under ${currencySymbol}100,000` },
                            { value: '100k-500k', label: `${currencySymbol}100,000 – ${currencySymbol}500k` },
                            { value: 'above500k', label: `Above ${currencySymbol}500,000` },
                        ].map((opt) => (
                            <button
                                key={opt.label}
                                className={cn(
                                    "flex items-center justify-between w-full p-2.5 rounded-xl text-[13px] transition-all",
                                    priceRange === opt.value ? "bg-primary-blue/10 text-primary-blue font-bold" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                                )}
                                onClick={() => setPriceRange(opt.value)}
                            >
                                <span>{opt.label}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* Location Filter */}
        {availableVenues.length > 0 && (
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <button onClick={() => toggleSection('location')} className="flex items-center justify-between w-full py-3 text-sm font-bold text-slate-900 dark:text-white group">
                    Venue
                    <div className={cn("transition-transform duration-200", expandedSections.location && "rotate-180")}>
                        <ChevronDown size={16} className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
                    </div>
                </button>
                <AnimatePresence initial={false}>
                    {expandedSections.location && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden space-y-1 mt-1 mb-3"
                        >
                            {availableVenues.map((venue) => (
                                <button
                                    key={venue}
                                    className={cn(
                                        "flex items-center justify-between w-full p-2.5 rounded-xl text-[13px] transition-all",
                                        selectedVenues.includes(venue) ? "bg-primary-blue/10 text-primary-blue font-bold" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                                    )}
                                    onClick={() => toggleVenue(venue)}
                                >
                                    <span>{venue}</span>
                                    {selectedVenues.includes(venue) && <X size={12} className="text-primary-blue" />}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        )}

        {/* Duration Filter */}
        {availableDurations.length > 0 && (
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <button onClick={() => toggleSection('duration')} className="flex items-center justify-between w-full py-3 text-sm font-bold text-slate-900 dark:text-white group">
                    Duration
                    <div className={cn("transition-transform duration-200", expandedSections.duration && "rotate-180")}>
                        <ChevronDown size={16} className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
                    </div>
                </button>
                <AnimatePresence initial={false}>
                    {expandedSections.duration && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden space-y-1 mt-1 mb-3"
                        >
                            {availableDurations.map((dur) => (
                                <button
                                    key={dur}
                                    className={cn(
                                        "flex items-center justify-between w-full p-2.5 rounded-xl text-[13px] transition-all",
                                        selectedDurations.includes(dur) ? "bg-primary-blue/10 text-primary-blue font-bold" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                                    )}
                                    onClick={() => toggleDuration(dur)}
                                >
                                    <span>{dur}</span>
                                    {selectedDurations.includes(dur) && <X size={12} className="text-primary-blue" />}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        )}

        {/* Tags Filter */}
        <div className="pb-3">
            <button onClick={() => toggleSection('tags')} className="flex items-center justify-between w-full py-3 text-sm font-bold text-slate-900 dark:text-white group">
                Popular Tags
                <div className={cn("transition-transform duration-200", expandedSections.tags && "rotate-180")}>
                    <ChevronDown size={16} className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
                </div>
            </button>
            <AnimatePresence initial={false}>
                {expandedSections.tags && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden flex flex-wrap gap-2 mt-2 mb-4 px-1"
                    >
                        {tags.slice(0, 12).map((tag) => (
                            <button
                                key={tag.id}
                                onClick={() => toggleTag(tag.id)}
                                className={cn(
                                    "text-[11px] font-bold px-3 py-1.5 rounded-full border transition-all",
                                    selectedTags.includes(tag.id)
                                        ? "bg-primary-blue text-white border-primary-blue shadow-sm"
                                        : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500 hover:border-slate-300"
                                )}
                            >
                                {tag.name}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {!isMobile && activeFilterCount > 0 && (
            <div className="pt-2">
                <Button
                    variant="ghost"
                    onClick={clearAllFilters}
                    className="w-full text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-xs font-bold h-11 rounded-xl gap-2 border border-transparent hover:border-rose-100 transition-all"
                >
                    <X size={14} /> Clear All Filters ({activeFilterCount})
                </Button>
            </div>
        )}
    </div>
);
