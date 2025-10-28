import React from 'react'
import { Box, Container, Typography, Stack, Link as MuiLink } from '@mui/material'
import { NavLink } from 'react-router-dom'

export default function Footer(){
    return (
        <Box component="footer" sx={{ backgroundColor: 'background.paper', borderTop: t => `1px solid ${t.palette.divider}`, py: 3 }}>
            <Container maxWidth="lg">
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>Škoda Repair Service</Typography>
                        <Typography variant="body2" color="text.secondary">Pouzdani specijalisti za vašu Škodu</Typography>
                    </Box>

                    <Stack direction="row" spacing={2} alignItems="center">
                        <MuiLink component={NavLink} to="/" underline="none">Home</MuiLink>
                        <MuiLink component={NavLink} to="/services" underline="none">Services</MuiLink>
                        <MuiLink component={NavLink} to="/appointments" underline="none">Appointments</MuiLink>
                        <MuiLink component={NavLink} to="/login" underline="none">Login</MuiLink>
                    </Stack>
                </Stack>

                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">© {new Date().getFullYear()} Škoda Auto Servis — Sva prava pridržana</Typography>
                </Box>
            </Container>
        </Box>
    )
}