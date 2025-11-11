import React, { useMemo, useState, useEffect } from 'react'
import { Box, TextField, MenuItem, FormHelperText } from '@mui/material'

function pad(n){ return n.toString().padStart(2,'0') }

function generateTimeSlotsForDate(dateString){
  // dateString in YYYY-MM-DD
  if(!dateString) return []
  const d = new Date(dateString + 'T00:00')
  const day = d.getDay() // 0 Sun .. 6 Sat

  // service hours
  let startHour = 8
  let endHour = 17 // exclusive upper bound for slot end
  if(day === 0) return [] // Sunday closed
  if(day === 6) endHour = 13

  const slots = []
  for(let h = startHour; h < endHour; h++){
    // two slots per hour: :00 and :30
    const hh = pad(h)
    slots.push(`${hh}:00`)
    // compute whether the :30 slot would end before or at endHour
    const nextHalf = h + 0.5
    if(nextHalf < endHour || (nextHalf === endHour)){
      slots.push(`${hh}:30`)
    }
  }
  // filter out any slots that would start at or after endHour (safety)
  return slots.filter(t => {
    const [hh, mm] = t.split(':').map(Number)
    return hh + mm/60 < endHour
  })
}

export default function DateTimeField({ datumVrijeme, setDatumVrijeme }){
  // datumVrijeme format: "YYYY-MM-DDTHH:MM" or empty
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  useEffect(()=>{
    if(!datumVrijeme){ setDate(''); setTime(''); return }
    const parts = datumVrijeme.split('T')
    setDate(parts[0] || '')
    setTime(parts[1] ? parts[1].slice(0,5) : '')
  },[datumVrijeme])

  const slots = useMemo(()=> generateTimeSlotsForDate(date), [date])

  useEffect(()=>{
    if(date && time){
      // ensure time is one of allowed slots; if not, clear time
      if(!slots.includes(time)){
        setTime('')
        setDatumVrijeme('')
        return
      }
      setDatumVrijeme(`${date}T${time}`)
    } else {
      setDatumVrijeme('')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[date,time])

  const today = new Date()
  const minDate = `${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}`
  const maxDateObj = new Date()
  maxDateObj.setDate(maxDateObj.getDate() + 365)
  const maxDate = `${maxDateObj.getFullYear()}-${pad(maxDateObj.getMonth()+1)}-${pad(maxDateObj.getDate())}`

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
      <TextField
        label=""
        type="date"
        value={date}
        onChange={e=> setDate(e.target.value)}
        slotProps={{ label: { shrink: true }, input: { min: minDate, max: maxDate } }}
        required
      />

      <TextField select label="Vrijeme" value={time} onChange={e=> setTime(e.target.value)} disabled={!date || !slots.length} helperText={!date ? 'Odaberite datum' : (slots.length ? '' : 'Servis zatvoren taj dan')} required>
        <MenuItem value="">—</MenuItem>
        {slots.map(s => (<MenuItem key={s} value={s}>{s}</MenuItem>))}
      </TextField>

      {date && !slots.length && <FormHelperText sx={{ gridColumn: '1 / -1' }}>Odabran je neradni dan, molimo odaberite drugi datum</FormHelperText>}
    </Box>
  )
}
