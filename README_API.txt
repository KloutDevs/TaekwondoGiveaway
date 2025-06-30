# Documentación de la API y módulos de autenticación

## Estructura de carpetas

- `src/lib/` : Módulos reutilizables para autenticación, Firebase y middleware de seguridad.
- `src/pages/api/public/` : Endpoints públicos (no requieren autenticación).
- `src/pages/api/admin/` : Endpoints protegidos, solo accesibles para usuarios autenticados.
- `src/types/cliente.ts` : Definición del tipo Cliente usado en la base de datos.

---

## Seguridad y autenticación

- El login se realiza en el frontend usando Firebase Auth (correo y contraseña).
- Tras el login, el JWT (`idToken`) se guarda en una cookie segura llamada `token`.
- Todas las peticiones a endpoints protegidos deben incluir la cookie `token` (usa `credentials: 'include'` en fetch).
- El backend verifica la validez y firma del token usando Firebase Admin SDK.
- Si el token es inválido o falso, el acceso es denegado.
- Actualmente, cualquier usuario autenticado puede acceder a los endpoints admin (puedes limitarlo por email si lo deseas).

---

## Archivos principales

### 1. `src/lib/authCliente.ts`
- Función `loginConCorreoYContrasena(email, password)`: Realiza login y guarda el token en la cookie.
- Función `setAuthCookie(idToken)`: Guarda el JWT en la cookie `token`.

### 2. `src/lib/verificarToken.ts`
- Función `verificarToken(request)`: Extrae y valida el JWT de la cookie en el backend.

### 3. `src/lib/middlewareAdmin.ts`
- Función `requireAdmin(request)`: Permite el acceso solo a usuarios autenticados.

### 4. `src/lib/firebaseAdmin.ts` y `src/lib/firebaseClient.ts`
- Inicialización de Firebase Admin (backend) y Firebase Client (frontend).

### 5. `src/types/cliente.ts`
- Define el tipo `Cliente`:
  - `nombreCompleto: string`
  - `telefono: string`
  - `numerosBoleta: string[]`
  - `fechaIngreso: string`

---

## Endpoints principales

### Públicos (`src/pages/api/public/`)
- `/api/public/ganadores` (GET): Consulta los números ganadores del sorteo.
- `/api/public/boletos-restantes` (GET): Consulta el numeor de boletos restantes, implementable tipo socket

### Admin (`src/pages/api/admin/`)
- `/api/admin/generar-ganadores` (POST): Genera los ganadores (protegido).
- `/api/admin/registrar-cliente` (POST): Registra o actualiza un cliente (protegido).
- `/api/admin/buscar-cliente` (GET): Busca un cliente por teléfono (protegido).
- `/api/admin/info-ganadores` (GET): Consulta la información de los ganadores y los clientes asociados (protegido).

---

## Notas adicionales
- Puedes agregar más endpoints públicos o admin según tus necesidades.
- Para logout, simplemente borra la cookie `token` en el frontend. 