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
    // credentialResponse may be either the credential object (from
    // the GoogleLogin component) containing an ID token at
    // credentialResponse.credential, or a token response from
    // useGoogleLogin which contains an access_token. Handle both.
    const id_token = credentialResponse?.credential
    if (id_token) {
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
      return
    }

    const accessToken = credentialResponse?.access_token
    if (accessToken) {
      // fetch basic profile info from Google's userinfo endpoint
      fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`)
        .then(res => res.json())
        .then(profile => {
          const u = {
            name: profile.name,
            email: profile.email,
            picture: profile.picture,
            sub: profile.sub,
            access_token: accessToken
          }
          setUser(u)
          localStorage.setItem('user', JSON.stringify(u))
        })
        .catch(err => {
          console.error('Failed to load Google profile', err)
        })
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