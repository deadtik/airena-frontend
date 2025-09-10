// app/api/posts/[postId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db, authAdmin, storage as adminStorage } from '@/app/firebase/firebaseAdmin';
import slugify from 'slugify';

// --- Route context type ---
interface RouteContext {
  params: {
    postId: string;
  };
}

// --- Firestore Post type ---
interface Post {
  title: string;
  content: string;
  imageUrl?: string;
  isFeatured: boolean;
}

// GET: Fetch a single post's data for the edit page
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { postId } = context.params;
    const docRef = db.collection('posts').doc(postId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ id: doc.id, ...doc.data() }, { status: 200 });
  } catch (error: unknown) {
    console.error('GET post error:', (error as Error).message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT: Update an existing post
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const { postId } = context.params;
    const idToken = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!idToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decodedToken = await authAdmin.verifyIdToken(idToken);
    if (decodedToken.admin !== true) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const formData = await req.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const image = formData.get('image') as File | null;
    const isFeatured = formData.get('isFeatured') === 'true';

    const postRef = db.collection('posts').doc(postId);

    // ✅ Use Firestore’s UpdateData<Post>
    const updateData: FirebaseFirestore.UpdateData<Post> = {
      title,
      content,
      isFeatured,
    };

    if (image) {
      const bucket = adminStorage.bucket();
      const fileName = `${Date.now()}_${slugify(image.name, { lower: true })}`;
      const file = bucket.file(`blog-images/${fileName}`);
      const imageBuffer = Buffer.from(await image.arrayBuffer());

      await file.save(imageBuffer, { metadata: { contentType: image.type } });
      await file.makePublic();

      updateData.imageUrl = file.publicUrl();
    }

    await postRef.update(updateData);
    return NextResponse.json({ message: 'Post updated successfully' }, { status: 200 });
  } catch (error: unknown) {
    console.error('PUT post error:', (error as Error).message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: Delete a post
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const { postId } = context.params;
    const idToken = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!idToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decodedToken = await authAdmin.verifyIdToken(idToken);
    if (decodedToken.admin !== true) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await db.collection('posts').doc(postId).delete();
    return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
  } catch (error: unknown) {
    console.error('DELETE post error:', (error as Error).message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
