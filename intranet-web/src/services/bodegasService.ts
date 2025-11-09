import { httpGet, httpPatch } from '../lib/httpClient'
import type { Bodega, BodegaStatus } from '../domain/bodegas'
import { toStorageUnit } from '../domain/storageUnits'
import type { StorageUnit } from '../domain/storageUnits'

const RESOURCE_PATH = '/bodegas'

export type UpdateBodegaPayload = {
  nombre?: string
  metrosCuadrados?: number
  piso?: number
  estado?: BodegaStatus
}

function assertBodegaList(data: unknown): Bodega[] {
  if (!Array.isArray(data)) {
    throw new Error('La respuesta de bodegas no es un listado válido.')
  }

  return data as Bodega[]
}

function mapToStorageUnits(bodegas: Bodega[]): StorageUnit[] {
  return bodegas.map(toStorageUnit)
}

export async function getBodegas(): Promise<StorageUnit[]> {
  const bodegas = await httpGet<unknown>(RESOURCE_PATH)
  return mapToStorageUnits(assertBodegaList(bodegas))
}

export async function getBodegaById(id: string): Promise<StorageUnit> {
  const bodega = await httpGet<unknown>(`${RESOURCE_PATH}/${encodeURIComponent(id)}`)

  if (!bodega || typeof bodega !== 'object') {
    throw new Error('La bodega solicitada no existe o es inválida.')
  }

  return toStorageUnit(bodega as Bodega)
}

export async function updateBodega(
  id: string,
  updates: UpdateBodegaPayload
): Promise<StorageUnit> {
  const bodega = await httpPatch<unknown>(`${RESOURCE_PATH}/${encodeURIComponent(id)}`, updates)

  if (!bodega || typeof bodega !== 'object') {
    throw new Error('La respuesta de actualización es inválida.')
  }

  return toStorageUnit(bodega as Bodega)
}
