import { verificarToken } from './verificarToken';

export async function requireAdmin(request: Request) {
  const usuario = await verificarToken(request);
  if (!usuario) return null;
  return usuario;
} 