import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home'
import Services from './pages/Services/Services'
import Appointments from './pages/Appointments/Appointments'
import MyAppointments from './pages/Appointments/MyAppointments'
import Footer from './components/Footer/Footer'
import Contact from './pages/Contact/Contact'
import CookiePopup from './components/Cookie/CookieWarningPopup'
import useThirdPartyCookies from './hooks/useThirdPartyCookies'

export default function App() {

    const cookiesEnabled = useThirdPartyCookies();
    const [popupClosed, setPopupClosed] = useState(false);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

            {/* ---- COOKIE POPUP ---- */}
            {!cookiesEnabled && !popupClosed && (
                <CookiePopup onClose={() => setPopupClosed(true)} />
            )}

            <Navbar />

            <Box component="main" sx={{ flex: 1, p: 2 }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/appointments" element={<Appointments />} />
                    <Route path="/my-termini" element={<MyAppointments />} />
                    <Route path="/contact" element={<Contact />} />
                </Routes>
            </Box>

            <Footer />
        </Box>
    )
}