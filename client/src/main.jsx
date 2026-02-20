import { StrictMode } from 'react'
import {createRoot} from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'

const Login = () => <div>Login Page</div>;
const Capture = () => <div>Camera / Upload Page</div>;
const Gallery = () => <div>Polaroid Gallery</div>;
const SinglePolaroid = () => <div>Single Polaroid View</div>;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
        {/* Core User Flows */}
        <Route path="/login" element={<Login />} />
        <Route path="/capture" element={<Capture />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/polaroid/:id" element={<SinglePolaroid />} />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
