// Imports
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Camera, Layers, Sparkles, Share, Twitter, Instagram } from 'lucide-react';

// Styled Components
const FooterContainer = styled.footer`
  background-color: #fcfaf8; /* Warm off-white matching the Hero */
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  color: #121826;
  padding-top: 4rem;
  padding-bottom: 2rem;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;

  @media (max-width: 768px) {
    padding: 0 1.5rem;
  }
`;

// --- Features Section ---
const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;
  margin-bottom: 4rem;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    text-align: center;
  }
`;

const FeatureItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 860px) {
    align-items: center;
  }
`;

const IconWrapper = styled.div`
  color: #c78933; /* Gold accent from the Hero */
`;

const FeatureTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #121826;
`;

const FeatureText = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  color: #4b5563; /* Soft gray */
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

// --- Navigation & Socials Section ---
const BottomNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: center;
  }
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #121826;
`;

const LogoText = styled.span`
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.25rem;
  font-weight: 800;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: 480px) {
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const FooterLink = styled(Link)`
  color: #4b5563;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: #c78933;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const SocialLink = styled.a`
  color: #4b5563;
  transition: color 0.2s;

  &:hover {
    color: #c78933;
  }
`;

// --- Copyright Section ---
const Copyright = styled.div`
  text-align: center;
  font-size: 0.85rem;
  color: #6b7280;
`;

// Component Logic
const Footer = () => {
  // Automated year calculation
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <ContentWrapper>
        {/* Top Features Section */}
        <FeaturesGrid>
          <FeatureItem>
            <IconWrapper>
              <Layers size={28} />
            </IconWrapper>
            <FeatureTitle>Tactile Design</FeatureTitle>
            <FeatureText>
              Realistic 3D frames that feel like holding a real physical photo in your hands.
            </FeatureText>
          </FeatureItem>

          <FeatureItem>
            <IconWrapper>
              <Sparkles size={28} />
            </IconWrapper>
            <FeatureTitle>Instant Glow</FeatureTitle>
            <FeatureText>
              Automatic enhancement that adds a warm, nostalgic aura and grain to every shot.
            </FeatureText>
          </FeatureItem>

          <FeatureItem>
            <IconWrapper>
              <Share size={28} />
            </IconWrapper>
            <FeatureTitle>Easy Sharing</FeatureTitle>
            <FeatureText>
              Export and share your digital Polaroids in high resolution, ready for any platform.
            </FeatureText>
          </FeatureItem>
        </FeaturesGrid>

        <Divider />

        {/* Bottom Navigation & Socials */}
        <BottomNav>
          <LogoSection>
            <Camera size={20} />
            <LogoText>PaperGlow</LogoText>
          </LogoSection>

          <NavLinks>
            <FooterLink to="/privacy">Privacy</FooterLink>
            <FooterLink to="/terms">Terms</FooterLink>
            <FooterLink to="/cookies">Cookies</FooterLink>
            <FooterLink to="/contact">Contact</FooterLink>
          </NavLinks>

          <SocialIcons>
            <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <Twitter size={20} />
            </SocialLink>
            <SocialLink href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram size={20} />
            </SocialLink>
          </SocialIcons>
        </BottomNav>

        {/* Copyright */}
        <Copyright>
          &copy; {currentYear} PaperGlow Inc. All rights reserved. Built by trileon.
        </Copyright>
      </ContentWrapper>
    </FooterContainer>
  );
};

// Export
export default Footer;