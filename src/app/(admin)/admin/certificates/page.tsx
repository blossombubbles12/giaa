'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Award, Search, Loader2, Download, User, BookOpen,
    Calendar, ExternalLink, Plus, Upload, FileText, X,
    CheckCircle2, AlertCircle, Copy, ClipboardList,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type Certificate = {
    id: string;
    pdfUrl: string;
    verifyHash: string;
    issuedAt: string;
    recipientName: string | null;
    recipientEmail: string | null;
    user: { name: string | null; email: string } | null;
    course: { title: string };
};

type Course = {
    id: string;
    title: string;
};

type BulkResult = {
    name: string;
    email: string;
    status: 'success' | 'failed';
    verifyHash?: string;
    pdfUrl?: string;
    error?: string;
};

export default function AdminCertificatesPage() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isIssueOpen, setIsIssueOpen] = useState(false);
    const [isBulkOpen, setIsBulkOpen] = useState(false);

    // Issue form
    const [issueName, setIssueName] = useState('');
    const [issueEmail, setIssueEmail] = useState('');
    const [issueCourseId, setIssueCourseId] = useState('');
    const [isIssuing, setIsIssuing] = useState(false);

    // Bulk
    const [bulkCourseId, setBulkCourseId] = useState('');
    const [bulkTab, setBulkTab] = useState<'csv' | 'paste'>('csv');
    const [bulkPasteData, setBulkPasteData] = useState('');
    const [parsedStudents, setParsedStudents] = useState<{ name: string; email: string }[]>([]);
    const [bulkResults, setBulkResults] = useState<BulkResult[] | null>(null);
    const [isBulkProcessing, setIsBulkProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [certRes, courseRes] = await Promise.all([
                fetch('/api/admin/certificates'),
                fetch('/api/admin/courses'),
            ]);
            if (certRes.ok) setCertificates(await certRes.json());
            if (courseRes.ok) {
                const d = await courseRes.json();
                setCourses(d.data || d);
            }
        } catch {
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // ── Issue Single ──
    const handleIssue = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!issueName || !issueEmail || !issueCourseId) {
            toast.error('All fields are required');
            return;
        }
        setIsIssuing(true);
        try {
            const res = await fetch('/api/admin/certificates/issue', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: issueName, email: issueEmail, courseId: issueCourseId }),
            });
            if (res.ok) {
                toast.success('Certificate issued successfully');
                setIsIssueOpen(false);
                setIssueName('');
                setIssueEmail('');
                setIssueCourseId('');
                fetchData();
            } else {
                const err = await res.json();
                toast.error(err.error || 'Failed to issue certificate');
            }
        } catch {
            toast.error('System error during issuance');
        } finally {
            setIsIssuing(false);
        }
    };

    // ── Bulk: Parse CSV ──
    const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const text = ev.target?.result as string;
            const lines = text.split('\n').filter(Boolean);
            const students = lines.slice(1).map(line => {
                const [name, email] = line.split(',').map(s => s.trim().replace(/^"|"$/g, ''));
                return { name, email };
            }).filter(s => s.name && s.email);
            setParsedStudents(students);
            toast.success(`Parsed ${students.length} students from CSV`);
        };
        reader.readAsText(file);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // ── Bulk: Parse Paste ──
    const parsePaste = () => {
        const lines = bulkPasteData.split('\n').filter(Boolean);
        const students = lines.map(line => {
            const [name, email] = line.split(',').map(s => s.trim());
            return { name, email };
        }).filter(s => s.name && s.email);
        setParsedStudents(students);
        toast.success(`Parsed ${students.length} students`);
    };

    // ── Bulk: Submit ──
    const handleBulkSubmit = async () => {
        if (!bulkCourseId || parsedStudents.length === 0) {
            toast.error('Select a course and add at least one student');
            return;
        }
        setIsBulkProcessing(true);
        setBulkResults(null);
        try {
            const res = await fetch('/api/admin/certificates/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ courseId: bulkCourseId, students: parsedStudents }),
            });
            if (res.ok) {
                const data = await res.json();
                setBulkResults(data.results);
                toast.success(`${data.success} certificates issued, ${data.failed} failed`);
                fetchData();
            } else {
                const err = await res.json();
                toast.error(err.error || 'Bulk upload failed');
            }
        } catch {
            toast.error('System error during bulk upload');
        } finally {
            setIsBulkProcessing(false);
        }
    };

    // ── Bulk: Download Results CSV ──
    const downloadResults = () => {
        if (!bulkResults) return;
        const header = 'Name,Email,Status,VerifyHash,PDFUrl\n';
        const rows = bulkResults.map(r =>
            `"${r.name}","${r.email}","${r.status}","${r.verifyHash || ''}","${r.pdfUrl || ''}"`
        ).join('\n');
        const blob = new Blob([header + rows], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'certificate-results.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    // ── Filter ──
    const filtered = certificates.filter(c => {
        const q = search.toLowerCase();
        const studentName = c.user?.name ?? c.recipientName ?? '';
        const studentEmail = c.user?.email ?? c.recipientEmail ?? '';
        return studentName.toLowerCase().includes(q) ||
            studentEmail.toLowerCase().includes(q) ||
            c.course.title.toLowerCase().includes(q);
    });

    // ── Display helpers ──
    const getStudentName = (c: Certificate) => c.user?.name ?? c.recipientName ?? 'Guest';
    const getStudentEmail = (c: Certificate) => c.user?.email ?? c.recipientEmail ?? '';
    const isGuest = (c: Certificate) => !c.user;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white uppercase tracking-tight italic">Professional Certification</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage, issue, and audit institutional credentials.</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Bulk Upload */}
                    <Dialog open={isBulkOpen} onOpenChange={v => { setIsBulkOpen(v); if (!v) { setParsedStudents([]); setBulkResults(null); setBulkPasteData(''); } }}>
                        <DialogTrigger asChild>
                            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-5 h-10 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-600/20 gap-2">
                                <Upload size={14} />
                                Bulk Upload
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-900 border-slate-800 text-white rounded-[2rem] max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-black uppercase tracking-tight italic">Bulk Certificate Upload</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6 pt-4">
                                {/* Course */}
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Course</Label>
                                    <select
                                        value={bulkCourseId}
                                        onChange={e => setBulkCourseId(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl h-12 px-4 text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
                                        required
                                    >
                                        <option value="">Select a course...</option>
                                        {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                    </select>
                                </div>

                                {/* Tabs */}
                                <div className="flex gap-2 border-b border-slate-800 pb-2">
                                    <button onClick={() => { setBulkTab('csv'); setParsedStudents([]); setBulkResults(null); }}
                                        className={`px-4 py-2 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all ${bulkTab === 'csv' ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30' : 'text-slate-500 hover:text-white'}`}>
                                        <FileText size={14} className="inline mr-1.5" /> CSV Upload
                                    </button>
                                    <button onClick={() => { setBulkTab('paste'); setParsedStudents([]); setBulkResults(null); }}
                                        className={`px-4 py-2 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all ${bulkTab === 'paste' ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30' : 'text-slate-500 hover:text-white'}`}>
                                        <ClipboardList size={14} className="inline mr-1.5" /> Paste List
                                    </button>
                                </div>

                                {/* CSV Upload */}
                                {bulkTab === 'csv' && (
                                    <div className="space-y-4">
                                        <div className="border-2 border-dashed border-slate-700 rounded-2xl p-8 text-center hover:border-emerald-600/50 transition-colors cursor-pointer"
                                            onClick={() => fileInputRef.current?.click()}>
                                            <Upload size={32} className="mx-auto text-slate-600 mb-3" />
                                            <p className="text-sm font-bold text-slate-400">Click to upload CSV</p>
                                            <p className="text-[10px] text-slate-600 mt-1">Format: Name,Email (one per line, header row optional)</p>
                                            <input ref={fileInputRef} type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
                                        </div>
                                    </div>
                                )}

                                {/* Paste */}
                                {bulkTab === 'paste' && (
                                    <div className="space-y-3">
                                        <textarea
                                            placeholder={`John Doe,john@example.com\nJane Smith,jane@example.com`}
                                            value={bulkPasteData}
                                            onChange={e => setBulkPasteData(e.target.value)}
                                            rows={6}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm focus:ring-2 focus:ring-emerald-600 outline-none resize-none font-mono"
                                        />
                                        <Button type="button" onClick={parsePaste}
                                            className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl h-10 px-6 text-[10px] font-black uppercase tracking-widest">
                                            Parse List
                                        </Button>
                                    </div>
                                )}

                                {/* Preview */}
                                {parsedStudents.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                                                Preview ({parsedStudents.length} students)
                                            </p>
                                            <button onClick={() => setParsedStudents([])}
                                                className="text-slate-600 hover:text-red-400 transition-colors">
                                                <X size={16} />
                                            </button>
                                        </div>
                                        <div className="max-h-40 overflow-y-auto bg-slate-950 rounded-xl border border-slate-800">
                                            <table className="w-full text-left text-sm">
                                                <thead className="border-b border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                    <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th></tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-800/50">
                                                    {parsedStudents.map((s, i) => (
                                                        <tr key={i} className="text-slate-300 text-[12px]">
                                                            <td className="px-4 py-2">{s.name}</td>
                                                            <td className="px-4 py-2 font-mono text-[10px]">{s.email}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <Button onClick={handleBulkSubmit} disabled={isBulkProcessing || !bulkCourseId}
                                            className="w-full bg-emerald-600 hover:bg-emerald-500 h-12 rounded-xl font-black uppercase tracking-widest gap-2">
                                            {isBulkProcessing ? <Loader2 className="animate-spin" /> : <Upload size={16} />}
                                            {isBulkProcessing ? `Processing ${parsedStudents.length}...` : `Issue ${parsedStudents.length} Certificates`}
                                        </Button>
                                    </div>
                                )}

                                {/* Results */}
                                {bulkResults && (
                                    <div className="space-y-3 border-t border-slate-800 pt-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-4">
                                                <span className="text-emerald-400 text-sm font-bold flex items-center gap-1.5">
                                                    <CheckCircle2 size={16} /> {bulkResults.filter(r => r.status === 'success').length} Success
                                                </span>
                                                <span className="text-red-400 text-sm font-bold flex items-center gap-1.5">
                                                    <AlertCircle size={16} /> {bulkResults.filter(r => r.status === 'failed').length} Failed
                                                </span>
                                            </div>
                                            <Button onClick={downloadResults} variant="ghost"
                                                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white gap-1.5">
                                                <Download size={14} /> CSV
                                            </Button>
                                        </div>
                                        <div className="max-h-60 overflow-y-auto bg-slate-950 rounded-xl border border-slate-800">
                                            <table className="w-full text-left text-sm">
                                                <thead className="border-b border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest sticky top-0 bg-slate-950">
                                                    <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Hash</th><th className="px-4 py-3">PDF</th></tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-800/50">
                                                    {bulkResults.map((r, i) => (
                                                        <tr key={i} className="text-[12px]">
                                                            <td className="px-4 py-2.5 text-slate-300">
                                                                <p className="font-bold">{r.name}</p>
                                                                <p className="text-[9px] text-slate-600 font-mono">{r.email}</p>
                                                            </td>
                                                            <td className="px-4 py-2.5">
                                                                {r.status === 'success'
                                                                    ? <span className="text-emerald-400 text-[10px] font-bold flex items-center gap-1"><CheckCircle2 size={12} /> Issued</span>
                                                                    : <span className="text-red-400 text-[10px] font-bold flex items-center gap-1"><AlertCircle size={12} /> {r.error}</span>
                                                                }
                                                            </td>
                                                            <td className="px-4 py-2.5">
                                                                {r.verifyHash && (
                                                                    <div className="flex items-center gap-1">
                                                                        <code className="text-[8px] text-slate-600 font-mono">{r.verifyHash.slice(0, 12)}...</code>
                                                                        <button onClick={() => { navigator.clipboard.writeText(r.verifyHash!); toast.success('Copied'); }}
                                                                            className="text-slate-600 hover:text-white transition-colors">
                                                                            <Copy size={12} />
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-2.5">
                                                                {r.pdfUrl && (
                                                                    <a href={r.pdfUrl} target="_blank" rel="noopener noreferrer"
                                                                        className="text-blue-400 hover:text-blue-300 transition-colors">
                                                                        <ExternalLink size={14} />
                                                                    </a>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Issue Single */}
                    <Dialog open={isIssueOpen} onOpenChange={v => { setIsIssueOpen(v); if (!v) { setIssueName(''); setIssueEmail(''); setIssueCourseId(''); } }}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-6 h-10 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-600/20 gap-2">
                                <Plus size={14} />
                                Issue New
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-900 border-slate-800 text-white rounded-[2rem] max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-black uppercase tracking-tight italic">Issue Certificate</DialogTitle>
                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                                    Enter student details manually
                                </p>
                            </DialogHeader>
                            <form onSubmit={handleIssue} className="space-y-6 pt-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Recipient Name</Label>
                                    <Input value={issueName} onChange={e => setIssueName(e.target.value)}
                                        placeholder="e.g. John Doe"
                                        className="bg-slate-950 border-slate-800 rounded-xl h-12 text-sm" required />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Recipient Email</Label>
                                    <Input value={issueEmail} onChange={e => setIssueEmail(e.target.value)}
                                        type="email" placeholder="e.g. john@example.com"
                                        className="bg-slate-950 border-slate-800 rounded-xl h-12 text-sm" required />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Course</Label>
                                    <select value={issueCourseId} onChange={e => setIssueCourseId(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl h-12 px-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                                        required>
                                        <option value="">Select a course...</option>
                                        {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                    </select>
                                </div>
                                <Button className="w-full bg-blue-600 hover:bg-blue-500 h-12 rounded-xl font-black uppercase tracking-widest"
                                    disabled={isIssuing}>
                                    {isIssuing ? <Loader2 className="animate-spin" /> : 'Generate Certificate'}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2 flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Issued</span>
                        <span className="text-lg font-black text-white">{certificates.length}</span>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-slate-800 bg-slate-800/10">
                    <div className="relative max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <Input placeholder="Find by student name, email, or course..."
                            value={search} onChange={e => setSearch(e.target.value)}
                            className="pl-12 bg-slate-950 border-slate-800 text-sm h-12 rounded-2xl focus:ring-blue-600 focus:border-blue-600 shadow-inner italic" />
                    </div>
                </div>

                {loading ? (
                    <div className="p-32 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] animate-pulse italic">Loading...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="p-32 text-center space-y-4">
                        <div className="w-20 h-20 bg-slate-800/50 rounded-3xl flex items-center justify-center mx-auto border border-slate-700 shadow-inner">
                            <Award className="text-slate-600" size={32} />
                        </div>
                        <h3 className="text-white font-bold text-lg uppercase tracking-tight">No credentials issued</h3>
                        <p className="text-slate-500 text-sm italic max-w-xs mx-auto opacity-70">
                            Issue certificates to registered students or upload in bulk.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-800/20">
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Recipient</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Course</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Validation</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filtered.map(cert => (
                                    <tr key={cert.id} className="hover:bg-slate-800/30 transition-all group">
                                        <td className="px-6 py-6 font-medium">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center text-slate-500 shrink-0 border border-slate-800 shadow-inner group-hover:border-blue-500/50 transition-colors">
                                                    <User size={18} />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-white font-black text-[13px] uppercase tracking-tighter italic leading-none">
                                                            {getStudentName(cert)}
                                                        </p>
                                                        {isGuest(cert) && (
                                                            <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                                Guest
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-blue-500/50 text-[10px] font-bold tracking-wider mt-1.5 font-mono">
                                                        {getStudentEmail(cert)}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-2">
                                                <BookOpen size={14} className="text-blue-500" />
                                                <p className="text-white font-black text-[11px] leading-tight uppercase tracking-tight italic">
                                                    {cert.course.title}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex flex-col">
                                                <code className="text-[9px] text-slate-600 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 w-fit font-mono">
                                                    {cert.verifyHash.slice(0, 12)}...
                                                </code>
                                                <span className="text-[10px] font-bold text-slate-700 uppercase mt-1">
                                                    {new Date(cert.issuedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <a href={cert.pdfUrl} target="_blank" rel="noopener noreferrer">
                                                    <Button variant="ghost" size="icon"
                                                        className="w-10 h-10 rounded-xl text-slate-500 hover:text-white hover:bg-slate-800 transition-all border border-transparent hover:border-slate-700 shadow-inner">
                                                        <ExternalLink size={16} />
                                                    </Button>
                                                </a>
                                                <a href={cert.pdfUrl} download={`certificate-${cert.id}.pdf`}>
                                                    <Button variant="ghost" size="icon"
                                                        className="w-10 h-10 rounded-xl text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 transition-all border border-transparent hover:border-blue-500/20 shadow-inner">
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
