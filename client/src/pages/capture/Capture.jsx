// Imports
import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Cropper from 'react-easy-crop';
import { 
  Timer, 
  SwitchCamera, 
  Sparkles, 
  Image as ImageIcon, 
  Aperture, 
  Zap,
  ArrowLeft,
  Check,
  X,
  Upload,
  LayoutGrid,
  CameraOff,
  Camera,
  Palette,
  Loader2 // Added for loading state
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// --- Frame Theme Presets ---
const FRAME_THEMES = [
  { id: 'classic', bg: '#ffffff', text: '#4b5563', subText: '#9ca3af', strip: '#f3f4f6' },
  { id: 'coral', bg: '#d97a5c', text: '#1e293b', subText: '#f8fafc', strip: '#c26549' },
  { id: 'slate', bg: '#1e293b', text: '#f8fafc', subText: '#94a3b8', strip: '#0f172a' },
  { id: 'sand', bg: '#e5d3b3', text: '#3f2a1d', subText: '#785b46', strip: '#d4c09e' },
];

// --- Helper Functions ---
const getFormattedDate = () => {
  const date = new Date();
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); 
    image.src = url;
  });

async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      resolve(URL.createObjectURL(file));
    }, 'image/jpeg');
  });
}

// ==========================================
// STYLED COMPONENTS (DARK HERO THEME)
// ==========================================
const CaptureContainer = styled.div`
  min-height: 100vh;
  background-color: #121826; /* Dark slate background */
  background-image: radial-gradient(circle at 50% 50%, #1a2235 0%, #121826 100%);
  display: flex;
  flex-direction: column;
  color: #ffffff;
  position: relative;
  overflow: hidden;
`;

const Header = styled.header`
  text-align: center;
  padding: 1.5rem 0;
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 1rem 0;
  }
`;

const TopNavButton = styled(Link)`
  position: absolute;
  top: 1.5rem;
  color: #9ca3af;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 10px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  text-decoration: none;

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    top: 1rem;
    padding: 8px;
  }
`;

const BackButton = styled(TopNavButton)`
  left: 2rem;
  @media (max-width: 768px) { left: 1rem; }
`;

const GalleryButton = styled(TopNavButton)`
  right: 2rem;
  @media (max-width: 768px) { right: 1rem; }
`;

const Title = styled.h1`
  font-family: 'Inter', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 0.25rem;

  @media (max-width: 768px) {
    font-size: 1.25rem;
    max-width: 60%;
  }
`;

const Subtitle = styled.p`
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-size: 0.95rem;
  color: #9ca3af;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Workspace = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 0 1rem;
    gap: 1.5rem;
  }
`;

const LeftToolbar = styled.div`
  position: absolute;
  left: 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  z-index: 20;

  @media (max-width: 768px) {
    position: static;
    flex-direction: row;
    justify-content: center;
    gap: 1rem;
    width: 100%;
  }
`;

const RightToolbar = styled(motion.div)`
  position: absolute;
  right: 3rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 20;
  background: rgba(255, 255, 255, 0.05); 
  padding: 12px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);

  @media (max-width: 768px) {
    position: static;
    flex-direction: row;
    padding: 8px 16px;
    border-radius: 30px;
    margin-top: -10px;
  }
`;

const ColorSwatch = styled(motion.button)`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${props => props.$color};
  border: 2px solid ${props => props.$isActive ? '#c78933' : 'rgba(255,255,255,0.2)'};
  cursor: pointer;
  outline: none;
  box-shadow: ${props => props.$isActive ? '0 0 10px rgba(199, 137, 51, 0.5)' : 'none'};
`;

