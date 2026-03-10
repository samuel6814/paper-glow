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
  @media (max-width: 768px) { padding: 2rem; }
`;

const Title = styled.h1`font-family: 'Inter', sans-serif; font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem;`;
const LastUpdated = styled.p`color: #9ca3af; font-size: 0.9rem; margin-bottom: 3rem; padding-bottom: 2rem; border-bottom: 1px solid #f3f4f6;`;
const Section = styled.section`
  margin-bottom: 2.5rem;
  h2 { font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; color: #121826; }
  p { color: #4b5563; line-height: 1.7; margin-bottom: 1rem; }
`;

const Cookies = () => {
  return (
    <>
      <Navbar />
      <PageContainer>
        <ContentWrapper>
          <Title>Cookie Policy</Title>
          <LastUpdated>Last Updated: October 2024</LastUpdated>

          <Section>
            <h2>1. What Are Cookies?</h2>
            <p>Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide a better user experience.</p>
          </Section>

          <Section>
            <h2>2. How We Use Cookies</h2>
            <p>PaperGlow uses cookies primarily for authentication and security. We use HTTP-only cookies to keep you securely logged into your account (powered by Better Auth). We do not use intrusive tracking cookies to serve you targeted advertisements.</p>
          </Section>

          <Section>
            <h2>3. Types of Cookies We Use</h2>
            <p><strong>Essential Cookies:</strong> These are required for the operation of our service. They include cookies that enable you to log into secure areas of our application, like the Capture and Gallery pages.</p>
            <p><strong>Preference Cookies:</strong> These may be used to remember your settings and preferences (like your favorite frame theme) for future visits.</p>
          </Section>

          <Section>
            <h2>4. Managing Cookies</h2>
            <p>You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. However, if you disable or refuse cookies, please note that some parts of PaperGlow (such as logging in) will become inaccessible or not function properly.</p>
          </Section>
        </ContentWrapper>
      </PageContainer>
      <Footer />
    </>
  );
};

export default Cookies;