import React from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

export default function Navbar(){
  return (
    <nav className="Navbar">
      <div className="Navbar__brand">Auto Servis</div>
      <div className="Navbar__links">
        <Link to="/">Home</Link>
        <Link to="/services">Services</Link>
        <Link to="/appointments">Appointments</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  )
}
