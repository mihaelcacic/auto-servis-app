import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'
import { Navbar, Footer, ProtectedRoute } from './components'
import Home from './pages/Home/Home'
import Services from './pages/Services/Services'
import Appointments from './pages/Appointments/Appointments'
import MyAppointments from './pages/Appointments/MyAppointments'
import Admin from './pages/Admin/Admin'
import Contact from './pages/Contact/Contact'
import ServiserDashboard from './pages/Serviser/ServiserDashboard'


export default function App() {

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

            <Navbar />

            <Box component="main" sx={{ flex: 1, p: 2 }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/appointments" element={<Appointments />} />
                    <Route path="/my-termini" element={<MyAppointments />} />
                    <Route path="/admin" element={
                        <ProtectedRoute allowedRoles={[ 'ROLE_ADMIN' ]}>
                            <Admin />
                        </ProtectedRoute>
                    } />
                    <Route path="/serviser" element={
                        <ProtectedRoute allowedRoles={[ 'ROLE_SERVISER' ]}>
                            <ServiserDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/contact" element={<Contact />} />
                </Routes>
            </Box>

            <Footer />
        </Box>
    )
}