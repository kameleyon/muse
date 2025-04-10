// src/store/types.ts - Centralized type definitions for the project workflow store

// --- Shared Enums / Literal Types ---
export type PrivacyLevel = 'private' | 'team' | 'public';
export type AudienceSize = 'Small' | 'Medium' | 'Enterprise' | '';
export type ComplexityLevel = 'basic' | 'intermediate' | 'advanced';
export type FactCheckLevel = 'basic' | 'standard' | 'thorough';
export type GenerationPhase = 'idle' | 'preparing' | 'researching' | 'content' | 'finalizing' | 'complete'; // Removed 'visuals'

// Blog-specific types
export interface ContentElement {
  id: string;
  type: string;
  name: string;
}

export interface Heading {
  id: string;
  level: number;
  title: string;
  parentId: string | null;
}

// Generation phase data
export interface PhaseData {
  currentPhase: 'researching' | 'content' | 'finalizing';
  phaseProgress: number;
  currentSection?: number;
  totalSections?: number;
  currentSlide?: number;
  totalSlides?: number;
}
export type ValidationStatus = 'Not Run' | 'Running' | 'Passed' | 'Issues Found';
export type ClientPdfStatus = 'idle' | 'generating' | 'success' | 'error';
// Removed 'image' to align with SlideInfo in pitchDeckPrompts.ts
export type VisualElementType = 'chart' | 'table' | 'diagram' | 'infographic' | 'logo';
export type VisualElementPosition = 'left' | 'right' | 'center' | 'full';
export type SlideCompletionStatus = 'pending' | 'researching' | 'drafting' | 'complete';

// --- Shared Interfaces ---

// Slide structure (used in Design and Generation)
export interface Slide {
    id: string;
    title: string;
    type: string;
    description?: string;
    customPrompt?: string;
    includeVisual?: boolean;
    visualType?: VisualElementType;
    isRequired?: boolean; // Add isRequired back
}

// Visual Element details (used in Generation)
export interface VisualElement {
  type: VisualElementType;
  data: any;            
  caption?: string;     
  position?: VisualElementPosition; 
}

// Citation details (used in Generation)
export interface Citation {
  source: string;       
  url?: string;         
  text: string;         
}

// Slide Content details (used in Generation)
export interface SlideContent {
  id: string;            
  title: string;         
  content: string;       
  visualElements?: VisualElement[]; 
  citations?: Citation[]; 
  completionStatus: SlideCompletionStatus; 
  generationProgress: number; 
}

// QA Metrics (used in QA)
export interface QualityMetrics { 
  overallScore: number; 
  categories: { name: string; score: number }[]; 
  issues: { id: string; severity: string; text: string }[]; 
}

// Fact Check Result (used in QA)
export interface FactCheckResult { 
  claim: string; 
  verified: boolean; 
  source?: string; 
  explanation?: string; 
}

// Refinement Suggestion (used in QA)
export interface Suggestion { 
  id: string; 
  text: string; 
  impact: string; 
  effort: string;
  type?: 'quality' | 'fact' | 'financial' | 'general'; // Added to categorize suggestions
}

// --- Placeholder for ProjectInfo if needed outside prompts ---
// interface ProjectInfo { ... } // Define if needed by other parts of the app
