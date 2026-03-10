// Imports
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  ArrowLeft,
  Loader2,
  Image as ImageIcon,
  Trash2,
  Download,
  Edit2,
  X,
  Save,
  Type,
} from "lucide-react";
import { Link } from "react-router-dom";
import html2canvas from "html2canvas";
import { api } from "../../lib/api";

const FRAME_THEMES = {
  classic: {
    id: "classic",
    bg: "#ffffff",
    text: "#4b5563",
    subText: "#9ca3af",
    strip: "#f3f4f6",
  },
  coral: {
    id: "coral",
    bg: "#d97a5c",
    text: "#1e293b",
    subText: "#f8fafc",
    strip: "#c26549",
  },
  slate: {
    id: "slate",
    bg: "#1e293b",
    text: "#f8fafc",
    subText: "#94a3b8",
    strip: "#0f172a",
  },
  sand: {
    id: "sand",
    bg: "#e5d3b3",
    text: "#3f2a1d",
    subText: "#785b46",
    strip: "#d4c09e",
  },
};

// UPDATED: Standard Fonts + Handwriting
const FONT_OPTIONS = [
  { id: "caveat", css: "'Caveat', cursive" },
  { id: "times", css: "'Times New Roman', Times, serif" },
  { id: "arial", css: "Arial, Helvetica, sans-serif" },
  { id: "inter", css: "'Inter', sans-serif" },
];

const IMAGE_FILTERS = {
  none: "none",
  film35mm:
    "contrast(1.1) brightness(1.1) saturate(1.2) sepia(0.3) hue-rotate(-10deg)",
  bw: "grayscale(100%) contrast(1.2)",
  vintage: "sepia(0.6) contrast(1.1) brightness(0.9) hue-rotate(-15deg)",
  lens360: "contrast(1.3) saturate(1.5) brightness(0.9)",
  cyber: "hue-rotate(90deg) saturate(2) contrast(1.2)",
  dream: "blur(1px) contrast(1.1) brightness(1.1) saturate(1.3)",
  cool: "sepia(0.2) hue-rotate(180deg) saturate(1.2)",
};

const getFontCss = (fontId) => {
  const font = FONT_OPTIONS.find((f) => f.id === fontId);
  return font ? font.css : "'Caveat', cursive";
};

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

