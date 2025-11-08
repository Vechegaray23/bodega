import { createContext, type ReactNode, useContext, useMemo, useState } from 'react'

type User = {
  id: string
  name: string
  roles: string[]
}

type AuthContextValue = {
  user: User | null
  loginMock: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  function loginMock() {
    setUser({
      id: '1',
      name: 'Usuario Demo',
      roles: ['OPERACIONES'],
    })
  }

  function logout() {
    setUser(null)
  }

  const value = useMemo<AuthContextValue>(() => ({ user, loginMock, logout }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
