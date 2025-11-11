import React, { useEffect, useState } from 'react'
import { Container, Typography, Box, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, CircularProgress, Alert } from '@mui/material'
import { getUsluge } from '../../services/api'

export default function Services(){
  const [usluge, setUsluge] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    getUsluge()
      .then(data => { if(mounted) setUsluge(Array.isArray(data) ? data : []) })
      .catch(err => { if(mounted) setError(err.message || 'Greška pri dohvaćanju usluga') })
      .finally(() => { if(mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 8 }}>
      <Typography variant="h4" gutterBottom>Usluge</Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error">{error}</Alert>
      )}

      {!loading && !error && (
        <TableContainer component={Paper} elevation={1}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 120 }}>ID</TableCell>
                <TableCell>Naziv usluge</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usluge.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} align="center">Nema dostupnih usluga.</TableCell>
                </TableRow>
              ) : (
                usluge.map(u => (
                  <TableRow key={u.idUsluga ?? u.id ?? u.uslugaId} hover>
                    <TableCell>{u.idUsluga ?? u.id ?? ''}</TableCell>
                    <TableCell>{u.uslugaNaziv ?? u.naziv ?? ''}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  )
}
