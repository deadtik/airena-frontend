import admin, { ServiceAccount } from "firebase-admin";

const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // should NOT be NEXT_PUBLIC
    });

    console.log("✅ Firebase Admin SDK initialized successfully.");
    console.log("🔥 Using Project ID:", serviceAccount.projectId);
    console.log("🔥 Storage Bucket:", admin.app().options.storageBucket);
  } catch (error: any) {
    console.error("❌ Firebase Admin init error:", error);
    throw error; // crash on bad creds
  }
}

export const db = admin.firestore();
export const storage = admin.storage();
export const authAdmin = admin.auth();
