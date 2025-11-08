import { httpGet } from '../lib/httpClient'
import { BodegaStatus, getAllBodegaStatuses } from '../domain/bodegas'

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

type BodegaDto = {
  id: string
  codigo: string
  nombre: string
  metrosCuadrados: number
  piso: number
  estado: BodegaStatus
}

export type StorageUnit = {
  id: string
  codigo: string
  nombre: string
  metrosCuadrados: number
  piso: number
  status: BodegaStatus
  estado: BodegaStatus
  size: string
  span: string
}

function toStorageUnit(bodega: BodegaDto): StorageUnit {
  const identifier = bodega.codigo || bodega.id
  const span = STORAGE_UNIT_LAYOUT[identifier] ?? DEFAULT_SPAN

  return {
    id: identifier,
    codigo: bodega.codigo,
    nombre: bodega.nombre,
    metrosCuadrados: bodega.metrosCuadrados,
    piso: bodega.piso,
    status: bodega.estado,
    estado: bodega.estado,
    size: `${bodega.metrosCuadrados} m²`,
    span,
  }
}

export async function getBodegas(): Promise<StorageUnit[]> {
  const bodegas = await httpGet<BodegaDto[]>('/bodegas')
  return bodegas.map(toStorageUnit)
}

export async function getBodegaStatusLegend(): Promise<BodegaStatus[]> {
  return getAllBodegaStatuses()
}

type WarehouseMetadata = {
  lastUpdate: string
  supervisor: string
}

export async function getWarehouseMetadata(): Promise<WarehouseMetadata> {
  return {
    lastUpdate: 'Hace 5 minutos',
    supervisor: 'María Gómez',
  }
}

export async function getWarehouseNotes(): Promise<string[]> {
  return [
    'La unidad A3 estará disponible nuevamente el 22 de junio.',
    'Se programó inspección de seguridad para el corredor central.',
    'Actualizar inventario de equipos en B1 y E2 antes del viernes.',
  ]
}

export async function getBodegaById(id: string): Promise<StorageUnit> {
  const bodega = await httpGet<BodegaDto>(`/bodegas/${encodeURIComponent(id)}`)
  return toStorageUnit(bodega)
}
