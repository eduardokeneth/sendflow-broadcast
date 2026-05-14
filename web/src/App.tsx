import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { PrivateRoute } from './components/shared/PrivateRoute'
import { Layout } from './components/shared/Layout'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ConnectionsPage } from './pages/ConnectionsPage'
import { ContactsPage } from './pages/ContactsPage'
import { MessagesPage } from './pages/MessagesPage'

export const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Layout>
                <Routes>
                  <Route path="connections" element={<ConnectionsPage />} />
                  <Route path="connections/:connectionId/contacts" element={<ContactsPage />} />
                  <Route path="connections/:connectionId/messages" element={<MessagesPage />} />
                  <Route path="*" element={<Navigate to="connections" replace />} />
                </Routes>
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
)

export default App
