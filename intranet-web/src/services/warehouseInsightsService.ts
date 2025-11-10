export type WarehouseMetadata = {
  lastUpdate: string
  supervisor: string
}

const SUPERVISOR_NAME = 'María Gómez'

let lastUpdatedAt = new Date()

function formatLastUpdate(date: Date): string {
  return new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function buildWarehouseMetadata(): WarehouseMetadata {
  return {
    lastUpdate: formatLastUpdate(lastUpdatedAt),
    supervisor: SUPERVISOR_NAME,
  }
}

export async function getWarehouseMetadata(): Promise<WarehouseMetadata> {
  return buildWarehouseMetadata()
}

export function markWarehouseUpdated(updatedAt: Date = new Date()): WarehouseMetadata {
  lastUpdatedAt = updatedAt
  return buildWarehouseMetadata()
}

export async function getWarehouseNotes(): Promise<string[]> {
  return [
    'La unidad A3 estará disponible nuevamente el 22 de junio.',
    'Se programó inspección de seguridad para el corredor central.',
    'Actualizar inventario de equipos en B1 y E2 antes del viernes.',
  ]
}
