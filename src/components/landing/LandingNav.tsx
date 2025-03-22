import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Menu, X, Moon, Sun } from 'lucide-react';
import useThemeStore from '@/store/themeStore';

const LandingNav: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useThemeStore();

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

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-secondary py-2 shadow-md'
          : 'bg-secondary py-4'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/mmlogo.png"
              alt="MagicMuse Logo"
              className="h-10 w-auto mr-2"
            />
            <span className="font-heading text-xl text-primary">MAGICMUSE.io</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="#features" className="text-primary hover:text-primary/80 transition-colors">
              FEATURES
            </Link>
            <Link to="#how-it-works" className="text-primary hover:text-primary/80 transition-colors">
              HOW IT WORKS
            </Link>
            <Link to="#prices" className="text-primary hover:text-primary/80 transition-colors">
              PRICES
            </Link>
            <Link to="#api" className="text-primary hover:text-primary/80 transition-colors">
              API
            </Link>
          </div>

          {/* Action Buttons & Theme Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-primary hover:text-primary/80 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link to="/auth/login">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-primary text-primary hover:bg-primary/10"
              >
                Login
              </Button>
            </Link>
            <Link to="/auth/register">
              <Button 
                size="sm"
                className="bg-primary text-secondary hover:bg-primary/90"
              >
                Sign Up
              </Button>
            </Link>
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
                <Link to="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button 
                    variant="outline" 
                    fullWidth
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button 
                    fullWidth
                    className="bg-primary text-secondary hover:bg-primary/90"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default LandingNav;