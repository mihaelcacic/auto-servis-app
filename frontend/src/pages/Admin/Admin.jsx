
import React, { useEffect, useState } from 'react'
import { Container, Typography, Box, TextField, Button, Checkbox, FormControlLabel, Table, TableHead, TableRow, TableCell, TableBody, Paper, TableContainer, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Alert, Snackbar, MenuItem, Select, FormControl, InputLabel } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import { postAdmin, postServiserAdmin, getServiseriAdmin, putServiserAdmin, getKlijentiAdmin, putKlijentAdmin, getNaloziAdmin, deleteNalogAdmin, putNalogAdmin, downloadStatistika, getMarke, getModelsByMarka, getUsluge, getServiseri, getZamjenskaSlobodna } from '../../services/api'
import { formatDatetime } from '../../utils/date'

export default function Admin(){
  const { user, loading } = useAuth()
  const [serviseri, setServiseri] = useState([])
  const [klijenti, setKlijenti] = useState([])
  const [nalozi, setNalozi] = useState([])
  const [loadingData, setLoadingData] = useState(false)

  // unosi forme
  const [adminForm, setAdminForm] = useState({ imeAdmin: '', prezimeAdmin: '', email: '' })
  const [serviserForm, setServiserForm] = useState({ imeServiser: '', prezimeServiser: '', email: '', voditeljServisa: false })

  // forme za uredjivanje servisera, klijenta i naloga
  const [editServiser, setEditServiser] = useState(null)
  const [editKlijent, setEditKlijent] = useState(null)
  const [editNalog, setEditNalog] = useState(null)
  const [originalNalog, setOriginalNalog] = useState(null)

  // podaci za uredjivanje naloga
  const [marke, setMarke] = useState([])
  const [models, setModels] = useState([])
  const [usluge, setUsluge] = useState([])
  const [serviseriForNalog, setServiseriForNalog] = useState([])
  const [zamjenskaVozila, setZamjenskaVozila] = useState([])

  const [alert, setAlert] = useState({ open:false, message:'', severity:'success' })

  useEffect(()=>{ if(!loading) loadAll() },[loading])

  // ucitavanje svih podataka
  async function loadAll(){
    setLoadingData(true)
    try{
      const s = await getServiseriAdmin()
      setServiseri(Array.isArray(s)?s:[])
    }catch(e){ }
    try{
      const k = await getKlijentiAdmin()
      setKlijenti(Array.isArray(k)?k:[])
    }catch(e){ }
    try{
      const n = await getNaloziAdmin()
      setNalozi(Array.isArray(n)?n:[])
    }catch(e){ }
    setLoadingData(false)
  }

  // provjera da li je korisnik ulogiran i da li ima ROLE_ADMIN
  if(loading) return null
  const roles = user?.roles || (user?.role ? [user.role] : [])
  if(!user || !roles.includes('ROLE_ADMIN')) return (
    <Container sx={{ mt:6 }}>
      <Alert severity="error">Nedozvoljen pristup. Potreban je ADMIN račun.</Alert>
    </Container>
  )

  // dodavanje administratora
  async function submitAdmin(e){
    e.preventDefault()
    try{
      await postAdmin(adminForm)
      setAlert({ open:true, message:'Administrator dodan', severity:'success' })
      setAdminForm({ imeAdmin:'', prezimeAdmin:'', email:'' })
    }catch(err){ setAlert({ open:true, message:err.message||'Greška', severity:'error' }) }
  }

  // dodavanje servisera
  async function submitServiser(e){
    e.preventDefault()
    try{
      await postServiserAdmin(serviserForm)
      setAlert({ open:true, message:'Serviser dodan', severity:'success' })
      setServiserForm({ imeServiser:'', prezimeServiser:'', email:'', voditeljServisa:false })
      loadAll()
    }catch(err){ setAlert({ open:true, message:err.message||'Greška', severity:'error' }) }
  }

  // spremanje uredjivanja servisera
  async function saveServiserEdit(){
    try{
      await putServiserAdmin(editServiser.idServiser ?? editServiser.id, editServiser)
      setAlert({ open:true, message:'Serviser ažuriran', severity:'success' })
      setEditServiser(null)
      loadAll()
    }catch(err){ setAlert({ open:true, message:err.message||'Greška', severity:'error' }) }
  }
  
  // spremanje uredjivanja klijenta
  async function saveKlijentEdit(){
    try{
      await putKlijentAdmin(editKlijent.idKlijent ?? editKlijent.id, editKlijent)
      setAlert({ open:true, message:'Klijent ažuriran', severity:'success' })
      setEditKlijent(null)
      loadAll()
    }catch(err){ setAlert({ open:true, message:err.message||'Greška', severity:'error' }) }
  }
  
  // brisanje naloga
  async function handleDeleteNalog(id){
    if(!confirm('Trajno obrisati nalog?')) return
    try{
      await deleteNalogAdmin(id)
      setAlert({ open:true, message:'Nalog obrisan', severity:'success' })
      loadAll()
    }catch(err){ setAlert({ open:true, message:err.message||'Greška', severity:'error' }) }
  }

  // ucitavanje podataka za uredjivanje naloga
  async function handleEditNalog(nalog){
    setOriginalNalog(nalog)
    
    // ucitavanje podataka za uredjivanje naloga
    try{
      const [m, u, s, z] = await Promise.all([
        getMarke(),
        getUsluge(),
        getServiseri(),
        getZamjenskaSlobodna()
      ])
      
      const markeArray = Array.isArray(m) ? m : []
      const uslugeArray = Array.isArray(u) ? u : []
      const serviseriArray = Array.isArray(s) ? s : []
      const zamjenskaArray = Array.isArray(z) ? z : []
      
      setMarke(markeArray)
      setUsluge(uslugeArray)
      setServiseriForNalog(serviseriArray)
      setZamjenskaVozila(zamjenskaArray)

      // hvatanje marki iz naloga - pokusaj sa svih mogućih naziva polja
      const marka = nalog.vozilo?.model?.markaNaziv || nalog.vozilo?.model?.marka || ''
      
      // ucitavanje modela za marku vozila
      let modelsArray = []
      if(marka){
        try {
          const modelsData = await getModelsByMarka(marka)
          modelsArray = Array.isArray(modelsData) ? modelsData : []
        } catch(e) {
          console.error('Error loading models:', e)
        }
      }
      setModels(modelsArray)

      // inicijalizacija forme za uredjivanje naloga
      const terminStr = nalog.datumVrijemeTermin 
        ? new Date(nalog.datumVrijemeTermin).toISOString().slice(0, 16)
        : ''
      
      // postavljanje podataka za uredjivanje naloga
      setEditNalog({
        datumVrijemeTermin: terminStr,
        vozilo: {
          registracija: nalog.vozilo?.registracija || '',
          modelId: nalog.vozilo?.model?.idModel || nalog.vozilo?.model?.id || '',
          godinaProizv: nalog.vozilo?.godinaProizv || ''
        },
        marka: marka,
        uslugeIds: nalog.usluge?.map(u => u.idUsluga || u.id) || [],
        serviserId: nalog.serviser?.idServiser || nalog.serviser?.id || '',
        zamjenskoVoziloId: nalog.zamjenskoVozilo?.idZamjVozilo || nalog.zamjenskoVozilo?.id || null,
        status: nalog.status || 0,
        napomena: nalog.napomena || ''
      })
    }catch(err){
      console.error('Error loading nalog edit data:', err)
      setAlert({ open:true, message:err.message||'Greška pri učitavanju podataka', severity:'error' })
    }
  }

  // ucitavanje modela za marku vozila
  useEffect(() => {
    if(editNalog?.marka){
      let mounted = true
      setModels([])
      getModelsByMarka(editNalog.marka).then(modelsData => {
        if(mounted) setModels(Array.isArray(modelsData) ? modelsData : [])
      }).catch(e => console.error(e))
      return () => { mounted = false }
    }
  }, [editNalog?.marka])

  // spremanje uredjivanja naloga
  async function saveNalogEdit(){
    if(!editNalog || !originalNalog) return

    try{
      // kreiranje payloada sa samo promjenjenim poljima
      const payload = {}
      const original = originalNalog

      // termin - samo poslati ako je promjenjen
      if(editNalog.datumVrijemeTermin){
        try {
          const newTermin = new Date(editNalog.datumVrijemeTermin)
          if(isNaN(newTermin.getTime())){
            throw new Error('Nevažeći datum i vrijeme')
          }
          const originalTermin = original.datumVrijemeTermin ? new Date(original.datumVrijemeTermin) : null
          if(originalTermin && newTermin.getTime() === originalTermin.getTime()){
            // nije promjenjen, preskoci
          } else {
            payload.datumVrijemeTermin = newTermin.toISOString()
          }
        } catch(e) {
          throw new Error('Nevažeći format datuma i vremena: ' + e.message)
        }
      }

      // vozilo - samo poslati ako je promjenjen
      const origVozilo = original.vozilo
      const origRegistracija = origVozilo?.registracija || ''
      const origModelId = origVozilo?.model?.idModel || origVozilo?.model?.id || null
      const origGodina = origVozilo?.godinaProizv || null
      
      const newRegistracija = (editNalog.vozilo?.registracija || '').trim()
      const newModelId = editNalog.vozilo?.modelId || null
      const newGodina = editNalog.vozilo?.godinaProizv || null
      
      const voziloChanged = origRegistracija !== newRegistracija ||
                           origModelId !== newModelId ||
                           origGodina !== newGodina
      
      if(voziloChanged){
        // samo ukljuciti polja koja su postavljena
        const voziloObj = {}
        if(newRegistracija) {
          voziloObj.registracija = newRegistracija
        }
        if(newModelId) {
          voziloObj.modelId = newModelId
        }
        if(newGodina) {
          voziloObj.godinaProizv = newGodina
        }
        
        // samo poslati vozilo ako ima barem jedno polje
        if(Object.keys(voziloObj).length > 0){
          payload.vozilo = voziloObj
        }
      }

      // usluge - samo poslati ako je promjenjen
      const origUslugeIds = (original.usluge || []).map(u => u.idUsluga || u.id).sort()
      const newUslugeIds = (editNalog.uslugeIds || []).slice().sort()
      const uslugeChanged = JSON.stringify(origUslugeIds) !== JSON.stringify(newUslugeIds)
      
      if(uslugeChanged){
        // poslati null ako je prazno, inace saljemo array
        payload.uslugeIds = newUslugeIds.length > 0 ? newUslugeIds : null
      }

      // serviser - samo poslati ako je promjenjen
      const origServiserId = original.serviser?.idServiser || original.serviser?.id || null
      const newServiserId = editNalog.serviserId || null
      if(origServiserId !== newServiserId){
        payload.serviserId = newServiserId
      }

      // zamjensko vozilo - samo poslati ako je promjenjeno
      const origZamjId = original.zamjenskoVozilo?.idZamjVozilo || original.zamjenskoVozilo?.id || null
      const newZamjId = editNalog.zamjenskoVoziloId === '' || editNalog.zamjenskoVoziloId === null ? null : editNalog.zamjenskoVoziloId
      if(origZamjId !== newZamjId){
        payload.zamjenskoVoziloId = newZamjId
      }

      // status - samo poslati ako je promjenjen
      const origStatus = original.status || 0
      const newStatus = editNalog.status || 0
      if(origStatus !== newStatus){
        payload.status = newStatus
      }

      // napomena - samo poslati ako je promjenjena
      const origNapomena = original.napomena || ''
      const newNapomena = editNalog.napomena || ''
      if(origNapomena !== newNapomena){
        payload.napomena = newNapomena || null
      }

      // samo poslati ako ima promjena
      if(Object.keys(payload).length === 0){
        setAlert({ open:true, message:'Nema promjena za spremanje', severity:'info' })
        setEditNalog(null)
        setOriginalNalog(null)
        return
      }

      console.log('Sending payload:', payload)
      await putNalogAdmin(original.idNalog || original.id, payload)
      setAlert({ open:true, message:'Nalog ažuriran', severity:'success' })
      setEditNalog(null)
      setOriginalNalog(null)
      loadAll()
    }catch(err){
      console.error('Error saving nalog:', err)
      setAlert({ open:true, message:err.message||'Greška pri spremanju naloga', severity:'error' })
    }
  }

  // preuzimanje statistike
  async function handleDownloadStats(format){
    try{
      const { blob, filename, contentType } = await downloadStatistika(format)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      // odaberi smislen default naziv file-a
      const ext = (format === 'xlsx') ? 'xlsx' : (format === 'xml' ? 'xml' : 'pdf')
      a.download = filename || `statistika.${ext}`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      setAlert({ open:true, message:`Preuzeto: statistika (${format})`, severity:'success' })
    }catch(err){ setAlert({ open:true, message:err.message||'Greška pri preuzimanju statistike', severity:'error' }) }
  }

  // prikaz stranice - admin dashboard
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
        Administracija
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
        {/* sekcija za statistiku */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, width: '100%', maxWidth: 900 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 500 }}>
            Preuzmi statistiku
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button variant="contained" color="primary" onClick={()=>handleDownloadStats('pdf')}>
              Preuzmi PDF
            </Button>
            <Button variant="contained" color="primary" onClick={()=>handleDownloadStats('xlsx')}>
              Preuzmi XLSX
            </Button>
            <Button variant="contained" color="primary" onClick={()=>handleDownloadStats('xml')}>
              Preuzmi XML
            </Button>
          </Box>
        </Paper>

        {/* dodavanje administratora */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, width: '100%', maxWidth: 900 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 500 }}>
            Kreiraj administratora
          </Typography>
          <Box component="form" onSubmit={submitAdmin}>
            <TextField 
              label="Ime" 
              value={adminForm.imeAdmin} 
              onChange={e=>setAdminForm({...adminForm, imeAdmin:e.target.value})} 
              sx={{ mb: 2 }} 
              fullWidth 
              variant="outlined"
            />
            <TextField 
              label="Prezime" 
              value={adminForm.prezimeAdmin} 
              onChange={e=>setAdminForm({...adminForm, prezimeAdmin:e.target.value})} 
              sx={{ mb: 2 }} 
              fullWidth 
              variant="outlined"
            />
            <TextField 
              label="Email" 
              type="email"
              value={adminForm.email} 
              onChange={e=>setAdminForm({...adminForm, email:e.target.value})} 
              sx={{ mb: 3 }} 
              fullWidth 
              variant="outlined"
            />
            <Button type="submit" variant="contained" fullWidth size="large">
              Kreiraj administratora
            </Button>
          </Box>
        </Paper>

        {/* dodavanje servisera */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, width: '100%', maxWidth: 900 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 500 }}>
            Dodaj servisera
          </Typography>
          <Box component="form" onSubmit={submitServiser}>
            <TextField 
              label="Ime" 
              value={serviserForm.imeServiser} 
              onChange={e=>setServiserForm({...serviserForm, imeServiser:e.target.value})} 
              sx={{ mb: 2 }} 
              fullWidth 
              variant="outlined"
            />
            <TextField 
              label="Prezime" 
              value={serviserForm.prezimeServiser} 
              onChange={e=>setServiserForm({...serviserForm, prezimeServiser:e.target.value})} 
              sx={{ mb: 2 }} 
              fullWidth 
              variant="outlined"
            />
            <TextField 
              label="Email" 
              type="email"
              value={serviserForm.email} 
              onChange={e=>setServiserForm({...serviserForm, email:e.target.value})} 
              sx={{ mb: 2 }} 
              fullWidth 
              variant="outlined"
            />
            <FormControlLabel 
              control={
                <Checkbox 
                  checked={serviserForm.voditeljServisa} 
                  onChange={e=>setServiserForm({...serviserForm, voditeljServisa:e.target.checked})} 
                />
              } 
              label="Voditelj servisa" 
              sx={{ mb: 3 }}
            />
            <Button type="submit" variant="contained" fullWidth size="large">
              Dodaj servisera
            </Button>
          </Box>
        </Paper>

        {/* tablica za servisere */}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden', width: '100%', maxWidth: 900 }}>
          <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              Serviseri
            </Typography>
          </Box>
            {loadingData ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.100' }}>
                      <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Ime</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Prezime</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Voditelj</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">Akcije</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {serviseri.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">Nema servisera</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      serviseri.map(s=> (
                        <TableRow key={s.idServiser ?? s.id} hover>
                          <TableCell>{s.idServiser ?? s.id}</TableCell>
                          <TableCell>{s.imeServiser}</TableCell>
                          <TableCell>{s.prezimeServiser}</TableCell>
                          <TableCell>{s.email}</TableCell>
                          <TableCell>{s.voditeljServisa ? 'Da' : 'Ne'}</TableCell>
                          <TableCell align="right">
                            <Button size="small" variant="outlined" onClick={()=>setEditServiser(s)}>
                              Uredi
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
        </Paper>

        {/* tablica za klijente */}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden', width: '100%', maxWidth: 900 }}>
          <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              Klijenti
            </Typography>
          </Box>
            {loadingData ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.100' }}>
                      <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Ime</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Prezime</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">Akcije</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {klijenti.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">Nema klijenata</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      klijenti.map(k=> (
                        <TableRow key={k.idKlijent ?? k.id} hover>
                          <TableCell>{k.idKlijent ?? k.id}</TableCell>
                          <TableCell>{k.imeKlijent}</TableCell>
                          <TableCell>{k.prezimeKlijent}</TableCell>
                          <TableCell>{k.email}</TableCell>
                          <TableCell align="right">
                            <Button size="small" variant="outlined" onClick={()=>setEditKlijent(k)}>
                              Uredi
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
        </Paper>

        {/* tablica za naloge */}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden', width: '100%', maxWidth: 900 }}>
          <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              Nalozi
            </Typography>
          </Box>
            {loadingData ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.100' }}>
                      <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Datum i vrijeme termina</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Napomena</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">Akcije</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {nalozi.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">Nema naloga</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      nalozi.map(n=> (
                        <TableRow key={n.idNalog ?? n.id} hover>
                          <TableCell>{n.idNalog ?? n.id}</TableCell>
                          <TableCell>{formatDatetime(n.datumVrijemeTermin)}</TableCell>
                          <TableCell>{formatStatus(n.status)}</TableCell>
                          <TableCell>{n.napomena || '-'}</TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                              <Button size="small" variant="outlined" onClick={()=>handleEditNalog(n)}>
                                Uredi
                              </Button>
                              <Button size="small" variant="outlined" color="error" onClick={()=>handleDeleteNalog(n.idNalog ?? n.id)}>
                                Obriši
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
        </Paper>
      </Box>

      {/* dijalog za uredjivanje servisera */}
      <Dialog open={!!editServiser} onClose={()=>setEditServiser(null)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ pb: 1, fontWeight: 600 }}>Uredi servisera</DialogTitle>
        <DialogContent>
          {editServiser && (
            <Box sx={{ mt: 2 }}>
              <TextField 
                fullWidth 
                label="Ime" 
                value={editServiser.imeServiser} 
                onChange={e=>setEditServiser({...editServiser, imeServiser:e.target.value})} 
                sx={{ mb: 2 }} 
                variant="outlined"
              />
              <TextField 
                fullWidth 
                label="Prezime" 
                value={editServiser.prezimeServiser} 
                onChange={e=>setEditServiser({...editServiser, prezimeServiser:e.target.value})} 
                sx={{ mb: 2 }} 
                variant="outlined"
              />
              <TextField 
                fullWidth 
                label="Email" 
                type="email"
                value={editServiser.email} 
                onChange={e=>setEditServiser({...editServiser, email:e.target.value})} 
                sx={{ mb: 2 }} 
                variant="outlined"
              />
              <FormControlLabel 
                control={
                  <Checkbox 
                    checked={!!editServiser.voditeljServisa} 
                    onChange={e=>setEditServiser({...editServiser, voditeljServisa:e.target.checked})} 
                  />
                } 
                label="Voditelj servisa" 
              />
            </Box>
          )}
        </DialogContent>
        {/* akcije za uredjivanje servisera */}
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button onClick={()=>setEditServiser(null)}>Zatvori</Button>
          <Button onClick={saveServiserEdit} variant="contained">Spremi</Button>
        </DialogActions>
      </Dialog>

      {/* dijalog za uredjivanje klijenta */}
      <Dialog open={!!editKlijent} onClose={()=>setEditKlijent(null)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ pb: 1, fontWeight: 600 }}>Uredi klijenta</DialogTitle>
        <DialogContent>
          {editKlijent && (
            <Box sx={{ mt: 2 }}>
              <TextField 
                fullWidth 
                label="Ime" 
                value={editKlijent.imeKlijent} 
                onChange={e=>setEditKlijent({...editKlijent, imeKlijent:e.target.value})} 
                sx={{ mb: 2 }} 
                variant="outlined"
              />
              <TextField 
                fullWidth 
                label="Prezime" 
                value={editKlijent.prezimeKlijent} 
                onChange={e=>setEditKlijent({...editKlijent, prezimeKlijent:e.target.value})} 
                sx={{ mb: 2 }} 
                variant="outlined"
              />
              <TextField 
                fullWidth 
                label="Email" 
                type="email"
                value={editKlijent.email} 
                onChange={e=>setEditKlijent({...editKlijent, email:e.target.value})} 
                sx={{ mb: 2 }} 
                variant="outlined"
              />
              <TextField 
                fullWidth 
                label="Slika URL" 
                value={editKlijent.slikaUrl || ''} 
                onChange={e=>setEditKlijent({...editKlijent, slikaUrl:e.target.value})} 
                variant="outlined"
              />
            </Box>
          )}
        </DialogContent>
        {/* akcije za uredjivanje klijenta */}
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button onClick={()=>setEditKlijent(null)}>Zatvori</Button>
          <Button onClick={saveKlijentEdit} variant="contained">Spremi</Button>
        </DialogActions>
      </Dialog>
      {/* uredjivanje naloga */}
      <Dialog open={!!editNalog} onClose={()=>{setEditNalog(null); setOriginalNalog(null)}} fullWidth maxWidth="md">
        <DialogTitle sx={{ pb: 1, fontWeight: 600 }}>Uredi nalog</DialogTitle>
        <DialogContent>
          {editNalog && (
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Datum i vrijeme termina"
                type="datetime-local"
                value={editNalog.datumVrijemeTermin}
                onChange={e=>setEditNalog({...editNalog, datumVrijemeTermin: e.target.value})}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
              {/* marka vozila */}
              <FormControl fullWidth>
                <InputLabel>Marka</InputLabel>
                <Select
                  value={editNalog.marka || ''}
                  onChange={e=>{
                    setEditNalog({
                      ...editNalog,
                      marka: e.target.value,
                      vozilo: {...editNalog.vozilo, modelId: ''}
                    })
                  }}
                  label="Marka"
                >
                  {marke.map(m => (
                    <MenuItem key={m} value={m}>{m}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Model</InputLabel>
                <Select
                  value={editNalog.vozilo?.modelId || ''}
                  onChange={e=>setEditNalog({
                    ...editNalog,
                    vozilo: {...editNalog.vozilo, modelId: e.target.value}
                  })}
                  label="Model"
                  disabled={!editNalog.marka}
                >
                  {models.map(m => (
                    <MenuItem key={m.idModel || m.id} value={m.idModel || m.id}>
                      {m.modelNaziv || m.nazivModela || m.naziv || 'N/A'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* registracija vozila */}
              <TextField
                fullWidth
                label="Registracija"
                value={editNalog.vozilo?.registracija || ''}
                onChange={e=>setEditNalog({
                  ...editNalog,
                  vozilo: {...editNalog.vozilo, registracija: e.target.value}
                })}
                variant="outlined"
              />
              {/* godina proizvodnje vozila */}
              <TextField
                fullWidth
                label="Godina proizvodnje"
                type="number"
                value={editNalog.vozilo?.godinaProizv || ''}
                onChange={e=>setEditNalog({
                  ...editNalog,
                  vozilo: {...editNalog.vozilo, godinaProizv: parseInt(e.target.value) || ''}
                })}
                variant="outlined"
              />
              {/* usluge */}
              <FormControl fullWidth>
                <InputLabel>Usluge</InputLabel>
                <Select
                  multiple
                  value={editNalog.uslugeIds || []}
                  onChange={e=>setEditNalog({...editNalog, uslugeIds: e.target.value})}
                  label="Usluge"
                  renderValue={(selected) => {
                    const selectedUsluge = usluge.filter(u => selected.includes(u.idUsluga || u.id))
                    return selectedUsluge.map(u => u.uslugaNaziv || u.nazivUsluga || u.naziv || 'N/A').join(', ')
                  }}
                >
                  {usluge.map(u => (
                    <MenuItem key={u.idUsluga || u.id} value={u.idUsluga || u.id}>
                      {u.uslugaNaziv || u.nazivUsluga || u.naziv || 'N/A'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* serviser */}
              <FormControl fullWidth>
                <InputLabel>Serviser</InputLabel>
                <Select
                  value={editNalog.serviserId || ''}
                  onChange={e=>setEditNalog({...editNalog, serviserId: e.target.value})}
                  label="Serviser"
                >
                  {serviseriForNalog.map(s => (
                    <MenuItem key={s.idServiser || s.id} value={s.idServiser || s.id}>
                      {s.imeServiser} {s.prezimeServiser}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* zamjensko vozilo */}
              <FormControl fullWidth>
                <InputLabel>Zamjensko vozilo (opcionalno)</InputLabel>
                <Select
                  value={editNalog.zamjenskoVoziloId || ''}
                  onChange={e=>{
                    const val = e.target.value
                    setEditNalog({...editNalog, zamjenskoVoziloId: val === '' ? null : val})
                  }}
                  label="Zamjensko vozilo (opcionalno)"
                >
                  <MenuItem value="">Nema zamjenskog vozila</MenuItem>
                  {zamjenskaVozila.map(z => {
                    const model = z.model
                    const modelNaziv = model?.modelNaziv || model?.nazivModela || model?.naziv || 'N/A'
                    const markaNaziv = model?.markaNaziv || model?.marka || ''
                    const displayName = markaNaziv ? `${markaNaziv} ${modelNaziv}` : modelNaziv
                    return (
                      <MenuItem key={z.idZamjVozilo || z.id} value={z.idZamjVozilo || z.id}>
                        {displayName}
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
              {/* status */}
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={editNalog.status ?? 0}
                  onChange={e=>setEditNalog({...editNalog, status: parseInt(e.target.value)})}
                  label="Status"
                >
                  <MenuItem value={0}>Čeka potvrdu servisera</MenuItem>
                  <MenuItem value={1}>Servis u tijeku</MenuItem>
                  <MenuItem value={2}>Servis završen</MenuItem>
                </Select>
              </FormControl>
              {/* napomena */}
              <TextField
                fullWidth
                label="Napomena"
                multiline
                rows={3}
                value={editNalog.napomena || ''}
                onChange={e=>setEditNalog({...editNalog, napomena: e.target.value})}
                variant="outlined"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button onClick={()=>{setEditNalog(null); setOriginalNalog(null)}}>Zatvori</Button>
          <Button onClick={saveNalogEdit} variant="contained">Spremi</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={alert.open} autoHideDuration={4000} onClose={()=>setAlert({...alert, open:false})} message={alert.message} />
    </Container>
  )
}

// formatiranje statusa
function formatStatus(s){
  switch(s){
    case 0:
    case '0':
      return 'Čeka potvrdu servisera'
    case 1:
    case '1':
      return 'Servis u tijeku'
    case 2:
    case '2':
      return 'Servis završen'
    default:
      return String(s ?? '-')
  }
}
