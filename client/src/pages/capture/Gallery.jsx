// Imports
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Plus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

// ==========================================
// MOCK DATA
// ==========================================
const MOCK_PHOTOS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    caption: "Summer Breeze '23",
    subCaption: "AUG 14 • MALIBU",
    rotation: -2,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=600&q=80',
    caption: "San Fran Morning",
    subCaption: "OCT 05 • CALIFORNIA",
    rotation: 3,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
    caption: "Lost in Green",
    subCaption: "JUNE 08 • OREGON",
    rotation: -1,
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    caption: "Cotton Candy Sky",
    subCaption: "SEPT 30 • HOME",
    rotation: 2,
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    caption: "Mountain Escape",
    subCaption: "DEC 20 • ALPS",
    rotation: -3,
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=600&q=80',
    caption: "Quiet Moments",
    subCaption: "JULY 12 • LAKE TAHOE",
    rotation: 1,
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?auto=format&fit=crop&w=600&q=80',
    caption: "Neon Nights",
    subCaption: "NOV 22 • TOKYO",
    rotation: -2,
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=600&q=80',
    caption: "First Light",
    subCaption: "MAY 15 • VERMONT",
    rotation: 3,
  },
];

// ==========================================
// STYLED COMPONENTS
// ==========================================
const GalleryContainer = styled.div`
  min-height: 100vh;
  background-color: #0f141e; /* Dark slate matching the capture page */
  background-image: radial-gradient(circle at 50% 0%, #1a2332 0%, #0f141e 80%);
  color: #ffffff;
  padding: 3rem 4rem;
  position: relative;
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem 6rem 1.5rem; /* Extra bottom padding for FAB */
  }
`;

const TopNav = styled.div`
  margin-bottom: 2rem;
`;

const BackButton = styled(Link)`
  color: #9ca3af;
  background: rgba(255, 255, 255, 0.05);
  padding: 10px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  text-decoration: none;

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4rem;
  flex-wrap: wrap;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    margin-bottom: 3rem;
  }
`;

const TitleBlock = styled.div`
  max-width: 500px;
`;

const Title = styled.h1`
  font-family: 'Inter', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.5rem;
  letter-spacing: -0.5px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #6b7280; /* Soft gray */
  line-height: 1.5;
`;

const FilterTabs = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.03);
  padding: 6px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const Tab = styled.button`
  background: ${props => props.$active ? '#1e293b' : 'transparent'};
  color: ${props => props.$active ? '#ffffff' : '#9ca3af'};
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #ffffff;
  }
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 3rem;
  justify-items: center;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 2rem;
  }
`;

const PolaroidCard = styled(motion.div)`
  background-color: #ffffff;
  padding: 12px 12px 50px 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border-radius: 2px;
  width: 100%;
  max-width: 320px;
  position: relative;
  cursor: pointer;
  /* Apply the randomized rotation passed via style prop */
  transform-origin: center;
`;

const PhotoFrame = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  background-color: #1a1e23;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
`;

const Photo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* Optional: Keep a slight vintage filter on gallery items */
  filter: sepia(0.1) contrast(1.05);
`;

const CaptionBlock = styled.div`
  position: absolute;
  bottom: 15px;
  left: 16px;
  width: calc(100% - 32px);
`;

const Caption = styled.h3`
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 4px;
`;

const SubCaption = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  color: #9ca3af;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const FAB = styled(Link)`
  position: fixed;
  bottom: 2.5rem;
  right: 2.5rem;
  background-color: #2bb1ff; /* Bright blue brand color */
  color: #ffffff;
  padding: 16px 28px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 10px 25px rgba(43, 177, 255, 0.4);
  transition: all 0.2s ease;
  z-index: 50;

  &:hover {
    background-color: #1a9fee;
    transform: translateY(-2px);
    box-shadow: 0 14px 30px rgba(43, 177, 255, 0.5);
  }

  @media (max-width: 768px) {
    bottom: 1.5rem;
    right: 1.5rem;
    padding: 14px 24px;
  }
`;

// ==========================================
// ANIMATION VARIANTS
// ==========================================
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

// ==========================================
// COMPONENT LOGIC
// ==========================================
const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState('All Photos');

  return (
    <GalleryContainer>
      <TopNav>
        <BackButton to="/">
          <ArrowLeft size={24} />
        </BackButton>
      </TopNav>

      <HeaderSection>
        <TitleBlock>
          <Title>Memories Gallery</Title>
          <Subtitle>
            Your digital Polaroids scattered in time. A collection of moments that glow.
          </Subtitle>
        </TitleBlock>

        <FilterTabs>
          <Tab 
            $active={activeFilter === 'All Photos'} 
            onClick={() => setActiveFilter('All Photos')}
          >
            All Photos
          </Tab>
          <Tab 
            $active={activeFilter === 'Recent'} 
            onClick={() => setActiveFilter('Recent')}
          >
            Recent
          </Tab>
          <Tab 
            $active={activeFilter === 'Favorites'} 
            onClick={() => setActiveFilter('Favorites')}
          >
            Favorites
          </Tab>
        </FilterTabs>
      </HeaderSection>

      <Grid
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {MOCK_PHOTOS.map((photo) => (
          <PolaroidCard 
            key={photo.id}
            variants={itemVariants}
            style={{ rotate: photo.rotation }}
            whileHover={{ 
              scale: 1.05, 
              rotate: 0, // Straightens out on hover!
              zIndex: 10,
              boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
              transition: { type: "spring", stiffness: 300 }
            }}
          >
            <PhotoFrame>
              <Photo src={photo.image} alt={photo.caption} loading="lazy" />
            </PhotoFrame>
            <CaptionBlock>
              <Caption>{photo.caption}</Caption>
              <SubCaption>{photo.subCaption}</SubCaption>
            </CaptionBlock>
          </PolaroidCard>
        ))}
      </Grid>

      {/* Floating Action Button */}
      <FAB to="/capture">
        <Plus size={20} />
        Capture Memory
      </FAB>

    </GalleryContainer>
  );
};

export default Gallery;