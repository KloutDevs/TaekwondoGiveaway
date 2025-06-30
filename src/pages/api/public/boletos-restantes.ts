import type { APIRoute } from 'astro';
import adminApp from '@/lib/firebaseAdmin';
import { getFirestore } from 'firebase-admin/firestore';

if (!adminApp) throw new Error('Firebase Admin no inicializado');
const db = getFirestore(adminApp);

export const GET: APIRoute = async () => {
  try {
    const snapshot = await db.collection('clientes').get();
    const totalClientes = snapshot.size;
    const boletosTotales = 200;
    const boletosRestantes = boletosTotales - totalClientes;
    return new Response(JSON.stringify({ totalClientes, boletosRestantes }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Error en el servidor', details: e instanceof Error ? e.message : e }), { status: 500 });
  }
}; 