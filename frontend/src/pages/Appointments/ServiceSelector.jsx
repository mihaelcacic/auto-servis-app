import React from 'react'
import { TextField, MenuItem } from '@mui/material'

export default function ServiceSelector({ usluge = [], uslugaId, setUslugaId }){
  return (
    <TextField select label="Usluga" value={uslugaId} onChange={e=>setUslugaId(e.target.value)} required>
      <MenuItem value="">—</MenuItem>
      {usluge.map(u => (<MenuItem key={u.idUsluga || u.id} value={u.idUsluga || u.id}>{u.uslugaNaziv}</MenuItem>))}
    </TextField>
  )
}
