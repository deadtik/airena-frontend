// firebase/firebaseAdmin.ts
import admin from 'firebase-admin';

const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        });
    } catch (error: unknown) { // Use unknown for better type safety
        console.error('❌ Firebase admin initialization error:', (error as Error).message);
    }
}

export const db = admin.firestore();
export const storage = admin.storage();
export const authAdmin = admin.auth();