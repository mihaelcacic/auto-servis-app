import React from 'react'
import { Container, Box, Typography, Button, Grid, Card, CardContent, Stack } from '@mui/material'
import BuildIcon from '@mui/icons-material/Build'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CarRepairIcon from '@mui/icons-material/CarRepair';
import StarIcon from '@mui/icons-material/Star'
import logo from '../../assets/icons/img/Logo.png'
import { useNavigate } from 'react-router-dom'

export default function Home(){
  const navigate = useNavigate()

  // prikaz stranice za početnu stranicu
  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 8 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          py: { xs: 6, md: 10 },
          px: 3,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="h3" gutterBottom>
            Brzi i pouzdani auto servis Bregmotors
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Kvalificirani serviseri, originalni dijelovi i transparentne cijene.
            Rezervirajte termin online i vratite se na cestu bez brige.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button variant="contained" color="secondary" size="large" onClick={() => navigate('/services')}>
              Pogledaj usluge
            </Button>
            <Button variant="outlined" size="large" onClick={() => navigate('/appointments')}>
              Rezerviraj termin
            </Button>
          </Stack>
        </Box>

        <Box sx={{ width: { xs: '40%', md: '30%' } }}>
          <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', borderRadius: 2, p: 3, textAlign: 'center' }}>
            <Box component="img" src={logo} alt="Bregmotors logo" sx={{ width: '100%', maxWidth: 160, mx: 'auto', mb: 1, borderRadius:4}} />
            <Typography variant="h6">Briga o vozilu</Typography>
            <Typography variant="body2">Redoviti servisi i hitne popravke</Typography>
          </Box>
        </Box>
      </Box>

      {/* mini boxevi */}
      <Box sx={{ mt: 6 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Card variant="outlined">
              <CardContent>
                <BuildIcon color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="h6" sx={{ mt: 1 }}>Stručni servisi</Typography>
                <Typography variant="body2" color="text.secondary">Iskusni mehaničari i originalni dijelovi.</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card variant="outlined">
              <CardContent>
                <AccessTimeIcon color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="h6" sx={{ mt: 1 }}>Brza usluga</Typography>
                <Typography variant="body2" color="text.secondary">Brzi popravci i kratko vrijeme čekanja.</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card variant="outlined">
              <CardContent>
                <CarRepairIcon color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="h6" sx={{ mt: 1 }}>Kompletna briga</Typography>
                <Typography variant="body2" color="text.secondary">Pregledi i održavanje vozila.</Typography>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Box>

      {/* traka za rezervaciju termina */}
      <Box sx={{ mt: 6, py: 4, px: 3, bgcolor: 'primary.light', color: 'primary.contrastText', borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>Spremni za servis?</Typography>
        <Button variant="contained" color="secondary" size="large" onClick={() => navigate('/appointments')}>Rezerviraj odmah</Button>
      </Box>
    </Container>
  )
}
