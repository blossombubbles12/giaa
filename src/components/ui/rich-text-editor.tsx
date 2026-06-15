'use client';

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,
    loading: () => <div className="h-[200px] w-full bg-slate-800/20 animate-pulse rounded-xl" />
});

interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
    className?: string;
}

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ color: [] }, { background: [] }],
        ['link', 'clean'],
    ],
};

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'color', 'background',
    'link',
];

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
    return (
        <div className={className}>
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
                className="bg-slate-800/50 text-white rounded-xl overflow-hidden border border-slate-700 focus-within:border-blue-500 transition-all shadow-inner"
            />
            <style jsx global>{`
                .ql-toolbar.ql-snow {
                    border-color: transparent !important;
                    background: rgba(15, 23, 42, 0.5) !important;
                    border-bottom: 1px solid rgba(51, 65, 85, 0.5) !important;
                    padding: 8px 12px !important;
                }
                .ql-container.ql-snow {
                    border-color: transparent !important;
                    font-size: 0.875rem !important;
                    min-height: 200px !important;
                }
                .ql-editor {
                    padding: 16px !important;
                    line-height: 1.6 !important;
                }
                .ql-editor.ql-blank::before {
                    color: #64748b !important;
                    font-style: italic !important;
                }
                .ql-snow .ql-stroke {
                    stroke: #94a3b8 !important;
                }
                .ql-snow .ql-fill {
                    fill: #94a3b8 !important;
                }
                .ql-snow .ql-picker {
                    color: #94a3b8 !important;
                }
                .ql-snow .ql-picker-options {
                    background-color: #0f172a !important;
                    border-color: #334155 !important;
                }
                .ql-snow.ql-toolbar button:hover .ql-stroke,
                .ql-snow.ql-toolbar button:hover .ql-fill,
                .ql-snow.ql-toolbar button.ql-active .ql-stroke,
                .ql-snow.ql-toolbar button.ql-active .ql-fill {
                    stroke: #3b82f6 !important;
                    fill: #3b82f6 !important;
                }
            `}</style>
        </div>
    );
}
