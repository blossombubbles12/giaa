'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CourseBrochureProps {
    course: any;
    currencySymbol: string;
}

export function CourseBrochure({ course, currencySymbol }: CourseBrochureProps) {
    const [generating, setGenerating] = useState(false);

    const downloadBrochure = async () => {
        setGenerating(true);
        try {
            const { buildBrochurePDF } = await import('@/lib/pdf-utils');
            const pdf = await buildBrochurePDF(course, currencySymbol);
            pdf.save(`${course.slug}-brochure.pdf`);
            toast.success('Brochure downloaded');
        } catch (e) {
            console.error(e);
            toast.error('Failed to generate brochure');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <Button
            onClick={downloadBrochure}
            disabled={generating}
            variant="outline"
            className="w-full h-12 rounded-xl border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-brand hover:border-brand gap-2 font-bold text-xs uppercase tracking-widest transition-all"
        >
            {generating ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
            {generating ? 'Generating...' : 'Download Brochure'}
        </Button>
    );
}
