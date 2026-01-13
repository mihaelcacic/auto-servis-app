import React, { useEffect, useState } from 'react'
import { Container, Typography, Box, TextField, Button, Checkbox, FormControlLabel, Table, TableHead, TableRow, TableCell, TableBody, Paper, TableContainer, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Alert, Snackbar } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import { postAdmin, postServiserAdmin, getServiseriAdmin, putServiserAdmin, getKlijentiAdmin, putKlijentAdmin, getNaloziAdmin, deleteNalogAdmin, downloadStatistika } from '../../services/api'
import { formatDatetime } from '../../utils/date'

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

  async function handleDownloadStats(format){
    try{
      const { blob, filename, contentType } = await downloadStatistika(format)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      // choose sensible default filename if backend doesn't provide one
      const ext = (format === 'xlsx') ? 'xlsx' : (format === 'xml' ? 'xml' : 'pdf')
      a.download = filename || `statistika.${ext}`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      setAlert({ open:true, message:`Preuzeto: statistika (${format})`, severity:'success' })
    }catch(err){ setAlert({ open:true, message:err.message||'Greška pri preuzimanju statistike', severity:'error' }) }
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
        Administracija
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
        {/* Statistika sekcija */}
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

        {/* Kreiraj administratora */}
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

        {/* Dodaj servisera */}
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

        {/* Serviseri tablica */}
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

        {/* Klijenti tablica */}
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

        {/* Nalozi tablica */}
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
                            <Button size="small" variant="outlined" color="error" onClick={()=>handleDeleteNalog(n.idNalog ?? n.id)}>
                              Obriši
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
      </Box>

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
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button onClick={()=>setEditServiser(null)}>Zatvori</Button>
          <Button onClick={saveServiserEdit} variant="contained">Spremi</Button>
        </DialogActions>
      </Dialog>

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
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button onClick={()=>setEditKlijent(null)}>Zatvori</Button>
          <Button onClick={saveKlijentEdit} variant="contained">Spremi</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={alert.open} autoHideDuration={4000} onClose={()=>setAlert({...alert, open:false})} message={alert.message} />
    </Container>
  )
}

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
