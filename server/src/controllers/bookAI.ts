import { Request, Response } from 'express';
import { supabaseClient } from '../services/supabase';
import { executeOpenRouterRequest } from '../services/openrouter';

// Clean JSON response helper
function cleanJsonResponse(response: string): any {
  try {
    // First try direct JSON parse
    return JSON.parse(response);
  } catch (e) {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1].trim());
      } catch (e) {
        // Continue to other extraction methods
      }
    }
    
    // Try to find JSON object in the response
    const objectMatch = response.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      try {
        return JSON.parse(objectMatch[0]);
      } catch (e) {
        // Continue to other extraction methods
      }
    }
    
    throw new Error('Failed to parse JSON response');
  }
}

export const generateMarketResearch = async (req: Request, res: Response) => {
  try {
    const { topic, references = [] } = req.body;

    const systemPrompt = `You are an expert market researcher specializing in book publishing. Analyze the given topic and provide comprehensive market research to guide the book creation process.`;
    
    const userPrompt = `Topic: ${topic}
${references.length > 0 ? `\nReference materials provided: ${references.join(', ')}` : ''}

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
}`;

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: userPrompt }
    ];

    const model = 'openai/gpt-4o-mini';
    
    const completion = await executeOpenRouterRequest({
      model,
      prompt: messages.map(m => `${m.role}: ${m.content}`).join('\n'),
      temperature: 0.7,
      max_tokens: 3000
    });

    const marketResearch = cleanJsonResponse(completion.choices[0].message.content);
    res.json({ marketResearch });
  } catch (error: any) {
    console.error('Error generating market research:', error);
    res.status(500).json({ error: error.message || 'Failed to generate market research' });
  }
};

export const generateBookStructure = async (req: Request, res: Response) => {
  try {
    const { topic, marketResearch, references = [] } = req.body;

    const systemPrompt = `You are an expert book writer. Based on the market research provided, create a comprehensive book structure that will appeal to the target audience and fill identified market gaps.`;
    
    const userPrompt = `Topic: ${topic}
${references.length > 0 ? `\nReference materials provided: ${references.join(', ')}` : ''}

Market Research Findings:
- Target Audience: ${marketResearch.targetAudience.demographics}
- Audience Pain Points: ${marketResearch.targetAudience.painPoints.join(', ')}
- Audience Desires: ${marketResearch.targetAudience.desires.join(', ')}
- Market Gaps: ${marketResearch.marketAnalysis.gaps.join(', ')}
- Recommended Tone: ${marketResearch.recommendations.tone}
- Recommended Style: ${marketResearch.recommendations.style}

Based on this market research, create a book structure that:
1. Addresses all identified pain points
2. Fulfills the audience's desires
3. Fills the market gaps
4. Uses the recommended tone and style
5. Is structured for maximum engagement with the target audience

You must respond with ONLY valid JSON in this exact format:
{
  "title": "Suggested book title",
  "subtitle": "Compelling subtitle",
  "audience": "refined target audience description",
  "style": "specific writing style based on research",
  "tone": "specific tone based on research",
  "marketPosition": "how to position this book in the market",
  "uniqueValue": "what makes this book different",
  "chapters": [
    {
      "number": 1,
      "title": "Chapter Title",
      "description": "Brief description addressing specific pain points/desires",
      "estimatedWords": 3000,
      "keyTopics": ["topic1", "topic2"]
    }
  ],
  "totalWords": 50000,
  "colorScheme": {
    "primary": "${marketResearch.recommendations.colors.primary}",
    "secondary": "${marketResearch.recommendations.colors.secondary}",
    "accent": "${marketResearch.recommendations.colors.accent}"
  }
}`;

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: userPrompt }
    ];

    const model = 'openai/gpt-4o';
    
    const completion = await executeOpenRouterRequest({
      model,
      prompt: messages.map(m => `${m.role}: ${m.content}`).join('\n'),
      temperature: 0.7,
      max_tokens: 4000
    });

    const structure = cleanJsonResponse(completion.choices[0].message.content);
    res.json({ structure });
  } catch (error: any) {
    console.error('Error generating book structure:', error);
    res.status(500).json({ error: error.message || 'Failed to generate book structure' });
  }
};

