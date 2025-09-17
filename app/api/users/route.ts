// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authAdmin } from '@/app/firebase/firebaseAdmin';

export async function GET(req: NextRequest) {
    try {
        const idToken = req.headers.get('Authorization')?.split('Bearer ')[1];
        if (!idToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        const decodedToken = await authAdmin.verifyIdToken(idToken);
        // CRITICAL: Only allow superAdmins to access this list
        if (decodedToken.superAdmin !== true) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const listUsersResult = await authAdmin.listUsers(1000); // Get up to 1000 users
        const users = listUsersResult.users.map(user => ({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || 'No Name',
            // Access custom claims to see their roles
            isAdmin: !!user.customClaims?.admin,
            isCreator: !!user.customClaims?.creator,
        }));

        return NextResponse.json(users, { status: 200 });

    } catch (error: unknown) {
        console.error('API Error fetching users:', (error as Error).message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}