// Imports
import React, { useState, useRef, useEffect, useCallback } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import Cropper from "react-easy-crop";
import html2canvas from "html2canvas";
import {
  SwitchCamera,
  Image as ImageIcon,
  Aperture,
  Zap,
  ArrowLeft,
  Check,
  X,
  Upload,
  Download,
  LayoutGrid,
  CameraOff,
  Camera,
  Palette,
  Loader2,
  Wand2,
  Type, // NEW: Imported for the font selector
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../lib/api";

// --- Frame Theme Presets ---
const FRAME_THEMES = [
  {
    id: "classic",
    bg: "#ffffff",
    text: "#4b5563",
    subText: "#9ca3af",
    strip: "#f3f4f6",
  },
  {
    id: "coral",
    bg: "#d97a5c",
    text: "#1e293b",
    subText: "#f8fafc",
    strip: "#c26549",
  },
  {
    id: "slate",
    bg: "#1e293b",
    text: "#f8fafc",
    subText: "#94a3b8",
    strip: "#0f172a",
  },
  {
    id: "sand",
    bg: "#e5d3b3",
    text: "#3f2a1d",
    subText: "#785b46",
    strip: "#d4c09e",
  },
];

// --- NEW: Font Presets ---
const FONT_OPTIONS = [
  { id: "caveat", css: "'Caveat', cursive" },
  { id: "kalam", css: "'Kalam', cursive" },
  { id: "marker", css: "'Permanent Marker', cursive" },
  { id: "indie", css: "'Indie Flower', cursive" },
];

// --- Image Filters ---
const IMAGE_FILTERS = [
  { id: "none", name: "Normal", css: "none" },
  {
    id: "film35mm",
    name: "35mm Film",
    css: "contrast(1.1) brightness(1.1) saturate(1.2) sepia(0.3) hue-rotate(-10deg)",
  },
  { id: "bw", name: "B & W", css: "grayscale(100%) contrast(1.2)" },
  {
    id: "vintage",
    name: "Vintage",
    css: "sepia(0.6) contrast(1.1) brightness(0.9) hue-rotate(-15deg)",
  },
  {
    id: "lens360",
    name: "Lens 360",
    css: "contrast(1.3) saturate(1.5) brightness(0.9)",
  },
  {
    id: "cyber",
    name: "Cyberpunk",
    css: "hue-rotate(90deg) saturate(2) contrast(1.2)",
  },
  {
    id: "dream",
    name: "Dreamy",
    css: "blur(1px) contrast(1.1) brightness(1.1) saturate(1.3)",
  },
  {
    id: "cool",
    name: "Cool Breeze",
    css: "sepia(0.2) hue-rotate(180deg) saturate(1.2)",
  },
];

// --- Helper Functions ---
const getFormattedDate = () => {
  const date = new Date();
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
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
    canvas.toBlob((file) => resolve(URL.createObjectURL(file)), "image/jpeg");
  });
}

