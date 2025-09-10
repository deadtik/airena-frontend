// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db, storage as adminStorage, authAdmin } from '@/app/firebase/firebaseAdmin';
import { Timestamp } from 'firebase-admin/firestore';
import slugify from 'slugify';

export async function POST(req: NextRequest) {
  try {
    const idToken = req.headers.get('Authorization')?.split('Bearer ')[1];

    if (!idToken) {
      return NextResponse.json({ error: 'Unauthorized: No token provided.' }, { status: 401 });
    }

    // Verify user
    const decodedToken = await authAdmin.verifyIdToken(idToken);
    const user = {
      uid: decodedToken.uid,
      name: decodedToken.name || decodedToken.email || 'Anonymous',
    };

    // Extract form data
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const image = formData.get('image') as File;

    if (!title || !content || !image) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // --- Image Upload Logic with Signed URL ---
    const bucket = adminStorage.bucket();
    const fileName = `${Date.now()}_${slugify(image.name, { lower: true })}`;
    const file = bucket.file(`blog-images/${fileName}`);
    const imageBuffer = Buffer.from(await image.arrayBuffer());

    await file.save(imageBuffer, { metadata: { contentType: image.type } });

    // ✅ Generate a long-lived signed URL (instead of makePublic)
    const [signedUrl] = await file.getSignedUrl({
      action: "read",
      expires: "01-01-2035", // adjust expiry if needed
    });

    const imageUrl = signedUrl;

    // --- Save Post to Firestore ---
    const slug = slugify(title, { lower: true, strict: true, trim: true });

    const postData = {
      title,
      content,
      imageUrl,
      slug,
      authorId: user.uid,
      authorName: user.name,
      createdAt: Timestamp.now(),
    };

    const postRef = await db.collection('posts').add(postData);

    return NextResponse.json({ id: postRef.id, slug }, { status: 201 });

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('API Route Error:', error.message);
      if ((error as { code?: string }).code === 'auth/id-token-expired') {
        return NextResponse.json({ error: 'Authentication token has expired. Please log in again.' }, { status: 401 });
      }
      return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }

    console.error('Unexpected API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: 'Unknown error' }, { status: 500 });
  }
}