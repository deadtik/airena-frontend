// app/blogs/[slug]/page.tsx
import { db } from "@/app/firebase/firebaseAdmin";
import { notFound } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import AppImage from "@/app/components/AppImage";

interface Post {
  id: string;
  title: string;
  authorName: string;
  createdAt: Date;
  imageUrl: string;
  content: string;
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;  // ✅ Await params

  const snapshot = await db
    .collection("posts")
    .where("slug", "==", slug)
    .get();

  if (snapshot.empty) {
    notFound();
  }

  const doc = snapshot.docs[0];
  const data = doc.data();
  const post: Post = {
    id: doc.id,
    title: data.title,
    authorName: data.authorName,
    createdAt: data.createdAt?.toDate?.() || new Date(),
    imageUrl: data.imageUrl,
    content: data.content,
  };

  return (
    <div className="bg-transparent">
      <Header />
      <main className="pt-24 pb-16 min-h-screen">
        <article className="container mx-auto px-4 max-w-4xl">
          <div className="relative w-full h-96 mb-8 rounded-2xl overflow-hidden">
            <AppImage
              src={post.imageUrl}
              alt={post.title}
              className="object-cover"
              fallbackText={post.title}
            />
          </div>
          <p className="text-sm text-gray-500 mb-4">
            {post.authorName} •{" "}
            {post.createdAt.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">{post.title}</h1>
          <div
            className="prose prose-invert prose-lg max-w-none prose-p:text-gray-300 prose-h2:text-emerald-400 prose-h3:text-emerald-400"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
      <Footer />
    </div>
  );
}