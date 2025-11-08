import { useEffect, useMemo, useState } from 'react'
import './App.css'
import StorageMap from './components/StorageMap'
import {
  getDashboardAnnouncements,
  getDashboardEvents,
  getDashboardMetrics,
  getDashboardNews,
  getMenuItems,
  getQuickLinks,
} from './services/dashboardService'
import { useAuth } from './contexts/AuthContext'

function Dashboard() {
  const [metrics, setMetrics] = useState([])
  const [news, setNews] = useState([])
  const [events, setEvents] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [quickLinks, setQuickLinks] = useState([])

  useEffect(() => {
    getDashboardMetrics().then(setMetrics)
    getDashboardNews().then(setNews)
    getDashboardEvents().then(setEvents)
    getDashboardAnnouncements().then(setAnnouncements)
    getQuickLinks().then(setQuickLinks)
  }, [])

  return (
    <>
      <header className="hero">
        <div className="hero__content">
          <p className="hero__badge">Intranet Corporativa</p>
          <h1>Todo lo que necesitás para estar al día en un mismo lugar</h1>
          <p className="hero__subtitle">
            Accedé rápidamente a recursos, noticias y herramientas clave. Seguimos construyendo un equipo conectado y colaborativo.
          </p>
          <div className="hero__actions">
            <button className="button button--primary">Ver OKRs</button>
            <button className="button button--ghost">Último reporte</button>
          </div>
        </div>
        <div className="hero__cards">
          {metrics.map((item) => (
            <div key={item.label} className="highlight-card">
              <span className="highlight-card__label">{item.label}</span>
              <strong className="highlight-card__value">{item.value}</strong>
              <span className="highlight-card__trend">{item.trend}</span>
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
            {news.map((item) => (
              <article key={item.title} className="news-card">
                <span className="news-card__tag">{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
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
    </>
  )
}

function App() {
  const [menuItems, setMenuItems] = useState([])
  const [activePage, setActivePage] = useState('dashboard')
  const { user, loginMock, logout } = useAuth()

  useEffect(() => {
    getMenuItems().then(setMenuItems)
  }, [])

  const userRolesLabel = useMemo(() => {
    if (!user?.roles?.length) return ''
    return user.roles.join(', ')
  }, [user])

  return (
    <div className="app-shell">
      <nav className="main-nav">
        <div className="main-nav__brand">
          <span className="main-nav__brand-mark" />
          <span>Intranet Bodega</span>
        </div>
        <ul className="main-nav__items">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={`main-nav__link ${activePage === item.id ? 'is-active' : ''}`}
                onClick={() => setActivePage(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="main-nav__auth">
          {user ? (
            <div className="main-nav__user">
              <div className="main-nav__user-info">
                <span className="main-nav__user-name">{user.name}</span>
                {userRolesLabel ? <span className="main-nav__user-roles">{userRolesLabel}</span> : null}
              </div>
              <button type="button" className="button button--ghost" onClick={logout}>
                Logout
              </button>
            </div>
          ) : (
            <button type="button" className="button button--primary" onClick={loginMock}>
              Login demo
            </button>
          )}
        </div>
      </nav>

      {activePage === 'dashboard' ? (
        <div className="app">
          <Dashboard />
        </div>
      ) : (
        <StorageMap />
      )}
    </div>
  )
}

export default App
