"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface EventBookingBoxProps {
    eventId: string;
    eventSlug: string;
    remainingSeats: number;
    isAuthenticated: boolean;
}

export function EventBookingBox({ eventId, eventSlug, remainingSeats, isAuthenticated }: EventBookingBoxProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleBooking = async () => {
        if (!isAuthenticated) return;
        
        setIsLoading(true);
        try {
            const res = await fetch(`/api/events/${eventId}/register`, {
                method: 'POST',
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || 'Failed to register for the event');
            }
            
            toast.success('Registration successful! Check your email for details.');
            router.refresh(); // Refresh page to show "Registered" state
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <Link href={`/login?callbackUrl=/events/${eventSlug}`} className="block">
                <Button className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-brand dark:hover:bg-brand hover:text-white rounded-2xl h-14 font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">
                    Login to Register
                </Button>
            </Link>
        );
    }

    return (
        <Button 
            onClick={handleBooking}
            disabled={remainingSeats <= 0 || isLoading}
            className="w-full bg-brand text-white hover:bg-slate-900 rounded-2xl h-14 font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all"
        >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : remainingSeats > 0 ? 'Confirm My Attendance' : 'Sold Out'}
        </Button>
    );
}
