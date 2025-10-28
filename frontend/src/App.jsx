import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home'
import Services from './pages/Services/Services'
import Appointments from './pages/Appointments/Appointments'
import Footer from './components/Footer/Footer'


export default function App() {
  return (
    <>
      <Navbar />
      <div style={{padding:12}}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/appointments" element={<Appointments />} />
        </Routes>
      </div>
      <Footer />
    </>
  )
}
