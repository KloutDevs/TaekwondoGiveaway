import type { APIRoute } from 'astro';
import adminApp from '@/lib/firebaseAdmin';
import { getFirestore } from 'firebase-admin/firestore';
import { verificarToken } from '@/lib/verificarToken';
import { requireAdmin } from '@/lib/middlewareAdmin';

function getGanadores(cantidad: number, max: number): number[] {
  const ganadores = new Set<number>();
  while (ganadores.size < cantidad) {
    ganadores.add(Math.floor(Math.random() * max) + 1);
  }
  return Array.from(ganadores);
}

if (!adminApp) throw new Error('Firebase Admin no inicializado');
const db = getFirestore(adminApp);

export const POST: APIRoute = async ({ request }) => {
  const usuario = await requireAdmin(request);
  if (!usuario) {
    return new Response('No autorizado', { status: 401 });
  }

  try {
    const ref = db.collection('ganadores').doc('sorteo');
    const doc = await ref.get();
    if (doc.exists) {
      return new Response('Ya existen ganadores, no se pueden volver a generar.', { status: 409 });
    }
    const ganadores = getGanadores(3, 200);
    await ref.set({ ganadores, fecha: new Date().toISOString() });
    return new Response(JSON.stringify({ ganadores }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response('Error en el servidor', { status: 500 });
  }
}; 