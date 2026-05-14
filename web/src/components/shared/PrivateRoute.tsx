import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { CircularProgress } from '@mui/material'
import type { ReactNode } from 'react'

export const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    )
  }

  return currentUser ? <>{children}</> : <Navigate to="/login" replace />
}
