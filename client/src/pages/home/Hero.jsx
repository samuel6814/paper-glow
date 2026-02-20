// Imports
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Hexagon, Heart, Sparkles } from 'lucide-react';

// Import our layout components
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

// Styled Components
const HeroContainer = styled.section`
  min-height: calc(100vh - 72px);
  background-color: #fcfaf8; /* Warm off-white from design */
  background-image: radial-gradient(circle at 50% 50%, #fffcf5 0%, #fcfaf8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  overflow: hidden;

  @media (max-width: 968px) {
    flex-direction: column;
    padding: 2rem 1.5rem;
    text-align: center;
    gap: 4rem;
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const LeftColumn = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 968px) {
    align-items: center;
  }
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: #fdf5e6;
  color: #d98c21;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  width: fit-content;
`;

const Title = styled.h1`
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(3.5rem, 6vw, 5.5rem);
  font-weight: 900;
  line-height: 1.05;
  color: #121826;
  letter-spacing: -1px;
`;

const Highlight = styled.span`
  color: #e69d35;
  font-style: italic;
`;

const Description = styled.p`
  font-family: 'Playfair Display', Georgia, serif;
  font-style: italic;
  font-size: 1.1rem;
  line-height: 1.6;
  color: #4b5563;
  max-width: 480px;
  margin-top: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
  }
`;

const PrimaryButton = styled(motion.button)`
  background-color: #c78933;
  color: #ffffff;
  border: none;
  padding: 14px 28px;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(199, 137, 51, 0.3);
  transition: background-color 0.2s;

  &:hover {
    background-color: #b57a2b;
  }

  @media (max-width: 480px) {
    width: 100%;
    justify-content: center;
  }
`;

const SecondaryButton = styled(motion.button)`
  background: none;
  border: none;
  color: #4b5563;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;

  &:hover {
    color: #121826;
  }
`;

const PlayIconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;
  transition: all 0.2s;

  ${SecondaryButton}:hover & {
    border-color: #121826;
    color: #121826;
  }
`;

const RightColumn = styled(motion.div)`
  position: relative;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 968px) {
    height: 400px;
    width: 100%;
  }
`;

const PolaroidStack = styled.div`
  position: relative;
  width: 320px;
  height: 380px;

  @media (max-width: 480px) {
    width: 280px;
    height: 340px;
  }
`;

const PolaroidCard = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #ffffff;
  padding: 12px 12px 60px 12px; /* Thick bottom border */
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #f3f4f6;
  transform-origin: center;
  border-radius: 2px;
`;

const PhotoFrame = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1; /* Strict 1:1 ratio */
  background-color: #e5e7eb;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1); /* Inner bevel */
`;

const Photo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: sepia(0.3) contrast(1.1) brightness(0.9); /* Warm vintage feel */
`;

const Caption = styled.div`
  position: absolute;
  bottom: 20px;
  left: 16px;
  font-family: 'Caveat', 'Playfair Display', cursive, serif;
  font-style: italic;
  color: #6b7280;
  font-size: 0.9rem;
`;

const FloatingBadge = styled(motion.div)`
  position: absolute;
  bottom: -20px;
  right: -20px;
  background: white;
  padding: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 10;
`;

const EffectIcon = styled.div`
  color: #e69d35;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EffectText = styled.div`
  display: flex;
  flex-direction: column;
`;

const EffectLabel = styled.span`
  font-size: 0.6rem;
  font-weight: 700;
  color: #9ca3af;
  letter-spacing: 0.5px;
`;

const EffectName = styled.span`
  font-size: 0.85rem;
  font-weight: 700;
  color: #1f2937;
`;

const HeartBadge = styled.div`
  position: absolute;
  top: -12px;
  right: 16px;
  background-color: #e69d35;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 10px rgba(230, 157, 53, 0.4);
  z-index: 10;
`;

// Component Logic
const Hero = () => {
  // Mock image for the hero polaroid
  const heroImage = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80";

  return (
    <>
      <Navbar />
      <HeroContainer>
        <HeroContent>
          {/* Left Column: Typography & CTAs */}
          <LeftColumn
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Badge>
              <Sparkles size={12} />
              A NEW WAY TO REMEMBER
            </Badge>
            
            <Title>
              Capture the <br />
              <Highlight>Glow</Highlight> of <br />
              Every <br />
              Moment.
            </Title>
            
            <Description>
              Transform your digital library into a collection of timeless Polaroids. 
              Preserve your memories with the warmth and texture of vintage film, right from your desktop.
            </Description>

            <ButtonGroup>
              <PrimaryButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                Get Started <ArrowRight size={18} />
              </PrimaryButton>
              
              <SecondaryButton whileHover={{ x: 5 }}>
                <PlayIconWrapper>
                  <Play size={16} fill="currentColor" />
                </PlayIconWrapper>
                See Examples
              </SecondaryButton>
            </ButtonGroup>
          </LeftColumn>

          {/* Right Column: Polaroid Visuals */}
          <RightColumn
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <PolaroidStack>
              {/* Bottom Card (Decorative) */}
              <PolaroidCard
                style={{ zIndex: 1, rotate: -8 }}
                initial={{ rotate: 0 }}
                animate={{ rotate: -8 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <PhotoFrame />
              </PolaroidCard>

              {/* Middle Card (Decorative) */}
              <PolaroidCard
                style={{ zIndex: 2, rotate: 6 }}
                initial={{ rotate: 0 }}
                animate={{ rotate: 6 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                <PhotoFrame />
              </PolaroidCard>

              {/* Top Main Card */}
              <PolaroidCard
                style={{ zIndex: 3, rotate: -2 }}
                initial={{ rotate: 0, y: 50 }}
                animate={{ rotate: -2, y: 0 }}
                whileHover={{ scale: 1.02, rotate: 0, transition: { duration: 0.3 } }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <HeartBadge>
                  <Heart size={14} fill="currentColor" />
                </HeartBadge>
                
                <PhotoFrame>
                  <Photo src={heroImage} alt="Vintage Portrait" />
                </PhotoFrame>
                
                <Caption>Venice Beach, Summer '23</Caption>

                <FloatingBadge
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  <EffectIcon>
                    <Hexagon size={24} fill="currentColor" color="#fef3c7" />
                  </EffectIcon>
                  <EffectText>
                    <EffectLabel>APPLIED EFFECT</EffectLabel>
                    <EffectName>Warm Grain Filter</EffectName>
                  </EffectText>
                </FloatingBadge>
              </PolaroidCard>
            </PolaroidStack>
          </RightColumn>
        </HeroContent>
      </HeroContainer>
    </>
  );
};

// Export
export default Hero;