// src/domain/bodegas.ts

export type EstadoBodega = 'DISPONIBLE' | 'RESERVADA' | 'OCUPADA' | 'POR_VENCER';

export interface Bodega {
  id: string;              // identificador único interno
  codigo: string;          // código visible, ej: "B-101"
  nombre: string;          // nombre descriptivo
  contratanteNombre: string; // nombre del responsable del contrato
  contratanteRut: string;   // RUT del contratante
  contratanteTelefono: string; // teléfono de contacto del contratante
  contratanteEmail: string; // correo electrónico del contratante
  metrosCuadrados: number; // superficie
  piso: number;            // piso/planta
  estado: EstadoBodega;    // estado operativo
  tarifaUf: number;        // tarifa mensual en UF
  fechaContratacion: string; // fecha de inicio del contrato (ISO)
  fechaTermino: string;    // fecha de término del contrato (ISO)
  observaciones: string;   // notas operativas
}
