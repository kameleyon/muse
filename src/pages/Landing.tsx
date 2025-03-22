import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import LandingNav from '@/components/landing/LandingNav';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import Pricing from '@/components/landing/Pricing';
import CTA from '@/components/landing/CTA';
import LandingFooter from '@/components/landing/LandingFooter';

const Landing: React.FC = () => {
  // Scroll to section if URL has hash
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>MagicMuse.io - AI-Powered Content Generation</title>
        <meta name="description" content="Create, edit, and generate high-quality content with the most intuitive AI writing companion. Craft AI-powered on-demand content in seconds." />
        <meta name="keywords" content="AI writing, content generation, copywriting, blog writing, AI assistant, content creation, writing tool" />
        <link rel="canonical" href="https://magicmuse.io" />
        <meta property="og:title" content="MagicMuse.io - AI-Powered Content Generation" />
        <meta property="og:description" content="Create professional, creative, and engaging content in seconds with our AI writing platform." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://magicmuse.io" />
        <meta property="og:image" content="https://magicmuse.io/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MagicMuse.io - AI-Powered Content Generation" />
        <meta name="twitter:description" content="Create professional, creative, and engaging content in seconds with our AI writing platform." />
        <meta name="twitter:image" content="https://magicmuse.io/og-image.jpg" />
        <link rel="icon" href="/favicon.ico" />
      </Helmet>

      <div className="min-h-screen bg-neutral-white dark:bg-secondary overflow-x-hidden">
        <LandingNav />
        
        <main>
          <Hero />
          <Features />
          <HowItWorks />
          <Pricing />
          <CTA />
        </main>
        
        <LandingFooter />
      </div>
    </>
  );
};

export default Landing;