import React, { useEffect, useState } from 'react'
import { Container, Typography, CircularProgress, Alert, Button, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper } from '@mui/material'
import { formatDatetime } from '../../utils/date'
import { useAuth } from '../../context/AuthContext'
import { getNaloziByKlijent } from '../../services/api'

export default function MyAppointments(){
  const { user, login, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [nalozi, setNalozi] = useState([])
  

  useEffect(()=>{
    if(authLoading) return
    if(!user){ return }
    let mounted = true
    async function load(){
      setLoading(true)
      try{
        const data = await getNaloziByKlijent(user.id)
        if(!mounted) return
        setNalozi(Array.isArray(data) ? data : [])
      }catch(e){
        console.error(e)
        setError('Ne mogu dohvatiti vaše termine')
      }finally{ mounted && setLoading(false) }
    }
    load()
    // Poll every 10s so client sees status updates when serviser changes status
    const iv = setInterval(()=>{ if(mounted) load() }, 10000)
    return ()=>{ mounted = false; clearInterval(iv) }
  },[user, authLoading])

  

  if(authLoading) return <Container sx={{mt:6}}><CircularProgress/></Container>

  if(!user) return (
    <Container sx={{mt:6}}>
      <Alert severity="info">Morate biti prijavljeni da vidite svoje termine.</Alert>
      <Button variant="contained" onClick={login} sx={{mt:2}}>Prijavi se</Button>
    </Container>
  )

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 8 }}>
      <Typography variant="h4" gutterBottom>Moji termini</Typography>
      {loading && (
        <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />
      )}
      {error && <Alert severity="error" sx={{ mb:2 }}>{error}</Alert>}

      {!loading && !error && (
        <TableContainer component={Paper} elevation={1}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Termin</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Vozilo</TableCell>
                <TableCell>Usluga</TableCell>
                <TableCell>Serviser</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {nalozi.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">Nemate rezerviranih termina.</TableCell>
                </TableRow>
              ) : (
                nalozi.map(n => (
                  <TableRow key={n.idNalog ?? n.id} hover>
                    <TableCell>{n.idNalog ?? n.id}</TableCell>
                    <TableCell>{formatDatetime(n.datumVrijemeTermin)}</TableCell>
                    <TableCell>{formatStatus(n.status)}</TableCell>
                    <TableCell>{n.vozilo?.registracija ? `${n.vozilo.registracija} — ${n.vozilo?.model?.markaNaziv || ''} ${n.vozilo?.model?.modelNaziv || ''}` : '-'}</TableCell>
                    <TableCell>{n.usluga?.uslugaNaziv || '-'}</TableCell>
                    <TableCell>{n.serviser ? `${n.serviser.imeServiser} ${n.serviser.prezimeServiser}` : '-'}</TableCell>
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

function formatStatus(s){
  // Map numeric status codes to human-friendly Croatian strings
  switch(s){
    case 0:
    case '0':
      return 'Čeka potvrdu servisera'
    case 1:
    case '1':
      return 'Servis preuzeo vozilo'
    case 2:
    case '2':
      return 'Servis gotov — čeka preuzimanje'
    case 3:
    case '3':
      return 'Klijent preuzeo vozilo'
    default:
      return String(s ?? '-')
  }
}
