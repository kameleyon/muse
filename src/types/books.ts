export interface Book {
  id: string
  user_id: string
  title: string
  topic: string
  status: 'draft' | 'in_progress' | 'complete'
  audience?: string
  style?: string
  market_research?: any
  structure?: BookStructure
  toc?: any
  pricing_info?: any
  color_scheme?: any
  book_type?: string
  chapters?: Chapter[]
  created_at: string
  updated_at: string
}

export interface Chapter {
  id: string
  book_id: string
  number: number
  title: string
  content: string
  status: 'draft' | 'pending' | 'generating' | 'generated' | 'approved' | 'in_progress' | 'complete'
  word_count?: number
  metadata?: {
    description?: string
    estimatedWords?: number
    keyTopics?: string[]
  }
  created_at: string
  updated_at: string
}

export interface Upload {
  id: string
  book_id: string
  user_id: string
  filename: string
  file_type: string
  file_path: string
  file_size?: number
  created_at: string
}

export interface MarketResearch {
  targetAudience: {
    demographics: string[]
    psychographics: string[]
    painPoints: string[]
    desires: string[]
  }
  toneAndStyle?: {
    tone: string
    writingStyle: string
    voiceCharacteristics: string[]
  }
  colorScheme?: {
    primary: string
    secondary: string
    accent: string
    meaning: string
  }
  marketPositioning?: {
    uniqueValue: string
    competitorAnalysis: string[]
    pricingRange: string
    marketGap: string
  }
  bookFormat?: {
    recommendedLength: string
    chapterStructure: string
    keyElements: string[]
  }
}

export interface BookStructure {
  title: string
  subtitle: string
  chapters: Array<{
    number: number
    title: string
    description: string
    estimatedWords?: number
    wordCount?: number
    keyPoints?: string[]
    purpose?: string
  }>
  totalChapters?: number
  totalWords?: number
  reasoning?: string
  audience?: string
  style?: string
  tone?: string
  marketPosition?: string
}