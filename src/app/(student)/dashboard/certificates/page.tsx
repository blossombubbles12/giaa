'use client';

import { useState, useEffect } from 'react';
import {
    Award,
    Download,
    ExternalLink,
    Loader2,
    Search,
    BookOpen,
    Calendar,
    FileCheck,
    Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

type Certificate = {
    id: string;
    pdfUrl: string;
    verifyHash: string;
    issuedAt: string;
    course: {
        title: string;
        thumbnail: string | null;
    };
};

export default function StudentCertificatesPage() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchCertificates = async () => {
        try {
            const res = await fetch('/api/certificates');
            if (res.ok) {
                const data = await res.json();
                setCertificates(data);
            }
        } catch (err) {
            toast.error('Failed to load certificates');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCertificates();
    }, []);

    const filtered = certificates.filter(c =>
        c.course.title.toLowerCase().includes(search.toLowerCase())
    );

    const handleShare = (verifyHash: string) => {
        const url = `${window.location.origin}/verify/${verifyHash}`;
        navigator.clipboard.writeText(url);
        toast.success('Verification link copied to clipboard');
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white uppercase tracking-tight italic">My Achievements</h1>
                    <p className="text-slate-400 text-sm mt-1">Access and share your officially verified professional credentials.</p>
                </div>

                <div className="relative w-full md:w-72 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={16} />
                    <Input
                        placeholder="Search certifications..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 bg-slate-900 border-slate-800 text-sm h-11 rounded-xl focus:ring-blue-600 focus:border-blue-600 shadow-inner italic"
                    />
                </div>
            </div>

            {loading ? (
                <div className="h-96 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] animate-pulse">Syncing Vault...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="h-96 border-2 border-dashed border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-8 space-y-4">
                    <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-slate-700">
                        <Award size={32} />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg uppercase tracking-tight">No certificates yet</h3>
                        <p className="text-slate-500 text-sm max-w-xs mx-auto italic font-medium">
                            Complete your enrolled courses and excel in assessments to earn professional certifications.
                        </p>
                    </div>
                    <Button variant="outline" className="border-slate-800 text-slate-400 hover:text-white rounded-xl h-10 px-6 font-black uppercase text-[10px] tracking-widest">
                        Browse Courses
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((cert) => (
                        <div key={cert.id} className="group bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden hover:border-blue-500/50 transition-all duration-500 shadow-xl flex flex-col h-full">
                            <div className="p-6 space-y-6 flex-1">
                                <div className="flex items-start justify-between">
                                    <div className="w-12 h-12 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center text-blue-500 shadow-inner group-hover:scale-110 transition-transform">
                                        <Award size={24} />
                                    </div>
                                    <div className="flex bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-emerald-500 gap-1.5 items-center">
                                        <FileCheck size={10} />
                                        <span className="text-[8px] font-black uppercase tracking-widest">Verified</span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-white font-black text-lg uppercase leading-tight tracking-tight italic group-hover:text-blue-400 transition-colors">
                                        {cert.course.title}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-4 text-slate-500">
                                        <Calendar size={12} />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">
                                            {new Date(cert.issuedAt).toLocaleDateString('en-GB', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-950/50 border-t border-slate-800 flex items-center gap-2">
                                <a
                                    href={cert.pdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1"
                                >
                                    <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-10 px-4 text-[10px] font-black uppercase tracking-widest gap-2">
                                        <ExternalLink size={14} />
                                        View
                                    </Button>
                                </a>
                                <Button
                                    onClick={() => handleShare(cert.verifyHash)}
                                    variant="ghost"
                                    size="icon"
                                    className="w-10 h-10 rounded-xl text-slate-500 hover:text-blue-500 hover:bg-blue-500/10 transition-all"
                                >
                                    <Share2 size={16} />
                                </Button>
                                <a
                                    href={cert.pdfUrl}
                                    download
                                >
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="w-10 h-10 rounded-xl text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/10 transition-all"
                                    >
                                        <Download size={16} />
                                    </Button>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="bg-blue-600/5 border border-blue-600/10 rounded-[2.5rem] p-8 flex items-start gap-5 shadow-inner">
                <div className="w-12 h-12 bg-blue-600/20 border border-blue-600/30 rounded-2xl flex items-center justify-center shrink-0">
                    <FileCheck className="text-blue-500" size={24} />
                </div>
                <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-tight italic mb-1">Authenticated Credentials</h4>
                    <p className="text-slate-500 text-xs leading-relaxed font-semibold italic opacity-80 max-w-2xl">
                        Your certifications are backed by our secure institutional ledger. You can share your verification link with employers to validate your professional qualifications in real-time.
                    </p>
                </div>
            </div>
        </div>
    );
}
