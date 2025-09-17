// app/api/creator-applications/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db, authAdmin } from "@/app/firebase/firebaseAdmin";

// --- THIS IS THE FIX ---
// Define the type for the context object that Next.js passes to the route handler.
// This is the standard and correct way to type dynamic route segments.
interface RouteContext {
  params: {
    userId: string;
  };
}
// --------------------

export async function POST(
  req: NextRequest,
  context: RouteContext // Use the defined type here
) {
  try {
    const { userId } = context.params; // Destructure the userId from the context
    const idToken = req.headers.get("Authorization")?.split("Bearer ")[1];
    if (!idToken)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decodedToken = await authAdmin.verifyIdToken(idToken);
    if (decodedToken.superAdmin !== true) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { status } = await req.json();
    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const applicationRef = db.collection("creator-applications").doc(userId);

    if (status === "approved") {
      const userToUpdate = await authAdmin.getUser(userId);
      const existingClaims = userToUpdate.customClaims || {};

      // 1. Grant the creator role
      await authAdmin.setCustomUserClaims(userId, {
        ...existingClaims,
        creator: true,
      });

      // 2. Create their channel document
      const appSnapshot = await applicationRef.get();
      if (appSnapshot.exists) {
        const appData = appSnapshot.data();
        const channelRef = db.collection("channels").doc(userId);
        await channelRef.set({
          channelName: userToUpdate.displayName || userToUpdate.email,
          photoURL: userToUpdate.photoURL || null,
          youtubeLink: appData?.youtubeLink || null,
          twitterLink: appData?.twitterLink || null,
          subscribers: 0,
          createdAt: new Date(),
        });
      }
    }

    // 3. Update the application status
    await applicationRef.update({ status });

    return NextResponse.json(
      { message: `Application ${status}.` },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("API Error updating application:", (error as Error).message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}