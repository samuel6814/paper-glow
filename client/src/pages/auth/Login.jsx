// Imports
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCcw, Mail, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// Import Layout Components
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

// Styled Components
const LoginContainer = styled.div`
  min-height: calc(100vh - 72px);
  background-color: #fcfaf8; /* Warm off-white matching Hero */
  background-image: radial-gradient(circle at 50% 50%, #fffcf5 0%, #fcfaf8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;

  @media (max-width: 968px) {
    padding: 2rem 1.5rem;
  }
`;

const ContentGrid = styled.div`
  max-width: 1000px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

// --- Left Column (Polaroid) ---
const LeftColumn = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 968px) {
    display: none; /* Hide polaroid on mobile to prioritize the form */
  }
`;

const PolaroidCard = styled.div`
  position: relative;
  background-color: #ffffff;
  padding: 16px 16px 70px 16px; /* Thick bottom border */
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
  border: 1px solid #f3f4f6;
  border-radius: 2px;
  width: 100%;
  max-width: 380px;
  transform: rotate(-2deg);
`;

const PhotoFrame = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  background-color: #e5e7eb;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
`;

const Photo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: sepia(0.2) contrast(1.05); /* Slight vintage warmth */
`;

const Caption = styled.div`
  position: absolute;
  bottom: 25px;
  left: 20px;
  font-family: 'Caveat', 'Playfair Display', cursive, serif;
  font-style: italic;
  color: #6b7280;
  font-size: 1.1rem;
`;

const FloatingBadge = styled.div`
  position: absolute;
  bottom: -20px;
  right: -20px;
  background-color: #e69d35; /* Gold accent from Hero */
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 10px 25px rgba(230, 157, 53, 0.3);
`;

// --- Right Column (Auth Form) ---
const RightColumn = styled(motion.div)`
  display: flex;
  flex-direction: column;
  max-width: 440px;
  width: 100%;

  @media (max-width: 968px) {
    margin: 0 auto;
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
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-family: 'Inter', sans-serif;
  font-size: clamp(2.5rem, 4vw, 3.5rem);
  font-weight: 800;
  line-height: 1.1;
  color: #121826; /* Dark slate text */
  letter-spacing: -1px;
  margin-bottom: 1rem;
`;

const Highlight = styled.span`
  color: #e69d35; /* Gold accent */
`;

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #4b5563; /* Soft gray */
  margin-bottom: 2.5rem;
`;

const SocialButton = styled.button`
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  color: #121826;
  width: 100%;
  padding: 14px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);

  &:hover {
    background-color: #f9fafb;
    border-color: #d1d5db;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 2rem 0;
  color: #9ca3af;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 1px;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #e5e7eb;
  }

  &::before {
    margin-right: 1em;
  }

  &::after {
    margin-left: 1em;
  }
`;

const PrimaryButton = styled.button`
  background-color: #f3f4f6;
  color: #121826;
  border: 1px solid transparent;
  width: 100%;
  padding: 14px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e5e7eb;
  }
`;

const ActionButton = styled.button`
  background-color: #c78933; /* Gold accent */
  color: #ffffff;
  border: none;
  width: 100%;
  padding: 14px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(199, 137, 51, 0.2);
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #b57a2b;
  }
`;

const Form = styled(motion.form)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  color: #121826;
  padding: 14px 16px;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #c78933; /* Focus outline is gold */
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const FormHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;

  &:hover {
    color: #121826;
  }
`;

const ToggleText = styled.p`
  color: #6b7280;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 1.5rem;

  button {
    background: none;
    border: none;
    color: #c78933; /* Gold text */
    font-weight: 600;
    cursor: pointer;
    padding: 0 4px;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const TermsText = styled.p`
  color: #9ca3af;
  font-size: 0.75rem;
  text-align: center;
  margin-top: 2rem;
  line-height: 1.5;

  a {
    color: #4b5563;
    text-decoration: none;
    border-bottom: 1px solid rgba(75, 85, 99, 0.3);

    &:hover {
      color: #121826;
      border-color: #121826;
    }
  }
`;

// Google Icon SVG Component
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);


// Component Logic
const Login = () => {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState('initial'); // 'initial' or 'email'
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  // Mock image for the polaroid
  const heroImage = "https://images.unsplash.com/photo-1511216335778-7cb8f49fa7a3?auto=format&fit=crop&w=800&q=80";

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleLogin = () => {
    console.log("Initiating Google Login...");
    navigate('/capture');
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      console.log("Signing up with:", formData);
    } else {
      console.log("Logging in with:", formData.email);
    }
    navigate('/capture');
  };

  return (
    <>
      <Navbar />
      <LoginContainer>
        <ContentGrid>
          
          {/* Left Column: Polaroid Visuals */}
          <LeftColumn
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <PolaroidCard>
              <PhotoFrame>
                <Photo src={heroImage} alt="Vintage Desk" />
              </PhotoFrame>
              <Caption>Golden Hour, '24</Caption>
              <FloatingBadge>
                <Sparkles size={24} />
              </FloatingBadge>
            </PolaroidCard>
          </LeftColumn>

          {/* Right Column: Auth Logic */}
          <RightColumn
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <Badge>
              <RotateCcw size={12} />
              NOSTALGIA REIMAGINED
            </Badge>

            <Title>
              Digital Memories, <br />
              <Highlight>Analog Soul.</Highlight>
            </Title>

            <Description>
              Experience the tactile charm of vintage Polaroids. We add a warm, nostalgic glow to your digital photos, making them feel physical again.
            </Description>

            <AnimatePresence mode="wait">
              {authMode === 'initial' ? (
                // View 1: Initial Social & Email Buttons
                <motion.div
                  key="initial-buttons"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <SocialButton onClick={handleGoogleLogin}>
                    <GoogleIcon /> Continue with Google
                  </SocialButton>

                  <Divider>OR SIGN IN WITH EMAIL</Divider>

                  <PrimaryButton onClick={() => setAuthMode('email')}>
                    <Mail size={20} /> Continue with Email
                  </PrimaryButton>
                </motion.div>
              ) : (
                // View 2: Email & Password Form
                <Form
                  key="email-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleEmailSubmit}
                >
                  <FormHeader>
                    <BackButton type="button" onClick={() => setAuthMode('initial')}>
                      <ArrowLeft size={20} />
                    </BackButton>
                    <span style={{ color: '#121826', fontWeight: 700 }}>
                      {isSignUp ? 'Create an Account' : 'Welcome Back'}
                    </span>
                  </FormHeader>

                  {isSignUp && (
                    <Input 
                      type="text" 
                      name="name" 
                      placeholder="Full Name" 
                      value={formData.name}
                      onChange={handleInputChange}
                      required 
                    />
                  )}
                  
                  <Input 
                    type="email" 
                    name="email" 
                    placeholder="Email address" 
                    value={formData.email}
                    onChange={handleInputChange}
                    required 
                  />
                  
                  <Input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    value={formData.password}
                    onChange={handleInputChange}
                    required 
                  />

                  <ActionButton type="submit">
                    {isSignUp ? 'Sign Up' : 'Sign In'}
                  </ActionButton>

                  <ToggleText>
                    {isSignUp ? "Already have an account?" : "Don't have an account?"}
                    <button type="button" onClick={() => setIsSignUp(!isSignUp)}>
                      {isSignUp ? 'Log in' : 'Sign up'}
                    </button>
                  </ToggleText>
                </Form>
              )}
            </AnimatePresence>

            <TermsText>
              By signing up, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.
            </TermsText>
          </RightColumn>

        </ContentGrid>
      </LoginContainer>
      <Footer />
    </>
  );
};

// Export
export default Login;