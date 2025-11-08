const rawBaseUrl = import.meta.env.VITE_API_BASE_URL

if (!rawBaseUrl) {
  throw new Error('VITE_API_BASE_URL no está configurada. Definila en .env.local')
}

const API_BASE_URL = rawBaseUrl.trim().replace(/\/+$/, '')

function resolvePath(path: string): string {
  if (!path) {
    return API_BASE_URL
  }

  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export class HttpError extends Error {
  status: number
  body: unknown

  constructor(status: number, body: unknown, message?: string) {
    const errorMessage =
      message ??
      (typeof body === 'string' && body.length > 0
        ? body
        : `Request failed with status ${status}`)

    super(errorMessage)
    this.name = 'HttpError'
    this.status = status
    this.body = body
  }
}

async function readBody(response: Response): Promise<unknown> {
  if (response.status === 204 || response.status === 205) {
    return null
  }

  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    return response.json()
  }

  const text = await response.text()
  if (!text) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

async function httpRequest<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(resolvePath(path), init)
  const body = await readBody(response)

  if (!response.ok) {
    throw new HttpError(response.status, body)
  }

  return body as T
}

export async function httpGet<T>(path: string, options: RequestInit = {}): Promise<T> {
  return httpRequest<T>(path, { ...options, method: 'GET' })
}

export async function httpPost<T>(path: string, body: unknown, options: RequestInit = {}): Promise<T> {
  const headers = { 'Content-Type': 'application/json', ...(options.headers ?? {}) }

  return httpRequest<T>(path, {
    ...options,
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
}
