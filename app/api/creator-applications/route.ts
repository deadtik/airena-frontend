// app/api/creator-applications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db, authAdmin } from '@/app/firebase/firebaseAdmin';

export async function GET(req: NextRequest) {
    try {
        const idToken = req.headers.get('Authorization')?.split('Bearer ')[1];
        if (!idToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        // CRITICAL: Verify the user is a SuperAdmin on the server
        const decodedToken = await authAdmin.verifyIdToken(idToken);
        if (decodedToken.superAdmin !== true) {
            return NextResponse.json({ error: 'Forbidden: Access denied' }, { status: 403 });
        }

        // Fetch all applications with a "pending" status
        const applicationsRef = db.collection('creator-applications');
        const q = applicationsRef.where('status', '==', 'pending');
        const snapshot = await q.get();

        if (snapshot.empty) {
            return NextResponse.json([], { status: 200 });
        }

        const applications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return NextResponse.json(applications, { status: 200 });

    } catch (error: unknown) {
        console.error('API Error fetching applications:', (error as Error).message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}