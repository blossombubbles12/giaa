'use client';

import { useState, useEffect } from 'react';
import {
    Bell,
    Trash2,
    CheckCircle2,
    Info,
    AlertTriangle,
    XCircle,
    Loader2,
    Search,
    Filter,
    MoreVertical,
    Check
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import Link from 'next/link';
import { useActionToast } from '@/hooks/use-action-toast';

type Notification = {
    id: string;
    title: string;
    message: string;
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
    read: boolean;
    link: string | null;
    createdAt: string;
};

export default function AdminNotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { execute } = useActionToast();

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/notifications');
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
            }
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (id: string) => {
        try {
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            );
            await fetch(`/api/notifications/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ read: true }),
            });
        } catch (err) {
            console.error('Failed to mark read:', err);
        }
    };

    const markAllAsRead = async () => {
        await execute(
            fetch('/api/notifications', { method: 'PATCH' }).then(async res => {
                if (!res.ok) throw new Error('Failed to update');
                setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
            }),
            {
                loading: 'Marking all as read...',
                success: 'All notifications marked as read',
            }
        );
    };

    const deleteNotification = async (id: string) => {
        await execute(
            fetch(`/api/notifications/${id}`, { method: 'DELETE' }).then(async res => {
                if (!res.ok) throw new Error('Failed to delete');
                setNotifications((prev) => prev.filter((n) => n.id !== id));
            }),
            {
                loading: 'Deleting...',
                success: 'Notification deleted',
            }
        );
    };

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'SUCCESS': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
            case 'WARNING': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
            case 'ERROR': return <XCircle className="w-5 h-5 text-red-500" />;
            default: return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const filteredNotifications = notifications.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Notifications</h1>
                    <p className="text-slate-400 text-sm">Manage and view all your system alerts</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={markAllAsRead}
                        disabled={!notifications.some(n => !n.read)}
                        className="bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl h-10 px-4 gap-2"
                    >
                        <Check size={16} />
                        Mark all read
                    </Button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <Input
                        placeholder="Search notifications..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus:border-blue-500 h-11 rounded-xl"
                    />
                </div>
                <Button variant="outline" className="bg-slate-900 border-slate-800 text-slate-300 rounded-xl h-11 px-4 gap-2">
                    <Filter size={16} />
                    Filter
                </Button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                        <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                            <Bell className="w-8 h-8 text-slate-600" />
                        </div>
                        <h3 className="text-white font-semibold">No notifications found</h3>
                        <p className="text-slate-500 text-sm mt-1 max-w-xs">
                            {searchQuery ? "Try adjusting your search query or filters." : "You're all caught up! No new notifications to show."}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-800">
                        {filteredNotifications.map((n) => (
                            <div
                                key={n.id}
                                className={cn(
                                    "relative group px-6 py-5 hover:bg-slate-800/30 transition-all",
                                    !n.read && "bg-blue-600/[0.02]"
                                )}
                            >
                                <div className="flex gap-4">
                                    <div className="shrink-0 mt-1">{getIcon(n.type)}</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className={cn(
                                                    "text-base",
                                                    n.read ? "text-slate-300" : "text-white font-semibold"
                                                )}>
                                                    {n.title}
                                                </p>
                                                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                                                    {n.message}
                                                </p>
                                            </div>
                                            <div className="shrink-0 text-right">
                                                <p className="text-xs text-slate-500">
                                                    {format(new Date(n.createdAt), 'MMM d, yyyy')}
                                                </p>
                                                <p className="text-[10px] text-slate-600 mt-1 uppercase tracking-wider font-bold">
                                                    {format(new Date(n.createdAt), 'h:mm a')}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 mt-4">
                                            {n.link && (
                                                <Link
                                                    href={n.link}
                                                    className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
                                                    onClick={() => markAsRead(n.id)}
                                                >
                                                    View Details
                                                </Link>
                                            )}

                                            {!n.read && (
                                                <button
                                                    onClick={() => markAsRead(n.id)}
                                                    className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                                                >
                                                    Mark as read
                                                </button>
                                            )}

                                            <button
                                                onClick={() => deleteNotification(n.id)}
                                                className="text-xs text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1"
                                            >
                                                <Trash2 size={12} />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {!n.read && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
