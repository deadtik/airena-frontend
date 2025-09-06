// app/blogs/page.tsx
import { db } from "@/app/firebase/firebaseAdmin"; //
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import AppImage from "@/app/components/AppImage";

// BlogPost type
interface BlogPost {
  id: string;
  slug: string;
  title: string;
  imageUrl: string;
  authorName: string;
  createdAt: Date; // ✅ safer than Firestore.Timestamp
}

export default async function BlogsPage() {
  let posts: BlogPost[] = [];

  try {
    const snapshot = await db
      .collection("posts")
      .orderBy("createdAt", "desc")
      .get();

    posts = snapshot.docs.map((doc) => {
      const data = doc.data();

      // Defensive date parsing
      let createdAt: Date;
      if (data.createdAt?.toDate) {
        createdAt = data.createdAt.toDate();
      } else if (data.createdAt instanceof Date) {
        createdAt = data.createdAt;
      } else {
        createdAt = new Date(); // fallback to "now"
      }

      return {
        id: doc.id,
        slug: String(data.slug ?? "untitled"),
        title: String(data.title ?? "Untitled Post"),
        imageUrl: String(data.imageUrl ?? "/placeholder.png"),
        authorName: String(data.authorName ?? "Unknown Author"),
        createdAt,
      };
    });
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
  }

  return (
    <div className="bg-black text-white">
      <Header />
      <main className="pt-24 pb-16 min-h-screen container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold mb-12">Latest Blogs</h1>

        {posts.length === 0 ? (
          <p className="text-gray-400">No blogs published yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blogs/${post.slug}`}
                className="group bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition"
              >
                <div className="relative w-full h-56">
                  <AppImage
                    src={post.imageUrl}
                    alt={post.title}
                    className="object-cover"
                    fallbackText={post.title}
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold group-hover:text-emerald-400 transition">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 text-sm mt-2">
                    {post.authorName} •{" "}
                    {post.createdAt.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
