'use client';

import { useState, useEffect } from 'react';
import {
    Award,
    Search,
    Loader2,
    Download,
    User,
    BookOpen,
    Calendar,
    ExternalLink,
    Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type Certificate = {
    id: string;
    pdfUrl: string;
    verifyHash: string;
    issuedAt: string;
    user: {
        name: string | null;
        email: string;
    };
    course: {
        title: string;
    };
};

type PlatformUser = {
    id: string;
    name: string | null;
    email: string;
};

type Course = {
    id: string;
    title: string;
};

export default function AdminCertificatesPage() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [users, setUsers] = useState<PlatformUser[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isIssuing, setIsIssuing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form state
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedCourseId, setSelectedCourseId] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [certRes, userRes, courseRes] = await Promise.all([
                fetch('/api/admin/certificates'),
                fetch('/api/admin/users'),
                fetch('/api/admin/courses'),
            ]);

            if (certRes.ok) setCertificates(await certRes.json());
            if (userRes.ok) setUsers(await userRes.json());
            if (courseRes.ok) {
                const courseData = await courseRes.json();
                setCourses(courseData.data || courseData);
            }
        } catch (err) {
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleIssueCertificate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUserId || !selectedCourseId) {
            toast.error('Please select both a student and a course');
            return;
        }

        setIsIssuing(true);
        try {
            const res = await fetch('/api/admin/certificates/issue', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: selectedUserId, courseId: selectedCourseId }),
            });

            if (res.ok) {
                toast.success('Professional certificate issued successfully');
                setIsModalOpen(false);
                setSelectedUserId('');
                setSelectedCourseId('');
                fetchData();
            } else {
                const error = await res.json();
                toast.error(error.error || 'Failed to issue certificate');
            }
        } catch (err) {
            toast.error('A system error occurred during issuance');
        } finally {
            setIsIssuing(false);
        }
    };

    const filteredCertificates = certificates.filter(c =>
        c.user.email.toLowerCase().includes(search.toLowerCase()) ||
        c.user.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.course.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white uppercase tracking-tight italic">Professional Certification</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage and audit institutional credentials and verification strings.</p>
                </div>

                <div className="flex items-center gap-4">
                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-6 h-10 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-600/20 gap-2">
                                <Plus size={14} />
                                Issue New Certificate
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-900 border-slate-800 text-white rounded-[2rem] max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-black uppercase tracking-tight italic">Manual Issuance</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleIssueCertificate} className="space-y-6 pt-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Select Recipient</Label>
                                    <select
                                        value={selectedUserId}
                                        onChange={(e) => setSelectedUserId(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl h-12 px-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                                        required
                                    >
                                        <option value="">Select a student...</option>
                                        {users.map(u => (
                                            <option key={u.id} value={u.id}>{u.name || u.email}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Select Course</Label>
                                    <select
                                        value={selectedCourseId}
                                        onChange={(e) => setSelectedCourseId(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl h-12 px-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                                        required
                                    >
                                        <option value="">Select a course...</option>
                                        {courses.map(c => (
                                            <option key={c.id} value={c.id}>{c.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <Button
                                    className="w-full bg-blue-600 hover:bg-blue-500 h-12 rounded-xl font-black uppercase tracking-widest"
                                    disabled={isIssuing}
                                >
                                    {isIssuing ? <Loader2 className="animate-spin" /> : 'Confirm & Generate PDF'}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2 flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Repository Size</span>
                        <span className="text-lg font-black text-white">{certificates.length}</span>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-slate-800 bg-slate-800/10">
                    <div className="relative max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <Input
                            placeholder="Find by student name, email, or course achievement..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-12 bg-slate-950 border-slate-800 text-sm h-12 rounded-2xl focus:ring-blue-600 focus:border-blue-600 shadow-inner italic"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-32 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] animate-pulse italic">Scanning Vault...</p>
                    </div>
                ) : filteredCertificates.length === 0 ? (
                    <div className="p-32 text-center space-y-4">
                        <div className="w-20 h-20 bg-slate-800/50 rounded-3xl flex items-center justify-center mx-auto border border-slate-700 shadow-inner">
                            <Award className="text-slate-600" size={32} />
                        </div>
                        <h3 className="text-white font-bold text-lg uppercase tracking-tight">No credentials issued</h3>
                        <p className="text-slate-500 text-sm italic max-w-xs mx-auto opacity-70">
                            Valid professional certificates will appear here for archival and audit purposes.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-800/20">
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Recipient Identity</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Course Achievement</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Validation Hash</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Repository Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredCertificates.map((certificate) => (
                                    <tr key={certificate.id} className="hover:bg-slate-800/30 transition-all group">
                                        <td className="px-6 py-6 font-medium">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center text-slate-500 shrink-0 border border-slate-800 shadow-inner group-hover:border-blue-500/50 transition-colors">
                                                    <User size={18} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-white font-black text-[13px] uppercase tracking-tighter italic leading-none">
                                                        {certificate.user.name || 'Student'}
                                                    </p>
                                                    <p className="text-blue-500/50 text-[10px] font-bold tracking-wider mt-1.5 font-mono">
                                                        {certificate.user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-2">
                                                <BookOpen size={14} className="text-blue-500" />
                                                <p className="text-white font-black text-[11px] leading-tight uppercase tracking-tight italic">
                                                    {certificate.course.title}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex flex-col">
                                                <code className="text-[9px] text-slate-600 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 w-fit font-mono">
                                                    {certificate.verifyHash.slice(0, 12)}...
                                                </code>
                                                <span className="text-[10px] font-bold text-slate-700 uppercase mt-1">
                                                    {new Date(certificate.issuedAt).toLocaleDateString(undefined, {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <a
                                                    href={certificate.pdfUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="w-10 h-10 rounded-xl text-slate-500 hover:text-white hover:bg-slate-800 transition-all border border-transparent hover:border-slate-700 shadow-inner"
                                                    >
                                                        <ExternalLink size={16} />
                                                    </Button>
                                                </a>
                                                <a
                                                    href={certificate.pdfUrl}
                                                    download={`certificate-${certificate.id}.pdf`}
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="w-10 h-10 rounded-xl text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 transition-all border border-transparent hover:border-blue-500/20 shadow-inner"
                                                    >
                                                        <Download size={16} />
                                                    </Button>
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
