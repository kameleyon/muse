import React from 'react';
import { Link } from 'react-router-dom'; // Keep Link for "See How it works"
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import TypingAnimation from './TypingAnimation';
import { useAuthModal } from '@/context/AuthModalContext'; // Import useAuthModal

const Hero: React.FC = () => {
  const { openForm } = useAuthModal(); // Instantiate the hook

  return (
    <section className="pt-28 pb-20 md:pt-36 md:pb-28 relative overflow-hidden">
      {/* Solid yellow background instead of gradient */}
      <div className="absolute inset-0 bg-[#edeae2]"></div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-10 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-5xl md:text-5xl lg:text-6xl font-heading font-regular text-[#3e3e3b]/80 mb-6">
              CREATE, EDIT AND GENERATE <span className='text-primary/80 font-semibold'>HIGH QUALITY</span> CONTENT
            </h1>
            <p className="text-lg md:text-xl text-secondary    max-w-xl mx-auto lg:mx-0 mb-8">
              Craft AI-Powered On-Demand Content in seconds with our most intuitive AI writing companion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {/* Updated Button: Removed Link, added onClick */}
              <Button 
                size="lg" 
                className=" text-[#edeae2]/80 bg-primary rounded-xl shadow-sm font-regular hover:bg-secondary/90" 
                onClick={() => openForm('register')} // Call openForm on click
              >
                Start your free trial 
              </Button>
              {/* Keep the "See How it works" button as a Link */}
              <Button size="lg" variant="outline" className="text-secondary    font-light    shadow-sm rounded-xl border-secondary hover:bg-secondary/10">
                <Link to="#how-it-works">See How it works</Link> 
              </Button>
            </div>
          </motion.div>

          {/* Right side - Animation - keeping this part the same */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-secondary/20 backdrop-blur-sm rounded-2xl shadow-md shadow-black/40 p-6 aspect-video"
          >
            <div className="relative h-full border-2 border-white rounded-2xl overflow-hidden flex flex-col">
              {/* Browser mockup header */}
              <div className="bg-secondary py-2 px-4 border-b border-neutral-light/20 flex items-center">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-error"></div>
                  <div className="w-3 h-3 rounded-full bg-warning"></div>
                  <div className="w-3 h-3 rounded-full bg-success"></div>
                </div>
                <div className="flex-1 text-center text-xs text-neutral-light">magicmuse</div>
              </div>
              
              {/* Animation content - keeping this the same */}
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
