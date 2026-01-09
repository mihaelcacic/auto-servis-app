import React, { useEffect, useState } from 'react'
import { Container, Typography, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, CircularProgress, Alert, Snackbar } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import { getMyNalozi, putNalogStatusServiser, putNalogNapomenaServiser } from '../../services/api'

export default function ServiserDashboard(){
  const { user, loading } = useAuth()
  const [nalozi, setNalozi] = useState([])
  const [loadingData, setLoadingData] = useState(false)
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

  async function saveNapomena(){
    try{
      await putNalogNapomenaServiser(editNapomena.idNalog ?? editNapomena.id, editNapomena.napomena)
      setAlert({ open:true, message:'Napomena ažurirana', severity:'success' })
      setEditNapomena(null)
      load()
    }catch(e){ setAlert({ open:true, message:e.message||'Greška', severity:'error' }) }
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
                  <TableCell>{n.datumVrijemeTermin}</TableCell>
                  <TableCell>{n.status}</TableCell>
                  <TableCell>{n.napomena}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={()=>setEditNapomena(n)}>Uredi napomenu</Button>
                    <Button size="small" onClick={()=>changeStatus(n.idNalog ?? n.id, 3)}>Označi kao završeno</Button>
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
