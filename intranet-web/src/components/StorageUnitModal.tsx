import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import { getAllBodegaStatuses, getBodegaStatusLabel } from '../domain/bodegas'
import type { StorageUnit } from '../domain/storageUnits'
import type { UpdateBodegaPayload } from '../services/bodegasService'

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
  metrosCuadrados: string
  piso: string
  estado: UpdateBodegaPayload['estado']
}

const STATUS_OPTIONS = getAllBodegaStatuses()

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
    metrosCuadrados: unit.metrosCuadrados.toString(),
    piso: unit.piso.toString(),
    estado: unit.status,
  })
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    setFormState({
      nombre: unit.nombre,
      metrosCuadrados: unit.metrosCuadrados.toString(),
      piso: unit.piso.toString(),
      estado: unit.status,
    })
    setFormError(null)
  }, [unit])

  const formattedSize = useMemo(() => {
    const metros = Number(formState.metrosCuadrados)
    if (Number.isFinite(metros)) {
      return `${metros} m²`
    }

    return unit.size
  }, [formState.metrosCuadrados, unit.size])

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target

    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nombre = formState.nombre.trim()
    const metrosCuadrados = Number(formState.metrosCuadrados)
    const piso = Number(formState.piso)

    if (!nombre) {
      setFormError('El nombre es obligatorio.')
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

    setFormError(null)

    const payload: UpdateBodegaPayload = {
      nombre,
      metrosCuadrados,
      piso,
      estado: formState.estado,
    }

    try {
      await onSave(payload)
    } catch {
      // El componente padre se encarga de mostrar el error correspondiente.
    }
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
            </dl>
          </section>

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
