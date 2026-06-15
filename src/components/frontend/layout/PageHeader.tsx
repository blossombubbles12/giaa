'use client';

import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Breadcrumb {
    name: string;
    href?: string;
}

interface PageHeaderProps {
    title: string;
    description?: string;
    breadcrumbs?: Breadcrumb[];
    className?: string;
}

export function PageHeader({ title, description, breadcrumbs, className }: PageHeaderProps) {
    return (
        <section className="container pt-6">
            <div className={cn("relative py-12 md:py-16 overflow-hidden flex items-center min-h-[200px] md:min-h-[240px] rounded-[2.5rem] shadow-2xl border border-slate-200/50 dark:border-slate-800/50", className)}>
                {/* Background Image & Gradient Overlay */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2070" 
                        alt="" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 to-slate-950/60" />
                </div>

                <div className="px-8 md:px-14 relative z-10">
                    <div className="max-w-4xl space-y-4">
                        {/* Breadcrumbs */}
                        <nav className="flex items-center flex-wrap gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            <Link 
                                href="/" 
                                className="flex items-center gap-1.5 hover:text-brand transition-colors duration-300"
                            >
                                <Home size={10} className="shrink-0" />
                                <span>Home</span>
                            </Link>
                            
                            {breadcrumbs?.map((crumb, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <ChevronRight size={10} className="text-slate-600 shrink-0" />
                                    {crumb.href ? (
                                        <Link 
                                            href={crumb.href} 
                                            className="hover:text-brand transition-colors duration-300"
                                        >
                                            {crumb.name}
                                        </Link>
                                    ) : (
                                        <span className="text-slate-300">{crumb.name}</span>
                                    )}
                                </div>
                            ))}
                        </nav>

                        {/* Content */}
                        <div className="space-y-3">
                            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tighter uppercase">
                                {title}
                            </h1>
                            
                            {description && (
                                <p className="text-xs md:text-sm text-slate-400 font-medium leading-relaxed max-w-xl border-l border-brand/50 pl-4">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
