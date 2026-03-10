import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// Added the LogIn icon here!
import { Camera, Menu, X, LogOut, LogIn } from 'lucide-react';

// Import Better Auth
import { useSession, signOut } from '../lib/auth';

// ==========================================
// STYLED COMPONENTS
// ==========================================
const NavContainer = styled.nav`
  box-sizing: border-box; 
  position: sticky;
  top: 0;
  width: 100%;
  height: 72px;
  background-color: rgba(252, 250, 248, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4rem;
  z-index: 100;

  @media (max-width: 968px) {
    padding: 0 2rem;
  }
`;

const Logo = styled(Link)`
  font-family: 'Inter', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: #121826;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: -0.5px;

  span {
    color: #c78933;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem; 

  @media (max-width: 768px) {
    display: none;
  }
`;

const DesktopMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem; 
`;

const NavLink = styled(Link)`
  font-size: 0.95rem;
  font-weight: 600;
  color: #4b5563;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #121826;
  }
`;

const AuthGroup = styled.div`
  display: flex;
  align-items: center;
`;

// UPDATED: Added flex layout to align the text and icon perfectly
const LoginButton = styled(Link)`
  font-size: 0.95rem;
  font-weight: 600;
  color: #121826;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.2s ease;

  &:hover {
    color: #c78933;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  font-size: 0.95rem;
  font-weight: 600;
  color: #ef4444; 
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.2s ease;
  padding: 0;

  &:hover {
    color: #b91c1c;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #121826;
  cursor: pointer;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileDropdown = styled(motion.div)`
  position: absolute;
  top: 72px;
  left: 0;
  width: 100%;
  background-color: #fcfaf8;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  padding: 2rem;
  gap: 1.5rem;
  z-index: 99;
  box-sizing: border-box; 
`;

const MobileLink = styled(Link)`
  font-size: 1.1rem;
  font-weight: 600;
  color: #121826;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px; /* Added gap in case you want to use icons here too */
`;

// ==========================================
// COMPONENT LOGIC
// ==========================================
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Better Auth state
  const { data: session } = useSession();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <NavContainer>
      {/* Logo */}
      <Logo to="/">
        <Camera size={24} color="#c78933" />
        Paper<span>Glow</span>
      </Logo>

      {/* Desktop Navigation & Auth */}
      <RightSection>
        {session && (
          <DesktopMenu>
            <NavLink to="/gallery">Gallery</NavLink>
            <NavLink to="/capture">Capture</NavLink>
          </DesktopMenu>
        )}

        <AuthGroup>
          {session ? (
            <LogoutButton onClick={handleLogout}>
              Log Out <LogOut size={16} />
            </LogoutButton>
          ) : (
            // NEW: Added the LogIn icon here
            <LoginButton to="/login">
              Log In <LogIn size={16} />
            </LoginButton>
          )}
        </AuthGroup>
      </RightSection>

      {/* Mobile Menu Toggle */}
      <MobileMenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </MobileMenuButton>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileDropdown
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: 'hidden' }}
          >
            {session && (
              <>
                <MobileLink to="/gallery">Gallery</MobileLink>
                <MobileLink to="/capture">Capture</MobileLink>
              </>
            )}

            <div style={{ height: '1px', background: '#e5e7eb', margin: '0.5rem 0' }} />

            {session ? (
              <LogoutButton onClick={handleLogout} style={{ fontSize: '1.1rem' }}>
                Log Out <LogOut size={18} />
              </LogoutButton>
            ) : (
              // NEW: Added the LogIn icon to the mobile menu as well
              <MobileLink to="/login" style={{ color: '#c78933' }}>
                Log In <LogIn size={18} />
              </MobileLink>
            )}
          </MobileDropdown>
        )}
      </AnimatePresence>
    </NavContainer>
  );
};

export default Navbar;