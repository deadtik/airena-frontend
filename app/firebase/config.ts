// app/firebase/config.ts
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ✅ Client SDK config (only NEXT_PUBLIC_ env vars)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// --- Safety check for missing env ---
for (const [key, value] of Object.entries(firebaseConfig)) {
  if (!value) {
    throw new Error(`❌ Missing Firebase config value: ${key}`);
  }
}

// --- Singleton pattern ---
const app: FirebaseApp =
  !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// --- Helper for Google sign-in (returns token for API) ---
export async function signInWithGoogle() {
  const { signInWithPopup } = await import("firebase/auth"); // dynamic import for SSR safety
  const result = await signInWithPopup(auth, googleProvider);
  const token = await result.user.getIdToken(); // 🔑 send this in Authorization header
  return { user: result.user, token };
}
