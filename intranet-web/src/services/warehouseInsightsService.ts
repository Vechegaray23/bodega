export type WarehouseMetadata = {
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
