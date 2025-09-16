// app/blogs/[slug]/page.tsx
import { db } from "@/app/firebase/firebaseAdmin"; // Use the Admin SDK for Server Components
import { notFound } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import AppImage from "@/app/components/AppImage";
// import CommentSection from "@/components/CommentSection"; // This must be a Client Component
// import ReactionBar from "@/components/ReactionBar";     // This must be a Client Component
import { Timestamp } from "firebase-admin/firestore";

// Define the shape of the post data
interface Post {
  id: string;
  title: string;
  authorName: string;
  createdAt: Date; // Use the standard Date object for easier formatting
  imageUrl: string;
  content: string;
}

// Updated signature for Next.js 15 - params is now a Promise
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; // Added await here

  // Fetch the data directly on the server before the page is rendered
  const snapshot = await db
    .collection("posts")
    .where("slug", "==", slug)
    .limit(1) // Ensure only one document is fetched
    .get();

  if (snapshot.empty) {
    notFound(); // Triggers the built-in 404 page if no post is found
  }

  const doc = snapshot.docs[0];
  const data = doc.data();
  
  // The toDate() method correctly converts the Firestore Timestamp to a standard Date object
  const createdAtTimestamp = data.createdAt as Timestamp;
  
  const post: Post = {
    id: doc.id,
    title: data.title,
    authorName: data.authorName || 'Airena',
    createdAt: createdAtTimestamp.toDate(),
    imageUrl: data.imageUrl,
    content: data.content,
  };

  return (
    <div className="bg-transparent">
      <Header />
      <main className="pt-24 pb-16 min-h-screen">
        <article className="container mx-auto px-4 max-w-4xl">
          {/* Featured Image */}
          <div className="relative w-full h-64 md:h-96 mb-8 rounded-2xl overflow-hidden shadow-lg shadow-black/20">
            <AppImage
              src={post.imageUrl}
              alt={post.title}
              className="object-cover"
              fallbackText={post.title}
            />
          </div>
          
          {/* Post Metadata */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight text-white">
              {post.title}
            </h1>
            <p className="text-md text-gray-400">
              By {post.authorName} •{" "}
              {post.createdAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          
          {/* Post Content */}
          <div
            className="prose prose-invert prose-lg max-w-none 
                       prose-p:text-gray-300 prose-p:leading-relaxed
                       prose-h2:text-emerald-400 prose-h2:font-semibold
                       prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-500/10
                       prose-li:text-gray-300"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Interactive Client Components for reactions and comments
          <ReactionBar postId={post.id} />
          <CommentSection postId={post.id} /> */}

        </article>
      </main>
      <Footer />
    </div>
  );
}