const bakeFilterIntoImage = async (imageSrc, filterCss) => {
  if (!filterCss || filterCss === "none") return imageSrc;
  const img = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx.filter = filterCss;
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL("image/jpeg", 0.95);
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
  @media (max-width: 768px) {
    padding: 2rem 1.5rem 6rem 1.5rem;
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
  transition: all 0.2s;
  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const HeaderSection = styled.div`
  margin-bottom: 4rem;
  @media (max-width: 768px) {
    margin-bottom: 3rem;
  }
`;
const Title = styled.h1`
  font-family: "Inter", sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;
const Subtitle = styled.p`
  color: #6b7280;
  line-height: 1.5;
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
  background-color: ${(props) => props.$theme.bg};
  padding: 12px 12px 50px 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border-radius: 2px;
  width: 100%;
  max-width: 320px;
  position: relative;
  cursor: pointer;
  transform-origin: center;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const PhotoFrame = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  background-color: #1a1e23;
  overflow: hidden;
  box-shadow: ${(props) =>
    props.$is360
      ? "inset 0 0 60px 15px rgba(0,0,0,0.8)"
      : "inset 0 2px 4px rgba(0,0,0,0.1)"};
`;

const Photo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: ${(props) => props.$effectCss};
`;

const CaptionBlock = styled.div`
  position: absolute;
  bottom: 12px;
  left: 0;
  width: 100%;
  text-align: center;
`;

const Caption = styled.h3`
  font-family: ${(props) => props.$fontFamily};
  font-size: 1.6rem;
  color: ${(props) => props.$theme.text};
  margin-bottom: -4px;
`;
const SubCaption = styled.p`
  font-family: ${(props) => props.$fontFamily};
  font-size: 1.1rem;
  color: ${(props) => props.$theme.subText};
`;

const FAB = styled(Link)`
  position: fixed;
  bottom: 2.5rem;
  right: 2.5rem;
  background-color: #c78933;
  color: #ffffff;
  padding: 16px 28px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 10px 25px rgba(199, 137, 51, 0.4);
  z-index: 50;
  &:hover {
    background-color: #b57a2b;
    transform: translateY(-2px);
  }
  @media (max-width: 768px) {
    bottom: 1.5rem;
    right: 1.5rem;
    padding: 14px 24px;
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5rem;
  color: #c78933;
  gap: 1rem;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: #6b7280;
  background: rgba(255, 255, 255, 0.02);
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  margin-top: 2rem;
  h3 {
    color: #ffffff;
    margin: 1rem 0 0.5rem;
    font-size: 1.5rem;
  }
  p {
    max-width: 400px;
    line-height: 1.5;
  }
`;

// ==========================================
// STYLED COMPONENTS (Modal & Actions)
// ==========================================
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const ActionBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 12px 24px;
  border-radius: 30px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => (props.$danger ? "#ef4444" : "#ffffff")};
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const EditForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
  width: 100%;
  max-width: 320px;
`;
const Input = styled.input`
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid #4b5563;
  background: #1f2937;
  color: white;
  outline: none;
  &:focus {
    border-color: #c78933;
  }
`;
const ThemeSelector = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 5px;
`;
const Swatch = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${(props) => props.$color};
  border: 2px solid ${(props) => (props.$active ? "#c78933" : "transparent")};
  cursor: pointer;
`;

const FontButton = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${(props) => (props.$active ? "#c78933" : "transparent")};
  cursor: pointer;
  outline: none;
  font-family: ${(props) => props.$fontFamily};
`;

// ==========================================
// COMPONENT LOGIC
// ==========================================
const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    caption: "",
    subCaption: "",
    theme: "classic",
    fontFamily: "caveat",
  });
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
    setEditData({
      caption: photo.caption || "",
      subCaption: photo.subCaption || "",
      theme: photo.theme || "classic",
      fontFamily: photo.fontFamily || "caveat",
    });
    setIsEditing(false);
  };

  const closeModal = () => {
    setSelectedPhoto(null);
    setIsEditing(false);
  };

  // --- ACTIONS ---
  const handleDownload = async () => {
    if (!polaroidRef.current || !selectedPhoto) return;
    try {
      setIsProcessing(true);

      const filterCss = IMAGE_FILTERS[selectedPhoto.filterName] || "none";
      const bakedImageSrc = await bakeFilterIntoImage(
        selectedPhoto.imageUrl,
        filterCss
      );

      const canvas = await html2canvas(polaroidRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: null,
        onclone: (clonedDoc) => {
          const imgElement = clonedDoc.querySelector("img");
          if (imgElement) {
            imgElement.src = bakedImageSrc;
            imgElement.style.filter = "none";
          }
        },
      });

      const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
      const link = document.createElement("a");
      link.download = `PaperGlow-${Date.now()}.jpg`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert("Failed to download image.");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this memory?")) return;
    try {
      setIsProcessing(true);
      await api.deletePolaroid(selectedPhoto.id);
      setPhotos(photos.filter((p) => p.id !== selectedPhoto.id));
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
      setPhotos(
        photos.map((p) =>
          p.id === selectedPhoto.id ? { ...p, ...editData } : p
        )
      );
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
      <TopNav>
        <BackButton to="/capture">
          <ArrowLeft size={24} />
        </BackButton>
      </TopNav>
      <HeaderSection>
        <Title>Memories Gallery</Title>
        <Subtitle>
          Your digital Polaroids scattered in time. A collection of moments that
          glow.
        </Subtitle>
      </HeaderSection>

      {isLoading ? (
        <LoaderContainer>
          <Loader2 size={40} className="animate-spin" />
          <p>Developing photos...</p>
        </LoaderContainer>
      ) : photos.length === 0 ? (
        <EmptyState>
          <ImageIcon size={48} opacity={0.5} />
          <h3>No memories yet</h3>
          <p>
            Your gallery is completely empty. Head over to the capture page to
            snap your first digital Polaroid!
          </p>
        </EmptyState>
      ) : (
        <Grid
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        >
          {photos.map((photo, index) => {
            const currentTheme =
              FRAME_THEMES[photo.theme] || FRAME_THEMES.classic;
            const randomRotation = (index % 7) - 3;
            const currentFontCss = getFontCss(photo.fontFamily);

            return (
              <PolaroidCard
                key={photo.id}
                onClick={() => openModal(photo)}
                $theme={currentTheme}
                style={{ rotate: randomRotation }}
                whileHover={{
                  scale: 1.05,
                  rotate: 0,
                  zIndex: 10,
                  boxShadow: "0 30px 60px rgba(0,0,0,0.7)",
                }}
              >
                <PhotoFrame $is360={photo.filterName === "lens360"}>
                  <Photo
                    src={photo.imageUrl}
                    alt={photo.caption || "Polaroid"}
                    $effectCss={IMAGE_FILTERS[photo.filterName] || "none"}
                    loading="lazy"
                    crossOrigin="anonymous"
                  />
                </PhotoFrame>
                <CaptionBlock>
                  <Caption $theme={currentTheme} $fontFamily={currentFontCss}>
                    {photo.caption}
                  </Caption>
                  <SubCaption
                    $theme={currentTheme}
                    $fontFamily={currentFontCss}
                  >
                    {photo.subCaption}
                  </SubCaption>
                </CaptionBlock>
              </PolaroidCard>
            );
          })}
        </Grid>
      )}

      <FAB to="/capture">
        <Plus size={20} /> Capture Memory
      </FAB>

      <AnimatePresence>
        {selectedPhoto && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CloseButton onClick={closeModal}>
              <X size={24} />
            </CloseButton>

            <PolaroidCard
              ref={polaroidRef}
              $theme={
                FRAME_THEMES[
                  isEditing ? editData.theme : selectedPhoto.theme
                ] || FRAME_THEMES.classic
              }
              style={{ cursor: "default", transform: "scale(1.1)" }}
            >
              <PhotoFrame $is360={selectedPhoto.filterName === "lens360"}>
                <Photo
                  src={selectedPhoto.imageUrl}
                  $effectCss={IMAGE_FILTERS[selectedPhoto.filterName] || "none"}
                  crossOrigin="anonymous"
                />
              </PhotoFrame>
              <CaptionBlock>
                <Caption
                  $theme={
                    FRAME_THEMES[
                      isEditing ? editData.theme : selectedPhoto.theme
                    ]
                  }
                  $fontFamily={getFontCss(
                    isEditing ? editData.fontFamily : selectedPhoto.fontFamily
                  )}
                >
                  {isEditing ? editData.caption : selectedPhoto.caption}
                </Caption>
                <SubCaption
                  $theme={
                    FRAME_THEMES[
                      isEditing ? editData.theme : selectedPhoto.theme
                    ]
                  }
                  $fontFamily={getFontCss(
                    isEditing ? editData.fontFamily : selectedPhoto.fontFamily
                  )}
                >
                  {isEditing ? editData.subCaption : selectedPhoto.subCaption}
                </SubCaption>
              </CaptionBlock>
            </PolaroidCard>

            {isEditing ? (
              <EditForm>
                <ThemeSelector>
                  {Object.values(FRAME_THEMES).map((t) => (
                    <Swatch
                      type="button"
                      key={t.id}
                      $color={t.bg}
                      $active={editData.theme === t.id}
                      onClick={() => setEditData({ ...editData, theme: t.id })}
                    />
                  ))}
                </ThemeSelector>
                <ThemeSelector>
                  {FONT_OPTIONS.map((f) => (
                    <FontButton
                      type="button"
                      key={f.id}
                      $fontFamily={f.css}
                      $active={editData.fontFamily === f.id}
                      onClick={() =>
                        setEditData({ ...editData, fontFamily: f.id })
                      }
                    >
                      Ag
                    </FontButton>
                  ))}
                </ThemeSelector>
                <Input
                  value={editData.caption}
                  onChange={(e) =>
                    setEditData({ ...editData, caption: e.target.value })
                  }
                  placeholder="Main Caption"
                />
                <Input
                  value={editData.subCaption}
                  onChange={(e) =>
                    setEditData({ ...editData, subCaption: e.target.value })
                  }
                  placeholder="Bottom Text (Date)"
                />
                <ActionBar
                  style={{ justifyContent: "space-between", marginTop: "10px" }}
                >
                  <ActionButton
                    type="button"
                    onClick={() => setIsEditing(false)}
                  >
                    <X size={18} /> Cancel
                  </ActionButton>
                  <ActionButton
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={isProcessing}
                    style={{ color: "#c78933" }}
                  >
                    {isProcessing ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Save size={18} />
                    )}{" "}
                    Save Changes
                  </ActionButton>
                </ActionBar>
              </EditForm>
            ) : (
              <ActionBar>
                <ActionButton onClick={handleDownload} disabled={isProcessing}>
                  <Download size={18} /> Download
                </ActionButton>
                <div
                  style={{
                    width: "1px",
                    background: "rgba(255,255,255,0.2)",
                    margin: "0 8px",
                  }}
                />
                <ActionButton onClick={() => setIsEditing(true)}>
                  <Edit2 size={18} /> Edit
                </ActionButton>
                <ActionButton
                  onClick={handleDelete}
                  disabled={isProcessing}
                  $danger
                >
                  <Trash2 size={18} /> Delete
                </ActionButton>
              </ActionBar>
            )}
          </ModalOverlay>
        )}
      </AnimatePresence>
    </GalleryContainer>
  );
};

export default Gallery;
