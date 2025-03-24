import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-3 px-4 md:px-6 lg:px-8 border-t border-neutral-light dark:border-neutral-dark bg-white dark:bg-neutral-dark">
      <div className="container mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center text-sm">
        <div className="flex items-center mb-2 md:mb-0">
          <img src="/mmlogo.png" alt="MagicMuse Logo" className="h-8 w-auto mr-2 block dark:hidden" />
          <img src="/mmlogolight.png" alt="MagicMuse Logo" className="h-8 w-auto mr-2 hidden dark:block" />
          <span className="text-neutral-medium">
            &copy; {currentYear} MagicMuse. All rights reserved.
          </span>
        </div>
        <div className="flex space-x-4">
          <Link to="/terms" className="text-neutral-medium hover:text-secondary dark:hover:text-neutral-white">
            Terms
          </Link>
          <Link to="/privacy" className="text-neutral-medium hover:text-secondary dark:hover:text-neutral-white">
            Privacy
          </Link>
          <Link to="/help" className="text-neutral-medium hover:text-secondary dark:hover:text-neutral-white">
            Help
          </Link>
          <a
            href="mailto:support@magicmuse.io"
            className="text-neutral-medium hover:text-secondary dark:hover:text-neutral-white"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
