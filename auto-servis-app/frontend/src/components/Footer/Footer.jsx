import React from 'react'
import { Box, Container, Typography, Stack, Link } from '@mui/material'


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
                        <Link href="/services" underline="hover" color="text.primary">Services</Link>
                        <Link href="/appointments" underline="hover" color="text.primary">Appointments</Link>
                        <Link href="/login" underline="hover" color="text.primary">Login</Link>
                    </Stack>
                </Stack>

                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">© {new Date().getFullYear()} Škoda Auto Servis — Sva prava pridržana</Typography>
                </Box>
            </Container>
        </Box>
    )
}