const ToolButton = styled(motion.button)`
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: ${props => props.$danger ? '#ef4444' : '#9ca3af'};
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover, &.active {
    background-color: ${props => props.$danger ? 'rgba(239, 68, 68, 0.1)' : 'rgba(199, 137, 51, 0.15)'};
    border-color: ${props => props.$danger ? 'rgba(239, 68, 68, 0.3)' : 'rgba(199, 137, 51, 0.4)'};
    color: ${props => props.$danger ? '#ef4444' : '#c78933'}; /* Gold accent */
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

// --- Polaroid Frame Components ---
const PolaroidWrapper = styled(motion.div)`
  background-color: ${props => props.$theme.bg};
  padding: 16px 16px 90px 16px; 
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5); /* Stronger shadow for dark theme */
  border-radius: 2px;
  width: 100%;
  max-width: 460px;
  transform: rotate(-1deg);
  position: relative;
  z-index: 10;
  transition: background-color 0.3s ease;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 12px 12px 80px 12px;
    transform: rotate(0deg);
  }
`;

const ViewfinderFrame = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  background-color: #1a1e23;
  position: relative;
  border: ${props => props.$isColored ? '2px solid rgba(255, 255, 255, 0.9)' : 'none'};
  box-shadow: inset 0 3px 6px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border 0.3s ease;
`;

const VideoFeed = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: ${props => props.$isFrontCamera ? 'scaleX(-1)' : 'scaleX(1)'};
`;

const CapturedImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: ${props => props.$effect ? 'contrast(1.1) brightness(1.1) saturate(1.2) sepia(0.3) hue-rotate(-10deg)' : 'none'};
  transition: filter 0.3s ease;
`;

const FilmBadge = styled(motion.div)`
  position: absolute;
  bottom: 12px;
  right: 12px;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  color: #fef3c7;
  padding: 4px 10px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 1px;
  z-index: 20;
  border: 1px solid rgba(254, 243, 199, 0.2);
`;

const CaptionInput = styled.input`
  position: absolute;
  bottom: 40px; 
  left: 0;
  width: 100%;
  text-align: center;
  font-family: 'Caveat', cursive, serif;
  font-size: 1.8rem;
  color: ${props => props.$color};
  background: transparent;
  border: none;
  outline: none;
  transition: color 0.3s ease;

  &::placeholder {
    color: ${props => props.$color};
    opacity: 0.5;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
    bottom: 35px;
  }
`;

const BottomStrip = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 32px; 
  background-color: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
`;

const SubCaptionInput = styled.input`
  width: 100%;
  text-align: center;
  font-family: 'Caveat', cursive, serif; 
  font-size: 1.2rem; 
  font-weight: 500;
  color: ${props => props.$color};
  background: transparent;
  border: none;
  outline: none;
  opacity: 0.85;
  transition: color 0.3s ease;

  &::placeholder {
    color: ${props => props.$color};
    opacity: 0.5;
  }
`;

const IdleState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #6b7280;
`;

