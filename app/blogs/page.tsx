// app/blog/page.tsx
import React from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AppImage from '../components/AppImage';

// In a real app, this data would come from a CMS
const blogPosts = [
    {
        slug: 'the-rise-of-esports-in-2025',
        title: 'The Unstoppable Rise of Competitive Esports in 2025',
        author: 'Jane Doe',
        date: 'September 2, 2025',
        excerpt: 'A deep dive into the trends, players, and platforms shaping the future of professional gaming.',
        imageUrl: 'https://images.unsplash.com/photo-1542751371-659545093593?q=80&w=2070&auto=format&fit=crop',
    },
    {
        slug: 'next-gen-consoles-one-year-later',
        title: 'Next-Gen Consoles: One Year Later, Are They Worth It?',
        author: 'John Smith',
        date: 'September 1, 2025',
        excerpt: 'We review the highs and lows of the latest generation of gaming hardware.',
        imageUrl: 'https://images.unsplash.com/photo-1589254066213-a0c9dc853511?q=80&w=2070&auto=format&fit=crop',
    },
    {
        slug: 'indie-games-you-cant-miss',
        title: 'The Top 5 Indie Games You Can\'t Afford to Miss This Season',
        author: 'Alex Ray',
        date: 'August 30, 2025',
        excerpt: 'From pixel-art masterpieces to narrative-driven adventures, these indie titles are a must-play.',
        imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop',
    }
];

const topStory = blogPosts[0];
const otherStories = blogPosts.slice(1);

const BlogPage = () => {
    return (
        <div className="bg-black text-white">
            <Header />
            <main className="pt-24 pb-16 min-h-screen">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">The Airena Blog</h1>
                    <p className="text-center text-gray-400 mb-12">News, updates, and stories from the world of gaming and sports.</p>

                    {/* Top Story */}
                    <div className="mb-16">
                        <Link href={`/blog/${topStory.slug}`} className="block group">
                            <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl shadow-emerald-500/10">
                                <AppImage src={topStory.imageUrl} alt={topStory.title} className="w-full h-96 object-cover opacity-60 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500" fallbackText="Top Story" />
                                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/70 to-transparent">
                                    <h2 className="text-3xl md:text-4xl font-bold mb-2 group-hover:text-emerald-400 transition-colors">{topStory.title}</h2>
                                    <p className="text-gray-300 mb-4 max-w-3xl">{topStory.excerpt}</p>
                                    <p className="text-sm text-gray-500">{topStory.author} • {topStory.date}</p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Other Stories */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {otherStories.map(post => (
                            <Link href={`/blog/${post.slug}`} key={post.slug} className="block group bg-[#181818]/50 rounded-lg overflow-hidden transform hover:-translate-y-1 transition-transform">
                                <AppImage src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" fallbackText={post.title} />
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-400 transition-colors">{post.title}</h3>
                                    <p className="text-gray-400 text-sm mb-3">{post.excerpt}</p>
                                    <p className="text-xs text-gray-500">{post.author} • {post.date}</p>
                                </div>
                            </Link>
                        ))}
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
};

export default BlogPage;
