import { createTheme } from '@mui/material/styles'

// Škoda-inspired palette: a strong green brand color, balanced neutrals and a
// contrasting accent for calls-to-action. These choices give a trustworthy
// automotive service feel while remaining modern and accessible.

const skodaTheme = createTheme({
  palette: {
    primary: {
      main: '#1E8A3B', // Škoda-like green (brand)
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#0F0D83', // deep indigo used previously in your CSS for headers
      contrastText: '#ffffff'
    },
    background: {
      default: '#f7f9fb', // very light gray-blue for surfaces
      paper: '#ffffff'
    },
    text: {
      primary: '#0b1220',
      secondary: '#445566'
    },
    error: {
      main: '#d32f2f'
    },
    success: {
      main: '#2e7d32'
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
          backgroundColor: '#1E8A3B'
        }
      }
    }
  }
})

export default skodaTheme
