import React from 'react'
import { TextField, MenuItem } from '@mui/material'

export default function ReplacementVehicleSelector({ zamjenska = [], zamjenskoId, setZamjenskoId }){
  return (
    <TextField select label="Zamjensko vozilo (opcionalno)" value={zamjenskoId} onChange={e=>setZamjenskoId(e.target.value)}>
      <MenuItem value="">—</MenuItem>
      {zamjenska.map(z => (
        <MenuItem key={z.idZamjVozilo || z.id} value={z.idZamjVozilo || z.id}>{z.model?.markaNaziv} {z.model?.modelNaziv}</MenuItem>
      ))}
    </TextField>
  )
}
