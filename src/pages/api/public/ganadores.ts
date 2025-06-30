import type { APIRoute } from 'astro';
import adminApp from '@/lib/firebaseAdmin';
import { getFirestore } from 'firebase-admin/firestore';

if (!adminApp) throw new Error('Firebase Admin no inicializado');
const db = getFirestore(adminApp);

export const GET: APIRoute = async () => {
  try {
    const ref = db.collection('ganadores').doc('sorteo');
    const doc = await ref.get();
    if (doc.exists) {
      const data = doc.data();
      return new Response(JSON.stringify({ ganadores: data?.ganadores }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return new Response(JSON.stringify({ mensaje: 'Aún no se han generado los ganadores.' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Error en el servidor', details: e instanceof Error ? e.message : e }), { status: 500 });
  }
}; 