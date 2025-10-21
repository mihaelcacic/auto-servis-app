import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import Home from './pages/Home/Home'
import LoginSignup from './pages/LoginSignup/LoginSignup'
import Services from './pages/Services/Services'
import Appointments from './pages/Appointments/Appointments'
import Navbar from './components/Navbar/Navbar'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{padding:12}}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/services" element={<Services />} />
          <Route path="/appointments" element={<Appointments />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
