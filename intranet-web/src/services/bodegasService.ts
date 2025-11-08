import { httpGet } from '../lib/httpClient'
import type { Bodega } from '../domain/bodegas'
import { toStorageUnit } from '../domain/storageUnits'
import type { StorageUnit } from '../domain/storageUnits'

const RESOURCE_PATH = '/bodegas'

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
