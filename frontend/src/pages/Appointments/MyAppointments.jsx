import React, { useEffect, useState } from 'react'
import { Box, Typography, CircularProgress, Alert, Card, CardContent, Grid, Button } from '@mui/material'
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
    setLoading(true)
    getNaloziByKlijent(user.id).then(data => {
      if(!mounted) return
      setNalozi(Array.isArray(data) ? data : [])
    }).catch(e => {
      console.error(e)
      setError('Ne mogu dohvatiti vaše termine')
    }).finally(()=> mounted && setLoading(false))
    return ()=> mounted = false
  },[user, authLoading])

  if(authLoading) return <Box sx={{p:3}}><CircularProgress/></Box>

  if(!user) return (
    <Box sx={{p:3}}>
      <Alert severity="info">Morate biti prijavljeni da vidite svoje termine.</Alert>
      <Box sx={{mt:2}}>
        <Button variant="contained" onClick={login}>Prijavi se</Button>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Moji termini</Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error" sx={{ mb:2 }}>{error}</Alert>}

      {!loading && !nalozi.length && <Alert severity="info">Nemate rezerviranih termina.</Alert>}

      <Grid container spacing={2} sx={{ mt: 1 }}>
        {nalozi.map(n => (
          <Grid item xs={12} md={6} key={n.idNalog}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1">Termin: {n.datumVrijemeTermin}</Typography>
                <Typography variant="body2" color="text.secondary">Status: {formatStatus(n.status)}</Typography>

                <Box sx={{ mt:1 }}>
                  <Typography variant="subtitle2">Vozilo</Typography>
                  <Typography>{n.vozilo?.registracija} — {n.vozilo?.model?.markaNaziv} {n.vozilo?.model?.modelNaziv}</Typography>
                </Box>

                <Box sx={{ mt:1 }}>
                  <Typography variant="subtitle2">Usluga</Typography>
                  <Typography>{n.usluga?.uslugaNaziv || '-'}</Typography>
                </Box>

                <Box sx={{ mt:1 }}>
                  <Typography variant="subtitle2">Serviser</Typography>
                  <Typography>{n.serviser ? `${n.serviser.imeServiser} ${n.serviser.prezimeServiser}` : '-'}</Typography>
                </Box>

              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
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
      return 'Na popravku'
    case 2:
    case '2':
      return 'Popravljen, spreman za preuzimanje'
    default:
      return String(s ?? '-')
  }
}
