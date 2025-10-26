import React, { createContext, useContext, useEffect, useState } from 'react'

function parseJwt(token) {
  if (!token) return null
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const raw = localStorage.getItem('user')
    if (raw) setUser(JSON.parse(raw))
  }, [])

  const login = (credentialResponse) => {
    // credentialResponse.credential is the ID token from @react-oauth/google
    const id_token = credentialResponse?.credential
    const payload = parseJwt(id_token)
    if (payload) {
      const u = {
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        sub: payload.sub,
        id_token
      }
      setUser(u)
      localStorage.setItem('user', JSON.stringify(u))
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    // optionally call backend to revoke session / token
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}