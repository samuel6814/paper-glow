// Imports
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowLeft, Loader2, Image as ImageIcon, Trash2, Download, Edit2, X, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { api } from '../../lib/api';

const FRAME_THEMES = {
  classic: { id: 'classic', bg: "#ffffff", text: "#4b5563", subText: "#9ca3af", strip: "#f3f4f6" },
  coral: { id: 'coral', bg: "#d97a5c", text: "#1e293b", subText: "#f8fafc", strip: "#c26549" },
  slate: { id: 'slate', bg: "#1e293b", text: "#f8fafc", subText: "#94a3b8", strip: "#0f172a" },
  sand: { id: 'sand', bg: "#e5d3b3", text: "#3f2a1d", subText: "#785b46", strip: "#d4c09e" },
};

// ==========================================
// STYLED COMPONENTS (Base Gallery)
// ==========================================
const GalleryContainer = styled.div`
  min-height: 100vh;
  background-color: #0f141e; 
  background-image: radial-gradient(circle at 50% 0%, #1a2332 0%, #0f141e 80%);
  color: #ffffff;
  padding: 3rem 4rem;
  position: relative;
  overflow-x: hidden;
  @media (max-width: 768px) { padding: 2rem 1.5rem 6rem 1.5rem; }
`;

const TopNav = styled.div`margin-bottom: 2rem;`;

const BackButton = styled(Link)`
  color: #9ca3af;
  background: rgba(255, 255, 255, 0.05);
  padding: 10px;
  border-radius: 50%;
  display: inline-flex;
  transition: all 0.2s;
  &:hover { color: #ffffff; background: rgba(255, 255, 255, 0.1); }
`;

const HeaderSection = styled.div`
  margin-bottom: 4rem;
  @media (max-width: 768px) { margin-bottom: 3rem; }
`;

const Title = styled.h1`
  font-family: 'Inter', sans-serif; font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`color: #6b7280; line-height: 1.5;`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 3rem; justify-items: center;
  @media (max-width: 768px) { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 2rem; }
`;

const PolaroidCard = styled(motion.div)`
  background-color: ${props => props.$theme.bg};
  padding: 12px 12px 50px 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border-radius: 2px; width: 100%; max-width: 320px;
  position: relative; cursor: pointer; transform-origin: center;
`;

const PhotoFrame = styled.div`
  width: 100%; aspect-ratio: 1 / 1; background-color: #1a1e23; overflow: hidden;
`;

const Photo = styled.img`
  width: 100%; height: 100%; object-fit: cover;
  filter: ${props => props.$effect ? "contrast(1.1) brightness(1.1) saturate(1.2) sepia(0.3) hue-rotate(-10deg)" : "none"};
`;

const CaptionBlock = styled.div`
  position: absolute; bottom: 12px; left: 0; width: 100%; text-align: center;
`;

const Caption = styled.h3`
  font-family: "Caveat", cursive; font-size: 1.6rem; color: ${props => props.$theme.text}; margin-bottom: -4px;
`;

const SubCaption = styled.p`
  font-family: "Caveat", cursive; font-size: 1.1rem; color: ${props => props.$theme.subText};
