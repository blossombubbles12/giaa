'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    BookOpen,
    Users,
    CalendarDays,
    Award,
    Star,
    CreditCard,
    FileText,
    Settings,
    BookMarked,
    Bell,
    ChevronDown,
    Layers,
    Tag,
    List,
    User,
    Camera,
    Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';

type NavItem = {
    href?: string;
    label: string;
    icon: any;
    children?: { href: string; label: string; icon: any }[];
};

const navItems: NavItem[] = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/leads', label: 'Leads & Inquiries', icon: Mail },
    {
        label: 'Courses',
        icon: BookOpen,
        children: [
            { href: '/admin/courses', label: 'All Courses', icon: List },
            { href: '/admin/courses/schedules', label: 'Schedules', icon: CalendarDays },
            { href: '/admin/courses/categories', label: 'Categories', icon: Layers },
            { href: '/admin/courses/tags', label: 'Tags', icon: Tag },
        ]
    },
    {
        label: 'Blog Posts',
        icon: FileText,
        children: [
            { href: '/admin/blog', label: 'All Posts', icon: List },
            { href: '/admin/blog/categories', label: 'Categories', icon: Layers },
            { href: '/admin/blog/tags', label: 'Tags', icon: Tag },
        ]
    },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/notifications', label: 'Notifications', icon: Bell },
    { href: '/admin/enrollments', label: 'Enrollments', icon: BookMarked },
    { href: '/admin/events', label: 'Events & Bookings', icon: CalendarDays },
    { href: '/admin/payments', label: 'Payments', icon: CreditCard },
    { href: '/admin/certificates', label: 'Certificates', icon: Award },
    { href: '/admin/galleries', label: 'Galleries', icon: Camera },
    { href: '/admin/pages', label: 'CMS Pages', icon: FileText },
    { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
];

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
    const pathname = usePathname();
    const [openSubmenus, setOpenSubmenus] = useState<string[]>(['Courses']);

    const toggleSubmenu = (label: string) => {
        setOpenSubmenus(prev =>
            prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
        );
    };

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            <aside className={cn(
                "fixed left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-[70] transition-transform duration-300 lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Logo Section */}
                <div className="px-6 h-[73px] border-b border-slate-800 relative flex items-center justify-center">
                    <img
                        src="/gialogo.png"
                        alt="GIA Logo"
                        className="h-10 w-auto object-contain hover:scale-105 transition-transform duration-500"
                    />

                    {/* Mobile Close Button */}
                    <button
                        onClick={onClose}
                        className="lg:hidden absolute top-[1.625rem] right-4 text-slate-500 hover:text-white transition-colors"
                    >
                        <ChevronDown className="rotate-90" size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => {
                        const hasChildren = !!item.children;
                        const isOpenSub = openSubmenus.includes(item.label);
                        const isActive = item.href
                            ? (pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href)))
                            : item.children?.some(child => pathname.startsWith(child.href));

                        if (hasChildren) {
                            return (
                                <div key={item.label} className="space-y-1">
                                    <button
                                        onClick={() => toggleSubmenu(item.label)}
                                        className={cn(
                                            'w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 outline-none',
                                            isActive && !isOpenSub
                                                ? 'bg-blue-600/10 text-blue-400'
                                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon size={18} />
                                            {item.label}
                                        </div>
                                        <ChevronDown size={14} className={cn('transition-transform', isOpenSub && 'rotate-180')} />
                                    </button>

                                    {isOpenSub && (
                                        <div className="pl-4 space-y-1 mt-1">
                                            {item.children?.map((child) => {
                                                const isChildActive = pathname === child.href;
                                                return (
                                                    <Link
                                                        key={child.href}
                                                        href={child.href}
                                                        onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                                                        className={cn(
                                                            'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150',
                                                            isChildActive
                                                                ? 'bg-blue-600 text-white shadow-sm'
                                                                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                                                        )}
                                                    >
                                                        <child.icon size={14} />
                                                        {child.label}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={item.href}
                                href={item.href!}
                                onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                )}
                            >
                                <item.icon size={18} className="shrink-0" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div className="p-4 border-t border-slate-800 space-y-1">
                    <Link
                        href="/admin/profile"
                        onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                            pathname === "/admin/profile"
                                ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                                : "text-slate-400 hover:text-white hover:bg-slate-800"
                        )}
                    >
                        <User size={18} />
                        Profile
                    </Link>
                    <Link
                        href="/admin/settings"
                        onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                            pathname === "/admin/settings"
                                ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                                : "text-slate-400 hover:text-white hover:bg-slate-800"
                        )}
                    >
                        <Settings size={18} />
                        Settings
                    </Link>
                </div>
            </aside>
        </>
    );
}