// NEW: Helper to permanently burn the CSS filter into the image pixels for downloading
const bakeFilterIntoImage = async (imageSrc, filterCss) => {
  if (filterCss === "none") return imageSrc;
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
// STYLED COMPONENTS
// ==========================================
const CaptureContainer = styled.div`
  min-height: 100vh;
  background-color: #121826;
  background-image: radial-gradient(
    circle at 50% 50%,
    #1a2235 0%,
    #121826 100%
  );
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
  @media (max-width: 768px) {
    left: 1rem;
  }
`;
const GalleryButton = styled(TopNavButton)`
  right: 2rem;
  @media (max-width: 768px) {
    right: 1rem;
  }
`;

const Title = styled.h1`
  font-family: "Inter", sans-serif;
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
  font-family: "Playfair Display", serif;
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
    gap: 1rem;
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
    margin-bottom: 0.5rem;
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
    margin-top: 1rem;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const ColorSwatch = styled(motion.button)`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${(props) => props.$color};
  border: 2px solid
    ${(props) => (props.$isActive ? "#c78933" : "rgba(255,255,255,0.2)")};
  cursor: pointer;
  outline: none;
  box-shadow: ${(props) =>
    props.$isActive ? "0 0 10px rgba(199, 137, 51, 0.5)" : "none"};
`;

// NEW: Font selection button
const FontButton = styled(motion.button)`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${(props) => (props.$isActive ? "#c78933" : "transparent")};
  cursor: pointer;
  outline: none;
  font-family: ${(props) => props.$fontFamily};
`;

const ToolButton = styled(motion.button)`
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: ${(props) => (props.$danger ? "#ef4444" : "#9ca3af")};
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover,
  &.active {
    background-color: ${(props) =>
      props.$danger ? "rgba(239, 68, 68, 0.1)" : "rgba(199, 137, 51, 0.15)"};
    border-color: ${(props) =>
      props.$danger ? "rgba(239, 68, 68, 0.3)" : "rgba(199, 137, 51, 0.4)"};
    color: ${(props) => (props.$danger ? "#ef4444" : "#c78933")};
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

const PolaroidContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 460px;
`;

const PolaroidWrapper = styled(motion.div)`
  background-color: ${(props) => props.$theme.bg};
  padding: 16px 16px 90px 16px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
  border-radius: 2px;
  width: 100%;
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
  border: ${(props) =>
    props.$isColored ? "2px solid rgba(255, 255, 255, 0.9)" : "none"};
  box-shadow: ${(props) =>
    props.$is360
      ? "inset 0 0 80px 20px rgba(0,0,0,0.8)"
      : "inset 0 3px 6px rgba(0, 0, 0, 0.2)"};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
`;

const VideoFeed = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: ${(props) => (props.$isFrontCamera ? "scaleX(-1)" : "scaleX(1)")};
  filter: ${(props) => props.$effectCss};
  transition: filter 0.3s ease;
`;

const CapturedImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: ${(props) => props.$effectCss};
  transition: filter 0.3s ease;
`;

const FilterBadge = styled(motion.div)`
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
  font-family: ${(props) => props.$fontFamily}; /* Dynamically updated font */
  font-size: 1.8rem;
  color: ${(props) => props.$color};
  background: transparent;
  border: none;
  outline: none;
  transition: color 0.3s ease;
  &::placeholder {
    color: ${(props) => props.$color};
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
  background-color: ${(props) => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
`;

const SubCaptionInput = styled.input`
  width: 100%;
  text-align: center;
  font-family: ${(props) => props.$fontFamily}; /* Dynamically updated font */
  font-size: 1.2rem;
  font-weight: 500;
  color: ${(props) => props.$color};
  background: transparent;
  border: none;
  outline: none;
  opacity: 0.85;
  transition: color 0.3s ease;
  &::placeholder {
    color: ${(props) => props.$color};
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
    content: "";
    display: block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #ef4444;
    box-shadow: 0 0 8px #ef4444;
    animation: pulse 1.5s infinite;
  }
  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }
`;

const FilterMenu = styled(motion.div)`
  position: absolute;
  bottom: -55px;
  left: 0;
  right: 0;
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 10px 5px;
  z-index: 30;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  @media (max-width: 768px) {
    bottom: -50px;
  }
`;

const FilterOption = styled.button`
  background: ${(props) =>
    props.$isActive ? "#c78933" : "rgba(255,255,255,0.1)"};
  color: ${(props) => (props.$isActive ? "#ffffff" : "#9ca3af")};
  border: 1px solid
    ${(props) => (props.$isActive ? "#c78933" : "rgba(255,255,255,0.2)")};
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: ${(props) =>
      props.$isActive ? "#c78933" : "rgba(255,255,255,0.2)"};
    color: #fff;
  }
`;

const BottomControls = styled.div`
  padding: 3rem 0 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rem;
  position: relative;
  z-index: 10;
  @media (max-width: 768px) {
    gap: 2.5rem;
    padding: 3rem 0 2rem;
  }
`;

const ActionGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const SecondaryButton = styled(motion.button)`
  background-color: rgba(255, 255, 255, 0.05);
  color: #9ca3af;
  border: 1px solid rgba(255, 255, 255, 0.05);
  width: 54px;
  height: 54px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: #ffffff;
  }
  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
  }
`;

const HiddenFileInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
`;
const ActionLabel = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  color: #9ca3af;
  letter-spacing: 1px;
