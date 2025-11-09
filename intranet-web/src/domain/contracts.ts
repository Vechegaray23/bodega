const LOCALE = 'es-CL'

const ADMINISTRADOR_NOMBRE = 'Administración de Bodegas Integrales SpA'
const ADMINISTRADOR_RUT = '76.543.210-9'
const ADMINISTRADOR_DOMICILIO = 'Avenida Nueva Las Condes 1234, Las Condes, Santiago'
const ADMINISTRADOR_REPRESENTANTE =
  'Representada para estos efectos por su Gerencia de Operaciones'

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
  estado?: 'RESERVADA' | 'OCUPADA'
  generatedAt?: Date
}

export function createStorageContractDocument(data: StorageContractData): string {
  const generatedAt = data.generatedAt ?? new Date()
  const observaciones = data.observaciones.trim()
    ? data.observaciones.trim()
    : 'Sin observaciones adicionales.'
  const estadoTexto =
    data.estado === 'OCUPADA'
      ? 'ocupada con contrato vigente en favor del CLIENTE'
      : 'reservada exclusivamente a favor del CLIENTE'

  const lines = [
    'CONTRATO DE RESERVA Y USO DE BODEGA',
    '',
    `En ${formatGeneratedAt(generatedAt)}, ${ADMINISTRADOR_NOMBRE}, RUT ${ADMINISTRADOR_RUT}, con domicilio en ${ADMINISTRADOR_DOMICILIO}, ${ADMINISTRADOR_REPRESENTANTE} (en adelante, "EL ADMINISTRADOR"), y ${data.contratanteNombre}, RUT ${data.contratanteRut}, domiciliado para estos efectos en los datos señalados al pie de firma (en adelante, "EL CLIENTE"), convienen las siguientes cláusulas:`,
    '',
    'PRIMERO: ANTECEDENTES Y OBJETO',
    `  1.1. EL ADMINISTRADOR entrega en ${estadoTexto} la bodega denominada "${data.bodegaNombre}" (código interno ${data.bodegaCodigo}), de una superficie aproximada de ${formatMeters(data.metrosCuadrados)}, ubicada en el piso ${data.piso} del complejo administrado por EL ADMINISTRADOR.`,
    '  1.2. El objeto del presente instrumento es regular la reserva, uso y explotación temporal de la bodega para fines de almacenamiento de bienes lícitos pertenecientes al CLIENTE.',
    '',
    'SEGUNDO: VIGENCIA',
    `  2.1. El presente contrato tiene una vigencia inicial desde el ${formatDate(data.fechaContratacion)} y hasta el ${formatDate(data.fechaTermino)}, ambas fechas inclusive.`,
    '  2.2. La renovación automática será evaluada por EL ADMINISTRADOR con una antelación mínima de 30 días, debiendo EL CLIENTE manifestar su interés en continuar antes de dicho plazo.',
    '',
    'TERCERO: PRECIO Y CONDICIONES DE PAGO',
    `  3.1. EL CLIENTE pagará a EL ADMINISTRADOR una renta mensual equivalente a ${formatUf(data.tarifaUf)}, reajustable en la misma proporción que la variación de la UF.`,
    '  3.2. El pago deberá efectuarse dentro de los primeros cinco (5) días hábiles de cada mes, mediante transferencia electrónica a la cuenta informada por EL ADMINISTRADOR o a través de los medios habilitados en la intranet corporativa.',
    '',
    'CUARTO: OBLIGACIONES DEL CLIENTE',
    `  4.1. Mantener actualizado un contacto telefónico (${data.contratanteTelefono}) y un correo electrónico válido (${data.contratanteEmail}) para efectos de notificaciones.`,
    '  4.2. Utilizar la bodega únicamente para almacenar bienes de origen lícito, respetando las normas de seguridad, horarios de acceso y protocolos internos vigentes.',
    '  4.3. Contratar y mantener vigentes los seguros necesarios para la protección de sus bienes, liberando a EL ADMINISTRADOR de responsabilidad por pérdidas o daños que no sean consecuencia directa de su dolo o culpa grave.',
    '',
    'QUINTO: TERMINACIÓN ANTICIPADA',
    '  5.1. Cualquiera de las partes podrá poner término anticipado al presente contrato dando aviso por escrito con al menos quince (15) días corridos de anticipación.',
    '  5.2. EL ADMINISTRADOR podrá poner término inmediato en caso de incumplimiento grave de las obligaciones establecidas en este documento o de las políticas internas informadas al CLIENTE.',
    '',
    'SEXTO: OBSERVACIONES Y ANEXOS',
    `  6.1. Observaciones registradas: ${observaciones}`,
    '  6.2. Forman parte integrante de esta minuta todos los anexos, reglamentos y actas de entrega que se generen electrónicamente en la intranet.',
    '',
    'SÉPTIMO: ACEPTACIÓN',
    '  7.1. Las partes declaran haber leído y aceptado íntegramente el contenido de este contrato electrónico, comprometiéndose a firmar la versión física o digital definitiva que sea emitida por EL ADMINISTRADOR.',
    '',
    'La presente minuta ha sido generada automáticamente a partir de los registros disponibles y debe revisarse antes de su firma definitiva. Para constancia se firma electrónicamente por las partes.',
  ]

  return lines.join('\n')
}
