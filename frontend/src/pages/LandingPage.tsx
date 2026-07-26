import React from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import AboutSection from '../components/landing/AboutSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import StatisticsSection from '../components/landing/StatisticsSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import FAQSection from '../components/landing/FAQSection';
import ContactSection from '../components/landing/ContactSection';
import LandingFooter from '../components/landing/LandingFooter';

const LandingPage: React.FC = () => {
  return (
    <div style={{ position: 'relative', overflowX: 'hidden' }}>
      <LandingNavbar />
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <HowItWorksSection />
      <StatisticsSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
