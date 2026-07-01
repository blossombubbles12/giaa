'use client';

import { Share2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function VerifyActions({ certId, shortCode }: { certId: string; shortCode: string }) {
  const formattedCode = `${shortCode.slice(0, 3)}-${shortCode.slice(3)}`;

  return (
    <div className="flex flex-wrap gap-3">
      <a href={`/api/certificates/download/${certId}`}>
        <Button className="bg-brand hover:bg-brand-dark text-white rounded-xl h-12 px-6 font-bold text-xs gap-2 shadow-lg active:scale-95 transition-all">
          <Download size={16} /> Download PDF
        </Button>
      </a>
      <Button
        variant="outline"
        className="rounded-xl h-12 px-6 font-bold text-xs gap-2 border-slate-200 dark:border-slate-700 active:scale-95 transition-all"
        onClick={() => { navigator.clipboard?.writeText(`${window.location.origin}/verify/${formattedCode}`); }}
      >
        <Share2 size={16} /> Share Proof
      </Button>
    </div>
  );
}
