import type { APIRoute } from 'astro';
import adminApp from '@/lib/firebaseAdmin';
import { getFirestore } from 'firebase-admin/firestore';
import type { Cliente } from '@/types/cliente';
import { requireAdmin } from '@/lib/middlewareAdmin';

if (!adminApp) throw new Error('Firebase Admin no inicializado');
const db = getFirestore(adminApp);

export const GET: APIRoute = async ({ request, url }) => {
  const usuario = await requireAdmin(request);
  if (!usuario) {
    return new Response('No autorizado', { status: 401 });
  }
  try {
    const telefono = url.searchParams.get('telefono');
    if (!telefono) return new Response('Falta el parámetro telefono', { status: 400 });
    const ref = db.collection('clientes').doc(telefono);
    const doc = await ref.get();
    if (!doc.exists) return new Response('No se encontró ningún cliente con ese teléfono.', { status: 404 });
    const cliente = doc.data() as Cliente;
    return new Response(`Cliente encontrado. Nombre: ${cliente.nombreCompleto}. Boletas: ${cliente.numerosBoleta.join(', ')}`, { status: 200 });
  } catch (e) {
    return new Response('Error en el servidor', { status: 500 });
  }
}; 