"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/app/firebase/config";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import AppImage from "@/app/components/AppImage";
import { useAuth } from "@/app/context/AuthContext";
import { PenSquare } from "lucide-react";

interface Post {
  id: string;
  slug: string;
  title: string;
  authorName: string;
  createdAt: Timestamp;
  imageUrl: string;
  content: string;
  isFeatured?: boolean;
}

export default function BlogPage() {
  const { isAdmin } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsCollection = collection(db, "posts");
        const querySnapshot = await getDocs(postsCollection);
        const postsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="bg-black h-screen flex items-center justify-center text-white">
        Loading blogs...
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-black h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center text-white">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-300">No Posts Yet</h2>
            <p className="text-gray-500 mt-4">
              Be the first to share a story with the community!
            </p>
            {isAdmin && (
              <Link
                href="/blogs/new"
                className="mt-8 inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-all transform hover:scale-105"
              >
                <PenSquare size={18} /> Write the First Post
              </Link>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Featured logic
  const featured = posts.find((p) => p.isFeatured) || posts[0];
  const others = posts.filter((p) => p.id !== featured?.id);

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16 container mx-auto px-6 lg:px-12">
        {/* Header + Write Post */}
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            The Airena Blog
          </h1>
          {isAdmin && (
            <Link
              href="/blogs/new"
              className="inline-flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-600 transition-all transform hover:scale-105 shadow-lg"
            >
              <PenSquare size={18} /> Write a New Blog
            </Link>
          )}
        </div>

        {/* Featured */}
        {featured && (
          <Link
            href={`/blogs/${featured.slug}`}
            className="block group relative rounded-2xl overflow-hidden border border-zinc-800 shadow-xl mb-16"
          >
            <div className="relative w-full h-[500px] overflow-hidden">
              <AppImage
                src={featured.imageUrl}
                alt={featured.title}
                className="object-cover group-hover:scale-105 opacity-80 transition-transform duration-700"
                fallbackText={featured.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            </div>
            <div className="absolute bottom-0 left-0 p-8 md:p-12">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">
                {featured.title}
              </h2>
              <p className="text-gray-300 max-w-3xl mb-4 line-clamp-3">
                {featured.content.replace(/<[^>]*>?/gm, "").slice(0, 200)}...
              </p>
              <p className="text-sm text-gray-400">
                {featured.authorName} •{" "}
                {featured.createdAt.toDate().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </Link>
        )}

        {/* Latest */}
        <h3 className="text-2xl font-semibold text-white mb-8">Latest Posts</h3>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((post) => (
            <Link
              key={post.id}
              href={`/blogs/${post.slug}`}
              className="group bg-zinc-900 border border-zinc-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:border-emerald-500 transition-all duration-300 flex flex-col"
            >
              <div className="relative w-full h-56 overflow-hidden">
                <AppImage
                  src={post.imageUrl}
                  alt={post.title}
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  fallbackText={post.title}
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <p className="text-xs text-gray-400 mb-2">
                  {post.authorName} •{" "}
                  {post.createdAt.toDate().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <h2 className="text-xl font-semibold text-white mb-3 group-hover:text-emerald-400 transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-400 line-clamp-3 flex-1">
                  {post.content.replace(/<[^>]*>?/gm, "").slice(0, 150)}...
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />

      {/* Floating FAB for admins */}
      {isAdmin && (
        <Link
          href="/blogs/new"
          className="fixed bottom-8 right-8 bg-emerald-500 text-white p-4 rounded-full shadow-xl hover:bg-emerald-600 hover:scale-110 transition-all flex items-center justify-center"
        >
          <PenSquare size={22} />
        </Link>
      )}
    </div>
  );
}
