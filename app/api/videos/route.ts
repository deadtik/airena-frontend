// app/api/videos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db, authAdmin } from '@/app/firebase/firebaseAdmin'; 
import { Timestamp } from 'firebase-admin/firestore';

// This API route now only handles saving the video's metadata to Firestore.
export async function POST(req: NextRequest) {
    try {
        const idToken = req.headers.get('Authorization')?.split('Bearer ')[1];
        if (!idToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        
        const decodedToken = await authAdmin.verifyIdToken(idToken);
        // Allow both admins and creators to create video entries
        if (decodedToken.admin !== true && decodedToken.creator !== true) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { title, description, category, videoUrl } = await req.json();

        if (!title || !description || !category || !videoUrl) {
            return NextResponse.json({ error: 'Missing required video metadata' }, { status: 400 });
        }
        
        const videoData = {
            title,
            description,
            category,
            videoUrl, // The URL comes from the client-side upload
            authorId: decodedToken.uid,
            authorName: decodedToken.name || 'Anonymous',
            authorPhotoURL: decodedToken.picture || null,
            createdAt: Timestamp.now(),
            views: 0,
        };
        
        await db.collection('videos').add(videoData);

        return NextResponse.json({ message: 'Video entry created successfully' }, { status: 201 });

    } catch (error: unknown) {
        console.error('API Error creating video entry:', (error as Error).message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}