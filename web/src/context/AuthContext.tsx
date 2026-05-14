import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User as FirebaseUser } from 'firebase/auth'
import { subscribeToAuthChanges } from '../services/auth'

type AuthContextType = {
  currentUser: FirebaseUser | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({ currentUser: null, loading: true })

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setCurrentUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
