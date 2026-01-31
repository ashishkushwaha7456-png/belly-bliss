'use client';

import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export default function Editor({ value, onChange }) {
    const editorRef = useRef(null);
    const quillInstance = useRef(null);

    useEffect(() => {
        if (editorRef.current && !quillInstance.current) {
            quillInstance.current = new Quill(editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ 'header': [2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        ['link', 'clean']
                    ]
                }
            });

            quillInstance.current.on('text-change', () => {
                const html = quillInstance.current.root.innerHTML;
                onChange(html);
            });
        }
    }, [onChange]); // Initial setup only

    // Handle external value changes (e.g., initial load or reset)
    useEffect(() => {
        if (quillInstance.current && value !== quillInstance.current.root.innerHTML) {
            // Only update if content is different to avoid cursor jumps
            // Use a simple check or dangeriously paste if completely different (like switching pages)
            const currentContent = quillInstance.current.root.innerHTML;
            if (value !== currentContent) {
                // Determine if this is a "new page load" (empty vs content) or just typing
                // For CMS, simpler is usually safer: if keys change in parent, value changes
                quillInstance.current.root.innerHTML = value || '';
            }
        }
    }, [value]);

    return (
        <div className="quill-wrapper">
            <div ref={editorRef} style={{ height: '300px', backgroundColor: 'white' }} />
            <style jsx global>{`
                .quill-wrapper {
                    display: flex;
                    flex-direction: column;
                }
                .ql-toolbar {
                    border-radius: 12px 12px 0 0;
                    border-color: #eee !important;
                    background: #f8fafc;
                }
                .ql-container {
                    border-radius: 0 0 12px 12px;
                    border-color: #eee !important;
                    font-size: 1rem !important;
                    font-family: inherit !important;
                }
                .ql-editor {
                    min-height: 300px;
                }
            `}</style>
        </div>
    );
}