export const generateChapter = async (req: Request, res: Response) => {
  try {
    const { chapterId } = req.body;

    // Get chapter details
    const { data: chapter, error: chapterError } = await supabaseClient
      .from('chapters')
      .select('*')
      .eq('id', chapterId)
      .single();

    if (chapterError) throw chapterError;

    // Get book details
    const { data: book, error: bookError } = await supabaseClient
      .from('books')
      .select('*')
      .eq('id', chapter.book_id)
      .single();

    if (bookError) throw bookError;

    // Get previous chapters for context
    const { data: allChapters } = await supabaseClient
      .from('chapters')
      .select('number, title')
      .eq('book_id', chapter.book_id)
      .lt('number', chapter.number)
      .order('number');

    const previousChapters = allChapters?.map((ch: any) => ch.title) || [];

    const systemPrompt = `You are an expert book writer specializing in creating content that resonates with specific target audiences. Write in the exact tone and style specified, addressing the audience's pain points and desires.`;
    
    const userPrompt = `Book Title: ${book.title}
Topic: ${book.topic}
Target Audience: ${book.structure?.audience || ''}
Writing Style: ${book.structure?.style || 'Clear and engaging'}
Tone: ${book.structure?.tone || 'Conversational'}

Chapter ${chapter.number}: ${chapter.title}
Description: ${book.structure?.chapters?.[chapter.number - 1]?.description || ''}
${book.structure?.chapters?.[chapter.number - 1]?.keyTopics ? `Key Topics to Cover: ${book.structure.chapters[chapter.number - 1].keyTopics.join(', ')}` : ''}
Target Word Count: ${book.structure?.chapters?.[chapter.number - 1]?.estimatedWords || 3000} words

${previousChapters.length > 0 ? `Previous chapters covered: ${previousChapters.join(', ')}` : 'This is the first chapter.'}

Write this chapter following these guidelines:
1. Use the specified ${book.structure?.tone || 'conversational'} tone throughout
2. Follow the ${book.structure?.style || 'clear and engaging'} writing style
3. Address the target audience's specific needs and interests
4. Include practical examples and actionable insights
5. Maintain consistency with previous chapters
6. Aim for approximately ${book.structure?.chapters?.[chapter.number - 1]?.estimatedWords || 3000} words
7. Format the content as proper markdown:
   - Use ## for the main chapter title
   - Use ### for subsections
   - Use **bold** for emphasis
   - Use - or * for bullet points
   - Use > for blockquotes
   - Ensure proper paragraph spacing (empty line between paragraphs)
   - Use numbered lists where appropriate
8. Start with the chapter title as ## heading
9. Structure the content with clear subsections using ### headings`;

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: userPrompt }
    ];

    const model = 'anthropic/claude-3.5-sonnet-20240620';
    
    // Adjust temperature based on tone
    let temperature = 0.7;
    if (book.structure?.tone?.toLowerCase().includes('creative') || 
        book.structure?.tone?.toLowerCase().includes('inspirational')) {
      temperature = 0.9;
    } else if (book.structure?.tone?.toLowerCase().includes('academic') || 
               book.structure?.tone?.toLowerCase().includes('technical')) {
      temperature = 0.5;
    }
    
    // Adjust max_tokens based on estimated words (roughly 1.3 tokens per word)
    const maxTokens = Math.min(Math.ceil((book.structure?.chapters?.[chapter.number - 1]?.estimatedWords || 3000) * 1.5), 8000);
    
    const response = await executeOpenRouterRequest({
      model,
      prompt: messages.map(m => `${m.role}: ${m.content}`).join('\n'),
      temperature,
      max_tokens: maxTokens
    });

    // Update chapter with generated content
    const content = response.choices[0].message.content;
    const { data: updatedChapter, error: updateError } = await supabaseClient
      .from('chapters')
      .update({
        content,
        status: 'in_progress',
        updated_at: new Date().toISOString()
      })
      .eq('id', chapterId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Update book's updated_at timestamp
    await supabaseClient
      .from('books')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', chapter.book_id);

    res.json({ chapter: updatedChapter });
  } catch (error: any) {
    console.error('Error generating chapter:', error);
    res.status(500).json({ error: error.message || 'Failed to generate chapter' });
  }
};

export const reviseChapter = async (req: Request, res: Response) => {
  try {
    const { chapterId, revisionInstructions } = req.body;

    // Get chapter details
    const { data: chapter, error: chapterError } = await supabaseClient
      .from('chapters')
      .select('*')
      .eq('id', chapterId)
      .single();

    if (chapterError) throw chapterError;

    if (!chapter.content) {
      throw new Error('Chapter has no content to revise');
    }

    const systemPrompt = `You are an expert editor. Revise the provided content according to the given instructions while maintaining the overall structure and key points.`;
    
    const userPrompt = `Original content:
${chapter.content}

Revision instructions:
${revisionInstructions}

Please revise the content accordingly.`;

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: userPrompt }
    ];

    const model = 'anthropic/claude-3.5-sonnet-20240620';
    
    const response2 = await executeOpenRouterRequest({
      model,
      prompt: messages.map(m => `${m.role}: ${m.content}`).join('\n'),
      temperature: 0.7,
      max_tokens: 4000
    });

    // Update chapter with revised content
    const revisedContent = response2.choices[0].message.content;
    const { data: updatedChapter, error: updateError } = await supabaseClient
      .from('chapters')
      .update({
        content: revisedContent,
        status: 'in_progress',
        updated_at: new Date().toISOString()
      })
      .eq('id', chapterId)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json({ chapter: updatedChapter });
  } catch (error: any) {
    console.error('Error revising chapter:', error);
    res.status(500).json({ error: error.message || 'Failed to revise chapter' });
  }
};