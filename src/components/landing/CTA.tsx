import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { useAuthModal } from '@/context/AuthModalContext';

const CTA: React.FC = () => {
  const { openForm } = useAuthModal();

  const handleRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    openForm('register');
  };

  return (
    <section className="py-20 bg-primary-hover relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-primary rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-secondary-hover/50 rounded-2xl shadow-md shadow-black/40 p-8 md:p-12 text-center max-w-4xl mx-auto border border-[#bcb7af]/40"
        >
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl md:text-4xl font-heading font-light text-[#bcb7af] mb-6"
          >
            Ready to Transform Your Content Creation?
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-neutral-light text-lg mb-8 max-w-2xl mx-auto"
          >
            Join thousands of writers, marketers, and businesses who are creating better content in less time with MagicMuse.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <Button 
              size="lg" 
              className="bg-white/10 text-secondary hover:bg-[#bcb7af]/90"
              onClick={handleRegister}
            >
              Start Your Free Trial
            </Button>
            <Link to="#how-it-works">
              <Button size="lg" variant="outline" className="border-[#bcb7af] text-[#bcb7af] hover:bg-white/10">
                See How It Works
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;