// app/api/users/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authAdmin } from '@/app/firebase/firebaseAdmin';

export async function POST(
  req: NextRequest, 
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const idToken = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!idToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decodedToken = await authAdmin.verifyIdToken(idToken);
    if (decodedToken.superAdmin !== true) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { roles } = await req.json(); // e.g., { isAdmin: true, isCreator: false }

    // Fetch the user's existing claims to avoid overwriting them
    const userToUpdate = await authAdmin.getUser(userId);
    const existingClaims = userToUpdate.customClaims || {};
    
    await authAdmin.setCustomUserClaims(userId, { 
      ...existingClaims, 
      ...roles 
    });

    return NextResponse.json({ message: `User ${userId} roles updated successfully.` }, { status: 200 });

  } catch (error: unknown) {
    console.error('API Error updating user roles:', (error as Error).message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}