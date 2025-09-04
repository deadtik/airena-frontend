import admin from "firebase-admin";
import { NextRequest, NextResponse } from "next/server";
import { db, storage as adminStorage, authAdmin } from "@/app/firebase/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";
import slugify from "slugify";

export async function POST(req: NextRequest) {
  console.log("\n--- [API] Received new post request ---");

  try {
    // ✅ Ensure Firebase app initialized
    const app = admin.apps.length ? admin.app() : admin.initializeApp();
    console.log("🔥 Firestore Project ID:", app.options.projectId);
    console.log("🔥 Storage Bucket:", app.options.storageBucket);

    // --- Step 1: Verify Auth Token ---
    const idToken = req.headers.get("Authorization")?.split("Bearer ")[1];
    if (!idToken) {
      console.error("[API ERROR] No ID token provided.");
      return NextResponse.json(
        { error: "Unauthorized: No token provided." },
        { status: 401 }
      );
    }

    console.log("[API STEP] Verifying user ID token...");
    const decodedToken = await authAdmin.verifyIdToken(idToken);
    console.log(`[API SUCCESS] Token verified for user UID: ${decodedToken.uid}`);

    const user = {
      uid: decodedToken.uid,
      name: decodedToken.name || decodedToken.email || "Anonymous",
    };

    // --- Step 2: Parse Form Data ---
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const image = formData.get("image") as unknown as Blob;

    if (!title || !content || !image) {
      console.error("[API ERROR] Missing required form fields.");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    if (!(image instanceof Blob)) {
      return NextResponse.json({ error: "Invalid image upload" }, { status: 400 });
    }
    console.log(`[API STEP] Form data parsed. Title: "${title}"`);

    // --- Step 3: Upload Image ---
    console.log("[API STEP] Uploading image to Firebase Storage...");
    const bucket = adminStorage.bucket();
    const fileName = `${Date.now()}_${slugify("image", { lower: true })}`;
    const file = bucket.file(`blog-images/${fileName}`);
    const imageBuffer = Buffer.from(await image.arrayBuffer());

    await file.save(imageBuffer, { metadata: { contentType: "image/jpeg" } });
    console.log("[API SUCCESS] Image uploaded.");

    console.log("[API STEP] Getting signed URL for the image...");
    const [imageUrl] = await file.getSignedUrl({
      action: "read",
      expires: "03-09-2491",
    });
    console.log("[API SUCCESS] Image URL obtained:", imageUrl);

    // --- Step 4: Save Post to Firestore ---
    const slug = `${slugify(title, { lower: true, strict: true, trim: true })}-${Date.now()}`;
    const postData = {
      title,
      content,
      imageUrl,
      slug,
      authorId: user.uid,
      authorName: user.name,
      createdAt: Timestamp.now(),
    };

    console.log("[API STEP] Attempting to save post to Firestore...");
    const postRef = await db.collection("posts").add(postData);
    console.log(`[API SUCCESS] Post saved to Firestore with ID: ${postRef.id}`);

    return NextResponse.json({ id: postRef.id, slug }, { status: 201 });
  } catch (error: any) {
    console.error("--- [API FATAL ERROR] ---");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    console.error("------------------------");

    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
