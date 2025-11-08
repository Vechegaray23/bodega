export type BodegaStatus = 'DISPONIBLE' | 'RESERVADA' | 'OCUPADA' | 'POR_VENCER'

type BodegaStatusConfig = {
  label: string
  color: string
}

const STATUS_CONFIG: Record<BodegaStatus, BodegaStatusConfig> = {
  DISPONIBLE: { label: 'Disponible', color: 'available' },
  RESERVADA: { label: 'Reservada', color: 'reserved' },
  OCUPADA: { label: 'Ocupada', color: 'occupied' },
  POR_VENCER: { label: 'Próxima a vencer', color: 'expiring' },
}

export function getBodegaStatusColor(status: BodegaStatus): string {
  return STATUS_CONFIG[status]?.color ?? 'unknown'
}

export function getBodegaStatusLabel(status: BodegaStatus): string {
  return STATUS_CONFIG[status]?.label ?? status
}

export function getAllBodegaStatuses(): BodegaStatus[] {
  return Object.keys(STATUS_CONFIG) as BodegaStatus[]
}
