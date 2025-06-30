import app from './firebaseClient';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth(app);

/**
 * Autentica un usuario con correo y contraseña usando Firebase Auth.
 * @param email Correo electrónico del usuario
 * @param password Contraseña del usuario
 * @returns Promesa que resuelve con el usuario autenticado o lanza un error
 */
export async function loginConCorreoYContrasena(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const idToken = await userCredential.user.getIdToken();
  setAuthCookie(idToken);
  return userCredential;
}

/**
 * Guarda el idToken en una cookie segura.
 * @param idToken JWT de Firebase Auth
 */
export function setAuthCookie(idToken: string) {
  document.cookie = `token=${idToken}; path=/; secure; samesite=strict`;
} 