import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const config = {
  apiKey: "AIzaSyB9C0wsMvzecHYxoIRV4P0BGJpKRcfgzSA",
  authDomain: "dmis-school-ab4d8.firebaseapp.com",
  projectId: "dmis-school-ab4d8",
  storageBucket: "dmis-school-ab4d8.firebasestorage.app",
  messagingSenderId: "169015818337",
  appId: "1:169015818337:web:246d06c36fdd230d3a1220",
  measurementId: "G-HVFQTNK48M"
};

const app = getApps().length ? getApp() : initializeApp(config);
export const firebase = app;
export const auth = getAuth(app);
export const db = getFirestore(app);
export const firebaseConfigured = Boolean(config.apiKey);
export default app;
// force rebuild
