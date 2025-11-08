import './App.css'

const quickLinks = [
  { title: 'Solicitar vacaciones', description: 'Administra tus días libres y supervisa el estado de tus solicitudes.', action: 'Ir a RRHH' },
  { title: 'Mesa de ayuda', description: 'Genera tickets y haz seguimiento de tus incidencias técnicas.', action: 'Abrir ticket' },
  { title: 'Directorio', description: 'Encuentra información de contacto de todo el equipo.', action: 'Ver personas' },
]

const highlights = [
  { label: 'Satisfacción del equipo', value: '92%', trend: '+4.5% vs. mes anterior' },
  { label: 'Proyectos activos', value: '18', trend: '6 entregas esta semana' },
  { label: 'Capacitaciones', value: '5', trend: 'Nuevos cursos disponibles' },
]

const events = [
  { date: '12 Jun', title: 'Demo trimestral', location: 'Auditorio principal / Streaming Teams' },
  { date: '19 Jun', title: 'Taller de liderazgo', location: 'Sala Innovación' },
  { date: '27 Jun', title: 'After Office', location: 'Terraza corporativa' },
]

const announcements = [
  {
    title: 'Nueva plataforma de bienestar',
    description:
      'Accede a sesiones de mindfulness, asesoramiento nutricional y descuentos en gimnasios aliados. Inscríbete antes del 30 de junio.',
  },
  {
    title: 'Actualización de políticas de trabajo híbrido',
    description:
      'Revisá la guía completa en la sección de Recursos Humanos. Entrará en vigencia el próximo mes.',
  },
]

function App() {
  return (
    <div className="app">
      <header className="hero">
        <div className="hero__content">
          <p className="hero__badge">Intranet Corporativa</p>
          <h1>Todo lo que necesitás para estar al día en un mismo lugar</h1>
          <p className="hero__subtitle">
            Accedé rápidamente a recursos, noticias y herramientas clave. Seguimos construyendo un equipo conectado y
            colaborativo.
          </p>
          <div className="hero__actions">
            <button className="button button--primary">Ver OKRs</button>
            <button className="button button--ghost">Último reporte</button>
          </div>
        </div>
        <div className="hero__cards">
          {highlights.map((highlight) => (
            <div key={highlight.label} className="highlight-card">
              <span className="highlight-card__label">{highlight.label}</span>
              <strong className="highlight-card__value">{highlight.value}</strong>
              <span className="highlight-card__trend">{highlight.trend}</span>
            </div>
          ))}
        </div>
      </header>

      <main className="main-grid">
        <section className="panel panel--wide">
          <div className="panel__header">
            <h2>Últimas novedades</h2>
            <a href="#" className="panel__link">
              Ver todas
            </a>
          </div>
          <div className="news-grid">
            <article className="news-card">
              <span className="news-card__tag">People</span>
              <h3>Reconocimiento a equipos destacados del trimestre</h3>
              <p>
                Conocé a los equipos que alcanzaron los mejores resultados y descubre sus estrategias para compartirlas con
                tu squad.
              </p>
            </article>
            <article className="news-card">
              <span className="news-card__tag">Tech</span>
              <h3>Lanzamos la nueva app móvil de clientes</h3>
              <p>
                La aplicación incorpora funcionalidades de autoservicio y monitoreo en tiempo real. Explorá el roadmap y los
                próximos hitos.
              </p>
            </article>
            <article className="news-card">
              <span className="news-card__tag">Cultura</span>
              <h3>Semana de impacto social</h3>
              <p>
                Sumate a las actividades de voluntariado junto a organizaciones aliadas. Hay opciones presenciales y
                virtuales.
              </p>
            </article>
          </div>
        </section>

        <section className="panel">
          <div className="panel__header">
            <h2>Eventos próximos</h2>
            <a href="#" className="panel__link">
              Calendario completo
            </a>
          </div>
          <ul className="event-list">
            {events.map((event) => (
              <li key={event.title} className="event-item">
                <span className="event-item__date">{event.date}</span>
                <div>
                  <h3>{event.title}</h3>
                  <p>{event.location}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <div className="panel__header">
            <h2>Anuncios</h2>
            <a href="#" className="panel__link">
              Centro de comunicaciones
            </a>
          </div>
          <div className="announcement-list">
            {announcements.map((item) => (
              <article key={item.title} className="announcement-card">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <button className="button button--inline">Más información</button>
              </article>
            ))}
          </div>
        </section>
      </main>

      <aside className="quick-links">
        <h2>Accesos directos</h2>
        <div className="quick-links__grid">
          {quickLinks.map((link) => (
            <article key={link.title} className="quick-link-card">
              <h3>{link.title}</h3>
              <p>{link.description}</p>
              <button className="button button--ghost">{link.action}</button>
            </article>
          ))}
        </div>
      </aside>
    </div>
  )
}

export default App
