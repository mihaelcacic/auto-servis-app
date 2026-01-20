import React, { useEffect, useState } from 'react'
import { Box, Button, Paper, Typography, Alert, CircularProgress, Container } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import VehicleSelector from './VehicleSelector'
import ServiceSelector from './ServiceSelector'
import StaffSelector from './StaffSelector'
import ReplacementVehicleSelector from './ReplacementVehicleSelector'
import DateTimeField from './DateTimeField'
import { getMarke, getModelsByMarka, getUsluge, getServiseri, getZamjenskaSlobodna, getZauzetiTermini, postNalog } from '../../services/api'

export default function AppointmentForm(){
  const { user, loading: authLoading } = useAuth()
  const [marke, setMarke] = useState([])
  const [marka, setMarka] = useState('')
  const [models, setModels] = useState([])
  const [modelId, setModelId] = useState('')
  const [registracija, setRegistracija] = useState('')
  const [godina, setGodina] = useState('')
  const [usluge, setUsluge] = useState([])
  const [uslugaIds, setUslugaIds] = useState([])
  const [serviseri, setServiseri] = useState([])
  const [serviserId, setServiserId] = useState('')
  const [zamjenska, setZamjenska] = useState([])
  const [zamjenskoId, setZamjenskoId] = useState('')
  const [datumVrijeme, setDatumVrijeme] = useState('')
  const [zauzetiTermini, setZauzetiTermini] = useState([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(()=>{
    async function load(){
      try{
        const [m, u, s, z, zt] = await Promise.all([getMarke(), getUsluge(), getServiseri(), getZamjenskaSlobodna(), getZauzetiTermini()])
        setMarke(Array.isArray(m) ? m : [])
        setUsluge(Array.isArray(u) ? u : [])
        setServiseri(Array.isArray(s) ? s : [])
        setZamjenska(Array.isArray(z) ? z : [])
        setZauzetiTermini(Array.isArray(zt) ? zt : [])
      }catch(e){
        console.error(e)
        setError('Ne mogu dohvatiti podatke s poslužitelja')
      }
    }
    load()
  },[])

  useEffect(()=>{
    if(!marka) return
    let mounted = true
    setModels([])
    setModelId('')
    getModelsByMarka(marka).then(models => {
      if(mounted) setModels(Array.isArray(models) ? models : [])
    }).catch(e => {
      console.error(e)
      setError('Ne mogu dohvatiti modele za odabranu marku')
    })
    return ()=> mounted = false
  },[marka])

  const handleSubmit = async (e) =>{
    e.preventDefault()
    setError(null)
    setSuccess(null)
    // basic validation
      if(!registracija || !modelId || !godina || uslugaIds.length === 0 || !serviserId || !datumVrijeme){
      setError('Popunite sva obavezna polja')
      return
    }
    // registration must start with two letters (county code)
    // allow Unicode letters (š,ž,ć,č,đ etc.) using Unicode property escapes
    if (!/^\p{L}{2}/u.test(registracija)){
      setError('Unesite valjanu registraciju vozila')
      return
    }
    // validate date is not in the past
    const selectedDate = new Date(datumVrijeme)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    if(selectedDate < tomorrow){
      setError('Termin mora biti sutrašnji dan ili kasnije')
      return
    }

      const payload = {
          klijentId: 1,
          vozilo: {
              registracija,
              modelId: Number(modelId),
              godinaProizv: Number(godina)
          },
          uslugeIds: uslugaIds.map(Number), // ⬅️ BITNO
          serviserId: Number(serviserId),
          zamjenskoVoziloId: zamjenskoId ? Number(zamjenskoId) : null,
          datumVrijemeTermin: datumVrijeme,
          status: 0
      }


      try{
      setLoading(true)
      const res = await postNalog(payload)
      setSuccess(res && (res.message || 'Nalog uspješno kreiran'))
      // clear
      setRegistracija('')
      setGodina('')
      setDatumVrijeme('')
      setModelId('')
      setMarka('')
      setUslugaIds([])
      setServiserId('')
      setZamjenskoId('')
    }catch(err){
      console.error(err)
      setError(err.message || 'Greška pri kreiranju naloga')
    }finally{
      setLoading(false)
    }
  }

  // Check if user is logged in and has client role
  if (authLoading) {
    return (
      <Container sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    )
  }

  const roles = user?.roles || (user?.role ? [user.role] : [])
  const isClient = roles.includes('ROLE_KLIJENT')
  
  if (!user || !isClient) {
    return (
      <Container sx={{ mt: 6 }}>
        <Alert severity="error">Samo klijenti mogu rezervirati termine servisa.</Alert>
      </Container>
    )
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4, mb: 6 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Rezerviraj termin servisa</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <VehicleSelector
            registracija={registracija} setRegistracija={setRegistracija}
            godina={godina} setGodina={setGodina}
            marka={marka} setMarka={setMarka}
            marke={marke}
            modelId={modelId} setModelId={setModelId}
            models={models}
          />

            <ServiceSelector
                usluge={usluge}
                uslugaIds={uslugaIds}
                setUslugaIds={setUslugaIds}
            />

            <StaffSelector serviseri={serviseri} serviserId={serviserId} setServiserId={setServiserId} />

          <ReplacementVehicleSelector zamjenska={zamjenska} zamjenskoId={zamjenskoId} setZamjenskoId={setZamjenskoId} />

          <DateTimeField datumVrijeme={datumVrijeme} setDatumVrijeme={setDatumVrijeme} zauzetiTermini={zauzetiTermini} />

          <Box sx={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: 2, alignItems: 'center' }}>
            {loading ? <CircularProgress size={24} /> : <Button type="submit" variant="contained">Rezerviraj</Button>}
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}
