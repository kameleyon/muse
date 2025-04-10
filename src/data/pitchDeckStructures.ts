// Define the structure interface
interface PitchDeckStructure {
  id: string;
  name: string;
  description: string;
  slides: Slide[];
}

// Import Slide type from the appropriate location
import { Slide } from '@/store/types';

// Define different pitch deck structures
export const pitchDeckStructures: PitchDeckStructure[] = [
  {
    id: 'standard-14',
    name: 'Standard (14-Slide Deck)',
    description: 'A comprehensive pitch deck covering all essential sections',
    slides: [
      { id: 'slide-1', title: 'Cover/Title', type: 'cover', includeVisual: true, visualType: 'logo' },
      { id: 'slide-2', title: 'Problem/Opportunity', type: 'problem', includeVisual: true },
      { id: 'slide-3', title: 'Solution Overview', type: 'solution', includeVisual: true },
      { id: 'slide-4', title: 'Value Proposition', type: 'value_proposition', includeVisual: false },
      { id: 'slide-5', title: 'Market Analysis', type: 'market_analysis', includeVisual: true, visualType: 'table' },
      { id: 'slide-6', title: 'Competitive Landscape', type: 'competition', includeVisual: true, visualType: 'table' },
      { id: 'slide-7', title: 'Product/Service Details', type: 'product', includeVisual: true },
      { id: 'slide-8', title: 'Business Model', type: 'business_model', includeVisual: true, visualType: 'table' },
      { id: 'slide-9', title: 'Financial Projections', type: 'financials', includeVisual: true, visualType: 'table' },
      { id: 'slide-10', title: 'Traction/Validation', type: 'traction', includeVisual: true, visualType: 'table' },
      { id: 'slide-11', title: 'Team Introduction', type: 'team', includeVisual: true },
      { id: 'slide-12', title: 'Timeline/Roadmap', type: 'roadmap', includeVisual: true, visualType: 'table' },
      { id: 'slide-13', title: 'Investment/Ask', type: 'investment', includeVisual: false },
      { id: 'slide-14', title: 'Call to Action', type: 'call_to_action', includeVisual: false }
    ]
  },
  {
    id: 'lean-10',
    name: 'Lean (10-Slide Deck)',
    description: 'A concise pitch deck focusing on key information - no table or graph',
    slides: [
      { id: 'slide-1', title: 'Cover/Title', type: 'cover', includeVisual: true, visualType: 'logo' },
      { id: 'slide-2', title: 'Problem Statement', type: 'problem', includeVisual: true },
      { id: 'slide-3', title: 'Solution', type: 'solution', includeVisual: true },
      { id: 'slide-4', title: 'Market Opportunity', type: 'market_analysis', includeVisual: true },
      { id: 'slide-5', title: 'Traction', type: 'traction', includeVisual: true },
      { id: 'slide-6', title: 'Business Model', type: 'business_model', includeVisual: true },
      { id: 'slide-7', title: 'Competitive Landscape', type: 'competition', includeVisual: true },
      { id: 'slide-8', title: 'Team', type: 'team', includeVisual: true },
      { id: 'slide-9', title: 'Financial Projections', type: 'financials', includeVisual: true },
      { id: 'slide-10', title: 'Call to Action', type: 'call_to_action', includeVisual: false }
    ]
  },
  {
    id: 'custom',
    name: 'Custom Structure ',
    description: 'Create a tailored pitch deck structure - add your custom slide',
    slides: [
      { id: 'slide-1', title: 'Cover/Title', type: 'cover', includeVisual: true, visualType: 'logo' }
    ]
  }
];

export const defaultPitchDeckStructure = pitchDeckStructures[0];
