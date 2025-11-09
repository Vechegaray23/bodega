const LOCALE = 'es-CL'

const DATE_FORMAT = new Intl.DateTimeFormat(LOCALE, {
  dateStyle: 'long',
})

const DATE_TIME_FORMAT = new Intl.DateTimeFormat(LOCALE, {
  dateStyle: 'long',
})

function formatDate(value: string): string {
  const parsed = Date.parse(value)
  if (Number.isNaN(parsed)) {
    return value
  }

  return DATE_FORMAT.format(new Date(parsed))
}

function formatGeneratedAt(value: Date): string {
  return DATE_TIME_FORMAT.format(value)
}

function formatMeters(value: number): string {
  if (!Number.isFinite(value) || value <= 0) {
    return `${value}`
  }

  return `${value.toLocaleString(LOCALE, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })} m²`
}

function formatUf(value: number): string {
  if (!Number.isFinite(value) || value <= 0) {
    return `${value} UF`
  }

  return `${value.toLocaleString(LOCALE, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} UF`
}

export type StorageContractData = {
  bodegaNombre: string
  bodegaCodigo: string
  metrosCuadrados: number
  piso: number
  tarifaUf: number
  fechaContratacion: string
  fechaTermino: string
  contratanteNombre: string
  contratanteRut: string
  contratanteTelefono: string
  contratanteEmail: string
  observaciones: string
  generatedAt?: Date
}

export function createStorageContractDocument(data: StorageContractData): string {
  const generatedAt = data.generatedAt ?? new Date()
  const observaciones = data.observaciones.trim()
    ? data.observaciones.trim()
    : 'Sin observaciones adicionales.'

  const lines = [
    'CONTRATO DE RESERVA DE BODEGA',
    '',
    `En fecha ${formatGeneratedAt(generatedAt)}, se deja constancia de la reserva del espacio de almacenamiento identificado como "${data.bodegaNombre}" (código ${data.bodegaCodigo}).`,
    '',
    'ANTECEDENTES DEL CONTRATANTE',
    `  • Nombre o razón social: ${data.contratanteNombre}`,
    `  • RUT: ${data.contratanteRut}`,
    `  • Teléfono: ${data.contratanteTelefono}`,
    `  • Correo electrónico: ${data.contratanteEmail}`,
    '',
    'CONDICIONES COMERCIALES',
    `  • Superficie útil: ${formatMeters(data.metrosCuadrados)}`,
    `  • Piso o ubicación: ${data.piso}`,
    `  • Tarifa mensual: ${formatUf(data.tarifaUf)}`,
    `  • Inicio del contrato: ${formatDate(data.fechaContratacion)}`,
    `  • Término del contrato: ${formatDate(data.fechaTermino)}`,
    '',
    'OBSERVACIONES',
    `  ${observaciones}`,
    '',
    'La presente minuta se genera automáticamente a partir de los datos registrados en la intranet de bodegas y debe ser revisada antes de su firma definitiva.',
  ]

  return lines.join('\n')
}
