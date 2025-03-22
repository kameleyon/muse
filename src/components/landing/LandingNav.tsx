import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Menu, X, Moon, Sun } from 'lucide-react';
import useThemeStore from '@/store/themeStore';
import { useAuthModal } from '@/context/AuthModalContext';
import './LandingNav.css';

const LandingNav: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useThemeStore();
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
          ? 'bg-secondary py-4 shadow-md border-b border-primary/50'
          : 'bg-transparent py-4 shadow-sm shadow-black/10 dark:bg-secondary border-b border-primary/50'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/mmlogo.png"
              alt="magicmuse Logo"
              className="h-10 w-auto mr-2"
            />
            <span className="font-heading text-3xl mt-3 text-primary web-only">magicmuse</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 font-medium">
            <Link to="#features" className="text-[#9195a1] hover:text-primary transition-colors">
              FEATURES
            </Link>
            <Link to="#how-it-works" className="text-[#9195a1] hover:text-primary transition-colors">
              HOW IT WORKS
            </Link>
            <Link to="#prices" className="text-[#9195a1] hover:text-primary transition-colors">
              PRICES
            </Link>
            <Link to="#api" className="text-[#9195a1] hover:text-primary transition-colors">
              API
            </Link>
          </div>

          {/* Action Buttons & Theme Toggle */}
          <div className="hidden md:flex items-center space-x-4 font-light">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-primary hover:text-primary transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Button 
              variant="outline" 
              size="md" 
              className="border-primary px-6 rounded-lg text-primary hover:text-secondary hover:bg-primary/90 font-light shadow-sm"
              onClick={handleOpenLogin}
            >
              Login
            </Button>
            <Button 
              size="md"
              className="bg-primary px-6 rounded-lg text-secondary hover:bg-primary/90 font-light shadow-sm"
              onClick={handleOpenRegister}
            >
              Sign Up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-primary hover:text-primary/80 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-primary hover:text-primary/80 transition-colors"
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
            className="md:hidden bg-secondary/90 backdrop-blur-sm mt-2 rounded-xl p-4 shadow-lg"
          >
            <div className="flex flex-col space-y-4">
              <Link
                to="#features"
                className="text-primary hover:text-primary/80 py-2 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                FEATURES
              </Link>
              <Link
                to="#how-it-works"
                className="text-primary hover:text-primary/80 py-2 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                HOW IT WORKS
              </Link>
              <Link
                to="#prices"
                className="text-primary hover:text-primary/80 py-2 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                PRICES
              </Link>
              <Link
                to="#api"
                className="text-primary hover:text-primary/80 py-2 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                API
              </Link>
              <div className="pt-2 flex flex-col space-y-2">
                <Button 
                  variant="outline" 
                  fullWidth
                  className="border-primary text-primary hover:bg-primary/10"
                  onClick={(e) => {
                    setIsMobileMenuOpen(false);
                    handleOpenLogin(e);
                  }}
                >
                  Login
                </Button>
                <Button 
                  fullWidth
                  className="bg-primary text-secondary hover:bg-primary/90"
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
