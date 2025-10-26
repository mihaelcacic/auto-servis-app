import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../../context/AuthContext'
import { Avatar } from '@mui/material'

export default function Navbar() {
  const navigate = useNavigate()
  const { user, login, logout } = useAuth()

  return (
    <nav className="Navbar">
      <div className="Navbar__brand">Auto Servis</div>

      <div className="Navbar__links">
        <Link to="/">Home</Link>
        <Link to="/services">Services</Link>
        <Link to="/appointments">Appointments</Link>

        {!user ? (
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              login(credentialResponse)
              navigate('/')
            }}
            onError={() => {
              console.log('Login Failed')
            }}
          />
        ) : (
          <Avatar
            src={user.picture}
            alt={user.name}
            className="Navbar__avatar"
            onClick={() => {
              logout()
              navigate('/')
            }}
          />
        )}
      </div>
    </nav>
  )
}