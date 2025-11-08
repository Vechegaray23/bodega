// src/domain/bodegas.ts

export type EstadoBodega = 'DISPONIBLE' | 'RESERVADA' | 'OCUPADA' | 'POR_VENCER';

export interface Bodega {
  id: string;              // identificador único interno
  codigo: string;          // código visible, ej: "B-101"
  nombre: string;          // nombre descriptivo
  metrosCuadrados: number; // superficie
  piso: number;            // piso/planta
  estado: EstadoBodega;    // estado operativo
}
