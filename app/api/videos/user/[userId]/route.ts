import { NextRequest, NextResponse } from "next/server";
import { db, authAdmin } from "@/app/firebase/firebaseAdmin";

// ✅ Use the built-in type from Next.js
interface Params {
  params: { userId: string };
}

// GET: Fetches all videos for a specific user (the creator)
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { userId } = params;
    const idToken = req.headers.get("Authorization")?.split("Bearer ")[1];

    if (!idToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = await authAdmin.verifyIdToken(idToken);

    // CRITICAL SECURITY CHECK: A user can only fetch their own videos.
    if (decodedToken.uid !== userId) {
      return NextResponse.json(
        { error: "Forbidden: You can only access your own content." },
        { status: 403 }
      );
    }

    // Fetch all videos for this user
    const videosRef = db.collection("videos");
    const q = videosRef.where("authorId", "==", userId).orderBy("createdAt", "desc");
    const snapshot = await q.get();

    if (snapshot.empty) {
      return NextResponse.json([], { status: 200 });
    }

    const videos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(videos, { status: 200 });
  } catch (error: unknown) {
    console.error("API Error fetching user videos:", (error as Error).message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
