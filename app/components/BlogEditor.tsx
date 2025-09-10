"use client";
import React from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, Strikethrough, List, ListOrdered, Heading2, Quote } from 'lucide-react';

const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) return null;
    const buttonClass = (name: string, opts?: {}) => 
        `p-2 rounded transition-colors ${editor.isActive(name, opts) ? 'bg-emerald-500/30 text-emerald-300' : 'text-gray-400 hover:bg-gray-700'}`;

    return (
        <div className="flex items-center gap-1 p-2 border-b border-gray-700 flex-wrap">
            <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={buttonClass('heading', { level: 2 })}><Heading2 size={18} /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={buttonClass('bold')}><Bold size={18} /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={buttonClass('italic')}><Italic size={18} /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={buttonClass('strike')}><Strikethrough size={18} /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={buttonClass('blockquote')}><Quote size={18} /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={buttonClass('bulletList')}><List size={18} /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={buttonClass('orderedList')}><ListOrdered size={18} /></button>
        </div>
    );
};

interface BlogEditorProps {
    value: string;
    onChange: (value: string) => void;
}

const BlogEditor: React.FC<BlogEditorProps> = ({ value, onChange }) => {
    const editor = useEditor({
        extensions: [ StarterKit ],
        content: value,
        immediatelyRender: false, // Fixes SSR hydration error
        onUpdate: ({ editor }) => { onChange(editor.getHTML()); },
        editorProps: {
            attributes: {
                class: 'prose prose-invert prose-lg max-w-none p-4 min-h-[300px] focus:outline-none prose-p:text-gray-300 prose-h2:text-emerald-400',
            },
        },
    });

    return (
        <div className="bg-[#1a1a1a] text-white rounded-lg border border-gray-700">
            <EditorToolbar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
};
export default BlogEditor;