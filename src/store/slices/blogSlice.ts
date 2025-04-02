import { StateCreator } from 'zustand';
import { ProjectWorkflowState, ProjectWorkflowActions } from '../projectWorkflowStore';
import { ContentElement, Heading } from '../types';

// Interface for Blog-specific State
export interface BlogState {
  // Blog objectives
  primaryGoal: string;
  contentGoals: string[];
  targetKeywords: string[];
  
  // Blog structure
  selectedStructureId: string | null;
  contentElements: ContentElement[];
  headingStructure: Heading[];
  
  // QA properties
  seoStatus: string;
  readabilityStatus: string;
  audienceAlignmentStatus: string;
  
  // Publishing properties
  isPublishing: boolean;
  publishingPlatform: string;
  scheduledTime: string;
  promotionChannels: string[];
  
  // Analytics properties
  trafficMetrics: any;
  engagementMetrics: any;
  conversionMetrics: any;
  seoPerformance: any;
}

// Interface for Blog Actions
export interface BlogActions {
  setBlogField: <K extends keyof BlogState>(field: K, value: BlogState[K]) => void;
  setObjectiveField: (field: string, value: any) => void;
  setSelectedStructureId: (id: string | null) => void;
  setContentElements: (elements: ContentElement[]) => void;
  setHeadingStructure: (headings: Heading[]) => void;
  setSeoStatus: (status: string) => void;
  setReadabilityStatus: (status: string) => void;
  setAudienceAlignmentStatus: (status: string) => void;
  setIsPublishing: (isPublishing: boolean) => void;
  setPublishingPlatform: (platform: string) => void;
  setScheduledTime: (time: string) => void;
  setPromotionChannels: (channels: string[]) => void;
  setTrafficMetrics: (metrics: any) => void;
  setEngagementMetrics: (metrics: any) => void;
  setConversionMetrics: (metrics: any) => void;
  setSeoPerformance: (performance: any) => void;
}

// Define the initial state for this slice
export const initialBlogState: BlogState = {
  primaryGoal: '',
  contentGoals: [],
  targetKeywords: [],
  
  selectedStructureId: null,
  contentElements: [],
  headingStructure: [],
  
  seoStatus: '',
  readabilityStatus: '',
  audienceAlignmentStatus: '',
  
  isPublishing: false,
  publishingPlatform: '',
  scheduledTime: '',
  promotionChannels: [],
  
  trafficMetrics: null,
  engagementMetrics: null,
  conversionMetrics: null,
  seoPerformance: null
};

// Create the slice
export const createBlogSlice: StateCreator<
  ProjectWorkflowState & ProjectWorkflowActions,
  [],
  [],
  BlogState & BlogActions
> = (set) => ({
  ...initialBlogState,

  // Actions
  setBlogField: (field, value) => set((state) => ({ ...state, [field]: value })),
  
  setObjectiveField: (field, value) => set((state) => {
    if (field === 'primaryGoal') {
      return { ...state, primaryGoal: value };
    } else if (field === 'contentGoals') {
      return { ...state, contentGoals: value };
    } else if (field === 'targetKeywords') {
      return { ...state, targetKeywords: value };
    }
    return state;
  }),
  
  setSelectedStructureId: (id) => set((state) => ({ ...state, selectedStructureId: id })),
  setContentElements: (elements) => set((state) => ({ ...state, contentElements: elements })),
  setHeadingStructure: (structure) => set((state) => ({ ...state, headingStructure: structure })),
  
  setSeoStatus: (status) => set((state) => ({ ...state, seoStatus: status })),
  setReadabilityStatus: (status) => set((state) => ({ ...state, readabilityStatus: status })),
  setAudienceAlignmentStatus: (status) => set((state) => ({ ...state, audienceAlignmentStatus: status })),
  
  setIsPublishing: (isPublishing) => set((state) => ({ ...state, isPublishing })),
  setPublishingPlatform: (platform) => set((state) => ({ ...state, publishingPlatform: platform })),
  setScheduledTime: (time) => set((state) => ({ ...state, scheduledTime: time })),
  setPromotionChannels: (channels) => set((state) => ({ ...state, promotionChannels: channels })),
  
  setTrafficMetrics: (metrics) => set((state) => ({ ...state, trafficMetrics: metrics })),
  setEngagementMetrics: (metrics) => set((state) => ({ ...state, engagementMetrics: metrics })),
  setConversionMetrics: (metrics) => set((state) => ({ ...state, conversionMetrics: metrics })),
  setSeoPerformance: (performance) => set((state) => ({ ...state, seoPerformance: performance })),
});
