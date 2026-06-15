'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { useActionToast } from '@/hooks/use-action-toast';

export default function TestimonialActions({ id, approved }: { id: string; approved: boolean }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { execute } = useActionToast();

    const toggle = async () => {
        setLoading(true);

        const { error } = await execute(
            fetch(`/api/admin/testimonials/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ approved: !approved }),
            }).then(async res => {
                if (!res.ok) throw new Error('Failed to update testimonial');
                return res.json();
            }),
            {
                loading: approved ? 'Hiding testimonial...' : 'Approving testimonial...',
                success: approved ? 'Testimonial hidden' : 'Testimonial approved!',
                error: (err) => err.message
            }
        );

        setLoading(false);
        if (!error) {
            router.refresh();
        }
    };

    return (
        <Button
            id={`testimonial-action-${id}`}
            variant="ghost"
            size="sm"
            onClick={toggle}
            disabled={loading}
            className={`text-xs rounded-lg gap-1.5 ${approved
                ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                : 'text-green-400 hover:text-green-300 hover:bg-green-500/10'
                }`}
        >
            {loading ? (
                <Loader2 size={12} className="animate-spin" />
            ) : approved ? (
                <><XCircle size={12} /> Hide</>
            ) : (
                <><CheckCircle size={12} /> Approve</>
            )}
        </Button>
    );
}
