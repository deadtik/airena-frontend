// app/components/BlogCard.tsx
"use client";
import React from 'react';
import Link from 'next/link';
import AppImage from './AppImage';
import { ArrowUpRight, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

interface Post {
    id: string;
    slug: string;
    title: string;
    authorName: string;
    createdAt: string;
    excerpt: string;
    imageUrl: string;
}

interface BlogCardProps {
    post: Post;
    isLarge?: boolean;
    onDelete: (postId: string) => void; // Function to trigger the delete confirmation
}

const BlogCard: React.FC<BlogCardProps> = ({ post, isLarge = false, onDelete }) => {
    const { isAdmin } = useAuth(); // Get admin status directly from the context

    if (!post) {
        return null;
    }

    // These functions prevent the main link from being followed when clicking an admin button
    const handleEditClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // The <Link> component will handle navigation
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onDelete(post.id);
    };

    return (
        <div className="relative group">
            {/* The main link that wraps the card content */}
            <Link 
                href={`/blogs/${post.slug}`} 
                className={`block bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-emerald-500/20 border border-white/10 hover:border-emerald-500/50 ${isLarge ? 'md:col-span-2' : ''}`}
            >
                <div className={`relative w-full overflow-hidden ${isLarge ? 'h-64' : 'h-48'}`}>
                    <AppImage 
                        src={post.imageUrl} 
                        alt={post.title} 
                        className="group-hover:scale-105 transition-transform duration-500"
                        fallbackText={post.title} 
                    />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent"></div>
                </div>
                <div className="p-6">
                    <h3 className={`font-bold mb-3 group-hover:text-emerald-400 transition-colors duration-300 line-clamp-2 ${isLarge ? 'text-2xl h-16' : 'text-xl h-14'}`}>{post.title}</h3>
                    <p className={`text-gray-400 text-sm mb-4 ${isLarge ? 'line-clamp-3 h-16' : 'line-clamp-2 h-10'}`}>{post.excerpt}</p>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-800">
                        <p className="text-xs text-gray-500">{post.authorName} • {post.createdAt}</p>
                        <ArrowUpRight className="text-gray-600 group-hover:text-emerald-400 transition-colors" size={20} />
                    </div>
                </div>
            </Link>

            {/* --- ADMIN BUTTONS OVERLAY --- */}
            {/* This will only render if the user is an admin */}
            {isAdmin && (
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Link href={`/admin/edit-post/${post.id}`} onClick={handleEditClick} className="p-2 bg-blue-500/80 hover:bg-blue-600 rounded-lg backdrop-blur-sm text-white cursor-pointer">
                        <Edit size={16} />
                    </Link>
                    <button onClick={handleDeleteClick} className="p-2 bg-red-500/80 hover:bg-red-600 rounded-lg backdrop-blur-sm text-white cursor-pointer">
                        <Trash2 size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default BlogCard;