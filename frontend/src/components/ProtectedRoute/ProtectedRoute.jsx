import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Box, CircularProgress, Alert } from '@mui/material'

export default function ProtectedRoute({ allowedRoles = [], children }){
  const { user, loading } = useAuth()

  if(loading) return <Box sx={{ p:3 }}><CircularProgress /></Box>

  if(!user) return <Navigate to="/" replace />

  const roles = user?.roles || (user?.role ? [user.role] : [])
  const hasAllowed = allowedRoles.length === 0 || roles.some(r => allowedRoles.includes(r))

  if(!hasAllowed){
    return (
      <Box sx={{ p:3 }}>
        <Alert severity="error">Nedozvoljen pristup.</Alert>
      </Box>
    )
  }

  return children
}
