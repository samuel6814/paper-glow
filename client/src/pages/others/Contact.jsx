import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Mail, MapPin, Send } from 'lucide-react';

const PageContainer = styled.div`
  min-height: calc(100vh - 72px);
  background-color: #fcfaf8;
  padding: 4rem 2rem;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 968px) { padding: 2rem 1.5rem; }
`;

const Grid = styled.div`
  max-width: 1000px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  background: #ffffff;
  padding: 4rem;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04);
  border: 1px solid #f3f4f6;

  @media (max-width: 868px) {
    grid-template-columns: 1fr;
    padding: 2rem;
    gap: 3rem;
  }
`;

const InfoSide = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-family: 'Inter', sans-serif;
  font-size: 2.5rem;
  font-weight: 800;
  color: #121826;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 2.5rem;
  font-size: 1.05rem;
`;

const ContactDetail = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;

  div {
    display: flex;
    flex-direction: column;
  }

  h4 {
    color: #121826;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }

  p {
    color: #6b7280;
    font-size: 0.95rem;
    line-height: 1.5;
  }
`;

const IconCircle = styled.div`
  width: 44px;
  height: 44px;
  background: rgba(199, 137, 51, 0.1);
  color: #c78933;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const FormSide = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #121826;
  }
`;

const Input = styled.input`
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: #f9fafb;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #c78933;
    background: #ffffff;
  }
`;

const TextArea = styled.textarea`
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: #f9fafb;
  font-size: 1rem;
  outline: none;
  resize: vertical;
  min-height: 120px;
  transition: border-color 0.2s;

  &:focus {
    border-color: #c78933;
    background: #ffffff;
  }
`;

const SubmitButton = styled.button`
  background-color: #c78933;
  color: #ffffff;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #b57a2b;
  }
`;

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, wire this to a mailer API or backend route
    alert("Thanks for reaching out! We'll get back to you soon.");
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <>
      <Navbar />
      <PageContainer>
        <Grid>
          <InfoSide>
            <Title>Get in Touch</Title>
            <Subtitle>Have a question about your gallery, need technical support, or just want to say hello? Drop us a line.</Subtitle>

            <ContactDetail>
              <IconCircle><Mail size={20} /></IconCircle>
              <div>
                <h4>Email Us</h4>
                <p>support@paperglow.com</p>
              </div>
            </ContactDetail>

            <ContactDetail>
              <IconCircle><MapPin size={20} /></IconCircle>
              <div>
                <h4>Headquarters</h4>
                <p>Kumasi, Ashanti Region<br/>Ghana</p>
              </div>
            </ContactDetail>
          </InfoSide>

          <FormSide onSubmit={handleSubmit}>
            <InputGroup>
              <label>Name</label>
              <Input 
                required 
                type="text" 
                placeholder="John Doe" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </InputGroup>

            <InputGroup>
              <label>Email</label>
              <Input 
                required 
                type="email" 
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </InputGroup>

            <InputGroup>
              <label>Message</label>
              <TextArea 
                required 
                placeholder="How can we help you?"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
            </InputGroup>

            <SubmitButton type="submit">
              Send Message <Send size={18} />
            </SubmitButton>
          </FormSide>
        </Grid>
      </PageContainer>
      <Footer />
    </>
  );
};

export default Contact;