`;

const FAB = styled(Link)`
  position: fixed; bottom: 2.5rem; right: 2.5rem; background-color: #c78933; color: #ffffff;
  padding: 16px 28px; border-radius: 30px; display: flex; align-items: center; gap: 10px; font-weight: 600;
  text-decoration: none; box-shadow: 0 10px 25px rgba(199, 137, 51, 0.4); z-index: 50;
  &:hover { background-color: #b57a2b; transform: translateY(-2px); }
  @media (max-width: 768px) { bottom: 1.5rem; right: 1.5rem; padding: 14px 24px; }
`;

const LoaderContainer = styled.div`
  display: flex; flex-direction: column; align-items: center; padding: 5rem; color: #c78933; gap: 1rem;
`;

// ==========================================
// STYLED COMPONENTS (Modal & Actions)
// ==========================================
const ModalOverlay = styled(motion.div)`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(8px);
  z-index: 100; display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 2rem;
`;

const ActionBar = styled.div`
  display: flex; gap: 1rem; margin-top: 2rem;
  background: rgba(255,255,255,0.1); padding: 12px 24px; border-radius: 30px;
`;

const ActionButton = styled.button`
  background: none; border: none; color: ${props => props.$danger ? '#ef4444' : '#ffffff'};
  display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 0.9rem; font-weight: 600;
  padding: 8px 12px; border-radius: 8px; transition: background 0.2s;
  &:hover { background: rgba(255,255,255,0.1); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const CloseButton = styled.button`
  position: absolute; top: 2rem; right: 2rem; background: none; border: none; color: #fff; cursor: pointer;
  padding: 8px; border-radius: 50%; background: rgba(255,255,255,0.1);
  &:hover { background: rgba(255,255,255,0.2); }
`;

const EditForm = styled.div`
  display: flex; flex-direction: column; gap: 1rem; margin-top: 2rem; width: 100%; max-width: 320px;
`;

const Input = styled.input`
  padding: 10px 16px; border-radius: 8px; border: 1px solid #4b5563; background: #1f2937; color: white;
`;

const ThemeSelector = styled.div`
  display: flex; justify-content: space-between; gap: 10px; margin-bottom: 10px;
`;

const Swatch = styled.button`
  width: 30px; height: 30px; border-radius: 50%; background-color: ${props => props.$color};
  border: 2px solid ${props => props.$active ? '#c78933' : 'transparent'}; cursor: pointer;
`;

// ==========================================
// COMPONENT LOGIC
// ==========================================
const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ caption: '', subCaption: '', theme: 'classic' });
  const [isProcessing, setIsProcessing] = useState(false);
  
  const polaroidRef = useRef(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const data = await api.getPolaroids();
      setPhotos(data);
    } catch (error) {
      console.error("Failed to fetch gallery:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (photo) => {
    setSelectedPhoto(photo);
    setEditData({ caption: photo.caption || '', subCaption: photo.subCaption || '', theme: photo.theme || 'classic' });
    setIsEditing(false);
  };

  const closeModal = () => {
    setSelectedPhoto(null);
    setIsEditing(false);
  };

  // --- ACTIONS ---
  const handleDownload = async () => {
    if (!polaroidRef.current) return;
    try {
      setIsProcessing(true);
      const canvas = await html2canvas(polaroidRef.current, { useCORS: true, scale: 2 });
      const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
      const link = document.createElement("a");
      link.download = `PaperGlow-${Date.now()}.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      alert("Failed to download image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if(!window.confirm("Are you sure you want to delete this memory?")) return;
    try {
      setIsProcessing(true);
      await api.deletePolaroid(selectedPhoto.id);
      setPhotos(photos.filter(p => p.id !== selectedPhoto.id));
      closeModal();
    } catch (error) {
      alert("Failed to delete photo.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveEdit = async () => {
    try {
      setIsProcessing(true);
      const updatedPhoto = await api.updatePolaroid(selectedPhoto.id, editData);
      // Update local state so UI reflects changes immediately
      setPhotos(photos.map(p => p.id === selectedPhoto.id ? { ...p, ...editData } : p));
      setSelectedPhoto({ ...selectedPhoto, ...editData });
      setIsEditing(false);
    } catch (error) {
      alert("Failed to update photo.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <GalleryContainer>
      <TopNav><BackButton to="/capture"><ArrowLeft size={24} /></BackButton></TopNav>
      <HeaderSection>
        <Title>Memories Gallery</Title>
        <Subtitle>Your digital Polaroids scattered in time. A collection of moments that glow.</Subtitle>
      </HeaderSection>

      {isLoading ? (
        <LoaderContainer><Loader2 size={40} className="animate-spin" /><p>Developing photos...</p></LoaderContainer>
      ) : (
        <Grid initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
          {photos.map((photo, index) => {
            const currentTheme = FRAME_THEMES[photo.theme] || FRAME_THEMES.classic;
            const randomRotation = (index % 7) - 3; 

            return (
              <PolaroidCard 
                key={photo.id}
                onClick={() => openModal(photo)}
                $theme={currentTheme}
                style={{ rotate: randomRotation }}
                whileHover={{ scale: 1.05, rotate: 0, zIndex: 10, boxShadow: "0 30px 60px rgba(0,0,0,0.7)" }}
              >
                <PhotoFrame>
                  <Photo src={photo.imageUrl} alt="Polaroid" $effect={photo.hasFilmFilter} loading="lazy" />
                </PhotoFrame>
                <CaptionBlock>
                  <Caption $theme={currentTheme}>{photo.caption}</Caption>
                  <SubCaption $theme={currentTheme}>{photo.subCaption}</SubCaption>
                </CaptionBlock>
              </PolaroidCard>
            );
          })}
        </Grid>
      )}

      <FAB to="/capture"><Plus size={20} /> Capture Memory</FAB>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedPhoto && (
          <ModalOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <CloseButton onClick={closeModal}><X size={24} /></CloseButton>
            
            {/* The Polaroid (used for viewing and downloading) */}
            <PolaroidCard 
              ref={polaroidRef}
              $theme={FRAME_THEMES[isEditing ? editData.theme : selectedPhoto.theme] || FRAME_THEMES.classic}
              style={{ cursor: 'default', transform: 'scale(1.1)' }}
            >
              <PhotoFrame>
                <Photo src={selectedPhoto.imageUrl} $effect={selectedPhoto.hasFilmFilter} crossOrigin="anonymous" />
              </PhotoFrame>
              <CaptionBlock>
                <Caption $theme={FRAME_THEMES[isEditing ? editData.theme : selectedPhoto.theme]}>{isEditing ? editData.caption : selectedPhoto.caption}</Caption>
                <SubCaption $theme={FRAME_THEMES[isEditing ? editData.theme : selectedPhoto.theme]}>{isEditing ? editData.subCaption : selectedPhoto.subCaption}</SubCaption>
              </CaptionBlock>
            </PolaroidCard>

            {/* Editing Form */}
            {isEditing ? (
              <EditForm>
                <ThemeSelector>
                  {Object.values(FRAME_THEMES).map(t => (
                    <Swatch key={t.id} $color={t.bg} $active={editData.theme === t.id} onClick={() => setEditData({...editData, theme: t.id})} />
                  ))}
                </ThemeSelector>
                <Input value={editData.caption} onChange={e => setEditData({...editData, caption: e.target.value})} placeholder="Main Caption" />
                <Input value={editData.subCaption} onChange={e => setEditData({...editData, subCaption: e.target.value})} placeholder="Bottom Text (Date)" />
                <ActionBar style={{ justifyContent: 'space-between', marginTop: '10px' }}>
                  <ActionButton onClick={() => setIsEditing(false)}><X size={18}/> Cancel</ActionButton>
                  <ActionButton onClick={handleSaveEdit} disabled={isProcessing} style={{ color: '#c78933' }}>
                    {isProcessing ? <Loader2 size={18} className="animate-spin"/> : <Save size={18}/>} Save Changes
                  </ActionButton>
                </ActionBar>
              </EditForm>
            ) : (
              /* View Actions */
              <ActionBar>
                <ActionButton onClick={handleDownload} disabled={isProcessing}><Download size={18} /> Download</ActionButton>
                <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)', margin: '0 8px' }} />
                <ActionButton onClick={() => setIsEditing(true)}><Edit2 size={18} /> Edit</ActionButton>
                <ActionButton onClick={handleDelete} disabled={isProcessing} $danger><Trash2 size={18} /> Delete</ActionButton>
              </ActionBar>
            )}

          </ModalOverlay>
        )}
      </AnimatePresence>
    </GalleryContainer>
  );
};

export default Gallery;