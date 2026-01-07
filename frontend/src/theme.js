import { createTheme } from '@mui/material/styles'

// Brand palette provided by user (olive/earth tones and warm browns).
// Mapping:
// - primary: maslinasto zelena (#4A6B3B)
// - primary.dark: tamna maslinasta (#2E4A2F)
// - primary.light: svjetlija maslinasta (#6F8843)
// - secondary / accent: narančasto-smeđa (#B5642A)
// - background: krem pozadina (#F1EAD8)
// - text: taman akcent (#0E1D14)
// - surfaces / wood / warm accents: use brown shades where appropriate

const brandTheme = createTheme({
  palette: {
    primary: {
      light: '#6F8843',
      main: '#4A6B3B',
      dark: '#2E4A2F',
      contrastText: '#FFFFFF'
    },
    secondary: {
      light: '#D18A4A',
      main: '#B5642A',
      dark: '#8A5226',
      contrastText: '#FFFFFF'
    },
    background: {
      default: '#F1EAD8', // krem pozadina
      paper: '#FFFFFF'
    },
    text: {
      primary: '#0E1D14', // taman akcent
      secondary: '#5C3A1F' // tamno smeđa for secondary text
    },
    divider: '#A0A84F', // svijetla maslinasto-žuta (used subtly)
    info: {
      main: '#1F3A2A'
    },
    success: {
      main: '#6F8843'
    },
    error: {
      main: '#B5642A'
    }
  },
  typography: {
    fontFamily: ['Inter', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
    h6: {
      fontWeight: 700
    },
    button: {
      textTransform: 'none'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#2E4A2F'
        }
      }
    },
    MuiIcon: {
      styleOverrides: {
        root: {
          color: '#0E1D14'
        }
      }
    }
  }
})

export default brandTheme
