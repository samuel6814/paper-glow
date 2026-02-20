// Imports
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Camera, Menu, X } from 'lucide-react';

// Styled Components
const NavContainer = styled.nav`
  background-color: #fcfaf8; /* Warm off-white matching the Hero */
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05); /* Subtle dark border instead of white */
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;

  @media (max-width: 768px) {
    padding: 0 1.5rem;
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
`;

const IconWrapper = styled.div`
  background-color: #c78933; /* Warm gold accent from the Hero */
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoText = styled.span`
  color: #121826; /* Dark slate text */
  font-family: 'Playfair Display', Georgia, serif; /* Matching the elegant typography */
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: 0px;
`;

const DesktopLinks = styled.div`
  display: flex;
  gap: 2.5rem;

  @media (max-width: 860px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: #4b5563; /* Soft gray */
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: #c78933; /* Hover turns gold */
  }
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 860px) {
    display: none;
  }
`;

const SignInLink = styled(Link)`
  color: #121826; /* Dark slate text */
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 600;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.7;
  }
`;

const GetStartedButton = styled(Link)`
  background-color: #c78933; /* Gold button */
  color: #ffffff;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 30px; /* Pill shape matching the hero CTA */
  font-weight: 600;
  font-size: 0.95rem;
  box-shadow: 0 4px 10px rgba(199, 137, 51, 0.2);
  transition: background-color 0.2s ease, transform 0.1s ease;

  &:hover {
    background-color: #b57a2b; /* Darker gold on hover */
  }

  &:active {
    transform: scale(0.98);
  }
`;

const MobileToggle = styled.button`
  display: none;
  background: none;
  border: none;
  color: #121826; /* Dark icon for mobile menu */
  cursor: pointer;

  @media (max-width: 860px) {
    display: block;
  }
`;

const MobileMenu = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fcfaf8; /* Warm off-white */
  padding: 1rem 2rem 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

  @media (min-width: 861px) {
    display: none;
  }
`;

const MobileLink = styled(Link)`
  color: #4b5563;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 500;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

  &:hover {
    color: #c78933;
  }
`;

const MobileButton = styled(Link)`
  background-color: #c78933;
  color: #ffffff;
  text-decoration: none;
  padding: 12px;
  border-radius: 30px;
  font-weight: 600;
  text-align: center;
  margin-top: 1.5rem;
  box-shadow: 0 4px 10px rgba(199, 137, 51, 0.2);
`;

// Component Logic
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <NavContainer>
      <NavContent>
        {/* Logo Section */}
        <Logo to="/">
          <IconWrapper>
            <Camera size={20} color="#ffffff" />
          </IconWrapper>
          <LogoText>PaperGlow</LogoText>
        </Logo>

        {/* Desktop Center Links */}
        <DesktopLinks>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/faq">FAQ</NavLink>
        </DesktopLinks>

        {/* Desktop Action Buttons */}
        <ActionButtons>
          <SignInLink to="/login">Sign In</SignInLink>
          <GetStartedButton to="/login">Get Started</GetStartedButton>
        </ActionButtons>

        {/* Mobile Menu Toggle */}
        <MobileToggle onClick={toggleMenu}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </MobileToggle>
      </NavContent>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <MobileMenu>
          <MobileLink to="/" onClick={toggleMenu}>Home</MobileLink>
          <MobileLink to="/about" onClick={toggleMenu}>About</MobileLink>
          <MobileLink to="/faq" onClick={toggleMenu}>FAQ</MobileLink>
          <MobileLink to="/login" onClick={toggleMenu}>Sign In</MobileLink>
          <MobileButton to="/login" onClick={toggleMenu}>Get Started</MobileButton>
        </MobileMenu>
      )}
    </NavContainer>
  );
};

// Export
export default Navbar;