import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin 
} from 'lucide-react';

const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-secondary text-neutral-white">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-6">
              <img src="/mmlogolight.png" alt="magicmuse Logo" className="h-8 w-auto mr-2" />
              <span className="font-heading text-3xl mt-2 text-neutral-white">magicmuse</span>
            </div>
            <p className="text-neutral-white/80 mb-6">
              Your AI-powered content generation platform. Create professional, creative, and
              engaging content in seconds.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-white/80 hover:text-neutral-white transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-neutral-white/80 hover:text-neutral-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-neutral-white/80 hover:text-neutral-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-lg text-neutral-white mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="#features" className="text-neutral-white/80 hover:text-neutral-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="#how-it-works" className="text-neutral-white/80 hover:text-neutral-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="#prices" className="text-neutral-white/80 hover:text-neutral-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="#api" className="text-neutral-white/80 hover:text-neutral-white transition-colors">
                  API
                </Link>
              </li>
              
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="font-heading text-lg text-neutral-white mb-6">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/terms" className="text-neutral-white/80 hover:text-neutral-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-neutral-white/80 hover:text-neutral-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-neutral-white/80 hover:text-neutral-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/gdpr" className="text-neutral-white/80 hover:text-neutral-white transition-colors">
                  GDPR Compliance
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="font-heading text-lg text-neutral-white mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Mail size={20} className="mr-3 flex-shrink-0 mt-1 text-neutral-white" />
                <span className="text-neutral-white/80">
                  support@magicmuse.com
                </span>
              </li>
              <li className="flex items-start">
                <Phone size={20} className="mr-3 flex-shrink-0 mt-1 text-neutral-white" />
                <span className="text-neutral-white/80">
                  +1 (555) 123-4567
                </span>
              </li>
              <li className="flex items-start">
                <MapPin size={20} className="mr-3 flex-shrink-0 mt-1 text-neutral-white" />
                <span className="text-neutral-white/80">
                  123 AI Boulevard<br />
                  San Francisco, CA 94105
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-white/20 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-white/80 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} magicmuse. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/sitemap" className="text-neutral-white/80 hover:text-neutral-white text-sm transition-colors">
              Sitemap
            </Link>
            <Link to="/accessibility" className="text-neutral-white/80 hover:text-neutral-white text-sm transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;