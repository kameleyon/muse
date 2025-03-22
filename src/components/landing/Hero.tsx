import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import TypingAnimation from './TypingAnimation';

const Hero: React.FC = () => {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#fcbf23] backdrop-blur-xl"></div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-20 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-regular text-[#1b1e27] mb-6">
              CREATE, EDIT AND GENERATE <br></br><span className='text-white'>HIGH QUALITY</span> CONTENT
            </h1>
            <p className="text-lg md:text-xl text-white max-w-xl mx-auto lg:mx-0 mb-8">
              Craft AI-Powered On-Demand Content in seconds with our most intuitive AI writing companion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" asChild className='bg-white'>
                <Link to="/auth/register">Start your free trial</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="#how-it-works">See How it works</Link>
              </Button>
            </div>
          </motion.div>

          {/* Right side - Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-secondary/60 backdrop-blur-sm rounded-xl shadow-lg p-6 aspect-video"
          >
            <div className="relative h-full border border-neutral-light/20 rounded-lg overflow-hidden flex flex-col">
              {/* Browser mockup header */}
              <div className="bg-secondary py-2 px-4 border-b border-neutral-light/20 flex items-center">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-error"></div>
                  <div className="w-3 h-3 rounded-full bg-warning"></div>
                  <div className="w-3 h-3 rounded-full bg-success"></div>
                </div>
                <div className="flex-1 text-center text-xs text-neutral-light">magicmuse.io</div>
              </div>
              
              {/* Animation content */}
              <div className="flex-1 bg-secondary overflow-hidden p-4">
                <TypingAnimation />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;