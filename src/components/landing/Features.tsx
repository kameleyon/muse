import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Zap, 
  Layers, 
  BarChart, 
  ShieldCheck, 
  MessageSquare 
} from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      title: 'Advanced AI Writing',
      description: 'State-of-the-art AI models trained on high-quality content create human-like text for any purpose.',
      icon: <Sparkles size={24} className="text-primary" />
    },
    {
      title: 'Lightning Fast',
      description: 'Generate complete, polished content in seconds, not hours. Save time for what matters most.',
      icon: <Zap size={24} className="text-primary" />
    },
    {
      title: 'Multi-format Support',
      description: 'From blog posts to marketing copy, academic papers to creative fiction, we support it all.',
      icon: <Layers size={24} className="text-primary" />
    },
    {
      title: 'Advanced Analytics',
      description: 'Track content performance with detailed analytics and improvement recommendations.',
      icon: <BarChart size={24} className="text-primary" />
    },
    {
      title: 'Security Focused',
      description: 'Enterprise-grade security ensures your data and content remain private and protected.',
      icon: <ShieldCheck size={24} className="text-primary" />
    },
    {
      title: 'Collaborative Tools',
      description: 'Share, edit, and collaborate on content with team members in real-time with intuitive tools.',
      icon: <MessageSquare size={24} className="text-primary" />
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section id="features" className="py-20 bg-neutral-white dark:bg-secondary">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-heading font-light text-secondary dark:text-primary mb-4"
          >
            Powerful Features
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-neutral-medium max-w-2xl mx-auto"
          >
            Discover the tools that make MagicMuse the most versatile and powerful AI content platform
          </motion.p>
        </div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white dark:bg-secondary-hover rounded-xl shadow-sm shadow-black/20 p-6 hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1 transition-transform"
            >
              <div className="p-3 bg-primary/5 rounded-full font-light inline-block mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-heading font-light text-secondary dark:text-primary mb-3">
                {feature.title}
              </h3>
              <p className="text-neutral-medium">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;