import React from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  FileText,
  Settings,
  Sparkles,
  Edit,
  Share
} from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      title: 'Sign Up',
      description: 'Create account or start with Google/Apple login',
      icon: <UserPlus className="w-6 h-6 text-[#faf9f5]" />,
      delay: 0.1
    },
    {
      title: 'Choose Project',
      description: 'Select from templates or start from scratch',
      icon: <FileText className="w-6 h-6 text-[#faf9f5]" />,
      delay: 0.2
    },
    {
      title: 'Set Parameters',
      description: 'Define tone, style, length, and audience',
      icon: <Settings className="w-6 h-6 text-[#faf9f5]" />,
      delay: 0.3
    },
    {
      title: 'Generate Content',
      description: 'AI creates initial draft based on parameters',
      icon: <Sparkles className="w-6 h-6 text-[#faf9f5]" />,
      delay: 0.4
    },
    {
      title: 'Refine',
      description: 'Edit, enhance, and customize the generated content',
      icon: <Edit className="w-6 h-6 text-[#faf9f5]" />,
      delay: 0.5
    },
    {
      title: 'Export & Share',
      description: 'Download in preferred format or share directly',
      icon: <Share className="w-6 h-6 text-[#faf9f5]" />,
      delay: 0.6
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-primary-hover text-secondary">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-light text-[#edeae2] mb-4">
            How It Works
          </h2>
          <p className="text-[#edeae2]/80 max-w-2xl mx-auto">
            Our simple six-step process makes content creation effortless and efficient.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 relative">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: step.delay }}
              className="flex flex-col items-center text-center relative z-10"
            >
              <div className="bg-[#6d371f]/50 p-5 rounded-full border-2 border-[#edeae2] mb-6 relative">
                <div className="absolute -top-3 -right-3 bg-[#edeae2] text-primary w-6 h-6 rounded-full flex items-center justify-center font-bold">
                  {String(index + 1).padStart(2, '0')}
                </div>
                {step.icon}
              </div>
              <h3 className="text-xl font-heading font-light text-[#faf9f5] mb-3">
                {step.title}
              </h3>
              <p className="text-[#edeae2]/80">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
