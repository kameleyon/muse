interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface OpenRouterRequest {
  model: string
  messages: OpenRouterMessage[]
  temperature?: number
  max_tokens?: number
}

class OpenRouterAPI {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || import.meta.env.VITE_API_KEY || ''
    this.baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9999'
    
    if (!this.apiKey) {
      console.warn('API key not found in environment variables, some features may not work')
    }
  }

  private checkApiKey() {
    if (!this.apiKey) {
      throw new Error('API key not found. Please add VITE_OPENROUTER_API_KEY to your environment variables.')
    }
  }

  async generateCompletion(request: OpenRouterRequest): Promise<string> {
    this.checkApiKey();
    try {
      const response = await fetch(`${this.baseUrl}/api/book-ai/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('OpenRouter API error:', error)
        throw new Error(error.error?.message || `Failed to generate content: ${response.status}`)
      }

      const data = await response.json()
      if (!data.content) {
        console.error('Unexpected response format:', data)
        throw new Error('Invalid response format from API')
      }
      
      return data.content
    } catch (error) {
      console.error('Error calling OpenRouter API:', error)
      throw error
    }
  }

  async conductMarketResearch(topic: string, resources: string[] = []): Promise<any> {
    this.checkApiKey();
    const systemPrompt = `You are an expert market researcher specializing in book publishing. Analyze the given topic and provide comprehensive market research to guide the book creation process.`
    
    const userPrompt = `Topic: ${topic}
${resources.length > 0 ? `\nReference materials provided: ${resources.join(', ')}` : ''}

Please conduct thorough market research and provide:
1. Target audience demographics and psychographics
2. Market size and growth potential
3. Competing books and market gaps
4. Recommended tone and writing style to appeal to target audience
5. Suggested color schemes for book cover that would attract target audience
6. Key pain points and desires of the target audience
7. Pricing strategy recommendations

You must respond with ONLY valid JSON in this exact format:
{
  "targetAudience": {
    "demographics": "detailed demographics",
    "psychographics": "interests, values, behaviors",
    "painPoints": ["pain point 1", "pain point 2"],
    "desires": ["desire 1", "desire 2"]
  },
  "marketAnalysis": {
    "size": "market size estimate",
    "growth": "growth potential",
    "competition": ["competing book 1", "competing book 2"],
    "gaps": ["market gap 1", "market gap 2"]
  },
  "recommendations": {
    "tone": "recommended tone (e.g., conversational, authoritative, friendly)",
    "style": "writing style (e.g., practical, academic, narrative)",
    "colors": {
      "primary": "#hexcode",
      "secondary": "#hexcode",
      "accent": "#hexcode",
      "reasoning": "why these colors appeal to target audience"
    },
    "pricing": {
      "suggested": "$XX.XX",
      "reasoning": "pricing rationale"
    }
  }
}`

    const messages: OpenRouterMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]

    const model = import.meta.env.VITE_MARKET_RESEARCH_MODEL || 'openai/gpt-4o-mini'
    
    const response = await this.generateCompletion({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 7000
    })

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      return JSON.parse(response)
    } catch (e) {
      console.error('Failed to parse market research response:', response)
      throw new Error('Failed to parse market research response')
    }
  }

  async generateBookStructure(topic: string, marketResearch: any, resources: string[] = []): Promise<any> {
    this.checkApiKey();
    
    // Create additional info from market research
    const additionalInfo = `
Market Research Findings:
- Target Audience: ${marketResearch.targetAudience.demographics}
- Audience Pain Points: ${marketResearch.targetAudience.painPoints.join(', ')}
- Audience Desires: ${marketResearch.targetAudience.desires.join(', ')}
- Market Gaps: ${marketResearch.marketAnalysis.gaps.join(', ')}
- Recommended Tone: ${marketResearch.recommendations.tone}
- Recommended Style: ${marketResearch.recommendations.style}
${resources.length > 0 ? `\nReference materials: ${resources.join(', ')}` : ''}`;

    const targetAudience = marketResearch.targetAudience.demographics || '';

    const systemPrompt = `You are an expert book outline creator. Create a detailed table of contents for a book about the given topic.
Include chapter titles and brief descriptions. Structure the outline in a clear, hierarchical format.
Consider the target audience and their needs. Be comprehensive but focused.`;

    const userPrompt = `Create a detailed table of contents for a book about: ${topic}
${additionalInfo ? `
Additional details: ${additionalInfo}` : ''}

Target audience: ${targetAudience}

You have complete creative freedom to structure the book in the most effective way for this topic. Create a rich, detailed outline that would be compelling and valuable to the target audience. Feel free to organize it with parts, sections, chapters, appendices, etc. as appropriate.

Format a comprehensive and detailed outline showing a vast and deep mastery of the ${topic} with Distinct Parts or sections including their clear chapter titles and brief descriptions.
Use markdown formatting with # for main sections and ## for subsections,

Your response must be valid JSON and include at minimum these fields:
{
  "title": "Suggested book title",
  "subtitle": "Compelling subtitle",
  "audience": "refined target audience description",
  "style": "${marketResearch.recommendations.style}",
  "tone": "${marketResearch.recommendations.tone}",
  "marketPosition": "how to position this book in the market",
  "uniqueValue": "what makes this book different",
  "acknowledgement": "Optional acknowledgement text", "estimatedWords": 150,
  "prologue": "Optional prologue text", "estimatedWords": 1500,
  "introduction": "Introduction text with markdown formatting", "estimatedWords": 4500,
  "conclusion": "Conclusion text with markdown formatting", "estimatedWords": 4500,
  "parts": [
    {
      "title": "Part I: PART TITLE",
      "chapters": [
        {
          "number": 1,
          "title": "Chapter title",
          "description": "Brief description of chapter content",
          "estimatedWords": 4000,
          "keyTopics": ["topic1", "topic2"]
        }
      ]
    }
  ],
  "chapters": [
    {
      "number": 1,
      "title": "Chapter title",
      "description": "Brief description of chapter content",
      "estimatedWords": 4000,
      "keyTopics": ["topic1", "topic2"]
    }
  ],
   "conclusion": "Conclusion text with markdown formatting", "estimatedWords": 4500,
   "totalWords": 184000
}

Be creative with the structure but ensure the "chapters" array always exists. Each chapter should have at minimum a number, title, description, and estimatedWords. You can add additional fields to chapters or add other structural elements to the book as needed.

Create a natural flow from beginning to end, with a clear introduction and conclusion. Make the descriptions informative and engaging.
`

    const messages: OpenRouterMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]

    const model = import.meta.env.VITE_BOOK_STRUCTURE_MODEL || 'anthropic/claude-3.5-sonnet'
    
    const response = await this.generateCompletion({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 174000
    })

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      return JSON.parse(response)
    } catch (e) {
      console.error('Failed to parse AI response:', response)
    
      
    }
  }

  async generateChapter(
    bookContext: {
      title: string
      topic: string
      audience: string
      style: string
      tone: string
      previousChapters: string[]
      marketResearch?: any
    },
    chapterInfo: {
      number: number
      title: string
      description: string
      keyTopics?: string[]
      estimatedWords: number
    }
  ): Promise<string> {
    this.checkApiKey();
    
    const systemPrompt = `You are an expert book writer specializing in creating content that resonates with specific target audiences. Write in the exact tone and style specified, addressing the audience's pain points and desires.`
    
    const userPrompt = `Book Title: ${bookContext.title}
Topic: ${bookContext.topic}
Target Audience: ${bookContext.audience}
Writing Style: ${bookContext.style}
Tone: ${bookContext.tone}

Chapter ${chapterInfo.number}: ${chapterInfo.title}
Description: ${chapterInfo.description}
${chapterInfo.keyTopics ? `Key Topics to Cover: ${chapterInfo.keyTopics.join(', ')}` : ''}
Target Word Count: ${chapterInfo.estimatedWords} words

${bookContext.previousChapters.length > 0 ? `Previous chapters covered: ${bookContext.previousChapters.join(', ')}` : 'This is the first chapter.'}

Write this chapter following these guidelines:
1. Use the specified ${bookContext.tone} tone throughout
2. Follow the ${bookContext.style} writing style
3. Address the target audience's specific needs and interests
4. Include practical examples and actionable insights
5. Maintain consistency with previous chapters
6. Aim for approximately ${chapterInfo.estimatedWords} words
7. Format the content as proper markdown:
   - Use ## for the main chapter title
   - Use ### for subsections
   - Use #### for important point in subsctions
   - Use **bold** for emphasis
   - Use - or * for bullet points
   - Use > for blockquotes
   - Use *** Your key-point text goes here ***
   - Ensure proper paragraph spacing (empty line between paragraphs)
   - Use numbered lists where appropriate
   - Use backticks for inline code or technical terms
8. Start with the chapter title as ## heading
9. Structure the content with clear subsections using ### headings`

    const messages: OpenRouterMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]

    const model = import.meta.env.VITE_CONTENT_GENERATOR_MODEL || 'anthropic/claude-3.5-sonnet'
    
    let temperature = 0.7
    if (bookContext.tone?.toLowerCase().includes('creative') || 
        bookContext.tone?.toLowerCase().includes('inspirational')) {
      temperature = 0.9
    } else if (bookContext.tone?.toLowerCase().includes('academic') || 
               bookContext.tone?.toLowerCase().includes('technical')) {
      temperature = 0.5
    }
    
    const maxTokens = Math.min(Math.ceil(chapterInfo.estimatedWords * 1.5), 18000)
    
    return await this.generateCompletion({
      model,
      messages,
      temperature,
      max_tokens: maxTokens
    })
  }

  async reviseChapter(
    originalContent: string,
    revisionInstructions: string
  ): Promise<string> {
    this.checkApiKey();
    
    const systemPrompt = `You are an expert editor. Revise the provided content according to the given instructions while maintaining the overall structure and key points.`
    
    const userPrompt = `Original content:
${originalContent}

Revision instructions:
${revisionInstructions}

Please revise the content accordingly.`

    const messages: OpenRouterMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]

    const model = 'anthropic/claude-3.5-sonnet'
    
    return await this.generateCompletion({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 14000
    })
  }
}

export const openRouter = new OpenRouterAPI()
