import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  FileEdit, 
  Lightbulb, 
  Rocket, 
  Palette, 
  Cpu, 
  Globe, 
  BarChart4
} from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      title: 'AI Writing Tools',
      description: 'Real-time writing assistance with contextual suggestions and multiple writing styles. Our intuitive AI analyzes your content as you write, offering relevant recommendations to enhance clarity, tone, and impact.',
      icon: <Sparkles size={24} className="text-primary" />
    },
    {
      title: 'Document Enhancement',
      description: 'Smart editing tools with grammar and style correction for polished content. Our comprehensive editing suite goes beyond basic spell-checking to identify passive voice, redundant phrases, and inconsistent terminology.',
      icon: <FileEdit size={24} className="text-primary" />
    },
    {
      title: 'Intelligent Suggestions',
      description: 'Context-aware recommendations that understand your intent and writing style. MagicMuse\'s sophisticated AI recognizes the purpose behind your content and offers targeted improvements aligned with your goals.',
      icon: <Lightbulb size={24} className="text-primary" />
    },
    {
      title: 'Productivity Features',
      description: 'Batch processing, export options, and version history to save time. Process multiple documents simultaneously with consistent parameters and formatting. Export your content in various formats including PDF, DOCX, HTML, and Markdown.',
      icon: <Rocket size={24} className="text-primary" />
    },
    {
      title: 'Style Adaptation',
      description: 'Personalized writing style that adapts to your voice and preferences. Our AI studies your writing patterns to develop a unique profile of your communication style. Over time, MagicMuse fine-tunes its suggestions to align with your distinctive tone.',
      icon: <Palette size={24} className="text-primary" />
    },
    {
      title: 'Advanced AI Capabilities',
      description: 'Cutting-edge AI that understands context, nuance, and creative elements. Our sophisticated models comprehend complex topics and specialized terminology across industries. The system recognizes subtle emotional tones and rhetorical techniques.',
      icon: <Cpu size={24} className="text-primary" />
    },
    {
      title: 'Multi-Language Support',
      description: 'Create content in over 15 languages with native-level quality and tone. Our language models have been trained on authentic texts across multiple languages, ensuring grammatically correct and culturally appropriate content.',
      icon: <Globe size={24} className="text-primary" />
    },
    {
      title: 'Content Analytics',
      description: 'Detailed insights on readability, engagement, and improvement opportunities. Monitor key performance metrics including reading level, emotional tone, keyword optimization, and audience alignment.',
      icon: <BarChart4 size={24} className="text-primary" />
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
    <section id="features" className="py-20 bg-neutral-white   ">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-heading font-light text-secondary    mb-4"
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white    rounded-xl shadow-sm shadow-black/20 p-6 hover:shadow-lg duration-300 transform hover:-translate-y-1 transition-transform"
            >
              <div className="p-3 bg-primary/5 rounded-full font-light inline-block mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-heading font-light text-secondary    mb-3">
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