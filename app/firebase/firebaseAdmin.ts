// firebase/firebaseAdmin.ts
import * as admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID || "airena-but-better";
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
      : undefined;

    if (!clientEmail || !privateKey) {
      throw new Error("❌ Missing Firebase service account credentials.");
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      storageBucket: `${projectId}.appspot.com`,
    });

    console.log("✅ Firebase Admin SDK initialized successfully.");
    console.log("🔥 Project ID:", projectId);
    console.log("🔥 Storage Bucket:", admin.app().options.storageBucket);
  } catch (error) {
    console.error("❌ Firebase Admin init error:", error);
    throw error;
  }
}

export const db = admin.firestore();
export const storage = admin.storage();
export const authAdmin = admin.auth();
