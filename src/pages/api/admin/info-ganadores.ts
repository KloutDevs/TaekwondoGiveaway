import type { APIRoute } from 'astro';
import adminApp from '@/lib/firebaseAdmin';
import { getFirestore } from 'firebase-admin/firestore';
import type { Cliente } from '@/types/cliente';
import { requireAdmin } from '@/lib/middlewareAdmin';

if (!adminApp) throw new Error('Firebase Admin no inicializado');
const db = getFirestore(adminApp);

export const GET: APIRoute = async ({ request }) => {
  const usuario = await requireAdmin(request);
  if (!usuario) {
    return new Response('No autorizado', { status: 401 });
  }
  try {
    const refGanadores = db.collection('ganadores').doc('sorteo');
    const docGanadores = await refGanadores.get();
    if (!docGanadores.exists) {
      return new Response(JSON.stringify({ mensaje: 'Aún no se han escogido los ganadores.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    const { ganadores, fecha } = docGanadores.data() as { ganadores: number[], fecha: string };
    // Buscar los clientes que tienen cada número de boleta
    const lugares = ['primer', 'segundo', 'tercer'];
    const resultados = [];
    for (let i = 0; i < ganadores.length; i++) {
      const numero = ganadores[i].toString();
      // Buscar cliente que tenga ese número de boleta
      const snapshot = await db.collection('clientes').where('numerosBoleta', 'array-contains', numero).get();
      let cliente: Cliente | null = null;
      if (!snapshot.empty) {
        cliente = snapshot.docs[0].data() as Cliente;
      }
      resultados.push({
        lugar: lugares[i],
        numeroBoleta: numero,
        cliente: cliente ? { nombreCompleto: cliente.nombreCompleto, telefono: cliente.telefono } : null
      });
    }
    return new Response(JSON.stringify({ ganadores: resultados, fecha }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Error en el servidor', details: e instanceof Error ? e.message : e }), { status: 500 });
  }
}; 