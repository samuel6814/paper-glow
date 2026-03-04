import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Import your Better Auth session hook
import { useSession } from './lib/auth' 

import App from './App'
import Login from './pages/auth/Login'
import Capture from './pages/capture/Capture'
import Gallery from './pages/capture/Gallery'

// ==========================================
// ROUTE GUARDS
// ==========================================

// Simple full-screen loader to show while checking auth status
const FullScreenLoader = () => (
  <div style={{ 
    minHeight: '100vh', 
    backgroundColor: '#121826', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    color: '#c78933',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600
  }}>
    Verifying session...
  </div>
);

// 1. Protects private routes (Capture, Gallery)
const ProtectedRoute = ({ children }) => {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <FullScreenLoader />;
  }

  // If no session exists, kick them to login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // If session exists, render the requested page
  return children;
};

// 2. Protects public routes (Login) from logged-in users
const PublicRoute = ({ children }) => {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <FullScreenLoader />;
  }

  // If session exists, kick them straight to the app
  if (session) {
    return <Navigate to="/capture" replace />;
  }

  // If no session, let them see the login page
  return children;
};


// ==========================================
// APP INITIALIZATION
// ==========================================
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Landing Page (Accessible to everyone) */}
        <Route path="/" element={<App/>} />
        
        {/* Auth Route (Only for logged-out users) */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login/>
            </PublicRoute>
          } 
        />
        
        {/* Protected App Routes (Only for logged-in users) */}
        <Route 
          path="/capture" 
          element={
            <ProtectedRoute>
              <Capture/>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/gallery" 
          element={
            <ProtectedRoute>
              <Gallery/>
            </ProtectedRoute>
          } 
        />

      </Routes>
    </BrowserRouter>
  </StrictMode>,
)