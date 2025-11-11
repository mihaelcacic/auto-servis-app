import React from 'react'
import { Box, Container, Typography, Stack, Link as MuiLink } from '@mui/material'
import logo from '../../assets/icons/img/Logo.png'
import { NavLink } from 'react-router-dom'

export default function Footer(){
    return (
        <Box component="footer" sx={{ backgroundColor: 'background.paper', borderTop: t => `1px solid ${t.palette.divider}`, py: 3 }}>
            <Container maxWidth="lg">
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box component="img" src={logo} alt="Bregmotors logo" sx={{ height: 48, borderRadius:2}} />
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>Bregmotors</Typography>
                            <Typography variant="body2" color="text.secondary">Pouzdani serviseri vašeg vozila</Typography>
                        </Box>
                    </Box>

                    <Stack direction="row" spacing={2} alignItems="center">
                        <MuiLink component={NavLink} to="/" underline="none">Početna</MuiLink>
                        <MuiLink component={NavLink} to="/services" underline="none">Usluge</MuiLink>
                        <MuiLink component={NavLink} to="/appointments" underline="none">Novi termin</MuiLink>
                        <MuiLink component={NavLink} to="/contact" underline="none">Kontakt</MuiLink>
                    </Stack>
                </Stack>

                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">© {new Date().getFullYear()} Bregmotors — Sva prava pridržana</Typography>
                </Box>
            </Container>
        </Box>
    )
}