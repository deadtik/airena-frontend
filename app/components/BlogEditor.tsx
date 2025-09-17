// app/components/BlogEditor.tsx
"use client";
import React, { useState, useCallback } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import TiptapLink from "@tiptap/extension-link";
import { Node } from "@tiptap/core";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Heading2,
  Quote,
  ImageIcon,
  Link2,
  Twitter,
} from "lucide-react";

// --- Custom Tiptap Extension for Social Media Embeds ---
interface SocialEmbedOptions {
  src: string;
  type: "twitter" | "youtube" | "instagram";
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    socialEmbed: {
      setSocialEmbed: (options: SocialEmbedOptions) => ReturnType;
    };
  }
}

const SocialEmbed = Node.create({
  name: "socialEmbed",
  group: "block",
  atom: true,
  addAttributes() {
    return { src: { default: null }, type: { default: "twitter" } };
  },
  parseHTML() {
    return [{ tag: "div[data-social-embed]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      {
        "data-social-embed": "",
        "data-src": HTMLAttributes.src,
        "data-type": HTMLAttributes.type,
        class: "social-embed-placeholder",
      },
      `Embed placeholder for ${HTMLAttributes.type}`,
    ];
  },
  addCommands() {
    return {
      setSocialEmbed:
        (options: SocialEmbedOptions) =>
        ({ commands }) => {
          return commands.insertContent({ type: this.name, attrs: options });
        },
    };
  },
});

// --- Editor Toolbar Component ---
const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [socialUrl, setSocialUrl] = useState("");
  const [socialType, setSocialType] = useState<
    "twitter" | "youtube" | "instagram"
  >("twitter");

  const addImage = useCallback(() => {
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl, alt: imageAlt }).run();
      setShowImageModal(false);
      setImageUrl("");
      setImageAlt("");
    }
  }, [editor, imageUrl, imageAlt]);

  const addSocialEmbed = useCallback(() => {
    if (socialUrl && editor) {
      editor
        .chain()
        .focus()
        .setSocialEmbed({ src: socialUrl, type: socialType })
        .run();
      setShowSocialModal(false);
      setSocialUrl("");
    }
  }, [editor, socialUrl, socialType]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  const buttonClass = (name: string, opts?: Record<string, unknown>) =>
    `p-2 rounded transition-colors ${
      editor.isActive(name, opts)
        ? "bg-emerald-500/30 text-emerald-300"
        : "text-gray-400 hover:bg-gray-700"
    }`;

  return (
    <>
      <div className="flex items-center gap-1 p-2 border-b border-gray-700 flex-wrap">
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={buttonClass("heading", { level: 2 })}
          title="Heading"
        >
          <Heading2 size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={buttonClass("bold")}
          title="Bold"
        >
          <Bold size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={buttonClass("italic")}
          title="Italic"
        >
          <Italic size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={buttonClass("strike")}
          title="Strikethrough"
        >
          <Strikethrough size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={buttonClass("blockquote")}
          title="Quote"
        >
          <Quote size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={buttonClass("bulletList")}
          title="Bullet List"
        >
          <List size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={buttonClass("orderedList")}
          title="Ordered List"
        >
          <ListOrdered size={18} />
        </button>
        <div className="w-px h-6 bg-gray-600 mx-1" />
        <button
          type="button"
          onClick={() => setShowImageModal(true)}
          className={buttonClass("image")}
          title="Add Image"
        >
          <ImageIcon size={18} />
        </button>
        <button
          type="button"
          onClick={setLink}
          className={buttonClass("link")}
          title="Add Link"
        >
          <Link2 size={18} />
        </button>
        <button
          type="button"
          onClick={() => setShowSocialModal(true)}
          className={buttonClass("socialEmbed")}
          title="Add Social Embed"
        >
          <Twitter size={18} />
        </button>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96 max-w-[90vw]">
            <h3 className="text-lg font-semibold mb-4 text-white">Add Image</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Alt Text (optional)
                </label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Description of the image"
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addImage}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
              >
                Add Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Social Embed Modal */}
      {showSocialModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96 max-w-[90vw]">
            <h3 className="text-lg font-semibold mb-4 text-white">
              Add Social Embed
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Platform
                </label>
                <select
                  value={socialType}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setSocialType(
                      e.target.value as "twitter" | "youtube" | "instagram"
                    )
                  }
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="twitter">Twitter/X</option>
                  <option value="youtube">YouTube</option>
                  <option value="instagram">Instagram</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL
                </label>
                <input
                  type="url"
                  value={socialUrl}
                  onChange={(e) => setSocialUrl(e.target.value)}
                  placeholder="Paste the full URL..."
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <button
                type="button"
                onClick={() => setShowSocialModal(false)}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addSocialEmbed}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
              >
                Add Embed
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// --- Main Blog Editor Component ---
interface BlogEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const BlogEditor: React.FC<BlogEditorProps> = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      TiptapImage.configure({ inline: false, allowBase64: true }),
      TiptapLink.configure({ openOnClick: false }),
      SocialEmbed,
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-invert prose-lg max-w-none p-4 min-h-[300px] focus:outline-none prose-p:text-gray-300 prose-h2:text-emerald-400 prose-a:text-emerald-400",
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
