import React from 'react';
import { TrendingUp, Briefcase, Handshake, Building, Target, Rocket, Megaphone, Edit } from 'lucide-react'; // Example icons

export interface PitchDeckType {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  details: string[]; // Bullet points from the feedback
  // Add other fields as needed: exampleThumbnails, industryRelevance, estimatedTime
}

export const pitchDeckTypes: PitchDeckType[] = [
  {
    id: 'investment',
    name: 'Investment Pitch',
    icon: <TrendingUp size={24} className="text-[#ae5630]" />,
    description: 'Secure funding from investors or venture capital. Focuses on market opportunity, business model, and growth potential.',
    details: [
      'For securing funding from investors or venture capital',
      'Focuses on market opportunity, business model, and growth potential',
      'Financial projections and ROI are emphasized',
    ],
  },
  {
    id: 'sales',
    name: 'Sales Proposal',
    icon: <Briefcase size={24} className="text-[#ae5630]" />,
    description: 'Win client business by focusing on their problems and your solutions. Emphasizes benefits, timeline, and implementation.',
    details: [
      'For winning client business',
      'Focuses on client problems and offered solutions',
      'Emphasizes benefits, timeline, and implementation',
    ],
  },
  {
    id: 'partnership',
    name: 'Partnership Proposal',
    icon: <Handshake size={24} className="text-[#ae5630]" />,
    description: 'Propose strategic alliances, focusing on mutual benefits, synergies, resource sharing, and joint opportunities.',
    details: [
      'For strategic alliance opportunities',
      'Focuses on mutual benefits and synergies',
      'Outlines resource sharing and joint opportunities',
    ],
  },
  {
    id: 'business',
    name: 'Business Proposal',
    icon: <Building size={24} className="text-[#ae5630]" />,
    description: 'A flexible structure for various general business opportunities, balancing opportunity and execution details.',
    details: [
      'For general business opportunities',
      'Flexible structure for various business contexts',
      'Balanced focus on opportunity and execution',
    ],
  },
  {
    id: 'project',
    name: 'Project Proposal',
    icon: <Target size={24} className="text-[#ae5630]" />,
    description: 'Gain approval for specific projects with detailed implementation plans, milestones, deliverables, and success metrics.',
    details: [
      'For specific project approval',
      'Detailed implementation plans and milestones',
      'Clear deliverables and success metrics',
    ],
  },
  {
    id: 'startup',
    name: 'Startup Pitch',
    icon: <Rocket size={24} className="text-[#ae5630]" />,
    description: 'Designed for early-stage companies, emphasizing vision, market disruption, team, product demo, and early traction.',
    details: [
      'For early-stage companies',
      'Emphasizes vision, market disruption, and team',
      'Product demonstration and early traction',
    ],
  },
  {
    id: 'product-launch',
    name: 'Product Launch',
    icon: <Megaphone size={24} className="text-[#ae5630]" />,
    description: 'Introduce new products/services, focusing on market fit, competitive advantage, marketing strategy, and rollout plan.',
    details: [
      'For introducing new products/services',
      'Focuses on market fit and competitive advantage',
      'Includes marketing strategy and rollout plan',
    ],
  },
  {
    id: 'custom',
    name: 'Custom Proposal',
    icon: <Edit size={24} className="text-[#ae5630]" />,
    description: 'Build from scratch for maximum flexibility, leveraging AI assistance for structure recommendations.',
    details: [
      'Build from scratch',
      'Maximum flexibility for unique needs',
      'AI assistance with structure recommendations',
    ],
  },
];