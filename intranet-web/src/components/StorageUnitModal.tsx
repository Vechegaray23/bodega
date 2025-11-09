import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import { getAllBodegaStatuses, getBodegaStatusLabel } from '../domain/bodegas'
import type { StorageUnit } from '../domain/storageUnits'
import type { UpdateBodegaPayload } from '../services/bodegasService'
import { createStorageContractDocument } from '../domain/contracts'
import { createPdfBlobFromText } from '../lib/pdf'

type StorageUnitModalProps = {
  unit: StorageUnit
  onClose: () => void
  onSave: (updates: UpdateBodegaPayload) => Promise<void>
  isSaving: boolean
  error: string | null
  successMessage: string | null
}

type FormState = {
  nombre: string
  contratanteNombre: string
  contratanteRut: string
  contratanteTelefono: string
  contratanteEmail: string
  metrosCuadrados: string
  piso: string
  estado: UpdateBodegaPayload['estado']
  tarifaUf: string
  fechaContratacion: string
  fechaTermino: string
  observaciones: string
}

const STATUS_OPTIONS = getAllBodegaStatuses()
const RUT_REGEX = /^\d{1,2}\.?\d{3}\.?\d{3}-[0-9kK]$/
const PHONE_REGEX = /^\+?[0-9\s()-]{6,20}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function StorageUnitModal({
  unit,
  onClose,
  onSave,
  isSaving,
  error,
  successMessage,
}: StorageUnitModalProps) {
  const [formState, setFormState] = useState<FormState>({
    nombre: unit.nombre,
    contratanteNombre: unit.contratanteNombre,
    contratanteRut: unit.contratanteRut,
    contratanteTelefono: unit.contratanteTelefono,
    contratanteEmail: unit.contratanteEmail,
    metrosCuadrados: unit.metrosCuadrados.toString(),
    piso: unit.piso.toString(),
    estado: unit.status,
    tarifaUf: unit.tarifaUf.toString(),
    fechaContratacion: unit.fechaContratacion,
    fechaTermino: unit.fechaTermino,
    observaciones: unit.observaciones,
  })
  const [formError, setFormError] = useState<string | null>(null)
  const [contractFeedback, setContractFeedback] = useState<string | null>(null)

  useEffect(() => {
    setFormState({
      nombre: unit.nombre,
      contratanteNombre: unit.contratanteNombre,
      contratanteRut: unit.contratanteRut,
      contratanteTelefono: unit.contratanteTelefono,
      contratanteEmail: unit.contratanteEmail,
      metrosCuadrados: unit.metrosCuadrados.toString(),
      piso: unit.piso.toString(),
      estado: unit.status,
      tarifaUf: unit.tarifaUf.toString(),
      fechaContratacion: unit.fechaContratacion,
      fechaTermino: unit.fechaTermino,
      observaciones: unit.observaciones,
    })
    setFormError(null)
    setContractFeedback(null)
  }, [unit])

  useEffect(() => {
    if (!contractFeedback) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setContractFeedback(null)
    }, 4000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [contractFeedback])

  const formattedSize = useMemo(() => {
    const metros = Number(formState.metrosCuadrados)
    if (Number.isFinite(metros)) {
      return `${metros} m²`
    }

    return unit.size
  }, [formState.metrosCuadrados, unit.size])

  const formattedTarifaUf = useMemo(() => {
    const tarifa = Number(formState.tarifaUf)
    if (Number.isFinite(tarifa) && tarifa > 0) {
      return `${tarifa.toLocaleString('es-CL', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} UF`
    }

    return `${unit.tarifaUf.toLocaleString('es-CL', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} UF`
  }, [formState.tarifaUf, unit.tarifaUf])

  const formatDateForDisplay = (value: string): string => {
    if (!value) {
      return '—'
    }

    const timestamp = Date.parse(value)
    if (Number.isNaN(timestamp)) {
      return value
    }

    return new Date(timestamp).toLocaleDateString('es-CL')
  }

  const contractPreview = useMemo(() => {
    if (formState.estado !== 'RESERVADA' && formState.estado !== 'OCUPADA') {
      return ''
    }

    const sanitizeText = (value: string, fallback: string): string => {
      const trimmed = value.trim()
      return trimmed || fallback
    }

    const parseNumber = (value: string, fallback: number): number => {
      const parsed = Number(value)
      if (!Number.isFinite(parsed)) {
        return fallback
      }

      return parsed
    }

    const fechaContratacion = formState.fechaContratacion || unit.fechaContratacion
    const fechaTermino = formState.fechaTermino || unit.fechaTermino

    return createStorageContractDocument({
      bodegaNombre: sanitizeText(formState.nombre, unit.nombre),
      bodegaCodigo: unit.codigo || unit.id,
      metrosCuadrados: parseNumber(formState.metrosCuadrados, unit.metrosCuadrados),
      piso: parseNumber(formState.piso, unit.piso),
      tarifaUf: parseNumber(formState.tarifaUf, unit.tarifaUf),
      fechaContratacion,
      fechaTermino,
      contratanteNombre: sanitizeText(formState.contratanteNombre, unit.contratanteNombre),
      contratanteRut: sanitizeText(formState.contratanteRut, unit.contratanteRut),
      contratanteTelefono: sanitizeText(formState.contratanteTelefono, unit.contratanteTelefono),
      contratanteEmail: sanitizeText(formState.contratanteEmail, unit.contratanteEmail),
      observaciones: sanitizeText(formState.observaciones, unit.observaciones),
      estado:
        formState.estado === 'RESERVADA' || formState.estado === 'OCUPADA'
          ? formState.estado
          : undefined,
      generatedAt: new Date(),
    })
  }, [formState, unit])

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target

    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nombre = formState.nombre.trim()
    const contratanteNombre = formState.contratanteNombre.trim()
    const contratanteRut = formState.contratanteRut.trim()
    const contratanteTelefono = formState.contratanteTelefono.trim()
    const contratanteEmail = formState.contratanteEmail.trim()
    const metrosCuadrados = Number(formState.metrosCuadrados)
    const piso = Number(formState.piso)
    const tarifaUf = Number(formState.tarifaUf)
    const fechaContratacion = formState.fechaContratacion
    const fechaTermino = formState.fechaTermino
    const observaciones = formState.observaciones.trim()

    if (!nombre) {
      setFormError('El nombre es obligatorio.')
      return
    }

    if (!contratanteNombre) {
      setFormError('Ingresá el nombre del contratante.')
      return
    }

    if (!RUT_REGEX.test(contratanteRut)) {
      setFormError('Ingresá un RUT de contratante válido.')
      return
    }

    if (!PHONE_REGEX.test(contratanteTelefono)) {
      setFormError('Ingresá un teléfono de contratante válido.')
      return
    }

    if (!EMAIL_REGEX.test(contratanteEmail)) {
      setFormError('Ingresá un correo electrónico de contratante válido.')
      return
    }

    if (!Number.isFinite(metrosCuadrados) || metrosCuadrados <= 0) {
      setFormError('Ingresá una superficie válida (en m²).')
      return
    }

    if (!Number.isInteger(piso)) {
      setFormError('Ingresá un número de piso válido.')
      return
    }

    if (!Number.isFinite(tarifaUf) || tarifaUf <= 0) {
      setFormError('Ingresá una tarifa en UF válida.')
      return
    }

    if (!fechaContratacion || Number.isNaN(Date.parse(fechaContratacion))) {
      setFormError('Seleccioná una fecha de contratación válida.')
      return
    }

    if (!fechaTermino || Number.isNaN(Date.parse(fechaTermino))) {
      setFormError('Seleccioná una fecha de término válida.')
      return
    }

    if (Date.parse(fechaTermino) < Date.parse(fechaContratacion)) {
      setFormError('La fecha de término no puede ser anterior a la fecha de contratación.')
      return
    }

    setFormError(null)

    const payload: UpdateBodegaPayload = {
      nombre,
      contratanteNombre,
      contratanteRut,
      contratanteTelefono,
      contratanteEmail,
      metrosCuadrados,
      piso,
      estado: formState.estado,
      tarifaUf,
      fechaContratacion,
      fechaTermino,
      observaciones,
    }

    try {
      await onSave(payload)
    } catch {
      // El componente padre se encarga de mostrar el error correspondiente.
    }
  }

  const handleCopyContract = async () => {
    if (!contractPreview) {
      return
    }

    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      setContractFeedback('No fue posible copiar automáticamente. Copiá el contrato manualmente.')
      return
    }

    try {
      await navigator.clipboard.writeText(contractPreview)
      setContractFeedback('Contrato copiado al portapapeles.')
    } catch {
      setContractFeedback('No se pudo copiar el contrato. Intentá nuevamente.')
    }
  }

  const handleDownloadContract = () => {
    if (!contractPreview) {
      return
    }

    const pdfBlob = createPdfBlobFromText(contractPreview)
    const url = URL.createObjectURL(pdfBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Contrato-${unit.codigo || unit.id}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setContractFeedback('Contrato PDF descargado correctamente.')
  }

  return (
    <div className="storage-modal__backdrop" role="presentation" onClick={onClose}>
      <div
        className="storage-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="storage-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="storage-modal__header">
          <div>
            <p className="storage-modal__eyebrow">Bodega {unit.codigo}</p>
            <h2 id="storage-modal-title">{unit.nombre}</h2>
          </div>
          <button
            type="button"
            className="storage-modal__close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </header>

        <form className="storage-modal__form" onSubmit={handleSubmit}>
          <div className="storage-modal__grid">
            <label className="storage-modal__field">
              <span>Nombre</span>
              <input
                type="text"
                name="nombre"
                value={formState.nombre}
                onChange={handleChange}
                placeholder="Ingresá un nombre descriptivo"
                required
              />
            </label>

            <label className="storage-modal__field">
              <span>Nombre contratante</span>
              <input
                type="text"
                name="contratanteNombre"
                value={formState.contratanteNombre}
                onChange={handleChange}
                placeholder="Ingresá el responsable del contrato"
                required
              />
            </label>

            <label className="storage-modal__field">
              <span>RUT contratante</span>
              <input
                type="text"
                name="contratanteRut"
                value={formState.contratanteRut}
                onChange={handleChange}
                placeholder="12.345.678-9"
                required
              />
            </label>

            <label className="storage-modal__field">
              <span>Teléfono contratante</span>
              <input
                type="tel"
                name="contratanteTelefono"
                value={formState.contratanteTelefono}
                onChange={handleChange}
                placeholder="+56 9 1234 5678"
                required
              />
            </label>

            <label className="storage-modal__field">
              <span>Correo contratante</span>
              <input
                type="email"
                name="contratanteEmail"
                value={formState.contratanteEmail}
                onChange={handleChange}
                placeholder="correo@empresa.cl"
                required
              />
            </label>

            <label className="storage-modal__field">
              <span>Metros cuadrados</span>
              <input
                type="number"
                name="metrosCuadrados"
                min="1"
                value={formState.metrosCuadrados}
                onChange={handleChange}
                required
              />
            </label>

            <label className="storage-modal__field">
              <span>Piso</span>
              <input
                type="number"
                name="piso"
                value={formState.piso}
                onChange={handleChange}
                required
              />
            </label>

            <label className="storage-modal__field">
              <span>Tarifa en UF</span>
              <input
                type="number"
                name="tarifaUf"
                min="0"
                step="0.01"
                value={formState.tarifaUf}
                onChange={handleChange}
                required
              />
            </label>

            <label className="storage-modal__field">
              <span>Estado</span>
              <select
                name="estado"
                value={formState.estado}
                onChange={handleChange}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {getBodegaStatusLabel(status)}
                  </option>
                ))}
              </select>
            </label>

            <label className="storage-modal__field">
              <span>Fecha de contratación</span>
              <input
                type="date"
                name="fechaContratacion"
                value={formState.fechaContratacion}
                onChange={handleChange}
                required
              />
            </label>

            <label className="storage-modal__field">
              <span>Fecha término contrato</span>
              <input
                type="date"
                name="fechaTermino"
                value={formState.fechaTermino}
                onChange={handleChange}
                required
              />
            </label>

            <label className="storage-modal__field storage-modal__field--full">
              <span>Observaciones</span>
              <textarea
                name="observaciones"
                value={formState.observaciones}
                onChange={handleChange}
                placeholder="Añadí notas relevantes sobre esta bodega"
                rows={4}
              />
            </label>
          </div>

          <section className="storage-modal__details">
            <dl>
              <div>
                <dt>Identificador interno</dt>
                <dd>{unit.id}</dd>
              </div>
              <div>
                <dt>Superficie actual</dt>
                <dd>{formattedSize}</dd>
              </div>
              <div>
                <dt>Último estado reportado</dt>
                <dd>{getBodegaStatusLabel(formState.estado ?? unit.status)}</dd>
              </div>
              <div>
                <dt>Tarifa mensual</dt>
                <dd>{formattedTarifaUf}</dd>
              </div>
              <div>
                <dt>Nombre contratante</dt>
                <dd>{formState.contratanteNombre.trim() || '—'}</dd>
              </div>
              <div>
                <dt>RUT contratante</dt>
                <dd>{formState.contratanteRut.trim() || '—'}</dd>
              </div>
              <div>
                <dt>Teléfono contratante</dt>
                <dd>{formState.contratanteTelefono.trim() || '—'}</dd>
              </div>
              <div>
                <dt>Correo contratante</dt>
                <dd>{formState.contratanteEmail.trim() || '—'}</dd>
              </div>
              <div>
                <dt>Contrato vigente desde</dt>
                <dd>{formatDateForDisplay(formState.fechaContratacion || unit.fechaContratacion)}</dd>
              </div>
              <div>
                <dt>Contrato vigente hasta</dt>
                <dd>{formatDateForDisplay(formState.fechaTermino || unit.fechaTermino)}</dd>
              </div>
              <div className="storage-modal__details-notes">
                <dt>Observaciones</dt>
                <dd className="storage-modal__details-note">
                  {formState.observaciones.trim() || '—'}
                </dd>
              </div>
            </dl>
          </section>

          {formState.estado === 'RESERVADA' || formState.estado === 'OCUPADA' ? (
            <section className="storage-modal__contract">
              <div className="storage-modal__contract-header">
                <h3>Contrato de reserva</h3>
                <p>Revisá y compartí la minuta generada automáticamente.</p>
              </div>
              <textarea
                className="storage-modal__contract-preview"
                readOnly
                value={contractPreview}
              />
              <div className="storage-modal__contract-actions">
                <button
                  type="button"
                  className="button button--ghost"
                  onClick={handleCopyContract}
                >
                  Copiar contrato
                </button>
                <button
                  type="button"
                  className="button button--primary"
                  onClick={handleDownloadContract}
                >
                  Descargar (.pdf)
                </button>
              </div>
              {contractFeedback ? (
                <p className="storage-modal__feedback storage-modal__feedback--info">
                  {contractFeedback}
                </p>
              ) : null}
            </section>
          ) : null}

          {formError ? <p className="storage-modal__feedback storage-modal__feedback--error">{formError}</p> : null}
          {error ? (
            <p className="storage-modal__feedback storage-modal__feedback--error">{error}</p>
          ) : null}
          {successMessage ? (
            <p className="storage-modal__feedback storage-modal__feedback--success">{successMessage}</p>
          ) : null}

          <footer className="storage-modal__actions">
            <button type="button" className="button button--ghost" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="button button--primary" disabled={isSaving}>
              {isSaving ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  )
}

export default StorageUnitModal
