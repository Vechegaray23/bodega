import { useEffect, useMemo, useState, type FormEvent, type KeyboardEvent } from 'react'
import StorageUnitModal from './StorageUnitModal'
import { getBodegas, updateBodega, type UpdateBodegaPayload } from '../services/bodegasService'
import {
  getWarehouseMetadata,
  getWarehouseNotes,
  type WarehouseMetadata,
} from '../services/warehouseInsightsService'
import {
  getAllBodegaStatuses,
  getBodegaStatusColor,
  getBodegaStatusLabel,
} from '../domain/bodegas'
import type { StorageUnit } from '../domain/storageUnits'
import { HttpError } from '../lib/httpClient'

function StorageMap() {
  const [storageUnits, setStorageUnits] = useState<StorageUnit[]>([])
  const [warehouseMetadata, setWarehouseMetadata] = useState<WarehouseMetadata | null>(null)
  const [operationalNotes, setOperationalNotes] = useState<string[]>([])
  const [isLoadingBodegas, setIsLoadingBodegas] = useState(true)
  const [bodegasError, setBodegasError] = useState<string | null>(null)
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null)
  const [isSavingChanges, setIsSavingChanges] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null)
  const [newNote, setNewNote] = useState('')
  const statusLegend = getAllBodegaStatuses()

  const selectedUnit = useMemo(() => {
    if (!selectedUnitId) {
      return null
    }

    return storageUnits.find((unit) => unit.id === selectedUnitId) ?? null
  }, [selectedUnitId, storageUnits])

  useEffect(() => {
    if (selectedUnitId && !selectedUnit) {
      setSelectedUnitId(null)
    }
  }, [selectedUnit, selectedUnitId])

  useEffect(() => {
    let isMounted = true

    async function loadBodegas() {
      try {
        setIsLoadingBodegas(true)
        const bodegas = await getBodegas()
        if (!isMounted) return
        setStorageUnits(bodegas)
        setBodegasError(null)
      } catch (error) {
        if (!isMounted) return
        console.error('No fue posible cargar las bodegas', error)
        setBodegasError(
          error instanceof Error ? error.message : 'No fue posible cargar las bodegas.'
        )
      } finally {
        if (isMounted) {
          setIsLoadingBodegas(false)
        }
      }
    }

    loadBodegas()
    getWarehouseMetadata().then((metadata) => {
      if (isMounted) {
        setWarehouseMetadata(metadata)
      }
    })
    getWarehouseNotes().then((notes) => {
      if (isMounted) {
        setOperationalNotes(notes)
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  const handleStorageUnitClick = (unitId: string) => {
    setSelectedUnitId(unitId)
    setSaveError(null)
    setSaveSuccessMessage(null)
  }

  const handleStorageUnitKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    unitId: string
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleStorageUnitClick(unitId)
    }
  }

  const handleCloseModal = () => {
    setSelectedUnitId(null)
    setSaveError(null)
    setSaveSuccessMessage(null)
  }

  const handleAddNote = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const note = newNote.trim()
    if (!note) {
      return
    }

    setOperationalNotes((prevNotes) => [...prevNotes, note])
    setNewNote('')
  }

  const handleRemoveNote = (indexToRemove: number) => {
    setOperationalNotes((prevNotes) =>
      prevNotes.filter((_, noteIndex) => noteIndex !== indexToRemove)
    )
  }

  const handleSaveChanges = async (updates: UpdateBodegaPayload) => {
    if (!selectedUnitId) {
      return
    }

    setIsSavingChanges(true)
    setSaveError(null)
    setSaveSuccessMessage(null)

    try {
      const updatedUnit = await updateBodega(selectedUnitId, updates)

      setStorageUnits((prevUnits) =>
        prevUnits.map((unit) => (unit.id === updatedUnit.id ? updatedUnit : unit))
      )
      setSelectedUnitId(updatedUnit.id)
      setSaveSuccessMessage('Bodega actualizada correctamente.')
    } catch (error) {
      console.error('No fue posible actualizar la bodega', error)

      let message = 'No fue posible actualizar la bodega.'

      if (error instanceof HttpError) {
        const body = error.body
        if (body && typeof body === 'object' && 'message' in body) {
          const bodyMessage = (body as { message?: unknown }).message
          if (typeof bodyMessage === 'string' && bodyMessage.trim()) {
            message = bodyMessage
          }
        } else if (error.message) {
          message = error.message
        }
      } else if (error instanceof Error && error.message) {
        message = error.message
      }

      setSaveError(message)
      throw error
    } finally {
      setIsSavingChanges(false)
    }
  }

  return (
    <div className="warehouse-page">
      <header className="warehouse-header">
        <div>
          <p className="warehouse-header__eyebrow">Plano maestro</p>
          <h1>Mapa de bodegas - Planta principal</h1>
          <p className="warehouse-header__description">
            Visualizá la disponibilidad y capacidad de cada unidad en tiempo real. El plano replica el layout arquitectónico de la planta con líneas estructurales y zonas de circulación.
          </p>
        </div>
        <div className="warehouse-header__meta">
          <div>
            <span className="warehouse-header__label">Actualización</span>
            <strong>{warehouseMetadata?.lastUpdate ?? '—'}</strong>
          </div>
          <div>
            <span className="warehouse-header__label">Supervisor</span>
            <strong>{warehouseMetadata?.supervisor ?? '—'}</strong>
          </div>
        </div>
      </header>

      <div className="warehouse-content">
        <div className="warehouse-map">
          <div className="warehouse-map__grid">
            <div className="warehouse-map__background" />
            {isLoadingBodegas && (
              <p className="warehouse-map__message">Cargando bodegas…</p>
            )}
            {!isLoadingBodegas && bodegasError && (
              <p className="warehouse-map__message warehouse-map__message--error">
                {bodegasError || 'No fue posible cargar las bodegas.'}
              </p>
            )}
            {!isLoadingBodegas && !bodegasError && storageUnits.length === 0 && (
              <p className="warehouse-map__message">No hay bodegas para mostrar.</p>
            )}
            {!isLoadingBodegas && !bodegasError &&
              storageUnits.map((unit) => (
                <div
                  key={unit.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Bodega ${unit.nombre}. Estado: ${getBodegaStatusLabel(unit.status)}.`}
                  onClick={() => handleStorageUnitClick(unit.id)}
                  onKeyDown={(event) => handleStorageUnitKeyDown(event, unit.id)}
                  className={`storage-unit ${unit.span} storage-unit--${getBodegaStatusColor(unit.status)}`}
                >
                  <span className="storage-unit__id">{unit.id}</span>
                  <span className="storage-unit__size">{unit.size}</span>
                  <span className="storage-unit__status-label">{getBodegaStatusLabel(unit.status)}</span>
                </div>
              ))}
          </div>
        </div>
        <aside className="warehouse-sidebar">
          <section>
            <h2>Estado general</h2>
            <ul className="warehouse-legend">
              {statusLegend.map((status) => (
                <li key={status}>
                  <span className={`warehouse-legend__dot warehouse-legend__dot--${getBodegaStatusColor(status)}`} />
                  {getBodegaStatusLabel(status)}
                </li>
              ))}
            </ul>
          </section>
          <section className="warehouse-notes">
            <h3>Notas operativas</h3>
            <form className="warehouse-notes__form" onSubmit={handleAddNote}>
              <label className="warehouse-notes__label" htmlFor="warehouse-notes-input">
                Nueva nota
              </label>
              <div className="warehouse-notes__input-group">
                <input
                  id="warehouse-notes-input"
                  type="text"
                  value={newNote}
                  onChange={(event) => setNewNote(event.target.value)}
                  placeholder="Agregá un recordatorio operativo"
                />
                <button type="submit" disabled={!newNote.trim()}>
                  Añadir
                </button>
              </div>
            </form>
            <ul>
              {operationalNotes.map((note, index) => (
                <li key={`${note}-${index}`}>
                  <span>{note}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveNote(index)}
                    className="warehouse-notes__remove"
                    aria-label={`Eliminar nota: ${note}`}
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      {selectedUnit ? (
        <StorageUnitModal
          unit={selectedUnit}
          onClose={handleCloseModal}
          onSave={handleSaveChanges}
          isSaving={isSavingChanges}
          error={saveError}
          successMessage={saveSuccessMessage}
        />
      ) : null}
    </div>
  )
}

export default StorageMap
