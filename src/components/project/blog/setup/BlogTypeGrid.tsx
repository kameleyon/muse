import React from 'react';
import { Card } from '@/components/ui/Card';
import { 
  FileText, 
  ListOrdered, 
  MessageSquare, 
  TrendingUp, 
  Search, 
  Star, 
  Lightbulb, 
  Scale 
} from 'lucide-react';

interface BlogType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  examples: string[];
}

interface BlogTypeGridProps {
  selectedTypeId: string | null;
  onSelectType: (id: string) => void;
}

const BlogTypeGrid: React.FC<BlogTypeGridProps> = ({ selectedTypeId, onSelectType }) => {
  const blogTypes: BlogType[] = [
    {
      id: 'how-to',
      name: 'How-to Guide',
      description: 'Step-by-step instructions to solve a problem or accomplish a task.',
      icon: <FileText size={24} />,
      examples: ['How to Start a Garden', 'How to Build a Website', 'How to Create a Content Strategy']
    },
    {
      id: 'listicle',
      name: 'List Article',
      description: 'A collection of items, tips, or ideas presented in a numbered format.',
      icon: <ListOrdered size={24} />,
      examples: ['10 Best Marketing Tools', '7 Ways to Improve Productivity', '5 Trends in Web Design']
    },
    {
      id: 'opinion',
      name: 'Opinion Piece',
      description: 'An article that presents a personal perspective or argument on a topic.',
      icon: <MessageSquare size={24} />,
      examples: ['Why Remote Work is Here to Stay', 'The Future of AI in Healthcare', 'Why Data Privacy Matters']
    },
    {
      id: 'trend-analysis',
      name: 'Trend Analysis',
      description: 'An in-depth look at emerging patterns and developments in your industry.',
      icon: <TrendingUp size={24} />,
      examples: ['2025 Marketing Trends', 'The Evolution of E-commerce', 'Changing Consumer Behavior']
    },
    {
      id: 'case-study',
      name: 'Case Study',
      description: 'A detailed examination of a specific instance, event, or organization.',
      icon: <Search size={24} />,
      examples: ['How Company X Increased Conversions by 50%', 'The Success Story of Brand Y', 'Project Z: Challenges and Solutions']
    },
    {
      id: 'product-review',
      name: 'Product Review',
      description: 'A critical assessment of a product or service, highlighting pros and cons.',
      icon: <Star size={24} />,
      examples: ['Review of the Latest Marketing Tool', 'Software Comparison: Product A vs Product B', 'Is Service X Worth the Investment?']
    },
    {
      id: 'thought-leadership',
      name: 'Thought Leadership',
      description: 'Forward-thinking content that positions you as an authority in your field.',
      icon: <Lightbulb size={24} />,
      examples: ['Reimagining Customer Experience', 'The Next Evolution of Digital Marketing', 'Building a Culture of Innovation']
    },
    {
      id: 'comparison',
      name: 'Comparison Article',
      description: 'A side-by-side analysis of two or more options, methods, or approaches.',
      icon: <Scale size={24} />,
      examples: ['Facebook vs Instagram Marketing', 'Traditional vs Digital PR', 'Freelance vs In-house Teams']
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold font-heading text-secondary">Select Blog Type</h3>
        {selectedTypeId && (
          <p className="text-sm text-primary">
            Selected: {blogTypes.find(type => type.id === selectedTypeId)?.name}
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {blogTypes.map((blogType) => (
          <Card
            key={blogType.id}
            className={`blog-type-card cursor-pointer ${
              selectedTypeId === blogType.id ? 'selected' : ''
            }`}
            onClick={() => onSelectType(blogType.id)}
          >
            <div className="mb-2 text-primary">{blogType.icon}</div>
            <h4 className="blog-type-name text-lg font-medium">{blogType.name}</h4>
            <p className="blog-type-description text-sm text-neutral-muted">{blogType.description}</p>
            <div className="mt-3">
              <p className="text-xs font-medium text-neutral-dark">Examples:</p>
              <ul className="text-xs text-neutral-muted list-disc list-inside">
                {blogType.examples.map((example, index) => (
                  <li key={index} className="truncate">{example}</li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BlogTypeGrid;
