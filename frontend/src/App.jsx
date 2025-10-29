import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home'
import Services from './pages/Services/Services'
import Appointments from './pages/Appointments/Appointments'
import Footer from './components/Footer/Footer'
import { useAuth } from "./context/AuthContext";


export default function App() {
    const { user, loading } = useAuth();

    if (loading) return <p>Loading...</p>;

    return (
        <>
            <Navbar />
            <div style={{ padding: 12 }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/services" element={<Services />} />
                    {user ? (
                        <Route path="/appointments" element={<Appointments />} />
                    ) : (
                        <Route
                            path="/appointments"
                            element={<p>Please log in to view appointments.</p>}
                        />
                    )}
                </Routes>
            </div>
            <Footer />
        </>
    );
}

