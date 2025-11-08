// import { httpGet } from '../lib/httpClient'

const bodegasMock = [
  { id: 'A1', size: '120 m²', status: 'DISPONIBLE', span: 'span-2x2' },
  { id: 'A2', size: '95 m²', status: 'OCUPADA', span: 'span-1x2' },
  { id: 'A3', size: '110 m²', status: 'POR_VENCER', span: 'span-1x2' },
  { id: 'B1', size: '140 m²', status: 'RESERVADA', span: 'span-2x3' },
  { id: 'B2', size: '85 m²', status: 'DISPONIBLE', span: 'span-1x1' },
  { id: 'B3', size: '85 m²', status: 'DISPONIBLE', span: 'span-1x1' },
  { id: 'C1', size: '100 m²', status: 'OCUPADA', span: 'span-2x2' },
  { id: 'C2', size: '75 m²', status: 'DISPONIBLE', span: 'span-1x1' },
  { id: 'C3', size: '75 m²', status: 'OCUPADA', span: 'span-1x1' },
  { id: 'D1', size: '90 m²', status: 'DISPONIBLE', span: 'span-1x2' },
  { id: 'D2', size: '90 m²', status: 'RESERVADA', span: 'span-1x2' },
  { id: 'E1', size: '130 m²', status: 'DISPONIBLE', span: 'span-2x2' },
  { id: 'E2', size: '120 m²', status: 'POR_VENCER', span: 'span-2x2' },
]

const statusLegendMock = ['DISPONIBLE', 'RESERVADA', 'OCUPADA', 'POR_VENCER']

const warehouseMetadataMock = {
  lastUpdate: 'Hace 5 minutos',
  supervisor: 'María Gómez',
}

const warehouseNotesMock = [
  'La unidad A3 estará disponible nuevamente el 22 de junio.',
  'Se programó inspección de seguridad para el corredor central.',
  'Actualizar inventario de equipos en B1 y E2 antes del viernes.',
]

export async function getBodegas() {
  // TODO: cuando exista API real, descomentar:
  // return httpGet('/bodegas')

  return bodegasMock
}

export async function getBodegaStatusLegend() {
  // TODO: cuando exista API real, descomentar:
  // return httpGet('/bodegas/status-legend')

  return statusLegendMock
}

export async function getWarehouseMetadata() {
  // TODO: cuando exista API real, descomentar:
  // return httpGet('/bodegas/metadata')

  return warehouseMetadataMock
}

export async function getWarehouseNotes() {
  // TODO: cuando exista API real, descomentar:
  // return httpGet('/bodegas/notes')

  return warehouseNotesMock
}
