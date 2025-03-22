import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  FileText,
  Brain,
  Globe,
  Rocket,
  BarChart2,
  Zap,
  LineChart
} from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      title: 'AI Writing Tools',
      description: 'Real-time writing assistance with contextual suggestions and multiple writing styles.',
      icon: <Sparkles className="w-6 h-6 text-amber-400" />
    },
    {
      title: 'Document Enhancement',
      description: 'Smart editing tools with grammar and style correction for polished content.',
      icon: <FileText className="w-6 h-6 text-amber-400" />
    },
    {
      title: 'Intelligent Suggestions',
      description: 'Context-aware recommendations that understand your intent and writing style.',
      icon: <Brain className="w-6 h-6 text-amber-400" />
    },
    {
      title: 'Productivity Features',
      description: 'Batch processing, export options, and version history to save time.',
      icon: <Rocket className="w-6 h-6 text-amber-400" />
    },
    {
      title: 'Style Adaptation',
      description: 'Personalized writing style that adapts to your voice and preferences.',
      icon: <Zap className="w-6 h-6 text-amber-400" />
    },
    {
      title: 'Advanced AI Capabilities',
      description: 'Cutting-edge AI that understands context, nuance, and creative elements.',
      icon: <Brain className="w-6 h-6 text-amber-400" />
    },
    {
      title: 'Multi-Language Support',
      description: 'Create content in over 15 languages with native-level quality and tone.',
      icon: <Globe className="w-6 h-6 text-amber-400" />
    },
    {
      title: 'Content Analytics',
      description: 'Detailed insights on readability, engagement, and improvement opportunities.',
      icon: <LineChart className="w-6 h-6 text-amber-400" />
    }
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl mb-4">
            Powerful <span className="text-amber-400">Features</span> for Writers
          </h2>
          <p className="text-gray-600 text-lg">
            Unlock your creative potential with our suite of advanced AI-powered writing tools designed to elevate your content.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-lg hover:bg-amber-50/30 transition-all duration-300"
            >
              <div className="bg-amber-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
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
