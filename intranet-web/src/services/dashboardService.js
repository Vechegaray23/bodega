// import { httpGet } from '../lib/httpClient'

const menuItemsMock = [
  { id: 'dashboard', label: 'Inicio' },
  { id: 'warehouse', label: 'Plano de bodegas' },
]

const quickLinksMock = [
  {
    title: 'Lorem ipsum dolor',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    action: 'Lorem ipsum',
  },
  {
    title: 'Consectetur adipiscing elit',
    description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    action: 'Dolor sit',
  },
  {
    title: 'Ut enim ad minim veniam',
    description: 'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    action: 'Amet lorem',
  },
]

const metricsMock = [
  { label: 'Lorem ipsum dolor', value: '92%', trend: 'Lorem ipsum dolor sit amet' },
  { label: 'Consectetur adipiscing', value: '18', trend: 'Sed do eiusmod tempor' },
  { label: 'Elit sed do', value: '5', trend: 'Eiusmod tempor incididunt' },
]

const newsMock = [
  {
    tag: 'Lorem',
    title: 'Lorem ipsum dolor sit amet',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
  },
  {
    tag: 'Ipsum',
    title: 'Ut enim ad minim veniam',
    description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.',
  },
  {
    tag: 'Dolor',
    title: 'Duis aute irure dolor in reprehenderit',
    description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  },
]

const eventsMock = [
  { date: '12 Jun', title: 'Lorem ipsum dolor sit', location: 'Lorem ipsum dolor' },
  { date: '19 Jun', title: 'Amet consectetur', location: 'Adipiscing elit' },
  { date: '27 Jun', title: 'Sed do eiusmod', location: 'Tempor incididunt' },
]

const announcementsMock = [
  {
    title: 'Lorem ipsum dolor sit amet',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
  },
  {
    title: 'Ut enim ad minim veniam',
    description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
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
