// import { httpGet, httpPost } from '../lib/httpClient'

export async function login(credentials) {
  console.warn('login service not implemented', credentials)
  // TODO: cuando exista API real, reemplazar por:
  // return httpPost('/auth/login', credentials)

  return { success: false }
}

export async function logout() {
  console.warn('logout service not implemented')
  // TODO: cuando exista API real, reemplazar por:
  // return httpPost('/auth/logout')

  return { success: false }
}

export async function getCurrentUser() {
  // TODO: cuando exista API real, reemplazar por:
  // return httpGet('/auth/me')

  return null
}
