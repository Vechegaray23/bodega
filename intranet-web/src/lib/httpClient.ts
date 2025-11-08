const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

export async function httpGet<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, options)
  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status}`)
  }
  return response.json() as Promise<T>
}

export async function httpPost<T>(path: string, body: unknown, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
    body: JSON.stringify(body),
    ...options,
  })

  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status}`)
  }
  return response.json() as Promise<T>
}
