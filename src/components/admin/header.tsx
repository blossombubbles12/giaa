'use client';

import { signOut, useSession } from 'next-auth/react';
import { LogOut, User, Menu } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import NotificationBell from './notification-bell';

interface AdminHeaderProps {
    user: any; // Fallback user from server
    onMenuToggle?: () => void;
}

export default function AdminHeader({ user: initialUser, onMenuToggle }: AdminHeaderProps) {
    const { data: session } = useSession();
    const currentUser = session?.user || initialUser;

    return (
        <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuToggle}
                    className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <Menu size={20} />
                </button>
                <div className="hidden sm:block">
                    <h2 className="text-slate-400 text-sm">Welcome back,</h2>
                    <p className="text-white font-semibold">{currentUser?.name ?? 'Administrator'}</p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <NotificationBell />
                <Link
                    href="/admin/profile"
                    className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-600/30 flex items-center justify-center text-blue-400 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105"
                >
                    <User size={16} />
                </Link>
                <Button
                    id="admin-signout"
                    variant="ghost"
                    size="sm"
                    onClick={() => signOut({ callbackUrl: window.location.origin })}
                    className="text-slate-400 hover:text-white hover:bg-slate-800 gap-2 rounded-xl"
                >
                    <LogOut size={15} />
                    Sign out
                </Button>
            </div>
        </header>
    );
}
