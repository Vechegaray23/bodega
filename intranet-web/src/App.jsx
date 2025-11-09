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
          <p className="hero__badge">Lorem ipsum dolor</p>
          <h1>Lorem ipsum dolor sit amet, consectetur adipiscing elit</h1>
          <p className="hero__subtitle">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Integer sed mauris sed orci feugiat tempus.
          </p>
          <div className="hero__actions">
            <button className="button button--primary">Lorem ipsum</button>
            <button className="button button--ghost">Dolor sit</button>
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
            <h2>Lorem ipsum dolor</h2>
            <a href="#" className="panel__link">
              Lorem ipsum
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
            <h2>Lorem ipsum dolor</h2>
            <a href="#" className="panel__link">
              Lorem ipsum
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
            <h2>Lorem ipsum dolor</h2>
            <a href="#" className="panel__link">
              Lorem ipsum
            </a>
          </div>
          <div className="announcement-list">
            {announcements.map((item) => (
              <article key={item.title} className="announcement-card">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <button className="button button--inline">Lorem ipsum</button>
              </article>
            ))}
          </div>
        </section>
      </main>

      <aside className="quick-links">
        <h2>Lorem ipsum dolor</h2>
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
