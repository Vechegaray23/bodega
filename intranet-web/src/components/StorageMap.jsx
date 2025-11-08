import { useEffect, useState } from 'react'
import {
  getBodegaStatusLegend,
  getBodegas,
  getWarehouseMetadata,
  getWarehouseNotes,
} from '../services/bodegasService'
import { getBodegaStatusColor, getBodegaStatusLabel } from '../domain/bodegas'

function StorageMap() {
  const [storageUnits, setStorageUnits] = useState([])
  const [statusLegend, setStatusLegend] = useState([])
  const [warehouseMetadata, setWarehouseMetadata] = useState(null)
  const [operationalNotes, setOperationalNotes] = useState([])

  useEffect(() => {
    getBodegas().then(setStorageUnits)
    getBodegaStatusLegend().then(setStatusLegend)
    getWarehouseMetadata().then(setWarehouseMetadata)
    getWarehouseNotes().then(setOperationalNotes)
  }, [])

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
            {storageUnits.map((unit) => (
              <div
                key={unit.id}
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
            <ul>
              {operationalNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  )
}

export default StorageMap
