const storageUnits = [
  { id: 'A1', size: '120 m²', status: 'Disponible', statusKey: 'available', span: 'span-2x2' },
  { id: 'A2', size: '95 m²', status: 'Ocupada', statusKey: 'occupied', span: 'span-1x2' },
  { id: 'A3', size: '110 m²', status: 'Próxima a vencer', statusKey: 'expiring', span: 'span-1x2' },
  { id: 'B1', size: '140 m²', status: 'Reservada', statusKey: 'reserved', span: 'span-2x3' },
  { id: 'B2', size: '85 m²', status: 'Disponible', statusKey: 'available', span: 'span-1x1' },
  { id: 'B3', size: '85 m²', status: 'Disponible', statusKey: 'available', span: 'span-1x1' },
  { id: 'C1', size: '100 m²', status: 'Ocupada', statusKey: 'occupied', span: 'span-2x2' },
  { id: 'C2', size: '75 m²', status: 'Disponible', statusKey: 'available', span: 'span-1x1' },
  { id: 'C3', size: '75 m²', status: 'Ocupada', statusKey: 'occupied', span: 'span-1x1' },
  { id: 'D1', size: '90 m²', status: 'Disponible', statusKey: 'available', span: 'span-1x2' },
  { id: 'D2', size: '90 m²', status: 'Reservada', statusKey: 'reserved', span: 'span-1x2' },
  { id: 'E1', size: '130 m²', status: 'Disponible', statusKey: 'available', span: 'span-2x2' },
  { id: 'E2', size: '120 m²', status: 'Próxima a vencer', statusKey: 'expiring', span: 'span-2x2' },
]

const statusLegend = [
  { label: 'Disponible', color: 'available' },
  { label: 'Reservada', color: 'reserved' },
  { label: 'Ocupada', color: 'occupied' },
  { label: 'Próxima a vencer', color: 'expiring' },
]

function StorageMap() {
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
            <strong>Hace 5 minutos</strong>
          </div>
          <div>
            <span className="warehouse-header__label">Supervisor</span>
            <strong>María Gómez</strong>
          </div>
        </div>
      </header>

      <div className="warehouse-content">
        <div className="warehouse-map">
          <div className="warehouse-map__grid">
            <div className="warehouse-map__background" />
            <div className="warehouse-corridor warehouse-corridor--horizontal" />
            <div className="warehouse-corridor warehouse-corridor--vertical" />
            {storageUnits.map((unit) => (
              <div key={unit.id} className={`storage-unit ${unit.span} storage-unit--${unit.statusKey}`}>
                <span className="storage-unit__id">{unit.id}</span>
                <span className="storage-unit__size">{unit.size}</span>
                <span className="storage-unit__status-label">{unit.status}</span>
              </div>
            ))}
          </div>
        </div>
        <aside className="warehouse-sidebar">
          <section>
            <h2>Estado general</h2>
            <ul className="warehouse-legend">
              {statusLegend.map((item) => (
                <li key={item.label}>
                  <span className={`warehouse-legend__dot warehouse-legend__dot--${item.color}`} />
                  {item.label}
                </li>
              ))}
            </ul>
          </section>
          <section className="warehouse-notes">
            <h3>Notas operativas</h3>
            <ul>
              <li>La unidad A3 estará disponible nuevamente el 22 de junio.</li>
              <li>Se programó inspección de seguridad para el corredor central.</li>
              <li>Actualizar inventario de equipos en B1 y E2 antes del viernes.</li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  )
}

export default StorageMap
