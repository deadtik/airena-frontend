// app/api/creator-applications/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db, authAdmin } from '@/app/firebase/firebaseAdmin';

export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
    try {
        const { userId } = params;
        const idToken = req.headers.get('Authorization')?.split('Bearer ')[1];
        if (!idToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decodedToken = await authAdmin.verifyIdToken(idToken);
        if (decodedToken.superAdmin !== true) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { status } = await req.json();
        if (!['approved', 'rejected'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const applicationRef = db.collection('creator-applications').doc(userId);
        
        if (status === 'approved') {
            const userToUpdate = await authAdmin.getUser(userId);
            const existingClaims = userToUpdate.customClaims || {};
            
            // 1. Grant the creator role
            await authAdmin.setCustomUserClaims(userId, { ...existingClaims, creator: true });

            // 2. Create their channel document
            const appSnapshot = await applicationRef.get();
            if (appSnapshot.exists) {
                const appData = appSnapshot.data();
                const channelRef = db.collection('channels').doc(userId);
                await channelRef.set({
                    channelName: userToUpdate.displayName || userToUpdate.email,
                    photoURL: userToUpdate.photoURL || null,
                    youtubeLink: appData?.youtubeLink || null,
                    twitterLink: appData?.twitterLink || null,
                    subscribers: 0, // Initial stat
                    createdAt: new Date(),
                });
            }
        }
        
        // 3. Update the application status
        await applicationRef.update({ status: status });

        return NextResponse.json({ message: `Application ${status}.` }, { status: 200 });

    } catch (error: unknown) {
        console.error('API Error updating application:', (error as Error).message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}