`;

const ShutterOuter = styled(motion.button)`
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background: rgba(199, 137, 51, 0.15);
  border: 2px solid rgba(199, 137, 51, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  &::before {
    content: "SHUTTER";
    position: absolute;
    top: -24px;
    background: rgba(199, 137, 51, 0.15);
    color: #c78933;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 1px;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    border-color: rgba(156, 163, 175, 0.3);
    background: rgba(156, 163, 175, 0.1);
    &::before {
      color: #9ca3af;
      background: rgba(156, 163, 175, 0.2);
    }
  }
  @media (max-width: 768px) {
    width: 72px;
    height: 72px;
    &::before {
      top: -20px;
      font-size: 0.6rem;
    }
  }
`;

const ShutterInner = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: ${(props) => (props.$disabled ? "#4b5563" : "#c78933")};
  box-shadow: ${(props) =>
    props.$disabled ? "none" : "0 0 20px rgba(199, 137, 51, 0.5)"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  @media (max-width: 768px) {
    width: 54px;
    height: 54px;
  }
`;

const ReviewControls = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    padding: 0 2rem;
    gap: 1rem;
    margin-top: 0;
  }
`;

const PrimaryActionButton = styled(motion.button)`
  background-color: #c78933;
  color: #ffffff;
  border: none;
  padding: 12px 24px;
  border-radius: 30px;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(199, 137, 51, 0.3);
  &:hover {
    background-color: #b57a2b;
  }
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  @media (max-width: 768px) {
    width: 100%;
    padding: 14px 24px;
  }
`;

const CancelActionButton = styled(motion.button)`
  background-color: transparent;
  color: #9ca3af;
  border: 1px solid #4b5563;
  padding: 12px 24px;
  border-radius: 30px;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  &:hover {
    color: #ffffff;
    border-color: #ffffff;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  @media (max-width: 768px) {
    width: 100%;
    padding: 14px 24px;
  }
`;

const FlashOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  z-index: 100;
  pointer-events: none;
`;

