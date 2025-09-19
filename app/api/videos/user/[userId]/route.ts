import { NextRequest, NextResponse } from 'next/server';
import { db, authAdmin } from '@/app/firebase/firebaseAdmin';

// --- THIS IS THE FIX ---
// Define the type for the context object that Next.js passes to the route handler.
// This is the standard and correct way to type dynamic route segments.
interface RouteContext {
    params: {
        userId: string;
    }
}
// --------------------

// GET: Fetches all videos for a specific user (the creator)
export async function GET(req: NextRequest, context: RouteContext) { // Use the defined type here
    try {
        const { userId } = context.params; // Destructure the userId from the context
        const idToken = req.headers.get('Authorization')?.split('Bearer ')[1];

        if (!idToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        const decodedToken = await authAdmin.verifyIdToken(idToken);
        
        // CRITICAL SECURITY CHECK: A user can only fetch their own videos.
        // This prevents one creator from seeing another creator's dashboard content.
        if (decodedToken.uid !== userId) {
            return NextResponse.json({ error: 'Forbidden: You can only access your own content.' }, { status: 403 });
        }

        // Fetch all videos from the 'videos' collection where the authorId matches the user's ID
        const videosRef = db.collection('videos');
        const q = videosRef.where('authorId', '==', userId).orderBy('createdAt', 'desc');
        const snapshot = await q.get();

        if (snapshot.empty) {
            return NextResponse.json([], { status: 200 }); // Return an empty array if they have no videos yet
        }

        const videos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return NextResponse.json(videos, { status: 200 });

    } catch (error: unknown) {
        console.error('API Error fetching user videos:', (error as Error).message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}