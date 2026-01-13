import React, { useEffect, useState } from 'react'
import { Container, Typography, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, CircularProgress, Alert, Snackbar, Box } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import { getMyNalozi, putNalogStatusServiser, putNalogNapomenaServiser, putNalogTerminServiser, downloadServiserNalogPdf, downloadServiserPredajaPdf, notifyServisZavrsen, downloadKlijentNalogPdf } from '../../services/api'
import { formatDatetime } from '../../utils/date'

export default function ServiserDashboard(){
  const { user, loading } = useAuth()
  const [nalozi, setNalozi] = useState([])
  const [loadingData, setLoadingData] = useState(false)
  const [processingIds, setProcessingIds] = useState([])
  const [editNapomena, setEditNapomena] = useState(null)
  const [editTermin, setEditTermin] = useState(null)
  const [alert, setAlert] = useState({ open:false, message:'', severity:'success' })

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
      // downloadServiserPredajaPdf calls getPotvrdaOPredaji which should change status to 1
      // But if it doesn't work, we'll also explicitly change status to 1
      const { blob, filename } = await downloadServiserPredajaPdf(id)
      // Explicitly change status to 1 as backup (in case backend didn't do it)
      try {
        await putNalogStatusServiser(id, 1)
      } catch (statusError) {
        // If status update fails, it might already be 1, so we'll continue
        console.warn('Status update failed (might already be 1):', statusError)
      }
      // Download the PDF
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename || `predaja_${id}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      setAlert({ open:true, message:'Vozilo preuzeto od klijenta, mail poslan i PDF preuzet', severity:'success' })
      await load()
    }catch(e){ 
      console.error('Error in takeVehicleFromClient:', e)
      setAlert({ open:true, message:e.message||'Greška', severity:'error' }) 
    }
    setProcessingIds(ids=>ids.filter(x=>x!==id))
  }

  async function downloadPredajaPdf(id){
    if (processingIds.includes(id)) return
    setProcessingIds(ids=>[...ids, id])
    try{
      // Try to download PDF - this may change status if status is 0
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
      await load()
    }catch(e){ 
      // If download fails (e.g., status is already 1 or higher), try using klijent PDF
      try {
        const { blob, filename } = await downloadKlijentNalogPdf(id)
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename || `predaja_${id}.pdf`
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
        setAlert({ open:true, message:'PDF preuzet', severity:'success' })
        await load()
      } catch (e2) {
        setAlert({ open:true, message:e.message||'Greška pri preuzimanju PDF-a', severity:'error' })
      }
    }
    setProcessingIds(ids=>ids.filter(x=>x!==id))
  }

  async function finishService(id){
    if (processingIds.includes(id)) return
    setProcessingIds(ids=>[...ids, id])
    try{
      // send email to client first (while status is still 1)
      await notifyServisZavrsen(id)
      // then change status to 2
      await putNalogStatusServiser(id, 2)
      setAlert({ open:true, message:'Servis završen i mail poslan klijentu', severity:'success' })
      await load()
    }catch(e){ setAlert({ open:true, message:e.message||'Greška', severity:'error' }) }
    setProcessingIds(ids=>ids.filter(x=>x!==id))
  }

  async function confirmClientPickup(id){
    if (processingIds.includes(id)) return
    setProcessingIds(ids=>[...ids, id])
    try{
      // Status is 2, but getPotvrdaOPreuzimanju requires status to be 0 or 1
      // So we need to temporarily change status back to 1, generate PDF, then change to 3
      // Actually, that's too complicated. Let's just change status to 3.
      // The PDF was already generated when status changed to 2 (in finishService)
      await putNalogStatusServiser(id, 3)
      setAlert({ open:true, message:'Potvrđeno da je klijent preuzeo vozilo', severity:'success' })
      await load()
    }catch(e){ setAlert({ open:true, message:e.message||'Greška', severity:'error' }) }
    setProcessingIds(ids=>ids.filter(x=>x!==id))
  }

  async function downloadPreuzimanjePdf(id){
    if (processingIds.includes(id)) return
    setProcessingIds(ids=>[...ids, id])
    try{
      // Try to download PDF - this may change status if status is 1
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
      await load()
    }catch(e){ 
      // If download fails (e.g., status is already 2 or higher), try using klijent PDF
      try {
        const { blob, filename } = await downloadKlijentNalogPdf(id)
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename || `preuzimanje_${id}.pdf`
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
        setAlert({ open:true, message:'PDF preuzet', severity:'success' })
        await load()
      } catch (e2) {
        setAlert({ open:true, message:e.message||'Greška pri preuzimanju PDF-a', severity:'error' })
      }
    }
    setProcessingIds(ids=>ids.filter(x=>x!==id))
  }

  async function finishAndDownload(id){
    if (processingIds.includes(id)) return
    setProcessingIds(ids=>[...ids, id])
    try{
      // first request server to set status = 3
      await putNalogStatusServiser(id, 3)
      // then download the generated PDF
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

  async function predajaAndDownload(id){
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

  async function finishAndNotify(id){
    if (processingIds.includes(id)) return
    setProcessingIds(ids=>[...ids, id])
    try{
      await putNalogStatusServiser(id, 3)
      // ask backend to send notification email to client
      await notifyServisZavrsen(id)
      setAlert({ open:true, message:'Servis označen kao završen i poslan mail klijentu', severity:'success' })
      await load()
    }catch(e){ setAlert({ open:true, message:e.message||'Greška pri završetku servisa', severity:'error' }) }
    setProcessingIds(ids=>ids.filter(x=>x!==id))
  }

  async function saveNapomena(){
    try{
      await putNalogNapomenaServiser(editNapomena.idNalog ?? editNapomena.id, editNapomena.napomena)
      setAlert({ open:true, message:'Napomena ažurirana', severity:'success' })
      setEditNapomena(null)
      load()
    }catch(e){ setAlert({ open:true, message:e.message||'Greška', severity:'error' }) }
  }

  async function saveTermin(){
    if(!editTermin || !editTermin.noviTermin) return
    try{
      // Validate that date is not in the past
      const selectedDate = new Date(editTermin.noviTermin)
      const now = new Date()
      if(selectedDate < now){
        setAlert({ open:true, message:'Termin ne može biti u prošlosti', severity:'error' })
        return
      }
      
      // Validate that minutes are 0 or 30
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

  function formatStatus(s){
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

  return (
    <Container maxWidth="lg" sx={{ mt:6, mb:8 }}>
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
              {nalozi.map(n=> (
                <TableRow key={n.idNalog ?? n.id} hover>
                  <TableCell>{n.idNalog ?? n.id}</TableCell>
                  <TableCell>{formatDatetime(n.datumVrijemeTermin)}</TableCell>
                  <TableCell>{formatStatus(n.status)}</TableCell>
                  <TableCell>{n.napomena}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button size="small" onClick={()=>setEditNapomena(n)}>Uredi napomenu</Button>
                        <Button 
                          size="small" 
                          onClick={()=>setEditTermin(n)}
                          disabled={(n.status === 1 || n.status === '1') || (n.status === 2 || n.status === '2') || (n.status === 3 || n.status === '3')}
                        >
                          Promijeni termin
                        </Button>
                      </Box>

                      {/* Akcije - mijenjanje statusa */}
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                        { (n.status === 0 || n.status === '0') && (
                          <Button size="small" variant="contained" color="primary" disabled={processingIds.includes(n.idNalog ?? n.id)} onClick={()=>takeVehicleFromClient(n.idNalog ?? n.id)}>Preuzmi vozilo od klijenta</Button>
                        ) }

                        { (n.status === 1 || n.status === '1') && (
                          <Button size="small" variant="contained" color="success" disabled={processingIds.includes(n.idNalog ?? n.id)} onClick={()=>finishService(n.idNalog ?? n.id)}>Obavijesti klijenta da je servis završen</Button>
                        ) }

                        { (n.status === 2 || n.status === '2') && (
                          <Button size="small" variant="contained" color="primary" disabled={processingIds.includes(n.idNalog ?? n.id)} onClick={()=>confirmClientPickup(n.idNalog ?? n.id)}>Potvrdi da je klijent preuzeo vozilo</Button>
                        ) }

                        { (n.status === 3 || n.status === '3') && (
                          <Button size="small" disabled>Završeno</Button>
                        ) }
                      </Box>

                      {/* PDF preuzimanja - odvojeno od akcija */}
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                        { ((n.status === 0 || n.status === '0') || (n.status === 1 || n.status === '1') || (n.status === 2 || n.status === '2') || (n.status === 3 || n.status === '3')) && (
                          <Button size="small" variant="outlined" disabled={processingIds.includes(n.idNalog ?? n.id)} onClick={()=>downloadPredajaPdf(n.idNalog ?? n.id)}>Preuzmi PDF - Potvrda o predaji vozila klijenta</Button>
                        ) }

                        { (n.status === 3 || n.status === '3') && (
                          <Button size="small" variant="outlined" disabled={processingIds.includes(n.idNalog ?? n.id)} onClick={()=>downloadPreuzimanjePdf(n.idNalog ?? n.id)}>Preuzmi PDF - Potvrda da je klijent preuzeo vozilo</Button>
                        ) }
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
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
            // Calculate minimum date (today)
            const today = new Date()
            const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}T${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`
            
            // Round time to nearest 30 minutes
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
              // Round minutes to nearest 30 (0 or 30)
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
                  step: 1800 // 30 minutes in seconds
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
