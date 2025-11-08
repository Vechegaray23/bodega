// import { httpGet } from '../lib/httpClient'

const menuItemsMock = [
  { id: 'dashboard', label: 'Inicio' },
  { id: 'warehouse', label: 'Plano de bodegas' },
]

const quickLinksMock = [
  {
    title: 'Solicitar vacaciones',
    description: 'Administra tus días libres y supervisa el estado de tus solicitudes.',
    action: 'Ir a RRHH',
  },
  {
    title: 'Mesa de ayuda',
    description: 'Genera tickets y haz seguimiento de tus incidencias técnicas.',
    action: 'Abrir ticket',
  },
  {
    title: 'Directorio',
    description: 'Encuentra información de contacto de todo el equipo.',
    action: 'Ver personas',
  },
]

const metricsMock = [
  { label: 'Satisfacción del equipo', value: '92%', trend: '+4.5% vs. mes anterior' },
  { label: 'Proyectos activos', value: '18', trend: '6 entregas esta semana' },
  { label: 'Capacitaciones', value: '5', trend: 'Nuevos cursos disponibles' },
]

const newsMock = [
  {
    tag: 'People',
    title: 'Reconocimiento a equipos destacados del trimestre',
    description:
      'Conocé a los equipos que alcanzaron los mejores resultados y descubre sus estrategias para compartirlas con tu squad.',
  },
  {
    tag: 'Tech',
    title: 'Lanzamos la nueva app móvil de clientes',
    description:
      'La aplicación incorpora funcionalidades de autoservicio y monitoreo en tiempo real. Explorá el roadmap y los próximos hitos.',
  },
  {
    tag: 'Cultura',
    title: 'Semana de impacto social',
    description:
      'Sumate a las actividades de voluntariado junto a organizaciones aliadas. Hay opciones presenciales y virtuales.',
  },
]

const eventsMock = [
  { date: '12 Jun', title: 'Demo trimestral', location: 'Auditorio principal / Streaming Teams' },
  { date: '19 Jun', title: 'Taller de liderazgo', location: 'Sala Innovación' },
  { date: '27 Jun', title: 'After Office', location: 'Terraza corporativa' },
]

const announcementsMock = [
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

export async function getMenuItems() {
  // TODO: cuando exista API real, descomentar:
  // return httpGet('/navigation/menu-items')

  return menuItemsMock
}

export async function getQuickLinks() {
  // TODO: cuando exista API real, descomentar:
  // return httpGet('/navigation/quick-links')

  return quickLinksMock
}

export async function getDashboardMetrics() {
  // TODO: cuando exista API real, descomentar:
  // return httpGet('/dashboard/metrics')

  return metricsMock
}

export async function getDashboardNews() {
  // TODO: cuando exista API real, descomentar:
  // return httpGet('/dashboard/news')

  return newsMock
}

export async function getDashboardEvents() {
  // TODO: cuando exista API real, descomentar:
  // return httpGet('/dashboard/events')

  return eventsMock
}

export async function getDashboardAnnouncements() {
  // TODO: cuando exista API real, descomentar:
  // return httpGet('/dashboard/announcements')

  return announcementsMock
}
