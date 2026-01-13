import React, { useEffect, useState } from 'react'
import { Container, Typography, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, CircularProgress, Alert, Snackbar } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import { getMyNalozi, putNalogStatusServiser, putNalogNapomenaServiser, downloadServiserNalogPdf } from '../../services/api'
import { formatDatetime } from '../../utils/date'

export default function ServiserDashboard(){
  const { user, loading } = useAuth()
  const [nalozi, setNalozi] = useState([])
  const [loadingData, setLoadingData] = useState(false)
  const [processingIds, setProcessingIds] = useState([])
  const [editNapomena, setEditNapomena] = useState(null)
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

  async function confirmReception(id){
    if (processingIds.includes(id)) return
    setProcessingIds(ids=>[...ids, id])
    try{
      // serviser confirms they have received the vehicle -> status 2
      await putNalogStatusServiser(id, 2)
      setAlert({ open:true, message:'Servis preuzet (status 2)', severity:'success' })
      await load()
    }catch(e){ setAlert({ open:true, message:e.message||'Greška', severity:'error' }) }
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

  async function saveNapomena(){
    try{
      await putNalogNapomenaServiser(editNapomena.idNalog ?? editNapomena.id, editNapomena.napomena)
      setAlert({ open:true, message:'Napomena ažurirana', severity:'success' })
      setEditNapomena(null)
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
                    <Button size="small" onClick={()=>setEditNapomena(n)}>Uredi napomenu</Button>
                    { (n.status === 1 || n.status === '1') && (
                      <Button size="small" disabled={processingIds.includes(n.idNalog ?? n.id)} onClick={()=>confirmReception(n.idNalog ?? n.id)}>Potvrdi preuzimanje (serviser preuzima vozilo)</Button>
                    ) }
                    { ((n.status === 2 || n.status === '2') || (n.status === 1 || n.status === '1') || (n.status === 0 || n.status === '0')) && (
                      <Button size="small" disabled={processingIds.includes(n.idNalog ?? n.id)} onClick={()=>finishAndDownload(n.idNalog ?? n.id)}>Završi servis i preuzmi PDF</Button>
                    ) }
                    { (n.status === 3 || n.status === '3') && (
                      <Button size="small" disabled>Završeno</Button>
                    ) }
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

      <Snackbar open={alert.open} autoHideDuration={3000} onClose={()=>setAlert({...alert, open:false})} message={alert.message} />
    </Container>
  )
}
