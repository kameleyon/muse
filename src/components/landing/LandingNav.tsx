import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom'; // Renamed react-router Link
// ScrollLink import removed
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Menu, X } from 'lucide-react';
import { useAuthModal } from '@/context/AuthModalContext';
import './LandingNav.css';

const LandingNav: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openForm } = useAuthModal();

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Smooth scroll handler
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      // Calculate offset for fixed header (approximate header height)
      const headerOffset = 80; // Adjust as needed
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    // Close mobile menu if open
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  // Authentication modal handlers
  const handleOpenLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    openForm('login');
  };

  const handleOpenRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    openForm('register');
  };

  return (
    <header
      className={`fixed w-full top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#edeae2] py-4 shadow-md border-b border-[#3d3d3a]/50'
          : 'bg-transparent py-4 shadow-sm shadow-black/10 border-b border-[#edeae2]/90'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <nav className="flex items-center justify-between">
          {/* Logo - Use RouterLink */}
          <RouterLink to="/" className="flex items-center">
            <img
              src="/mmlogo.png"
              alt="magicmuse Logo"
              className="h-12 w-auto mr-2"
            />
            <span className="font-heading text-4xl mt-3 text-[#3d3d3a] web-only">magicmuse</span>
          </RouterLink> 

          {/* Desktop Navigation - Use <a> tags with onClick for smooth scroll */}
          <div className="hidden md:flex items-center space-x-8 font-medium">
            <a 
              href="#features" 
              onClick={(e) => handleSmoothScroll(e, 'features')}
              className="text-[#3d3d3a] hover:text-[#ae5630] transition-colors cursor-pointer"
            >
              FEATURES
            </a>
            <a 
              href="#how-it-works" 
              onClick={(e) => handleSmoothScroll(e, 'how-it-works')}
              className="text-[#3d3d3a] hover:text-[#ae5630] transition-colors cursor-pointer"
            >
              HOW IT WORKS
            </a>
            <a 
              href="#prices" 
              onClick={(e) => handleSmoothScroll(e, 'prices')}
              className="text-[#3d3d3a] hover:text-[#ae5630] transition-colors cursor-pointer"
            >
              PRICES
            </a>
            <RouterLink to="/api" className="text-[#3d3d3a] hover:text-[#ae5630] transition-colors">
              API 
            </RouterLink>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4 font-light">
            <Button 
              variant="outline" 
              size="md" 
              className="border-[#3d3d3a] px-6 rounded-lg text-[#3d3d3a] hover:text-[#edeae2] hover:bg-[#3d3d3a]/90 font-light shadow-sm"
              onClick={handleOpenLogin}
            >
              Login
            </Button>
            <Button 
              size="md"
              className="bg-[#3d3d3a] px-6 rounded-lg text-[#edeae2] hover:bg-[#3d3d3a]/90 font-light shadow-sm"
              onClick={handleOpenRegister}
            >
              Sign Up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-4">
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-[#3d3d3a] hover:text-[#3d3d3a]/80 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[#edeae2]/90 backdrop-blur-sm mt-2 rounded-xl p-4 shadow-md"
          >
            <div className="flex flex-col space-y-4">
              {/* Mobile Menu - Use <a> tags with onClick for smooth scroll */}
              <a
                href="#features"
                onClick={(e) => handleSmoothScroll(e, 'features')}
                className="text-[#3d3d3a] hover:text-[#ae5630] py-2 transition-colors cursor-pointer"
                // onClick handler already closes menu via handleSmoothScroll
              >
                FEATURES
              </a>
              <a
                href="#how-it-works"
                onClick={(e) => handleSmoothScroll(e, 'how-it-works')}
                className="text-[#3d3d3a] hover:text-[#ae5630] py-2 transition-colors cursor-pointer"
              >
                HOW IT WORKS
              </a>
              <a
                href="#prices"
                onClick={(e) => handleSmoothScroll(e, 'prices')}
                className="text-[#3d3d3a] hover:text-[#ae5630] py-2 transition-colors cursor-pointer"
              >
                PRICES
              </a>
              <RouterLink
                to="/api"
                className="text-[#3d3d3a] hover:text-[#ae5630] py-2 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                API
              </RouterLink>
              <div className="pt-2 flex flex-col space-y-2">
                <Button 
                  variant="outline" 
                  fullWidth
                  className="border-[#3d3d3a] text-[#3d3d3a] hover:text-[#edeae2] hover:bg-[#3d3d3a]/90"
                  onClick={(e) => {
                    setIsMobileMenuOpen(false);
                    handleOpenLogin(e);
                  }}
                >
                  Login
                </Button>
                <Button 
                  fullWidth
                  className="bg-[#3d3d3a] text-[#edeae2] hover:bg-[#3d3d3a]/90"
                  onClick={(e) => {
                    setIsMobileMenuOpen(false);
                    handleOpenRegister(e);
                  }}
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default LandingNav;
