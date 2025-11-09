import type { Bodega, BodegaStatus } from './bodegas'

const STORAGE_UNIT_LAYOUT: Record<string, string> = {
  A1: 'span-2x2',
  A2: 'span-1x2',
  A3: 'span-1x2',
  B1: 'span-2x3',
  B2: 'span-1x1',
  B3: 'span-1x1',
  C1: 'span-2x2',
  C2: 'span-1x1',
  C3: 'span-1x1',
  D1: 'span-1x2',
  D2: 'span-1x2',
  E1: 'span-2x2',
  E2: 'span-2x2',
}

const DEFAULT_SPAN = 'span-1x1'

export type StorageUnit = {
  id: string
  codigo: string
  nombre: string
  metrosCuadrados: number
  piso: number
  status: BodegaStatus
  size: string
  span: string
  tarifaUf: number
  fechaContratacion: string
  fechaTermino: string
  observaciones: string
}

function resolveIdentifier(bodega: Bodega): string {
  return bodega.codigo || bodega.id
}

function resolveSpan(identifier: string): string {
  return STORAGE_UNIT_LAYOUT[identifier] ?? DEFAULT_SPAN
}

export function toStorageUnit(bodega: Bodega): StorageUnit {
  const identifier = resolveIdentifier(bodega)

  return {
    id: identifier,
    codigo: bodega.codigo,
    nombre: bodega.nombre,
    metrosCuadrados: bodega.metrosCuadrados,
    piso: bodega.piso,
    status: bodega.estado,
    size: `${bodega.metrosCuadrados} m²`,
    span: resolveSpan(identifier),
    tarifaUf: bodega.tarifaUf,
    fechaContratacion: bodega.fechaContratacion,
    fechaTermino: bodega.fechaTermino,
    observaciones: bodega.observaciones,
  }
}

export function toStorageUnits(bodegas: Bodega[]): StorageUnit[] {
  return bodegas.map(toStorageUnit)
}
