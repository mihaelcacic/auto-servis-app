import React, { useEffect, useState } from 'react'
import { Container, Typography, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, CircularProgress, Alert, Snackbar, Box, Grid } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import { getMyNalozi, putNalogStatusServiser, putNalogNapomenaServiser, putNalogTerminServiser, downloadServiserNalogPdf, downloadServiserPredajaPdf, notifyServisZavrsen, getPotvrdaOPreuzimanjuWithEmail, getPotvrdaOPredajiWithEmail } from '../../services/api'
import { formatDatetime } from '../../utils/date'

export default function ServiserDashboard(){
  const { user, loading } = useAuth()
  const [nalozi, setNalozi] = useState([])
  const [loadingData, setLoadingData] = useState(false)
  const [processingIds, setProcessingIds] = useState([])
  const [editNapomena, setEditNapomena] = useState(null)
  const [editTermin, setEditTermin] = useState(null)
  const [alert, setAlert] = useState({ open:false, message:'', severity:'success' })
  const [expandedRows, setExpandedRows] = useState(new Set())

  useEffect(()=>{ if(!loading) load() },[loading])

  async function load(){
    setLoadingData(true)
    try{
      const r = await getMyNalozi()
      setNalozi(Array.isArray(r)?r:[])
    }catch(e){}
    setLoadingData(false)
  }

  if(loading) return null
  const roles = user?.roles || (user?.role ? [user.role] : [])
  if(!user || !roles.includes('ROLE_SERVISER')) return (
    <Container sx={{ mt:6 }}>
      <Alert severity="error">Nedozvoljen pristup. Potreban je SERVISER račun.</Alert>
    </Container>
  )

  async function changeStatus(id, status){
    try{
      await putNalogStatusServiser(id, status)
      setAlert({ open:true, message:'Status ažuriran', severity:'success' })
      load()
    }catch(e){ setAlert({ open:true, message:e.message||'Greška', severity:'error' }) }
  }

  async function takeVehicleFromClient(id){
    if (processingIds.includes(id)) return
    setProcessingIds(ids=>[...ids, id])
    try{
      // dobivanje potvrde o predaji vozila klijenta
      const { blob, filename } = await getPotvrdaOPredajiWithEmail(id)
      // preuzimanje PDF-a lokalno
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename || `predaja_${id}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      setAlert({ open:true, message:'Potvrđeno da je klijent predao vozilo - mail s PDF-om poslan klijentu', severity:'success' })
      await load()
    }catch(e){ 
      console.error('Greška u takeVehicleFromClient:', e)
      setAlert({ open:true, message:e.message||'Greška', severity:'error' }) 
    }
    setProcessingIds(ids=>ids.filter(x=>x!==id))
  }

  async function downloadPredajaPdf(id){
    if (processingIds.includes(id)) return
    setProcessingIds(ids=>[...ids, id])
    try{
      // preuzimanje PDF-a - endpoint NE mijenja status
      const { blob, filename } = await downloadServiserPredajaPdf(id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename || `predaja_${id}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      setAlert({ open:true, message:'PDF preuzet', severity:'success' })
    }catch(e){ 
      setAlert({ open:true, message:e.message||'Greška pri preuzimanju PDF-a', severity:'error' })
    }
    setProcessingIds(ids=>ids.filter(x=>x!==id))
  }

  async function finishService(id){
    if (processingIds.includes(id)) return
    setProcessingIds(ids=>[...ids, id])
    try{
      // samo poslati email klijentu - NE mijenja status
      // status ostaje 1 dok klijent ne potvrdi preuzimanje vozila
      await notifyServisZavrsen(id)
      // dodati napomenu u nalog
      const nalog = nalozi.find(n => (n.idNalog ?? n.id) === id)
      const currentNapomena = nalog?.napomena || ''
      const newNapomena = currentNapomena 
        ? `${currentNapomena}\nServis gotov, klijent obaviješten`
        : 'Servis gotov, klijent obaviješten'
      await putNalogNapomenaServiser(id, newNapomena)
      setAlert({ open:true, message:'Mail poslan klijentu o završetku servisa', severity:'success' })
      await load()
    }catch(e){ setAlert({ open:true, message:e.message||'Greška', severity:'error' }) }
    setProcessingIds(ids=>ids.filter(x=>x!==id))
  }

  async function confirmClientPickup(id){
    if (processingIds.includes(id)) return
    setProcessingIds(ids=>[...ids, id])
    try{
      // dobivanje potvrde o preuzimanju vozila klijenta
      const { blob, filename } = await getPotvrdaOPreuzimanjuWithEmail(id)
      // preuzimanje PDF-a lokalno
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename || `preuzimanje_${id}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      setAlert({ open:true, message:'Potvrđeno da je klijent preuzeo vozilo - mail s PDF-om poslan klijentu', severity:'success' })
      await load()
    }catch(e){ 
      console.error('Error in confirmClientPickup:', e)
      setAlert({ open:true, message:e.message||'Greška', severity:'error' }) 
    }
    setProcessingIds(ids=>ids.filter(x=>x!==id))
  }

  async function downloadPreuzimanjePdf(id){
    if (processingIds.includes(id)) return
    setProcessingIds(ids=>[...ids, id])
    try{
      // preuzimanje PDF-a - NE mijenja status
      const { blob, filename } = await downloadServiserNalogPdf(id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename || `preuzimanje_${id}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      setAlert({ open:true, message:'PDF preuzet', severity:'success' })
    }catch(e){ 
      setAlert({ open:true, message:e.message||'Greška pri preuzimanju PDF-a', severity:'error' })
    }
    setProcessingIds(ids=>ids.filter(x=>x!==id))
  }

  async function finishAndDownload(id){
    if (processingIds.includes(id)) return
    setProcessingIds(ids=>[...ids, id])
    try{
      // prvo zatražiti server da postavi status = 3
      await putNalogStatusServiser(id, 3)
      // zatim preuzeti generirani PDF
      const { blob, filename } = await downloadServiserNalogPdf(id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename || `nalog_${id}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      setAlert({ open:true, message:'PDF preuzet i nalog označen kao završen', severity:'success' })
      await load()
    }catch(e){ setAlert({ open:true, message:e.message||'Greška pri dovršetku servisa', severity:'error' }) }
    setProcessingIds(ids=>ids.filter(x=>x!==id))
  }

  async function predajaAndDownload(id){ // preuzimanje PDF-a - potvrde o predaji vozila klijenta
    if (processingIds.includes(id)) return
    setProcessingIds(ids=>[...ids, id])
    try{
      const { blob, filename } = await downloadServiserPredajaPdf(id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename || `predaja_${id}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      setAlert({ open:true, message:'Predaja PDF preuzet', severity:'success' })
      await load()
    }catch(e){ setAlert({ open:true, message:e.message||'Greška pri preuzimanju predaje', severity:'error' }) }
    setProcessingIds(ids=>ids.filter(x=>x!==id))
  }


  async function saveNapomena(){ // ažuriranje napomene u nalogu
    try{
      await putNalogNapomenaServiser(editNapomena.idNalog ?? editNapomena.id, editNapomena.napomena)
      setAlert({ open:true, message:'Napomena ažurirana', severity:'success' })
      setEditNapomena(null)
      load()
    }catch(e){ setAlert({ open:true, message:e.message||'Greška', severity:'error' }) }
  }

  async function saveTermin(){ // ažuriranje termina u nalogu
    if(!editTermin || !editTermin.noviTermin) return
    try{
      // provjeriti da datum nije u prošlosti
      const selectedDate = new Date(editTermin.noviTermin)
      const now = new Date()
      if(selectedDate < now){
        setAlert({ open:true, message:'Termin ne može biti u prošlosti', severity:'error' })
        return
      }
      
      // provjeriti da minute su 0 ili 30
      const [datePart, timePart] = editTermin.noviTermin.split('T')
      if(timePart){
        const minutes = parseInt(timePart.split(':')[1])
        if(minutes !== 0 && minutes !== 30){
          setAlert({ open:true, message:'Termin mora biti u razmaku od 30 minuta (npr. 19:00 ili 19:30)', severity:'error' })
          return
        }
      }
      
      await putNalogTerminServiser(editTermin.idNalog ?? editTermin.id, editTermin.noviTermin)
      setAlert({ open:true, message:'Termin ažuriran', severity:'success' })
      setEditTermin(null)
      load()
    }catch(e){ setAlert({ open:true, message:e.message||'Greška', severity:'error' }) }
  }

  function formatStatus(s){ // formatiranje statusa
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

  // prikaz stranice za servisera
  return (
    <Container maxWidth="xl" sx={{ mt:6, mb:8 }}>
      <Typography variant="h4" gutterBottom>Moji nalozi</Typography>
      {loadingData ? <CircularProgress /> : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Termin</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Napomena</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {nalozi.map(n=> {
                const nalogId = n.idNalog ?? n.id
                return (
                <React.Fragment key={nalogId}>
                <TableRow hover>
                  <TableCell>{nalogId}</TableCell>
                  <TableCell>{formatDatetime(n.datumVrijemeTermin)}</TableCell>
                  <TableCell>{formatStatus(n.status)}</TableCell>
                  <TableCell>{n.napomena || '-'}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button size="small" onClick={()=>setEditNapomena(n)}>Uredi napomenu</Button>
                        <Button 
                          size="small" 
                          onClick={()=>setEditTermin(n)}
                          disabled={(n.status === 1 || n.status === '1') || (n.status === 2 || n.status === '2')}
                        >
                          Promijeni termin
                        </Button>
                      </Box>

                      {/* akcije - mijenjanje statusa */}
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                        { (n.status === 0 || n.status === '0') && (
                          <Button size="small" variant="contained" color="success" disabled={processingIds.includes(n.idNalog ?? n.id)} onClick={()=>takeVehicleFromClient(n.idNalog ?? n.id)}>Potvrdi da je klijent predao vozilo</Button>
                        ) }

                        { (n.status === 1 || n.status === '1') && (
                          <>
                            <Button size="small" variant="contained" color="primary" disabled={processingIds.includes(n.idNalog ?? n.id)} onClick={()=>finishService(n.idNalog ?? n.id)}>Servis završio</Button>
                            <Button size="small" variant="contained" color="success" disabled={processingIds.includes(n.idNalog ?? n.id)} onClick={()=>confirmClientPickup(n.idNalog ?? n.id)}>Potvrdi da je klijent preuzeo vozilo</Button>
                          </>
                        ) }

                        { (n.status === 2 || n.status === '2') && (
                          <Button size="small" disabled>Završeno</Button>
                        ) }
                      </Box>

                      {/* pdf preuzimanja - odvojeno od akcija */}
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                        { ((n.status === 0 || n.status === '0') || (n.status === 1 || n.status === '1') || (n.status === 2 || n.status === '2')) && (
                          <Button size="small" variant="outlined" disabled={processingIds.includes(n.idNalog ?? n.id)} onClick={()=>downloadPredajaPdf(n.idNalog ?? n.id)}>Preuzmi PDF - Potvrda o predaji vozila klijenta</Button>
                        ) }

                        { ((n.status === 1 || n.status === '1') || (n.status === 2 || n.status === '2')) && (
                          <Button size="small" variant="outlined" disabled={processingIds.includes(n.idNalog ?? n.id)} onClick={()=>downloadPreuzimanjePdf(n.idNalog ?? n.id)}>Preuzmi PDF - Potvrda da je klijent preuzeo vozilo</Button>
                        ) }
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
                {/* detalji naloga - uvijek prikazani */}
                <TableRow>
                  <TableCell colSpan={5} sx={{ py: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 400 }}>
                        Detalji naloga #{nalogId}
                      </Typography>
                      <Grid container spacing={2}>
                          {/* Vozilo */}
                          <Grid item xs={12} md={6}>
                            <Paper elevation={1} sx={{ p: 2 }}>
                              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Vozilo
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {n.vozilo?.registracija || '-'}
                              </Typography>
                              {n.vozilo?.model && (
                                <>
                                  <Typography variant="body2" color="text.secondary">
                                    {n.vozilo.model.markaNaziv || n.vozilo.model.marka || ''} {n.vozilo.model.modelNaziv || n.vozilo.model.nazivModela || ''}
                                  </Typography>
                                  {n.vozilo.godinaProizv && (
                                    <Typography variant="body2" color="text.secondary">
                                      Godina: {n.vozilo.godinaProizv}
                                    </Typography>
                                  )}
                                </>
                              )}
                            </Paper>
                          </Grid>

                          {/* Klijent */}
                          <Grid item xs={12} md={6}>
                            <Paper elevation={1} sx={{ p: 2 }}>
                              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Klijent
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {n.klijent ? `${n.klijent.imeKlijent || ''} ${n.klijent.prezimeKlijent || ''}`.trim() : '-'}
                              </Typography>
                              {n.klijent?.email && (
                                <Typography variant="body2" color="text.secondary">
                                  {n.klijent.email}
                                </Typography>
                              )}
                            </Paper>
                          </Grid>

                          {/* Usluge */}
                          <Grid item xs={12} md={6}>
                            <Paper elevation={1} sx={{ p: 2 }}>
                              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Usluge
                              </Typography>
                              {n.usluge && n.usluge.length > 0 ? (
                                <Box>
                                  {Array.from(n.usluge).map((usluga, idx) => (
                                    <Typography key={idx} variant="body2">
                                      • {usluga.uslugaNaziv || usluga.nazivUsluga || usluga.naziv || 'N/A'}
                                    </Typography>
                                  ))}
                                </Box>
                              ) : (
                                <Typography variant="body2" color="text.secondary">
                                  Nema usluga
                                </Typography>
                              )}
                            </Paper>
                          </Grid>

                          {/* Zamjensko vozilo */}
                          <Grid item xs={12} md={6}>
                            <Paper elevation={1} sx={{ p: 2 }}>
                              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Zamjensko vozilo
                              </Typography>
                              {n.zamjenskoVozilo ? (
                                <>
                                  {n.zamjenskoVozilo.model && (
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                      {n.zamjenskoVozilo.model.markaNaziv || n.zamjenskoVozilo.model.marka || ''} {n.zamjenskoVozilo.model.modelNaziv || n.zamjenskoVozilo.model.nazivModela || ''}
                                    </Typography>
                                  )}
                                </>
                              ) : (
                                <Typography variant="body2" color="text.secondary">
                                  Nema zamjenskog vozila
                                </Typography>
                              )}
                            </Paper>
                          </Grid>

                          {/* Datumi */}
                          <Grid item xs={12} md={6}>
                            <Paper elevation={1} sx={{ p: 2 }}>
                              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Datumi
                              </Typography>
                              <Typography variant="body2">
                                <strong>Termin:</strong> {formatDatetime(n.datumVrijemeTermin)}
                              </Typography>
                              {n.datumVrijemeZavrsenPopravak && (
                                <Typography variant="body2">
                                  <strong>Završetak popravka:</strong> {formatDatetime(n.datumVrijemeZavrsenPopravak)}
                                </Typography>
                              )}
                              {n.datumVrijemeAzuriranja && (
                                <Typography variant="body2" color="text.secondary">
                                  <strong>Ažurirano:</strong> {formatDatetime(n.datumVrijemeAzuriranja)}
                                </Typography>
                              )}
                            </Paper>
                          </Grid>

                          {/* Status i napomena */}
                          <Grid item xs={12} md={6}>
                            <Paper elevation={1} sx={{ p: 2 }}>
                              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Status i napomena
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                <strong>Status:</strong> {formatStatus(n.status)}
                              </Typography>
                              {n.napomena && (
                                <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                                  <strong>Napomena:</strong><br />
                                  {n.napomena}
                                </Typography>
                              )}
                            </Paper>
                          </Grid>
                        </Grid>
                      </Box>
                  </TableCell>
                </TableRow>
                </React.Fragment>
              )})}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={!!editNapomena} onClose={()=>setEditNapomena(null)} fullWidth>
        <DialogTitle>Ažuriraj napomenu</DialogTitle>
        <DialogContent>
          {editNapomena && (
            <TextField fullWidth multiline minRows={3} value={editNapomena.napomena || ''} onChange={e=>setEditNapomena({...editNapomena, napomena:e.target.value})} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setEditNapomena(null)}>Zatvori</Button>
          <Button onClick={saveNapomena} variant="contained">Spremi</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!editTermin} onClose={()=>setEditTermin(null)} fullWidth maxWidth="sm">
        <DialogTitle>Promijeni termin</DialogTitle>
        <DialogContent>
          {editTermin && (() => {
            // izracunati minimum datum (danas)
            const today = new Date()
            const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}T${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`
            
            // zaokruziti vrijeme na 0 ili 30 minuta
            const handleTimeChange = (value) => {
              if (!value) {
                setEditTermin({...editTermin, noviTermin: ''})
                return
              }
              
              const [datePart, timePart] = value.split('T')
              if (!timePart) {
                setEditTermin({...editTermin, noviTermin: value})
                return
              }
              
              const [hours, minutes] = timePart.split(':').map(Number)
              const roundedMinutes = minutes < 30 ? 0 : 30
              const roundedTime = `${String(hours).padStart(2, '0')}:${String(roundedMinutes).padStart(2, '0')}`
              
              setEditTermin({...editTermin, noviTermin: `${datePart}T${roundedTime}`})
            }
            
            return (  
              <TextField 
                fullWidth 
                type="datetime-local" 
                label="Novi termin"
                value={editTermin.noviTermin || (editTermin.datumVrijemeTermin ? new Date(editTermin.datumVrijemeTermin).toISOString().slice(0, 16) : '')} 
                onChange={e=>handleTimeChange(e.target.value)}
                inputProps={{
                  min: minDate,
                  step: 1800 // 30 minuta u sekundama
                }}
                sx={{ mt: 2 }}
                InputLabelProps={{ shrink: true }}
                helperText="Termin mora biti u budućnosti i u razmaku od 30 minuta (npr. 19:00 ili 19:30)"
              />
            )
          })()}
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setEditTermin(null)}>Zatvori</Button>
          <Button onClick={saveTermin} variant="contained">Spremi</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={alert.open} autoHideDuration={3000} onClose={()=>setAlert({...alert, open:false})} message={alert.message} />
    </Container>
  )
}
