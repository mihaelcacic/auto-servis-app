import React, { useState } from 'react'
import { TextField, MenuItem } from '@mui/material'

export default function VehicleSelector({
  registracija,
  setRegistracija,
  godina,
  setGodina,
  marka,
  setMarka,
  marke = [],
  modelId,
  setModelId,
  models = []
}){
  const [regError, setRegError] = useState(false)

  const currentYear = new Date().getFullYear()
  const years = []
  for (let y = currentYear + 1; y >= 1980; y--) years.push(String(y))

  const cleanAndSetRegistracija = (raw) => {
    // pretvoriti u uppercase i maknuti neželjene znakove
    // dozvoliti kvacice, brojeve, razmake i crtice
    const upper = raw.toUpperCase()
    const v = upper.replace(/[^\p{L}0-9 \-]/gu, '')
    setRegistracija(v)
  }

  const validateRegistracija = (v) => {
    if (!v) return false
    // provjeriti da prva dva slova su slova (uključujući kvacice)
    return /^\p{L}{2}/u.test(v)
  }

  // prikaz forme za vozilo
  return (
    <>
      <TextField
        label="AA0000BB"
        value={registracija}
        onChange={e=>cleanAndSetRegistracija(e.target.value)}
        onBlur={() => setRegError(!validateRegistracija(registracija))}
        error={regError}
        helperText={regError ? 'Unesite valjanu registarsku oznaku' : ''}
        required
      />

      <TextField select label="Godina proizvodnje" value={godina} onChange={e=>setGodina(e.target.value)} required>
        <MenuItem value="">—</MenuItem>
        {years.map(y => (<MenuItem key={y} value={y}>{y}</MenuItem>))}
      </TextField>

      <TextField select label="Marka" value={marka} onChange={e=>setMarka(e.target.value)} helperText="Odaberite marku">
        <MenuItem value="">—</MenuItem>
        {marke.map(m => (<MenuItem key={m} value={m}>{m}</MenuItem>))}
      </TextField>

      <TextField select label="Model" value={modelId} onChange={e=>setModelId(e.target.value)} helperText="Odaberite model" disabled={!models.length} required>
        <MenuItem value="">—</MenuItem>
        {models.map(m => (
          <MenuItem key={m.idModel || m.id} value={m.idModel || m.id}>{m.modelNaziv || m.modelNaziv}</MenuItem>
        ))}
      </TextField>
    </>
  )
}
