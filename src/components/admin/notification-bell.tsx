'use client';

import { useState, useEffect } from 'react';
import { Bell, Trash2, CheckCircle2, Info, AlertTriangle, XCircle, Loader2 } from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

type Notification = {
    id: string;
    title: string;
    message: string;
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
    read: boolean;
    link: string | null;
    createdAt: string;
};

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

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
        const interval = setInterval(fetchNotifications, 60000); // Polling every minute
        return () => clearInterval(interval);
    }, []);

    const unreadCount = notifications.filter((n) => !n.read).length;

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
        try {
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
            await fetch('/api/notifications', { method: 'PATCH' });
        } catch (err) {
            console.error('Failed to mark all read:', err);
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
            await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
        } catch (err) {
            console.error('Failed to delete notification:', err);
        }
    };

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'SUCCESS': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            case 'WARNING': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
            case 'ERROR': return <XCircle className="w-4 h-4 text-red-500" />;
            default: return <Info className="w-4 h-4 text-blue-500" />;
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    id="admin-notifications"
                    className="relative w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all outline-none"
                >
                    <Bell size={16} />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-md shadow-blue-600/30">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 bg-slate-900 border-slate-800 shadow-2xl rounded-2xl" align="end">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                    <h3 className="text-white font-semibold text-sm">Notifications</h3>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={markAllAsRead}
                            className="text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 h-7 px-2"
                        >
                            Mark all as read
                        </Button>
                    )}
                </div>

                <ScrollArea className="h-80">
                    {loading ? (
                        <div className="flex items-center justify-center h-full py-10">
                            <Loader2 className="w-6 h-6 animate-spin text-slate-600" />
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full py-10 px-4 text-center">
                            <Bell className="w-8 h-8 text-slate-700 mb-2" />
                            <p className="text-slate-400 text-sm font-medium">All caught up!</p>
                            <p className="text-slate-600 text-xs mt-1">No new notifications for you.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-800">
                            {notifications.map((n) => (
                                <div
                                    key={n.id}
                                    className={cn(
                                        "relative group px-4 py-3 hover:bg-slate-800/50 transition-colors",
                                        !n.read && "bg-blue-600/[0.03]"
                                    )}
                                >
                                    <div className="flex gap-3">
                                        <div className="mt-0.5 shrink-0">{getIcon(n.type)}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className={cn(
                                                    "text-sm truncate",
                                                    n.read ? "text-slate-300" : "text-white font-medium"
                                                )}>
                                                    {n.title}
                                                </p>
                                                <span className="text-[10px] text-slate-500 whitespace-nowrap">
                                                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                                                {n.message}
                                            </p>

                                            {n.link && (
                                                <Link
                                                    href={n.link}
                                                    className="text-[10px] text-blue-400 hover:underline mt-2 inline-block"
                                                    onClick={() => {
                                                        markAsRead(n.id);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    View details
                                                </Link>
                                            )}
                                        </div>
                                    </div>

                                    {!n.read && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />
                                    )}

                                    <button
                                        onClick={() => deleteNotification(n.id)}
                                        className="absolute right-2 bottom-2 p-1 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all rounded-md hover:bg-slate-700"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                <div className="px-4 py-2 border-t border-slate-800 text-center">
                    <Link
                        href="/admin/notifications"
                        className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
                        onClick={() => setOpen(false)}
                    >
                        See all notifications
                    </Link>
                </div>
            </PopoverContent>
        </Popover>
    );
}
