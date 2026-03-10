import React from 'react';
import styled from 'styled-components';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

// Reusing the exact same layout as Privacy for consistency
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

  @media (max-width: 768px) { padding: 2rem; }
`;

const Title = styled.h1`font-family: 'Inter', sans-serif; font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem;`;
const LastUpdated = styled.p`color: #9ca3af; font-size: 0.9rem; margin-bottom: 3rem; padding-bottom: 2rem; border-bottom: 1px solid #f3f4f6;`;
const Section = styled.section`
  margin-bottom: 2.5rem;
  h2 { font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; color: #121826; }
  p { color: #4b5563; line-height: 1.7; margin-bottom: 1rem; }
`;

const Terms = () => {
  return (
    <>
      <Navbar />
      <PageContainer>
        <ContentWrapper>
          <Title>Terms of Service</Title>
          <LastUpdated>Last Updated: October 2024</LastUpdated>

          <Section>
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing or using PaperGlow, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>
          </Section>

          <Section>
            <h2>2. User Conduct & Content</h2>
            <p>You retain all rights to the photos you upload and process through PaperGlow. However, you agree not to use the service to upload, post, or transmit any content that is illegal, abusive, harassing, or violates any third-party intellectual property rights.</p>
          </Section>

          <Section>
            <h2>3. Service Availability</h2>
            <p>We strive to keep PaperGlow up and running reliably, but we do not guarantee that the service will be uninterrupted, error-free, or completely secure. We reserve the right to modify or discontinue the service at any time without notice.</p>
          </Section>

          <Section>
            <h2>4. Account Termination</h2>
            <p>We reserve the right to suspend or terminate your account and access to the service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
          </Section>
        </ContentWrapper>
      </PageContainer>
      <Footer />
    </>
  );
};

export default Terms;