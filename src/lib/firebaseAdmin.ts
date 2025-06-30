import 'dotenv/config';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import type { App } from 'firebase-admin/app';

// Depuración: mostrar valores de entorno importantes
console.log('[FIREBASE ADMIN] projectId:', process.env.FIREBASE_PROJECT_ID);
console.log('[FIREBASE ADMIN] clientEmail:', process.env.FIREBASE_CLIENT_EMAIL);
console.log('[FIREBASE ADMIN] privateKey:', process.env.FIREBASE_PRIVATE_KEY ? '[OK]' : '[FALTA]');
console.log('[FIREBASE ADMIN] databaseURL:', process.env.FIREBASE_DATABASE_URL);

let adminApp: App | undefined;

if (!getApps().length) {
  adminApp = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
} else {
  adminApp = getApps()[0];
}

export default adminApp; 