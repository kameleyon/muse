import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

const NotFound: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <h1 className="text-9xl font-bold font-heading text-primary mb-4">404</h1>
      <h2 className="text-3xl font-bold font-heading mb-6">Page Not Found</h2>
      <p className="text-neutral-medium max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is
        temporarily unavailable.
      </p>
      <div className="flex gap-4">
        <Link to="/">
          <Button variant="primary">Go to Dashboard</Button>
        </Link>
        <Link to="/help">
          <Button variant="outline">Contact Support</Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default NotFound;