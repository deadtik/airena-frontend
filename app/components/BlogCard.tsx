// components/BlogCard.tsx
import React from 'react';
import Link from 'next/link';
import AppImage from './AppImage';
import { ArrowUpRight } from 'lucide-react';

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
    isLarge?: boolean; // New prop for larger cards in the grid
}

const BlogCard: React.FC<BlogCardProps> = ({ post, isLarge = false }) => {
    if (!post) {
        return null;
    }

    return (
        <Link 
            href={`/blogs/${post.slug}`} 
            className={`block group bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-emerald-500/20 border border-white/10 hover:border-emerald-500/50 ${isLarge ? 'md:col-span-2' : ''}`}
        >
            <div className={`relative w-full overflow-hidden ${isLarge ? 'h-64' : 'h-48'}`}>
                <AppImage 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="group-hover:scale-105 transition-transform duration-500"
                    fallbackText={post.title} 
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
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
    );
};

export default BlogCard;