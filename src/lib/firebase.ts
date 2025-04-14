import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEiyKfbUaXwUM7ugA-n5VFQKNmARabOMM",
  authDomain: "medical-wallet-bb1b4.firebaseapp.com",
  projectId: "medical-wallet-bb1b4",
  storageBucket: "medical-wallet-bb1b4.firebasestorage.app",
  messagingSenderId: "105925077597",
  appId: "1:105925077597:web:5ead3e2c5041f120dd3bb4",
  measurementId: "G-XZP338EH1Q"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { db, auth, storage, analytics }; 