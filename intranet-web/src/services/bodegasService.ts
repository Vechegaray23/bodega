import { httpGet } from '../lib/httpClient'
import type { Bodega } from '../domain/bodegas'

const RESOURCE_PATH = '/bodegas'

export async function getBodegas(): Promise<Bodega[]> {
  return httpGet<Bodega[]>(RESOURCE_PATH)
}

export async function getBodegaById(id: string): Promise<Bodega> {
  return httpGet<Bodega>(`${RESOURCE_PATH}/${encodeURIComponent(id)}`)
}
