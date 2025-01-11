import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app, "datadudefs");
export const fcm = app;

export async function firebaseAuthen(token: string) {
  const firebaseAuth = await signInWithCustomToken(getAuth(app), token);
  return {
    firebaseAuth,
    db: getFirestore(app)
  };
}
