'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export default function StudentLogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: window.location.origin })}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-rose-500/10 group transition-all text-rose-400 border-0 bg-transparent outline-none"
        >
            <LogOut className="w-5 h-5" />
            <span className="hidden md:block text-sm font-medium">Log Out</span>
        </button>
    );
}
