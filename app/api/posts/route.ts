// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db, storage as adminStorage, authAdmin } from '@/app/firebase/firebaseAdmin'; 
import { Timestamp } from 'firebase-admin/firestore';
import slugify from 'slugify';

export async function POST(req: NextRequest) {
    try {
        const idToken = req.headers.get('Authorization')?.split('Bearer ')[1];
        if (!idToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        const decodedToken = await authAdmin.verifyIdToken(idToken);
        if (decodedToken.admin !== true) {
            return NextResponse.json({ error: 'Forbidden: User is not an admin.' }, { status: 403 });
        }
        const user = { uid: decodedToken.uid, name: decodedToken.name || decodedToken.email || 'Anonymous' };

        const formData = await req.formData();
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const image = formData.get('image') as File;
        const isFeatured = formData.get('isFeatured') === 'true';

        if (!title || !content || !image) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        
        if (isFeatured) {
            const featuredQuery = db.collection('posts').where('isFeatured', '==', true).limit(1);
            const featuredSnapshot = await featuredQuery.get();
            if (!featuredSnapshot.empty) {
                await featuredSnapshot.docs[0].ref.update({ isFeatured: false });
            }
        }

        const bucket = adminStorage.bucket();
        const fileName = `${Date.now()}_${slugify(image.name, { lower: true })}`;
        const file = bucket.file(`blog-images/${fileName}`);
        const imageBuffer = Buffer.from(await image.arrayBuffer());
        
        await file.save(imageBuffer, { metadata: { contentType: image.type } });
        
        // --- THIS IS THE DEFINITIVE FIX ---
        // We will now generate a long-lived Signed URL instead of making the file public.
        // This bypasses the need for public IAM permissions.
        const [imageUrl] = await file.getSignedUrl({
            action: 'read',
            expires: '03-09-2491' // Set a very long expiration date
        });
        // --------------------------------

        const slug = slugify(title, { lower: true, strict: true, trim: true });
        
        const postData = {
            title, content, imageUrl, slug,
            authorId: user.uid, authorName: user.name,
            createdAt: Timestamp.now(), isFeatured,
        };
        
        const postRef = await db.collection('posts').add(postData);

        return NextResponse.json({ id: postRef.id, slug }, { status: 201 });

    } catch (error: any) {
        console.error('API Route Error:', (error as Error).message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}