// app/blogs/[slug]/page.tsx
import { db } from "@/app/firebase/firebaseAdmin"; // admin SDK
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import AppImage from "@/app/components/AppImage";

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const postsRef = db.collection("posts");
  const snapshot = await postsRef.where("slug", "==", params.slug).get();

  if (snapshot.empty) {
    return (
      <div className="bg-black h-screen flex items-center justify-center text-white">
        Post not found.
      </div>
    );
  }

  const post = snapshot.docs[0].data();

  return (
    <div className="bg-black text-white">
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
            {post.createdAt.toDate().toLocaleDateString("en-US", {
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