// ==========================================
// COMPONENT LOGIC
// ==========================================
const Capture = () => {
  const navigate = useNavigate();

  const [viewState, setViewState] = useState("camera");
  const [isFlashing, setIsFlashing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [facingMode, setFacingMode] = useState("user");

  const [theme, setTheme] = useState(FRAME_THEMES[0]);
  const [activeFont, setActiveFont] = useState(FONT_OPTIONS[0]); // NEW: Font State
  const [activeFilter, setActiveFilter] = useState(IMAGE_FILTERS[0]);
  const [showFilters, setShowFilters] = useState(false);

  const [caption, setCaption] = useState("");
  const [subCaption, setSubCaption] = useState(getFormattedDate());

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const polaroidRef = useRef(null);

  const [uploadedImage, setUploadedImage] = useState(null);
  const [finalImage, setFinalImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
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
          video: {
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            facingMode: facingMode,
          },
          audio: false,
        });
        if (!isMounted || viewState !== "camera") {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    };
    if (viewState === "camera") startCamera();
    else stopCamera();
    return () => {
      isMounted = false;
      stopCamera();
    };
  }, [viewState, facingMode, stopCamera]);

  const toggleCameraPower = () => {
    viewState === "camera" ? setViewState("idle") : setViewState("camera");
  };
  const flipCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const handleCapture = () => {
    if (!videoRef.current || viewState !== "camera") return;
    setIsFlashing(true);

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    const size = Math.min(video.videoWidth, video.videoHeight);

    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    const startX = (video.videoWidth - size) / 2;
    const startY = (video.videoHeight - size) / 2;

    if (facingMode === "user") {
      ctx.translate(size, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size);
    const imageDataUrl = canvas.toDataURL("image/jpeg", 0.9);

    setTimeout(() => {
      setIsFlashing(false);
      setFinalImage(imageDataUrl);
      setViewState("review");
      setShowFilters(false);
    }, 200);
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setUploadedImage(reader.result);
        setViewState("crop");
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleApplyCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(
        uploadedImage,
        croppedAreaPixels
      );
      setFinalImage(croppedImage);
      setViewState("review");
    } catch (e) {
      console.error("Error cropping image", e);
    }
  };

  const handleRetake = () => {
    setFinalImage(null);
    setUploadedImage(null);
    setViewState("camera");
    setTheme(FRAME_THEMES[0]);
    setActiveFont(FONT_OPTIONS[0]);
    setActiveFilter(IMAGE_FILTERS[0]);
    setCaption("");
    setSubCaption(getFormattedDate());
  };

  const handleSaveToDevice = async () => {
    if (!polaroidRef.current || !finalImage) return;
    setIsSaving(true);

    try {
      document.activeElement?.blur();

      // 1. Bake the filter into the image so html2canvas captures it
      const bakedImageSrc = await bakeFilterIntoImage(
        finalImage,
        activeFilter.css
      );

      // 2. Temporarily swap the UI image with the "baked" image
      const imgElement = polaroidRef.current.querySelector("img");
      const originalFilter = imgElement.style.filter;
      const originalSrc = imgElement.src;

      imgElement.src = bakedImageSrc;
      imgElement.style.filter = "none"; // Remove CSS filter so it doesn't double-apply

      // Wait a tiny moment for the DOM to update
      await new Promise((resolve) => setTimeout(resolve, 100));

      // 3. Take the screenshot
      const canvas = await html2canvas(polaroidRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: null,
      });

      // 4. Restore the UI image back to normal
      imgElement.src = originalSrc;
      imgElement.style.filter = originalFilter;

      // 5. Download the screenshot
      const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
      const link = document.createElement("a");
      link.download = `PaperGlow-${Date.now()}.jpg`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert("Oops! Couldn't save the image to your device.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveToGallery = async () => {
    if (!finalImage) return;
    setIsSaving(true);

    try {
      const response = await fetch(finalImage);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append("image", blob, "polaroid_capture.jpg");
      formData.append("caption", caption);
      formData.append("subCaption", subCaption);
      formData.append("theme", theme.id);
      formData.append("fontFamily", activeFont.id); // NEW: Send the font choice to the backend!
      formData.append("filterName", activeFilter.id);

      await api.uploadPolaroid(formData);
      navigate("/gallery");
    } catch (error) {
      console.error("Save Error:", error.message);
      alert(`Failed to save: ${error.message}`);
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
            title={viewState === "camera" ? "Close Camera" : "Open Camera"}
            onClick={toggleCameraPower}
            $danger={viewState === "camera"}
            disabled={viewState === "crop" || viewState === "review"}
          >
            {viewState === "camera" ? (
              <CameraOff size={20} />
            ) : (
              <Camera size={20} />
            )}
          </ToolButton>
          <ToolButton
            onClick={flipCamera}
            disabled={viewState !== "camera"}
            title="Flip Camera"
          >
            <SwitchCamera size={20} />
          </ToolButton>
          <ToolButton
            className={showFilters ? "active" : ""}
            onClick={() => setShowFilters(!showFilters)}
            disabled={viewState === "crop"}
            title="Toggle Image Filters"
          >
            <Wand2 size={20} />
          </ToolButton>
        </LeftToolbar>

        <AnimatePresence>
          {viewState === "review" && (
            <RightToolbar
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Palette
                size={20}
                color="#9ca3af"
                style={{ margin: "0 auto 4px", display: "block" }}
              />
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {FRAME_THEMES.map((t) => (
                  <ColorSwatch
                    key={t.id}
                    $color={t.bg}
                    $isActive={theme.id === t.id}
                    onClick={() => setTheme(t)}
                    title={`Theme: ${t.id}`}
                  />
                ))}
              </div>

              <div
                style={{
                  width: "100%",
                  height: "1px",
                  background: "rgba(255,255,255,0.1)",
                  margin: "8px 0",
                }}
              />

              <Type
                size={18}
                color="#9ca3af"
                style={{ margin: "0 auto 4px", display: "block" }}
              />
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {FONT_OPTIONS.map((f) => (
                  <FontButton
                    key={f.id}
                    $fontFamily={f.css}
                    $isActive={activeFont.id === f.id}
                    onClick={() => setActiveFont(f)}
                    title={`Font: ${f.id}`}
                  >
                    Ag
                  </FontButton>
                ))}
              </div>
            </RightToolbar>
          )}
        </AnimatePresence>

        <PolaroidContainer>
          <PolaroidWrapper
            ref={polaroidRef}
            $theme={theme}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <ViewfinderFrame
              $isColored={theme.id !== "classic"}
              $is360={activeFilter.id === "lens360"}
            >
              {viewState === "camera" && (
                <>
                  <LiveIndicator>LIVE</LiveIndicator>
                  <VideoFeed
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    $isFrontCamera={facingMode === "user"}
                    $effectCss={activeFilter.css}
                  />
                </>
              )}

              {viewState === "idle" && (
                <IdleState>
                  <CameraOff size={48} opacity={0.5} color="#9ca3af" />
                  <p>Camera is off</p>
                </IdleState>
              )}

              {viewState === "crop" && (
                <Cropper
                  image={uploadedImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  style={{ containerStyle: { background: "#1a1e23" } }}
                />
              )}

              {viewState === "review" && (
                <>
                  <CapturedImage
                    src={finalImage}
                    alt="Captured Polaroid"
                    $effectCss={activeFilter.css}
                  />
                  <AnimatePresence>
                    {activeFilter.id !== "none" && (
                      <FilterBadge
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <Wand2 size={12} color="#c78933" /> {activeFilter.name}
                      </FilterBadge>
                    )}
                  </AnimatePresence>
                </>
              )}
            </ViewfinderFrame>

            <CaptionInput
              type="text"
              placeholder={viewState === "review" ? "Write a caption..." : ""}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              $color={theme.text}
              $fontFamily={activeFont.css}
              disabled={viewState !== "review"}
              spellCheck="false"
            />
            <BottomStrip $color={theme.strip}>
              <SubCaptionInput
                type="text"
                value={subCaption}
                onChange={(e) => setSubCaption(e.target.value)}
                $color={theme.subText}
                $fontFamily={activeFont.css}
                disabled={viewState !== "review"}
                spellCheck="false"
              />
            </BottomStrip>
          </PolaroidWrapper>

          <AnimatePresence>
            {showFilters && (
              <FilterMenu
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {IMAGE_FILTERS.map((filter) => (
                  <FilterOption
                    key={filter.id}
                    $isActive={activeFilter.id === filter.id}
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter.name}
                  </FilterOption>
                ))}
              </FilterMenu>
            )}
          </AnimatePresence>
        </PolaroidContainer>
      </Workspace>

      <BottomControls>
        {(viewState === "camera" || viewState === "idle") && (
          <>
            <ActionGroup>
              <SecondaryButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
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
                whileHover={{ scale: viewState === "camera" ? 1.05 : 1 }}
                whileTap={{ scale: viewState === "camera" ? 0.9 : 1 }}
                disabled={viewState !== "camera"}
              >
                <ShutterInner $disabled={viewState !== "camera"}>
                  <Aperture size={32} />
                </ShutterInner>
              </ShutterOuter>
            </ActionGroup>

            <ActionGroup>
              <SecondaryButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Zap size={22} />
              </SecondaryButton>
              <ActionLabel>AUTO</ActionLabel>
            </ActionGroup>
          </>
        )}

        {viewState === "crop" && (
          <ReviewControls>
            <CancelActionButton onClick={handleRetake}>
              <X size={18} /> Cancel
            </CancelActionButton>
            <PrimaryActionButton onClick={handleApplyCrop}>
              <Check size={18} /> Apply Crop
            </PrimaryActionButton>
          </ReviewControls>
        )}

        {viewState === "review" && (
          <ReviewControls>
            <CancelActionButton onClick={handleRetake} disabled={isSaving}>
              <X size={18} /> Retake
            </CancelActionButton>
            <CancelActionButton
              onClick={handleSaveToDevice}
              disabled={isSaving}
            >
              <Download size={18} /> Download
            </CancelActionButton>
            <PrimaryActionButton
              onClick={handleSaveToGallery}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Upload size={18} /> Save to Gallery
                </>
              )}
            </PrimaryActionButton>
          </ReviewControls>
        )}
      </BottomControls>
    </CaptureContainer>
  );
};

export default Capture;
