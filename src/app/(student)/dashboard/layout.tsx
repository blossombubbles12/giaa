import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard,
    BookOpen,
    Settings,
    LogOut,
    Bell,
    GraduationCap,
    Award,
    Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import NotificationBell from '@/components/admin/notification-bell';
import StudentLogoutButton from '@/components/student/logout-button';

export default async function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-slate-950 flex">
            {/* Mini Sidebar */}
            <aside className="w-20 md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col items-center md:items-stretch py-6 px-4 gap-8">
                <Link href="/" className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                        <GraduationCap className="text-white w-6 h-6" />
                    </div>
                    <span className="hidden md:block font-bold text-white tracking-tight">GIA</span>
                </Link>

                <nav className="flex-1 flex flex-col gap-2">
                    {[
                        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
                        { href: '/dashboard/courses', label: 'My Courses', icon: BookOpen },
                        { href: '/dashboard/certificates', label: 'My Certificates', icon: Award },
                        { href: '/dashboard/bookings', label: 'My Bookings', icon: Calendar },
                        { href: '/dashboard/settings', label: 'Settings', icon: Settings },
                    ].map((item) => (
                        <Link key={item.href} href={item.href}>
                            <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-800 group transition-all">
                                <item.icon className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                                <span className="hidden md:block text-sm font-medium text-slate-400 group-hover:text-white">{item.label}</span>
                            </div>
                        </Link>
                    ))}
                </nav>

                <div className="pt-4 border-t border-slate-800">
                    <StudentLogoutButton />
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl flex items-center justify-between px-8">
                    <div className="md:hidden flex items-center gap-2">
                        <GraduationCap className="text-blue-500 w-6 h-6" />
                        <span className="font-bold text-white text-sm">GIA</span>
                    </div>
                    <div className="hidden md:block">
                        <h2 className="text-slate-400 text-sm font-medium italic">Welcome back, {session.user.name?.split(' ')[0]}!</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <NotificationBell />
                        <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-600/30 flex items-center justify-center overflow-hidden">
                            {session.user.image ? (
                                <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-[10px] font-bold text-blue-400">{session.user.name?.[0].toUpperCase()}</span>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 bg-slate-950">
                    {children}
                </main>
            </div>
        </div>
    );
}
