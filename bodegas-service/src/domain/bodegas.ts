// src/domain/bodegas.ts

export type EstadoBodega = 'DISPONIBLE' | 'RESERVADA' | 'OCUPADA' | 'POR_VENCER';

export interface BodegaInfo {
  id: string; // identificador único interno
  codigo: string; // código visible, ej: "B-101"
  nombre: string; // nombre descriptivo
  metrosCuadrados: number; // superficie
  piso: number; // piso/planta
}

export interface BodegaContract {
  bodegaId: string; // referencia a la bodega
  contratanteNombre: string; // nombre del responsable del contrato
  contratanteRut: string; // RUT del contratante
  contratanteTelefono: string; // teléfono de contacto del contratante
  contratanteEmail: string; // correo electrónico del contratante
  estado: EstadoBodega; // estado operativo
  tarifaUf: number; // tarifa mensual en UF
  fechaContratacion: string; // fecha de inicio del contrato (ISO)
  fechaTermino: string; // fecha de término del contrato (ISO)
  observaciones: string; // notas operativas
}

export type BodegaContractData = Omit<BodegaContract, 'bodegaId'>;

export type Bodega = BodegaInfo & BodegaContractData;

const EMPTY_CONTRACT_DATA: BodegaContractData = {
  contratanteNombre: '',
  contratanteRut: '',
  contratanteTelefono: '',
  contratanteEmail: '',
  estado: 'DISPONIBLE',
  tarifaUf: 0,
  fechaContratacion: '',
  fechaTermino: '',
  observaciones: '',
};

export function createEmptyContract(bodegaId: string): BodegaContract {
  return {
    bodegaId,
    ...EMPTY_CONTRACT_DATA,
  };
}

export function mergeBodegaData(
  info: BodegaInfo,
  contract: BodegaContract | null | undefined,
): Bodega {
  const contractData = contract ?? createEmptyContract(info.id);

  return {
    ...info,
    contratanteNombre: contractData.contratanteNombre,
    contratanteRut: contractData.contratanteRut,
    contratanteTelefono: contractData.contratanteTelefono,
    contratanteEmail: contractData.contratanteEmail,
    estado: contractData.estado,
    tarifaUf: contractData.tarifaUf,
    fechaContratacion: contractData.fechaContratacion,
    fechaTermino: contractData.fechaTermino,
    observaciones: contractData.observaciones,
  };
}
