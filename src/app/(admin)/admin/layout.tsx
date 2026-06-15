'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import AdminSidebar from '@/components/admin/sidebar';
import AdminHeader from '@/components/admin/header';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (status === 'loading') {
        return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Auth...</div>;
    }

    if (!session || session.user.role !== 'ADMIN') {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-slate-950 flex overflow-x-hidden">
            <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex-1 flex flex-col min-h-screen lg:ml-64 w-full transition-all duration-300">
                <AdminHeader user={session.user} onMenuToggle={() => setIsSidebarOpen(true)} />
                <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
