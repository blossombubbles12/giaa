'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MoreHorizontal, Trash2, ShieldAlert, GraduationCap, Loader2, Edit2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface UserActionsProps {
    user: {
        id: string;
        role: string;
    };
}

export function UserActions({ user }: UserActionsProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Are you absolutely sure you want to terminate this account? This action cannot be undone.')) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/admin/users?id=${user.id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                toast.success('Account terminated successfully');
                router.refresh();
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to delete account');
            }
        } catch (err) {
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (newRole: string) => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: user.id, role: newRole }),
            });

            if (res.ok) {
                toast.success(`Access level updated to ${newRole}`);
                router.refresh();
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to update access level');
            }
        } catch (err) {
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl text-slate-500 hover:text-white hover:bg-slate-800 transition-all outline-none">
                    {loading ? <Loader2 size={18} className="animate-spin text-blue-500" /> : <MoreHorizontal size={18} />}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-300 w-56 rounded-2xl p-2 shadow-2xl">
                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-3 py-2">Account Management</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-800 mx-2" />

                <Link href={`/admin/users/${user.id}`}>
                    <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-600/10 hover:text-blue-400 cursor-pointer transition-colors">
                        <Edit2 size={16} />
                        <span className="text-xs font-bold uppercase tracking-tight">Edit Profile</span>
                    </DropdownMenuItem>
                </Link>

                <DropdownMenuSeparator className="bg-slate-800 mx-2" />

                {user.role === 'ADMIN' ? (
                    <DropdownMenuItem
                        onClick={() => handleRoleChange('STUDENT')}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-600/10 hover:text-blue-400 cursor-pointer transition-colors"
                    >
                        <GraduationCap size={16} />
                        <span className="text-xs font-bold uppercase tracking-tight">Convert to Student</span>
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem
                        onClick={() => handleRoleChange('ADMIN')}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-600/10 hover:text-rose-400 cursor-pointer transition-colors"
                    >
                        <ShieldAlert size={16} />
                        <span className="text-xs font-bold uppercase tracking-tight">Grant Admin Rights</span>
                    </DropdownMenuItem>
                )}

                <DropdownMenuSeparator className="bg-slate-800 mx-2" />

                <DropdownMenuItem
                    onClick={handleDelete}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-500 hover:bg-rose-600/10 hover:text-rose-400 cursor-pointer transition-colors"
                >
                    <Trash2 size={16} />
                    <span className="text-xs font-bold uppercase tracking-tight">Terminate Account</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
