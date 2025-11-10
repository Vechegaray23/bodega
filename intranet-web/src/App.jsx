import { useEffect, useMemo, useState } from 'react'
import './App.css'
import StorageMap from './components/StorageMap'
import LoginLanding from './components/LoginLanding'
import {
  getDashboardAnnouncements,
  getDashboardEvents,
  getDashboardNews,
  getMenuItems,
  getQuickLinks,
} from './services/dashboardService'
import { useAuth } from './contexts/AuthContext'
import { getBodegas } from './services/bodegasService'

function Dashboard() {
  const [news, setNews] = useState([])
  const [events, setEvents] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [quickLinks, setQuickLinks] = useState([])
  const [storageUnits, setStorageUnits] = useState([])
  const [isLoadingStorageUnits, setIsLoadingStorageUnits] = useState(true)
  const [storageUnitsError, setStorageUnitsError] = useState(null)

  useEffect(() => {
    getDashboardNews().then(setNews)
    getDashboardEvents().then(setEvents)
    getDashboardAnnouncements().then(setAnnouncements)
    getQuickLinks().then(setQuickLinks)
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadStorageUnits() {
      try {
        setIsLoadingStorageUnits(true)
        const bodegas = await getBodegas()
        if (!isMounted) return
        setStorageUnits(bodegas)
        setStorageUnitsError(null)
      } catch (error) {
        if (!isMounted) return
        console.error('No fue posible cargar los indicadores de bodegas', error)
        setStorageUnits([])
        setStorageUnitsError(
          error instanceof Error
            ? error.message
            : 'No fue posible cargar los indicadores de bodegas.'
        )
      } finally {
        if (isMounted) {
          setIsLoadingStorageUnits(false)
        }
      }
    }

    loadStorageUnits()

    return () => {
      isMounted = false
    }
  }, [])

  const kpiMetrics = useMemo(() => {
    const OCCUPIED_STATUSES = new Set(['OCUPADA', 'POR_VENCER'])
    const EXPIRATION_THRESHOLD_DAYS = 30
    const MS_PER_DAY = 1000 * 60 * 60 * 24

    const totalUnits = storageUnits.length
    const occupiedUnits = storageUnits.filter((unit) =>
      OCCUPIED_STATUSES.has(unit.status)
    )

    const occupancyRate = totalUnits === 0 ? 0 : Math.round((occupiedUnits.length / totalUnits) * 100)

    const contractsExpiring = storageUnits.filter((unit) => {
      if (unit.status === 'POR_VENCER') {
        return true
      }

      if (!unit.fechaTermino) {
        return false
      }

      const expirationDate = new Date(unit.fechaTermino)
      if (Number.isNaN(expirationDate.getTime())) {
        return false
      }

      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const diffInDays = Math.ceil((expirationDate.getTime() - today.getTime()) / MS_PER_DAY)

      return diffInDays >= 0 && diffInDays <= EXPIRATION_THRESHOLD_DAYS
    }).length

    const monthlyRevenue = occupiedUnits.reduce((total, unit) => {
      const unitRevenue = typeof unit.tarifaUf === 'number' ? unit.tarifaUf : 0
      return total + unitRevenue
    }, 0)

    const formatNumber = (value, options = {}) =>
      new Intl.NumberFormat('es-CL', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        ...options,
      }).format(value)

    const occupiedLabel = `${occupiedUnits.length} de ${totalUnits || '—'} bodegas en uso`

    return [
      {
        label: 'Ocupación de bodegas',
        value: `${formatNumber(occupancyRate, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}%`,
        trend:
          totalUnits === 0
            ? 'Sin bodegas registradas'
            : occupiedUnits.length === 1
              ? '1 bodega en uso'
              : occupiedLabel,
      },
      {
        label: 'Contratos por vencer',
        value: formatNumber(contractsExpiring, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }),
        trend: `Dentro de ${EXPIRATION_THRESHOLD_DAYS} días`,
      },
      {
        label: 'Ingresos mensuales (UF)',
        value: formatNumber(monthlyRevenue, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }),
        trend:
          occupiedUnits.length === 0
            ? 'Sin bodegas facturando'
            : occupiedUnits.length === 1
              ? '1 bodega facturando'
              : `${occupiedUnits.length} bodegas facturando`,
      },
    ]
  }, [storageUnits])

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
          {isLoadingStorageUnits ? (
            <p className="hero__cards-message">Cargando indicadores…</p>
          ) : storageUnitsError ? (
            <p className="hero__cards-message hero__cards-message--error">
              {storageUnitsError}
            </p>
          ) : (
            kpiMetrics.map((item) => (
              <div key={item.label} className="highlight-card">
                <span className="highlight-card__label">{item.label}</span>
                <strong className="highlight-card__value">{item.value}</strong>
                <span className="highlight-card__trend">{item.trend}</span>
              </div>
            ))
          )}
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
  const { user, login, logout } = useAuth()

  useEffect(() => {
    getMenuItems().then(setMenuItems)
  }, [])

  const userRolesLabel = useMemo(() => {
    if (!user?.roles?.length) return ''
    return user.roles.join(', ')
  }, [user])

  useEffect(() => {
    if (!user) {
      setActivePage('dashboard')
    }
  }, [user])

  const handleLogin = (username, password) => login(username, password)

  if (!user) {
    return <LoginLanding onLogin={handleLogin} />
  }

  return (
    <div className="app-shell">
      <nav className="main-nav">
        <div className="main-nav__brand">
          <span className="main-nav__brand-mark" />
          <span>Lorem ipsum</span>
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
          <div className="main-nav__user">
            <div className="main-nav__user-info">
              <span className="main-nav__user-name">{user.name}</span>
              {userRolesLabel ? <span className="main-nav__user-roles">{userRolesLabel}</span> : null}
            </div>
            <button type="button" className="button button--ghost" onClick={logout}>
              Cerrar sesión
            </button>
          </div>
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
