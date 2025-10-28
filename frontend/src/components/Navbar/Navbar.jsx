import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MenuIcon from "@mui/icons-material/Menu";
import { NavLink } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import ListItemIcon from '@mui/material/ListItemIcon';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Logout from '@mui/icons-material/Logout';
import GoogleIcon from '@mui/icons-material/Google';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';


export default function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [userAnchorEl, setUserAnchorEl] = React.useState(null);
  const isOpen = Boolean(anchorEl);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navItems = ["Home", "About", "Services", "Contact"];
  const links = [
    { label: 'Home', to: '/' },
    { label: 'Services', to: '/services' },
    { label: 'Appointments', to: '/appointments' },
    { label: 'Contact', to: '/contact' },
  ];

  const { user, login, logout } = useAuth();

  const handleUserMenuOpen = (event) => {
    setUserAnchorEl(event.currentTarget);
  };
  const handleUserMenuClose = () => setUserAnchorEl(null);

  return (
    <AppBar position="static" color="primary" elevation={3}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Škoda Auto Servis
        </Typography>

        {isSmall ? (
          <Box>
            {user ? (
              <Tooltip title={user?.name || 'Account'}>
                <IconButton onClick={handleUserMenuOpen} sx={{ mr: 1 }}>
                  <Avatar alt={user?.name} src={user?.picture} sx={{ width: 32, height: 32 }} />
                </IconButton>
              </Tooltip>
            ) : (
              <Box sx={{ display: 'inline-flex', mr: 1 }}>
                {/* custom MUI Google button for mobile */}
                <GoogleSignInButton onSuccess={login} />
              </Box>
            )}
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={isOpen}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              {links.map((item) => (
                <MenuItem
                  key={item.to}
                  component={NavLink}
                  to={item.to}
                  onClick={handleMenuClose}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: "flex", gap: 1 }}>
            {links.map((item) => (
              <Button
                key={item.to}
                color="inherit"
                component={NavLink}
                to={item.to}
                sx={{ textTransform: 'none' }}
              >
                {item.label}
              </Button>
            ))}
            {!user ? (
              <Box sx={{ ml: 1 }}>
                {/* custom MUI Google button for desktop */}
                <GoogleSignInButton onSuccess={login} />
              </Box>
            ) : (
              <Box>
                <Tooltip title={user?.name || 'Account'}>
                  <IconButton onClick={handleUserMenuOpen} sx={{ ml: 1 }}>
                    <Avatar alt={user?.name} src={user?.picture} />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>
        )}

        {/*meni za korisnika je izvan wrappera tkd se moze koristiti i na mobile i desktopu */}
       
        <Menu
          anchorEl={userAnchorEl}
          open={Boolean(userAnchorEl)}
          onClose={handleUserMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem component={NavLink} to="/profile" onClick={handleUserMenuClose}>
            <ListItemIcon>
              <AccountCircle fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem onClick={() => { handleUserMenuClose(); logout(); }}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

// mali wrapper za Google login gumb da koristi MUI stil 
function GoogleSignInButton({ onSuccess }) {
  const login = useGoogleLogin({
    onSuccess: tokenResponse => onSuccess(tokenResponse),
    onError: () => console.error('Google login failed')
  });

  return (
    <Button
      variant="outlined"
      startIcon={<GoogleIcon />}
      onClick={() => login()}
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderColor: 'divider'
      }}
    >
      Sign in
    </Button>
  );
}