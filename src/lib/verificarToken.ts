import adminApp from './firebaseAdmin';
import { getAuth } from 'firebase-admin/auth';

const adminAuth = getAuth(adminApp);

export async function verificarToken(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/token=([^;]+)/);
  if (!match) return null;
  const idToken = match[1];
  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    return decoded; // Info del usuario autenticado
  } catch {
    return null;
  }
} 