// app/api/videos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db, storage as adminStorage, authAdmin } from '@/app/firebase/firebaseAdmin'; 
import { Timestamp } from 'firebase-admin/firestore';
import slugify from 'slugify';

export async function POST(req: NextRequest) {
    try {
        const idToken = req.headers.get('Authorization')?.split('Bearer ')[1];
        if (!idToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        
        const decodedToken = await authAdmin.verifyIdToken(idToken);
        
        // This rule correctly allows admins OR creators to upload
        if (decodedToken.admin !== true && decodedToken.creator !== true) {
            return NextResponse.json({ error: 'Forbidden: User does not have creator permissions.' }, { status: 403 });
        }

        const { uid, name, picture } = decodedToken;
        const formData = await req.formData();
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const category = formData.get('category') as string;
        const video = formData.get('video') as File;

        if (!title || !description || !category || !video) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        
        const bucket = adminStorage.bucket();
        const fileName = `${Date.now()}_${slugify(video.name, { lower: true })}`;
        // The file is saved in a user-specific folder, as defined in our security rules
        const file = bucket.file(`videos/${uid}/${fileName}`); 
        
        const videoBuffer = Buffer.from(await video.arrayBuffer());
        
        await file.save(videoBuffer, { metadata: { contentType: video.type } });
        
        // --- THIS IS THE DEFINITIVE FIX ---
        // We remove the line that was causing the error:
        // await file.makePublic(); 

        // And replace it with the modern way to get a long-lived signed URL.
        // This is compatible with Uniform bucket-level access.
        const [videoUrl] = await file.getSignedUrl({
            action: 'read',
            expires: '01-01-2035' // Set a very long expiration date
        });
        // ---------------------------------
        
        const videoData = {
            title,
            description,
            category,
            videoUrl, // Use the new signed URL
            authorId: uid,
            authorName: name || 'Anonymous',
            authorPhotoURL: picture || null,
            createdAt: Timestamp.now(),
            views: 0,
        };
        
        await db.collection('videos').add(videoData);

        return NextResponse.json({ message: 'Video uploaded successfully' }, { status: 201 });

    } catch (error: unknown) {
        console.error('Video Upload API Error:', (error as Error).message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}