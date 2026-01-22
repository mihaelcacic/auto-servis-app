import React from 'react'
import { TextField, MenuItem } from '@mui/material'

// prikaz forme za servisere
export default function StaffSelector({ serviseri = [], serviserId, setServiserId }){
  return (
    <TextField select label="Serviser" value={serviserId} onChange={e=>setServiserId(e.target.value)} required>
      <MenuItem value="">—</MenuItem>
      {serviseri.map(s => (<MenuItem key={s.idServiser || s.id} value={s.idServiser || s.id}>{s.imeServiser} {s.prezimeServiser}</MenuItem>))}
    </TextField>
  )
}
