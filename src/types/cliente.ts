export type Cliente = {
  nombreCompleto: string;
  telefono: string;
  numerosBoleta: string[];
  fechaIngreso: string; // ISO string
};

// Estructura en Firestore:
// Colección: 'clientes'
// Documento: <telefono>
// Datos: Cliente 