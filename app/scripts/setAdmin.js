// scripts/setAdmin.js
// This line loads your .env.local file
require('dotenv').config({ path: '.env.local' }); 
const admin = require('firebase-admin');

// The script reads your service account keys from the .env.local file
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
};

// Initialize the app
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// -------------------------------------------------------------------
// PASTE THE USER UID FROM THE FIREBASE CONSOLE HERE
const uid = "1oElZfI82SOEnL3BDwHEAuMWbsw2"; 
const newUsername = "Airena Blogs";
// -------------------------------------------------------------------

async function setupAdmin() {
  if (!uid || uid === "PASTE_YOUR_ADMIN_USER_UID_HERE") {
    console.error("❌ Please provide a valid User UID in the script.");
    return;
  }
  
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log(`✅ Successfully set custom claim { admin: true } for user ${uid}.`);

    await admin.auth().updateUser(uid, {
      displayName: newUsername
    });
    console.log(`✅ Successfully updated display name to "${newUsername}" for user ${uid}.`);
    
    console.log("\nSetup complete! The user is now the BlogAdmin with the username 'Airena'.");
    process.exit(0);

  } catch (error) {
    console.error('❌ Error during admin setup:', error);
    process.exit(1);
  }
}

setupAdmin();