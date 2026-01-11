import React, { useEffect, useState } from 'react'
import { Box, Typography, CircularProgress, Alert, Card, CardContent, Grid, Button } from '@mui/material'
import { formatDatetime } from '../../utils/date'
import { useAuth } from '../../context/AuthContext'
import { getNaloziByKlijent, downloadKlijentNalogPdf } from '../../services/api'

export default function MyAppointments(){
  const { user, login, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [nalozi, setNalozi] = useState([])
  const [predajProcessing, setPredajProcessing] = useState([])

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

  async function handlePredaj(id){
    if (predajProcessing.includes(id)) return
    setPredajProcessing(p=>[...p,id])
    try{
      const { blob, filename } = await downloadKlijentNalogPdf(id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename || `nalog_${id}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      setError(null)
      // refresh list from server (server now persists status=1)
      const data = await getNaloziByKlijent(user.id)
      setNalozi(Array.isArray(data) ? data : [])
    }catch(e){
      console.error(e)
      setError('Greška pri predaji vozila / preuzimanju PDF')
    }
    setPredajProcessing(p=>p.filter(x=>x!==id))
  }

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
                <Typography variant="subtitle1">Termin: {formatDatetime(n.datumVrijemeTermin)}</Typography>
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

                <Box sx={{ mt:1 }}>
                  { (n.status === 0 || n.status === '0') && (
                    <Button variant="contained" size="small" onClick={()=>handlePredaj(n.idNalog)} disabled={predajProcessing.includes(n.idNalog)}>Predaj vozilo i preuzmi PDF</Button>
                  ) }
                  { (n.status === 1 || n.status === '1') && (
                    <Typography variant="caption">Predano — čekanje potvrde servisera</Typography>
                  ) }
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
      return 'Termin potvrđen — čeka se dostava vozila'
    case 2:
    case '2':
      return 'Serviser preuzeo vozilo — radi se servis'
    case 3:
    case '3':
      return 'Servis gotov — čeka preuzimanje'
    case 4:
    case '4':
      return 'Klijent preuzeo vozilo'
    default:
      return String(s ?? '-')
  }
}
