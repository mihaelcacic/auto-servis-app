import React, { useState } from 'react'
import { Container, Grid, Box, Typography, TextField, Button, Paper, Divider, List, ListItem, ListItemText } from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

export default function Contact() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    setMessages([...messages, { sender: 'user', text: input }])
    setInput('')
    // ovdje kasnije možeš dodati logiku za slanje na backend ili chatbot API
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 8 }}>
      <Typography variant="h4" gutterBottom textAlign="center">Kontaktirajte nas</Typography>
      <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 5 }}>
        Slobodno nas kontaktirajte putem obrasca, chata ili posjetite naš servis.
      </Typography>

      <Grid container spacing={5}>
        {/* Lijeva strana - kontakt info + forma */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Kontakt podaci</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOnIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="body1">Servis Škoda, Zagrebačka 25, Osijek</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PhoneIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="body1">+385 31 555 222</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <EmailIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="body1">info@autoservis-skoda.hr</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="body1">Pon–Pet: 8:00–17:00, Sub: 8:00–13:00</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>Pošaljite poruku</Typography>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="Ime i prezime" variant="outlined" fullWidth />
              <TextField label="Email" type="email" variant="outlined" fullWidth />
              <TextField label="Poruka" multiline rows={4} variant="outlined" fullWidth />
              <Button variant="contained" color="primary">Pošalji</Button>
            </Box>
          </Paper>
        </Grid>

        {/* Desna strana - chat + mapa */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
            <Typography variant="h6" gutterBottom>Chat podrška</Typography>
            <List sx={{ height: 250, overflowY: 'auto', mb: 2, border: '1px solid #ddd', borderRadius: 1, p: 1 }}>
              {messages.length === 0 && (
                <ListItem>
                  <ListItemText primary="Dobrodošli! Kako vam možemo pomoći?" />
                </ListItem>
              )}
              {messages.map((msg, index) => (
                <ListItem key={index} sx={{ justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                  <Box
                    sx={{
                      bgcolor: msg.sender === 'user' ? 'primary.main' : 'grey.200',
                      color: msg.sender === 'user' ? 'white' : 'black',
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      maxWidth: '70%',
                    }}
                  >
                    <Typography variant="body2">{msg.text}</Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                placeholder="Upišite poruku..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button variant="contained" onClick={handleSend}>Pošalji</Button>
            </Box>
          </Paper>

          <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <iframe
              title="Mapa"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2782.533583116057!2d18.6714!3d45.5540!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475ce7e63f8d5b97%3A0x2c2c2a10f6f4ffda!2sOsijek!5e0!3m2!1shr!2shr!4v1685200200000!5m2!1shr!2shr"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}