const LiveIndicator = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  padding: 4px 10px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 1px;
  z-index: 5;

  &::before {
    content: '';
    display: block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #ef4444;
    box-shadow: 0 0 8px #ef4444;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
`;

const Reticle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  z-index: 5;
`;

const BottomControls = styled.div`
  padding: 2rem 0 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rem;
  position: relative;
  z-index: 10;
  @media (max-width: 768px) { gap: 2.5rem; padding: 1.5rem 0 2rem; }
`;

const ActionGroup = styled.div` display: flex; flex-direction: column; align-items: center; gap: 8px; `;

const SecondaryButton = styled(motion.button)`
  background-color: rgba(255, 255, 255, 0.05); 
  color: #9ca3af; 
  border: 1px solid rgba(255, 255, 255, 0.05); 
  width: 54px; height: 54px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative;
  &:hover { background-color: rgba(255, 255, 255, 0.1); color: #ffffff; }
  @media (max-width: 768px) { width: 48px; height: 48px; }
`;

const HiddenFileInput = styled.input` position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; `;
const ActionLabel = styled.span` font-size: 0.7rem; font-weight: 600; color: #9ca3af; letter-spacing: 1px; `;

const ShutterOuter = styled(motion.button)`
  width: 84px; height: 84px; border-radius: 50%; 
  background: rgba(199, 137, 51, 0.15); /* Gold tint */
  border: 2px solid rgba(199, 137, 51, 0.4); 
  display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative;
  &::before { content: 'SHUTTER'; position: absolute; top: -24px; background: rgba(199, 137, 51, 0.15); color: #c78933; padding: 2px 8px; border-radius: 10px; font-size: 0.65rem; font-weight: 700; letter-spacing: 1px; }
  &:disabled { opacity: 0.5; cursor: not-allowed; border-color: rgba(156, 163, 175, 0.3); background: rgba(156, 163, 175, 0.1); &::before { color: #9ca3af; background: rgba(156, 163, 175, 0.2); } }
  @media (max-width: 768px) { width: 72px; height: 72px; &::before { top: -20px; font-size: 0.6rem; } }
`;

const ShutterInner = styled.div`
  width: 64px; height: 64px; border-radius: 50%; 
  background-color: ${props => props.$disabled ? '#4b5563' : '#c78933'}; 
  box-shadow: ${props => props.$disabled ? 'none' : '0 0 20px rgba(199, 137, 51, 0.5)'}; 
  display: flex; align-items: center; justify-content: center; color: #ffffff;
  @media (max-width: 768px) { width: 54px; height: 54px; }
`;

const ReviewControls = styled.div`
  display: flex; gap: 1.5rem; margin-top: 1rem;
  @media (max-width: 768px) { flex-direction: column; width: 100%; padding: 0 2rem; gap: 1rem; margin-top: 0; }
`;

const PrimaryActionButton = styled(motion.button)`
  background-color: #c78933; color: #ffffff; border: none; padding: 12px 24px; border-radius: 30px; font-size: 0.9rem; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; box-shadow: 0 10px 20px rgba(199, 137, 51, 0.3);
  &:hover { background-color: #b57a2b; }
  &:disabled { opacity: 0.7; cursor: not-allowed; }
  @media (max-width: 768px) { width: 100%; padding: 14px 24px; }
`;

const CancelActionButton = styled(motion.button)`
  background-color: transparent; color: #9ca3af; border: 1px solid #4b5563; padding: 12px 24px; border-radius: 30px; font-size: 0.9rem; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer;
  &:hover { color: #ffffff; border-color: #ffffff; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
  @media (max-width: 768px) { width: 100%; padding: 14px 24px; }
`;

const FlashOverlay = styled(motion.div)`
  position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: white; z-index: 100; pointer-events: none;
`;

// ==========================================
// COMPONENT LOGIC
// ==========================================
const Capture = () => {
  const navigate = useNavigate(); // Added for redirection after save

  const [viewState, setViewState] = useState('camera'); 
  const [isFilm35mmActive, setIsFilm35mmActive] = useState(false); 
  const [isFlashing, setIsFlashing] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Added for Save button state
  const [facingMode, setFacingMode] = useState('user');
  
  const [theme, setTheme] = useState(FRAME_THEMES[0]);
  const [caption, setCaption] = useState('');
  const [subCaption, setSubCaption] = useState(getFormattedDate());
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  
  const [uploadedImage, setUploadedImage] = useState(null);
  const [finalImage, setFinalImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const startCamera = async () => {
      stopCamera(); 
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          // Ideal resolution requests without forcing strict constraints ensures better Android/iOS compatibility
          video: { 
            width: { ideal: 1920 }, 
            height: { ideal: 1080 },
            facingMode: facingMode
          },
          audio: false
        });
        
        if (!isMounted || viewState !== 'camera') {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    };

    if (viewState === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, [viewState, facingMode, stopCamera]);

  const toggleCameraPower = () => {
    if (viewState === 'camera') setViewState('idle');
    else if (viewState === 'idle') setViewState('camera');
  };

  const flipCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const handleCapture = () => {
    if (!videoRef.current || viewState !== 'camera') return;

    setIsFlashing(true);
    
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    
    const size = Math.min(video.videoWidth, video.videoHeight);
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    const startX = (video.videoWidth - size) / 2;
    const startY = (video.videoHeight - size) / 2;

    if (facingMode === 'user') {
      ctx.translate(size, 0);
      ctx.scale(-1, 1);
    }
    
    ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size);
    
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    
    setTimeout(() => {
      setIsFlashing(false);
      setFinalImage(imageDataUrl);
      setViewState('review');
    }, 200);
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setUploadedImage(reader.result);
        setViewState('crop');
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleApplyCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(uploadedImage, croppedAreaPixels);
      setFinalImage(croppedImage);
      setViewState('review');
    } catch (e) {
      console.error("Error cropping image", e);
    }
  };

  const handleRetake = () => {
    setFinalImage(null);
    setUploadedImage(null);
    setViewState('camera');
    setTheme(FRAME_THEMES[0]);
    setCaption('');
    setSubCaption(getFormattedDate()); 
  };

  // --- SAVE LOGIC ---
  const handleSaveToGallery = async () => {
    if (!finalImage) return;
    setIsSaving(true);
    
    try {
      // 1. Safely convert Data URL or Object URL to a File Blob (Works flawlessly on iOS/Android)
      const response = await fetch(finalImage);
      const blob = await response.blob();
      
      // 2. Prepare the FormData payload expected by Multer
      const formData = new FormData();
      formData.append('image', blob, 'polaroid_capture.jpg');
      formData.append('caption', caption); 

      // 3. Post to the Express API
      const res = await fetch('/api/polaroids', {
        method: 'POST',
        body: formData,
        // Ensure Better Auth session cookies are sent with the request
        credentials: 'include' 
      });

      if (!res.ok) {
        throw new Error('Failed to save to database');
      }

      // 4. Redirect user to see their new photo
      navigate('/gallery');

    } catch (error) {
      console.error("Save Error:", error);
      // Fallback: If backend isn't linked yet, still redirect so the UI flow works during dev
      alert("Note: Failed to connect to server. Redirecting to gallery anyway for demo purposes.");
      navigate('/gallery');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <CaptureContainer>
      <AnimatePresence>
        {isFlashing && (
          <FlashOverlay
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      <Header>
        <BackButton to="/">
          <ArrowLeft size={24} color="#9ca3af" />
        </BackButton>
        
        <Title>Frame your moment</Title>
        <Subtitle>"The beauty of instant film, digitally preserved."</Subtitle>
        
        <GalleryButton to="/gallery" title="View Gallery">
          <LayoutGrid size={24} color="#9ca3af" />
        </GalleryButton>
      </Header>

      <Workspace>
        <LeftToolbar>
          <ToolButton 
            title={viewState === 'camera' ? "Close Camera" : "Open Camera"}
            onClick={toggleCameraPower}
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            $danger={viewState === 'camera'}
            disabled={viewState === 'crop' || viewState === 'review'}
          >
            {viewState === 'camera' ? <CameraOff size={20} /> : <Camera size={20} />}
          </ToolButton>

          <ToolButton 
            onClick={flipCamera}
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            disabled={viewState !== 'camera'}
            title="Flip Camera (Front/Back)"
          >
            <SwitchCamera size={20} />
          </ToolButton>

          <ToolButton 
            className={isFilm35mmActive ? 'active' : ''}
            onClick={() => setIsFilm35mmActive(!isFilm35mmActive)}
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            disabled={viewState === 'crop'}
            title="Toggle Film 35mm™ Filter"
          >
            <Sparkles size={20} />
          </ToolButton>
        </LeftToolbar>

        <AnimatePresence>
          {viewState === 'review' && (
            <RightToolbar
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Palette size={20} color="#9ca3af" style={{ margin: '0 auto 8px', display: 'block' }} />
              {FRAME_THEMES.map((t) => (
                <ColorSwatch 
                  key={t.id}
                  $color={t.bg}
                  $isActive={theme.id === t.id}
                  onClick={() => setTheme(t)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title={`Theme: ${t.id}`}
                />
              ))}
            </RightToolbar>
          )}
        </AnimatePresence>

        <PolaroidWrapper
          $theme={theme}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <ViewfinderFrame $isColored={theme.id !== 'classic'}>
            {viewState === 'camera' && (
              <>
                <LiveIndicator>LIVE</LiveIndicator>
                <Reticle />
                {/* PlaysInline and AutoPlay ensure iOS functionality */}
                <VideoFeed 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  $isFrontCamera={facingMode === 'user'} 
                />
              </>
            )}

            {viewState === 'idle' && (
              <IdleState>
                <CameraOff size={48} opacity={0.5} color="#9ca3af" />
                <p>Camera is off</p>
              </IdleState>
            )}

            {viewState === 'crop' && (
              <Cropper
                image={uploadedImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                style={{
                  containerStyle: { background: '#1a1e23' }
                }}
              />
            )}

            {viewState === 'review' && (
              <>
                <CapturedImage 
                  src={finalImage} 
                  alt="Captured Polaroid" 
                  $effect={isFilm35mmActive} 
                />
                <AnimatePresence>
                  {isFilm35mmActive && (
                    <FilmBadge
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <Sparkles size={12} color="#c78933" /> Film 35mm™
                    </FilmBadge>
                  )}
                </AnimatePresence>
              </>
            )}
          </ViewfinderFrame>

          <CaptionInput 
            type="text"
            placeholder={viewState === 'review' ? "Write a caption..." : ""}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            $color={theme.text}
            disabled={viewState !== 'review'}
            spellCheck="false"
          />

          <BottomStrip $color={theme.strip}>
            <SubCaptionInput 
              type="text"
              value={subCaption}
              onChange={(e) => setSubCaption(e.target.value)}
              $color={theme.subText}
              disabled={viewState !== 'review'}
              spellCheck="false"
            />
          </BottomStrip>

        </PolaroidWrapper>
      </Workspace>

      <BottomControls>
        {(viewState === 'camera' || viewState === 'idle') && (
          <>
            <ActionGroup>
              <SecondaryButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <ImageIcon size={22} />
                <HiddenFileInput 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                />
              </SecondaryButton>
              <ActionLabel>UPLOAD</ActionLabel>
            </ActionGroup>

            <ActionGroup>
              <ShutterOuter 
                onClick={handleCapture} 
                whileHover={{ scale: viewState === 'camera' ? 1.05 : 1 }} 
                whileTap={{ scale: viewState === 'camera' ? 0.9 : 1 }}
                disabled={viewState !== 'camera'}
              >
                <ShutterInner $disabled={viewState !== 'camera'}>
                  <Aperture size={32} />
                </ShutterInner>
              </ShutterOuter>
            </ActionGroup>

            <ActionGroup>
              <SecondaryButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Zap size={22} />
              </SecondaryButton>
              <ActionLabel>AUTO</ActionLabel>
            </ActionGroup>
          </>
        )}

        {viewState === 'crop' && (
          <ReviewControls>
            <CancelActionButton onClick={handleRetake} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <X size={18} /> Cancel
            </CancelActionButton>
            <PrimaryActionButton onClick={handleApplyCrop} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Check size={18} /> Apply Crop
            </PrimaryActionButton>
          </ReviewControls>
        )}

        {viewState === 'review' && (
          <ReviewControls>
            <CancelActionButton 
              onClick={handleRetake} 
              disabled={isSaving}
              whileHover={!isSaving ? { scale: 1.05 } : {}} 
              whileTap={!isSaving ? { scale: 0.95 } : {}}
            >
              <X size={18} /> Retake
            </CancelActionButton>
            
            {/* Functional Save Button */}
            <PrimaryActionButton 
              onClick={handleSaveToGallery}
              disabled={isSaving}
              whileHover={!isSaving ? { scale: 1.05 } : {}} 
              whileTap={!isSaving ? { scale: 0.95 } : {}}
            >
              {isSaving ? (
                <><Loader2 size={18} className="animate-spin" /> Saving...</>
              ) : (
                <><Upload size={18} /> Save to Gallery</>
              )}
            </PrimaryActionButton>
          </ReviewControls>
        )}
      </BottomControls>
    </CaptureContainer>
  );
};

export default Capture;