import React, { useMemo, useState, useEffect } from 'react'
import { Box, TextField, MenuItem, FormHelperText } from '@mui/material'

// dodavanje nula na brojeve manje od 10
function pad(n){ return n.toString().padStart(2,'0') }

// generiranje vremenskih slotova za dan
function generateTimeSlotsForDate(dateString){
  // dateString u YYYY-MM-DD
  if(!dateString) return []
  const d = new Date(dateString + 'T00:00')
  const day = d.getDay() // nedjelja 0, ponedjeljak 1, utorak 2, srijeda 3, četvrtak 4, petak 5, subota 6

  // radno vrijeme
  let startHour = 8
  let endHour = 17 // kraj radnog vremena
  if(day === 0) return [] // nedjelja zatvoreno
  if(day === 6) endHour = 13 // subota zatvoreno

  const slots = []
  for(let h = startHour; h < endHour; h++){
    // dva slota po satu: :00 i :30
    const hh = pad(h)
    slots.push(`${hh}:00`)
    // provjeriti da li :30 slot završava prije ili u kraj radnog vremena
    const nextHalf = h + 0.5
    if(nextHalf < endHour || (nextHalf === endHour)){
      slots.push(`${hh}:30`)
    }
  }
  // filtrirati termine koji bi počeli poslije kraja radnog vremena
  return slots.filter(t => {
    const [hh, mm] = t.split(':').map(Number)
    return hh + mm/60 < endHour
  })
}

export default function DateTimeField({ datumVrijeme, setDatumVrijeme, zauzetiTermini = [] }){
  // datumVrijeme format: "YYYY-MM-DDTHH:MM" 
  // zauzetiTermini - lista LocalDateTime iz backenda
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  useEffect(()=>{
    if(!datumVrijeme){ setDate(''); setTime(''); return }
    const parts = datumVrijeme.split('T')
    setDate(parts[0] || '')
    setTime(parts[1] ? parts[1].slice(0,5) : '')
  },[datumVrijeme])

  const slots = useMemo(()=> generateTimeSlotsForDate(date), [date])

  // provjeriti da li je termin zauzet
  const isTerminZauzet = useMemo(() => {
    if (!date) return () => false
    return (timeSlot) => {
      const fullDateTime = `${date}T${timeSlot}`
      // provjeriti da li je termin zauzet 
      return zauzetiTermini.some(zauzet => {
        const zauzetStr = typeof zauzet === 'string' ? zauzet : (zauzet.toISOString ? zauzet.toISOString() : String(zauzet))
        const zauzetNormalized = zauzetStr.replace(/:\d{2}(\.\d+)?$/, '').slice(0, 16)
        return zauzetNormalized === fullDateTime
      })
    }
  }, [date, zauzetiTermini])

  useEffect(()=>{
    if(date && time){
      // provjeriti da vrijeme pripada dozvoljenim terminima
      if(!slots.includes(time)){
        setTime('')
        setDatumVrijeme('')
        return
      }
      // provjeriti da li je izabrani termin zauzet
      if(isTerminZauzet(time)){
        setTime('')
        setDatumVrijeme('')
        return
      }
      setDatumVrijeme(`${date}T${time}`)
    } else {
      setDatumVrijeme('')
    }
  },[date,time,isTerminZauzet])

  const today = new Date() // danas
  // minimum datum je sutra (ne danas)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth()+1)}-${pad(tomorrow.getDate())}`
  const maxDateObj = new Date()
  maxDateObj.setDate(maxDateObj.getDate() + 365)
  const maxDate = `${maxDateObj.getFullYear()}-${pad(maxDateObj.getMonth()+1)}-${pad(maxDateObj.getDate())}`

  // prikaz forme za datum i vrijeme
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
        {slots.map(s => {
          const zauzet = isTerminZauzet(s)
          return (
            <MenuItem key={s} value={s} disabled={zauzet} sx={zauzet ? { opacity: 0.5, textDecoration: 'line-through' } : {}}>
              {s} {zauzet ? '(zauzeto)' : ''}
            </MenuItem>
          )
        })}
      </TextField>

      {date && !slots.length && <FormHelperText sx={{ gridColumn: '1 / -1' }}>Odabran je neradni dan, molimo odaberite drugi datum</FormHelperText>}
    </Box>
  )
}
