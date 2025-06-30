import type { APIRoute } from 'astro';
import adminApp from '@/lib/firebaseAdmin';
import { getFirestore } from 'firebase-admin/firestore';
import type { Cliente } from '@/types/cliente';
import { requireAdmin } from '@/lib/middlewareAdmin';

if (!adminApp) throw new Error('Firebase Admin no inicializado');
const db = getFirestore(adminApp);

export const POST: APIRoute = async ({ request }) => {
  const usuario = await requireAdmin(request);
  if (!usuario) {
    return new Response('No autorizado', { status: 401 });
  }
  try {
    const body = await request.json();
    const { nombreCompleto, telefono, numeroBoleta } = body;
    if (!nombreCompleto || !telefono || !numeroBoleta) {
      return new Response('Faltan datos requeridos', { status: 400 });
    }
    const ref = db.collection('clientes').doc(telefono);
    const doc = await ref.get();
    let fechaIngreso = new Date().toISOString();
    if (doc.exists) {
      const data = doc.data() as Cliente;
      // Si ya tiene ese número de boleta, no lo agregues de nuevo
      if (data.numerosBoleta.includes(numeroBoleta)) {
        return new Response('El número de boleta ya está registrado para este cliente.', { status: 200 });
      }
      await ref.update({
        numerosBoleta: [...data.numerosBoleta, numeroBoleta],
      });
      return new Response('Número de boleta agregado correctamente al cliente.', { status: 201 });
    } else {
      const cliente: Cliente = { nombreCompleto, telefono, numerosBoleta: [numeroBoleta], fechaIngreso };
      await ref.set(cliente);
      return new Response('Cliente registrado correctamente.', { status: 201 });
    }
  } catch (e) {
    return new Response('Error en el servidor', { status: 500 });
  }
}; 