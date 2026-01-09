import React, { useEffect, useState } from 'react'
import { Container, Typography, Box, Grid, TextField, Button, Checkbox, FormControlLabel, Table, TableHead, TableRow, TableCell, TableBody, Paper, TableContainer, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Alert, Snackbar } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import { postAdmin, postServiserAdmin, getServiseriAdmin, putServiserAdmin, getKlijentiAdmin, putKlijentAdmin, getNaloziAdmin, deleteNalogAdmin } from '../../services/api'

export default function Admin(){
  const { user, loading } = useAuth()
  const [serviseri, setServiseri] = useState([])
  const [klijenti, setKlijenti] = useState([])
  const [nalozi, setNalozi] = useState([])
  const [loadingData, setLoadingData] = useState(false)

  // forms
  const [adminForm, setAdminForm] = useState({ imeAdmin: '', prezimeAdmin: '', email: '' })
  const [serviserForm, setServiserForm] = useState({ imeServiser: '', prezimeServiser: '', email: '', voditeljServisa: false })

  // edit dialogs
  const [editServiser, setEditServiser] = useState(null)
  const [editKlijent, setEditKlijent] = useState(null)

  const [alert, setAlert] = useState({ open:false, message:'', severity:'success' })

  useEffect(()=>{ if(!loading) loadAll() },[loading])

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

  if(loading) return null
  const roles = user?.roles || (user?.role ? [user.role] : [])
  if(!user || !roles.includes('ROLE_ADMIN')) return (
    <Container sx={{ mt:6 }}>
      <Alert severity="error">Nedozvoljen pristup. Potreban je ADMIN račun.</Alert>
    </Container>
  )

  async function submitAdmin(e){
    e.preventDefault()
    try{
      await postAdmin(adminForm)
      setAlert({ open:true, message:'Administrator dodan', severity:'success' })
      setAdminForm({ imeAdmin:'', prezimeAdmin:'', email:'' })
    }catch(err){ setAlert({ open:true, message:err.message||'Greška', severity:'error' }) }
  }

  async function submitServiser(e){
    e.preventDefault()
    try{
      await postServiserAdmin(serviserForm)
      setAlert({ open:true, message:'Serviser dodan', severity:'success' })
      setServiserForm({ imeServiser:'', prezimeServiser:'', email:'', voditeljServisa:false })
      loadAll()
    }catch(err){ setAlert({ open:true, message:err.message||'Greška', severity:'error' }) }
  }

  async function saveServiserEdit(){
    try{
      await putServiserAdmin(editServiser.idServiser ?? editServiser.id, editServiser)
      setAlert({ open:true, message:'Serviser ažuriran', severity:'success' })
      setEditServiser(null)
      loadAll()
    }catch(err){ setAlert({ open:true, message:err.message||'Greška', severity:'error' }) }
  }

  async function saveKlijentEdit(){
    try{
      await putKlijentAdmin(editKlijent.idKlijent ?? editKlijent.id, editKlijent)
      setAlert({ open:true, message:'Klijent ažuriran', severity:'success' })
      setEditKlijent(null)
      loadAll()
    }catch(err){ setAlert({ open:true, message:err.message||'Greška', severity:'error' }) }
  }

  async function handleDeleteNalog(id){
    if(!confirm('Trajno obrisati nalog?')) return
    try{
      await deleteNalogAdmin(id)
      setAlert({ open:true, message:'Nalog obrisan', severity:'success' })
      loadAll()
    }catch(err){ setAlert({ open:true, message:err.message||'Greška', severity:'error' }) }
  }

  return (
    <Container maxWidth="lg" sx={{ mt:6, mb:8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" gutterBottom align="center">Admin</Typography>

      <Box sx={{ width: '100%', maxWidth: 1100 }}>
        <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p:2 }}>
            <Typography variant="h6" align="center">Kreiraj administratora</Typography>
            <Box component="form" onSubmit={submitAdmin} sx={{ mt:2, display:'flex', flexDirection:'column', alignItems:'center' }}>
              <Box sx={{ width: '100%', maxWidth: 420 }}>
                <TextField label="Ime" value={adminForm.imeAdmin} onChange={e=>setAdminForm({...adminForm, imeAdmin:e.target.value})} sx={{ mb:2 }} fullWidth />
                <TextField label="Prezime" value={adminForm.prezimeAdmin} onChange={e=>setAdminForm({...adminForm, prezimeAdmin:e.target.value})} sx={{ mb:2 }} fullWidth />
                <TextField label="Email" value={adminForm.email} onChange={e=>setAdminForm({...adminForm, email:e.target.value})} sx={{ mb:2 }} fullWidth />
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button type="submit" variant="contained">Kreiraj</Button>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p:2 }}>
            <Typography variant="h6" align="center">Dodaj servisera</Typography>
            <Box component="form" onSubmit={submitServiser} sx={{ mt:2, display:'flex', flexDirection:'column', alignItems:'center' }}>
              <Box sx={{ width: '100%', maxWidth: 420 }}>
                <TextField label="Ime" value={serviserForm.imeServiser} onChange={e=>setServiserForm({...serviserForm, imeServiser:e.target.value})} sx={{ mb:2 }} fullWidth />
                <TextField label="Prezime" value={serviserForm.prezimeServiser} onChange={e=>setServiserForm({...serviserForm, prezimeServiser:e.target.value})} sx={{ mb:2 }} fullWidth />
                <TextField label="Email" value={serviserForm.email} onChange={e=>setServiserForm({...serviserForm, email:e.target.value})} sx={{ mb:2 }} fullWidth />
                <FormControlLabel control={<Checkbox checked={serviserForm.voditeljServisa} onChange={e=>setServiserForm({...serviserForm, voditeljServisa:e.target.checked})} />} label="Voditelj servisa" />
                <Box sx={{ mt:2, display: 'flex', justifyContent: 'center' }}>
                  <Button type="submit" variant="contained">Dodaj</Button>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">Serviseri</Typography>
          {loadingData ? <CircularProgress /> : (
            <TableContainer component={Paper} sx={{ mt:1 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Ime</TableCell>
                    <TableCell>Prezime</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Voditelj</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {serviseri.map(s=> (
                    <TableRow key={s.idServiser ?? s.id} hover>
                      <TableCell>{s.idServiser ?? s.id}</TableCell>
                      <TableCell>{s.imeServiser}</TableCell>
                      <TableCell>{s.prezimeServiser}</TableCell>
                      <TableCell>{s.email}</TableCell>
                      <TableCell>{s.voditeljServisa ? 'Da' : 'Ne'}</TableCell>
                      <TableCell>
                        <Button size="small" onClick={()=>setEditServiser(s)}>Uredi</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">Klijenti</Typography>
          {loadingData ? <CircularProgress /> : (
            <TableContainer component={Paper} sx={{ mt:1 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Ime</TableCell>
                    <TableCell>Prezime</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {klijenti.map(k=> (
                    <TableRow key={k.idKlijent ?? k.id} hover>
                      <TableCell>{k.idKlijent ?? k.id}</TableCell>
                      <TableCell>{k.imeKlijent}</TableCell>
                      <TableCell>{k.prezimeKlijent}</TableCell>
                      <TableCell>{k.email}</TableCell>
                      <TableCell>
                        <Button size="small" onClick={()=>setEditKlijent(k)}>Uredi</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">Nalozi</Typography>
          {loadingData ? <CircularProgress /> : (
            <TableContainer component={Paper} sx={{ mt:1 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>DatumTermin</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Napomena</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {nalozi.map(n=> (
                    <TableRow key={n.idNalog ?? n.id} hover>
                      <TableCell>{n.idNalog ?? n.id}</TableCell>
                      <TableCell>{n.datumVrijemeTermin}</TableCell>
                      <TableCell>{n.status}</TableCell>
                      <TableCell>{n.napomena}</TableCell>
                      <TableCell>
                        <Button size="small" color="error" onClick={()=>handleDeleteNalog(n.idNalog ?? n.id)}>Obriši</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
        </Grid>
      </Box>

      <Dialog open={!!editServiser} onClose={()=>setEditServiser(null)} fullWidth>
        <DialogTitle>Uredi servisera</DialogTitle>
        <DialogContent>
          {editServiser && (
            <Box sx={{ mt:1 }}>
              <TextField fullWidth label="Ime" value={editServiser.imeServiser} onChange={e=>setEditServiser({...editServiser, imeServiser:e.target.value})} sx={{ mb:2 }} />
              <TextField fullWidth label="Prezime" value={editServiser.prezimeServiser} onChange={e=>setEditServiser({...editServiser, prezimeServiser:e.target.value})} sx={{ mb:2 }} />
              <TextField fullWidth label="Email" value={editServiser.email} onChange={e=>setEditServiser({...editServiser, email:e.target.value})} sx={{ mb:2 }} />
              <FormControlLabel control={<Checkbox checked={!!editServiser.voditeljServisa} onChange={e=>setEditServiser({...editServiser, voditeljServisa:e.target.checked})} />} label="Voditelj servisa" />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setEditServiser(null)}>Zatvori</Button>
          <Button onClick={saveServiserEdit} variant="contained">Spremi</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!editKlijent} onClose={()=>setEditKlijent(null)} fullWidth>
        <DialogTitle>Uredi klijenta</DialogTitle>
        <DialogContent>
          {editKlijent && (
            <Box sx={{ mt:1 }}>
              <TextField fullWidth label="Ime" value={editKlijent.imeKlijent} onChange={e=>setEditKlijent({...editKlijent, imeKlijent:e.target.value})} sx={{ mb:2 }} />
              <TextField fullWidth label="Prezime" value={editKlijent.prezimeKlijent} onChange={e=>setEditKlijent({...editKlijent, prezimeKlijent:e.target.value})} sx={{ mb:2 }} />
              <TextField fullWidth label="Email" value={editKlijent.email} onChange={e=>setEditKlijent({...editKlijent, email:e.target.value})} sx={{ mb:2 }} />
              <TextField fullWidth label="Slika URL" value={editKlijent.slikaUrl} onChange={e=>setEditKlijent({...editKlijent, slikaUrl:e.target.value})} sx={{ mb:2 }} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setEditKlijent(null)}>Zatvori</Button>
          <Button onClick={saveKlijentEdit} variant="contained">Spremi</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={alert.open} autoHideDuration={4000} onClose={()=>setAlert({...alert, open:false})} message={alert.message} />
    </Container>
  )
}
