import React from 'react';
import styled from 'styled-components';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const PageContainer = styled.div`
  min-height: calc(100vh - 72px);
  background-color: #fcfaf8;
  padding: 4rem 2rem;
  color: #121826;
`;

const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: #ffffff;
  padding: 4rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  border: 1px solid #f3f4f6;

  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const Title = styled.h1`
  font-family: 'Inter', sans-serif;
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
`;

const LastUpdated = styled.p`
  color: #9ca3af;
  font-size: 0.9rem;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #f3f4f6;
`;

const Section = styled.section`
  margin-bottom: 2.5rem;

  h2 {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: #121826;
  }

  p {
    color: #4b5563;
    line-height: 1.7;
    margin-bottom: 1rem;
  }

  ul {
    color: #4b5563;
    line-height: 1.7;
    padding-left: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const Privacy = () => {
  return (
    <>
      <Navbar />
      <PageContainer>
        <ContentWrapper>
          <Title>Privacy Policy</Title>
          <LastUpdated>Last Updated: October 2024</LastUpdated>

          <Section>
            <h2>1. Information We Collect</h2>
            <p>At PaperGlow, we collect information you provide directly to us when you create an account, upload photos, or communicate with us. This includes your name, email address, and the images you choose to process through our service.</p>
          </Section>

          <Section>
            <h2>2. How We Use Your Data</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our services.</li>
              <li>Process your images and apply our digital Polaroid filters.</li>
              <li>Securely store your gallery using our third-party database and image hosting partners.</li>
              <li>Communicate with you regarding updates, security alerts, and support.</li>
            </ul>
          </Section>

          <Section>
            <h2>3. Third-Party Services</h2>
            <p>To provide our services, we utilize trusted third-party providers. Your images are securely hosted using Cloudinary, and your account data is managed via Neon Database and Better Auth. We do not sell your personal data or photos to third parties.</p>
          </Section>

          <Section>
            <h2>4. Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, or destruction. However, no internet transmission is entirely secure, and we cannot guarantee absolute security.</p>
          </Section>
        </ContentWrapper>
      </PageContainer>
      <Footer />
    </>
  );
};

export default Privacy;