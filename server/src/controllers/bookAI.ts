import { Request, Response } from 'express';
import { supabaseClient, supabaseAdmin } from '../services/supabase';
import { executeOpenRouterRequest } from '../services/openrouter';

// Clean JSON response helper
function cleanJsonResponse(response: string): any {
  console.log("Received response from AI model, attempting to extract JSON...");
  
  try {
    // First try direct JSON parse
    return JSON.parse(response);
  } catch (e: any) {
    console.log("Failed to parse direct JSON, trying to extract from response:", e.message);
    
    try {
      // Extract JSON from markdown code blocks
      const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        try {
          const json = JSON.parse(jsonMatch[1].trim());
          console.log("Successfully extracted JSON from code block");
          return json;
        } catch (e2: any) {
          console.log("Failed to parse JSON from code block:", e2.message);
        }
      }
      
      // Try to find JSON object in the response
      const objectMatch = response.match(/\{[\s\S]*\}/);
      if (objectMatch) {
        try {
          const extracted = objectMatch[0];
          // Fix common JSON parsing issues
          const cleanedJson = extracted
            // Fix unquoted keys
            .replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3')
            // Fix trailing commas in arrays and objects
            .replace(/,(\s*[\]}])/g, '$1')
            // Fix missing quotes around string values
            .replace(/:\s*([a-zA-Z][a-zA-Z0-9_]*)\s*([,}])/g, ':"$1"$2')
            // Ensure consistent quotation
            .replace(/:\s*'([^']*)'/g, ':"$1"');
            
          console.log("Cleaned JSON from regex match");
          return JSON.parse(cleanedJson);
        } catch (e3: any) {
          console.log("Failed to parse cleaned JSON from regex match:", e3.message);
        }
      }
      
      // As a last resort, try to parse the entire response text as a fallback structure
      console.log("Creating a fallback structure from the response text");
      
      // Look for a title in the response
      const titleMatch = response.match(/title[:\s]+["']?([^"'\n,]+)["']?/i);
      const title = titleMatch ? titleMatch[1].trim() : "Generated Book";
      
      // Look for a subtitle
      const subtitleMatch = response.match(/subtitle[:\s]+["']?([^"'\n,]+)["']?/i);
      const subtitle = subtitleMatch ? subtitleMatch[1].trim() : "A Comprehensive Guide";
      
      // Check if we can extract parts or sections from the response
      const partsRegex = /Part\s+\w+:\s+([A-Z\s]+)/g;
      const partMatches = [...response.matchAll(partsRegex)];
      
      // Extract chapters
      const chapterRegex = /Chapter\s+(\d+):\s+([^\n]+)/g;
      const chapterMatches = [...response.matchAll(chapterRegex)];
      
      // Group chapters by parts if possible
      const parts = [];
      
      if (partMatches.length > 0) {
        // We have parts, try to organize chapters under them
        partMatches.forEach((partMatch, partIndex) => {
          const partTitle = partMatch[1].trim();
          const nextPartMatch = partMatches[partIndex + 1] || null;
          const partStart = partMatch.index as number;
          const partEnd = nextPartMatch ? nextPartMatch.index : response.length;
          const partText = response.substring(partStart, partEnd);
          
          // Find chapters within this part text
          const partChapters = [];
          const chapterRegex = /Chapter\s+(\d+):\s+([^\n]+)/g;
          let chapterMatch;
          while ((chapterMatch = chapterRegex.exec(partText)) !== null) {
            partChapters.push({
              number: parseInt(chapterMatch[1]),
              title: chapterMatch[2].trim(),
              description: "Chapter extracted from AI response",
              estimatedWords: 3000
            });
          }
          
          if (partChapters.length > 0) {
            parts.push({
              partNumber: partIndex + 1,
              partTitle: partTitle,
              chapters: partChapters
            });
          }
        });
      }
      
      // If we couldn't extract parts but have chapters, create a flat structure
      if (parts.length === 0 && chapterMatches.length > 0) {
        // Create a single part with all chapters
        const flatChapters = chapterMatches.map(match => ({
          number: parseInt(match[1]),
          title: match[2].trim(),
          description: "Chapter extracted from AI response",
          estimatedWords: 3000
        }));
        
        if (flatChapters.length > 0) {
          parts.push({
            partNumber: 1,
            partTitle: "MAIN CONTENT",
            chapters: flatChapters
          });
        }
      }
      
      // Create a fallback structure with at least 32 chapters across 8 parts
      let fallbackParts = [];
      
      if (parts.length > 0) {
        // We have extracted some parts, use them
        fallbackParts = parts;
        
        // Check if we have enough chapters (at least 30)
        const totalChapters = parts.reduce((total, part) => total + part.chapters.length, 0);
        if (totalChapters < 30) {
          // Add more parts if needed
          const additionalPartsNeeded = Math.ceil((30 - totalChapters) / 4);
          for (let i = 0; i < additionalPartsNeeded; i++) {
            const partNumber = parts.length + i + 1;
            fallbackParts.push({
              partNumber,
              partTitle: `ADDITIONAL CONTENT PART ${partNumber}`,
              chapters: Array.from({ length: 4 }, (_, j) => ({
                number: totalChapters + (i * 4) + j + 1,
                title: `Additional Chapter ${j + 1}`,
                description: "Auto-generated chapter for comprehensive coverage",
                estimatedWords: 4000
              }))
            });
          }
        }
      } else {
        // Create 8 parts with 4 chapters each
        const partTitles = [
          "FOUNDATIONS AND CORE CONCEPTS",
          "ESSENTIAL STRATEGIES",
          "PRACTICAL TECHNIQUES",
          "ADVANCED APPLICATIONS",
          "CASE STUDIES AND EXAMPLES",
          "IMPLEMENTATION AND EXECUTION",
          "OVERCOMING CHALLENGES",
          "MASTERY AND FUTURE DIRECTIONS"
        ];
        
        fallbackParts = partTitles.map((partTitle, partIndex) => ({
          partNumber: partIndex + 1,
          partTitle,
          chapters: Array.from({ length: 4 }, (_, j) => ({
            number: (partIndex * 4) + j + 1,
            title: `${partTitle.split(' ')[0]} Chapter ${j + 1}`,
            description: `Auto-generated chapter covering ${partTitle.toLowerCase()}`,
            estimatedWords: 3000
          }))
        }));
      }
      
      const fallbackStructure = {
        title,
        subtitle,
        parts: fallbackParts,
        introduction: "Introduction to the topic - providing essential context and overview",
        conclusion: "Concluding thoughts on the topic - integrating key insights and future directions",
        marketPosition: "Comprehensive guide for practitioners and enthusiasts alike",
        uniqueValue: "Combines theoretical foundations with practical applications in an accessible format"
      };
      
      console.log("Created fallback structure with parts:", fallbackStructure.parts.length);
      return fallbackStructure;
    } catch (finalError: any) {
      console.error("Failed all JSON parsing attempts:", finalError);
      throw new Error('Failed to parse JSON response and could not create fallback structure');
    }
  }
}

export const generateMarketResearch = async (req: Request, res: Response) => {
  try {
    const { topic, references = [] } = req.body;

    const systemPrompt = `You are an expert market researcher specializing in book publishing. Analyze the given topic and provide comprehensive market research to guide the book creation process. Your response MUST be valid JSON that can be parsed directly with JSON.parse().`;
    
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
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const model = 'openai/gpt-4o-search-preview';
    
    console.log(`Generating market research for topic: ${topic}`);
    const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n');
    const completion = await executeOpenRouterRequest({
      model,
      prompt,
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 3000
    });

    const marketResearch = cleanJsonResponse(completion.choices[0].message.content || '');
    res.json({ marketResearch });
  } catch (error: any) {
    console.error('Error generating market research:', error);
    res.status(500).json({ error: error.message || 'Failed to generate market research' });
  }
};

export const generateBookStructure = async (req: Request, res: Response) => {
  try {
    const { topic, marketResearch, references = [] } = req.body;

    const systemPrompt = `You are an expert book outliner who creates JSON-structured book outlines. Your entire response MUST be valid, parseable JSON with no text before or after the JSON object. Based on the market research provided, create a comprehensive book structure.
    Format a comprehensive and detailed outline showing a vast and deep mastery of the ${topic} with Distinct Parts or sections including their clear chapter titles and brief descriptions.
Use markdown formatting with # for main sections and ## for subsections,

CRITICAL JSON FORMAT REQUIREMENTS:
1. Output ONLY well-formed, valid JSON that can be parsed directly with JSON.parse()
2. Do NOT include markdown formatting, code blocks, or any explanation text
3. Ensure all keys are properly quoted with double quotes
4. Ensure no trailing commas in arrays or objects
5. Ensure all string values are properly quoted with double quotes
6. DO NOT use single quotes for strings in your JSON

CONTENT REQUIREMENTS:
1. Create a book structure with multiple parts. Each part should contain 4-7 thematically related chapters.
2. The total estimated word count for the entire book should be between 160,000 and 184,000 words. Distribute this word count appropriately across chapters.
3. Each chapter must have a creative and descriptive title, a detailed explanation/description of its content and purpose, an estimated word count, key topics to be covered, and 3-5 key points the reader should take away.
4. Include a Prologue, Introduction, and Conclusion. These MUST be structured as full chapters within the 'parts' array.
   - The Prologue and Introduction should be the initial chapters, logically grouped (e.g., in a "Part 0: Prelude" or similar).
   - The Conclusion should be the final chapter, logically grouped (e.g., in a final "Part X: Final Thoughts").
5. An 'acknowledgement' section should be a brief top-level string.
6. Do NOT include 'appendix', 'references', or 'coverPageDetails' as part of the chapter flow in the 'parts' array; these are handled separately if needed.
7. Be creative with part titles and chapter titles based on the topic and market research. Do not just use generic placeholders.
8. Ensure the JSON format is strictly followed as per the example.

CRITICAL: Your ENTIRE response must be ONLY the JSON object with no preceding or following text.`;
    
    const userPrompt = `Topic: ${topic}
${references.length > 0 ? `\nReference materials provided: ${references.join(', ')}` : ''}

Market Research Findings:
- Target Audience: ${marketResearch.targetAudience.demographics}
- Audience Pain Points: ${marketResearch.targetAudience.painPoints.join(', ')}
- Audience Desires: ${marketResearch.targetAudience.desires.join(', ')}
- Market Gaps: ${marketResearch.marketAnalysis.gaps.join(', ')}
- Recommended Tone: ${marketResearch.recommendations.tone}
- Recommended Style: ${marketResearch.recommendations.style}



You must respond with ONLY valid JSON in this exact format:
{
  "title": "Suggested book title",
  "subtitle": "Compelling subtitle",
  "audience": "refined target audience description",
  "style": "specific writing style based on research",
  "tone": "specific tone based on research",
  "marketPosition": "how to position this book in the market",
  "uniqueValue": "what makes this book different",
  "acknowledgement": "A brief acknowledgement section content here. This should be concise.",
  "parts": [
    {
      "partNumber": 0, // Or a suitable starting number for prelude/intro part
      "partTitle": "Example: Setting the Stage", // AI should generate a creative title
      "chapters": [
        {
          "number": 0, // Can be 0 or 1 depending on how AI sequences
          "title": "Prologue: A Glimpse into the Journey", // AI should generate a creative title
          "description": "A compelling prologue that hooks the reader, introduces core mysteries or themes, and sets the tone for the book. This should be a full chapter.",
          "estimatedWords": 2500, // Example, AI to determine based on overall structure
          "keyPoints": ["Key hook or opening statement", "Sets the stage for the book's main theme", "Introduces a central question or conflict"],
          "keyTopics": ["Prologue themes", "Initial narrative hook", "Foreshadowing"]
        },
        {
          "number": 1, // Sequential numbering
          "title": "Introduction: Understanding the Landscape", // AI should generate a creative title
          "description": "A detailed introduction explaining the book's premise, scope, what the reader will gain, and a roadmap of the content. This should be a full chapter.",
          "estimatedWords": 3500, // Example
          "keyPoints": ["Main argument/thesis of the book", "Overview of book structure and flow", "What the reader will learn or achieve"],
          "keyTopics": ["Introduction themes", "Core concepts overview", "Book's purpose and value proposition"]
        }
      ]
    },
    {
      "partNumber": 1, // Or next sequential part number
      "partTitle": "Example: Exploring Core Concepts", // AI should generate a creative title
      "chapters": [
        {
          "number": 2, // Sequential numbering
          "title": "Chapter X: Creative Title for First Main Chapter", // AI to generate
          "description": "Detailed description of what this chapter covers, addressing specific pain points/desires of the target audience. Explain the chapter's purpose and how it fits into the part's theme.",
          "estimatedWords": 5000, // Example
          "keyPoints": ["Primary takeaway for this chapter", "Crucial concept explained clearly", "Actionable insight or application", "Connection to previous/next chapter"],
          "keyTopics": ["Main subject of this chapter", "Sub-topic A explored", "Sub-topic B introduced"]
        }
        // ... AI to add 3-6 more chapters to this part ...
      ]
    }
    // ... AI to add more parts, each with 4-7 chapters ...
    ,
    {
      "partNumber": "N", // Example: Last part number
      "partTitle": "Example: Synthesizing and Looking Ahead", // AI should generate a creative title
      "chapters": [
        {
          "number": "M", // Example: Last chapter number
          "title": "Conclusion: The Path Forward", // AI should generate a creative title
          "description": "A meaningful conclusion that summarizes key takeaways, reiterates the book's core message, offers final thoughts, and potentially a call to action or future outlook. This should be a full chapter.",
          "estimatedWords": 3000, // Example
          "keyPoints": ["Summary of the book's main arguments/discoveries", "Final impactful message or insight", "Suggested next steps or reflections for the reader"],
          "keyTopics": ["Recap of key themes", "Concluding insights", "Future implications or call to action"]
        }
      ]
    }
  ],
  "totalWords": 150000, // AI should calculate this based on chapter estimates, aiming for 160K-184k range
  "colorScheme": {
    "primary": "${marketResearch.recommendations.colors.primary}",
    "secondary": "${marketResearch.recommendations.colors.secondary}",
    "accent": "${marketResearch.recommendations.colors.accent}"
  }
}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const model = 'anthropic/claude-3.7-sonnet'; 
    
    const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n');
    const completion = await executeOpenRouterRequest({
      model,
      prompt,
      messages,
      temperature: 0.7,
      max_tokens: 16000 
    });

    // Log the first 500 characters of the response for debugging
    // Extract content from the response
    const rawResponse = completion.choices[0].message.content || '';
    console.log("Raw response from AI (first 500 chars):", rawResponse.substring(0, 500));
    
    // Try to clean and parse the JSON response
    const structure = cleanJsonResponse(rawResponse);
    res.json({ structure });
  } catch (error: any) {
    console.error('Error generating book structure:', error);
    res.status(500).json({ error: error.message || 'Failed to generate book structure' });
  }
};

export const generateChapter = async (req: Request, res: Response) => {
  try {
    const { chapterId } = req.body;
    
    console.log(`Attempting to generate chapter with ID: ${chapterId}`);

    // Get chapter details with explicit error handling
    console.log(`Looking for chapter with ID: ${chapterId}`);
    
    const chapterResult = await supabaseAdmin // Use supabaseAdmin
      .from('chapters')
      .select('*')
      .eq('id', chapterId);

    if (chapterResult.error) {
      console.error(`Chapter query error:`, chapterResult.error);
      throw new Error(`Failed to retrieve chapter: ${chapterResult.error.message}`);
    }
    
    if (!chapterResult.data || chapterResult.data.length === 0) {
      console.error(`No chapter found with ID: ${chapterId}`);
      
      // Additional diagnostics to help debug the issue
      const allChaptersResult = await supabaseAdmin // Use supabaseAdmin
        .from('chapters')
        .select('id, book_id, title')
        .limit(10);
      
      if (allChaptersResult.error) {
        console.error('Error checking for any chapters:', allChaptersResult.error);
      } else if (allChaptersResult.data.length === 0) {
        console.error('No chapters exist in the database at all');
      } else {
        console.error(`Found ${allChaptersResult.data.length} chapters in database, but none with ID ${chapterId}`);
        console.error('First few chapters:', allChaptersResult.data);
      }
      
      throw new Error(`Chapter not found with ID: ${chapterId}. This likely means the chapter wasn't created properly when the book was set up.`);
    }
    
    const chapter = chapterResult.data[0];
    console.log(`Found chapter:`, chapter);

    // Get book details with explicit error handling
    const bookResult = await supabaseAdmin // Use supabaseAdmin
      .from('books')
      .select('*')
      .eq('id', chapter.book_id);

    if (bookResult.error) {
      console.error(`Book query error:`, bookResult.error);
      throw new Error(`Failed to retrieve book: ${bookResult.error.message}`);
    }
    
    if (!bookResult.data || bookResult.data.length === 0) {
      console.error(`No book found with ID: ${chapter.book_id}`);
      throw new Error(`Book not found with ID: ${chapter.book_id}`);
    }
    
    const book = bookResult.data[0];
    console.log(`Found book:`, book.id, book.title);

    // Get previous chapters for context
    const { data: allChapters } = await supabaseAdmin // Use supabaseAdmin
      .from('chapters')
      .select('number, title')
      .eq('book_id', chapter.book_id)
      .lt('number', chapter.number)
      .order('number');

    const previousChapters = allChapters?.map((ch: any) => ch.title) || [];

    // Find current chapter details from the structure
    let chapterDetails: any = null;
    let partTitle = '';
    
    console.log(`Looking for chapter details for chapter number ${chapter.number}`);
    
    // Check if using the parts structure
    if (book.structure?.parts && Array.isArray(book.structure.parts)) {
      console.log(`Book has parts structure with ${book.structure.parts.length} parts`);
      
      for (const part of book.structure.parts) {
        if (!part.chapters || !Array.isArray(part.chapters)) {
          console.log(`Part ${part.partTitle || 'unknown'} has invalid chapters array`);
          continue;
        }
        
        const foundChapter = part.chapters.find((ch: any) => ch.number === chapter.number);
        if (foundChapter) {
          chapterDetails = foundChapter;
          partTitle = part.partTitle;
          console.log(`Found chapter details in part: ${partTitle}`);
          break;
        }
      }
    } else if (book.structure?.chapters && Array.isArray(book.structure.chapters)) {
      // Fallback to flat chapters array
      console.log(`Book has flat chapters structure with ${book.structure.chapters.length} chapters`);
      chapterDetails = book.structure.chapters.find((ch: any) => ch.number === chapter.number);
      if (chapterDetails) {
        console.log(`Found chapter details in flat structure`);
      }
    }
    
    // If no structure details are found, create minimal details from the chapter itself
    if (!chapterDetails) {
      console.log(`No chapter details found in book structure, creating minimal details`);
      
      // Safely access metadata, which might not exist yet in the database schema
      let description = 'No description available';
      let estimatedWords = 4000;
      
      try {
        if (typeof chapter.metadata === 'object' && chapter.metadata !== null) {
          description = chapter.metadata.description || description;
          estimatedWords = chapter.metadata.estimatedWords || estimatedWords;
        } else if (typeof chapter.metadata === 'string' && chapter.metadata.trim() !== '') {
          // Try to parse if it's a string
          try {
            const parsedMetadata = JSON.parse(chapter.metadata);
            description = parsedMetadata.description || description;
            estimatedWords = parsedMetadata.estimatedWords || estimatedWords;
          } catch (e) {
            console.warn('Failed to parse metadata string:', e);
          }
        }
      } catch (e) {
        console.warn('Error accessing chapter metadata:', e);
      }
      
      chapterDetails = {
        title: chapter.title,
        number: chapter.number,
        description: description,
        estimatedWords: estimatedWords
      };
    }
    
    // Check if we have a metadata column in the database
    // If not, we'll need to adapt our update strategy later
    const hasMetadataColumn = Object.prototype.hasOwnProperty.call(chapter, 'metadata');

    const systemPrompt = `You are an expert book writer specializing in creating content that resonates with specific target audiences. Write in the exact tone and style specified, addressing the audience's pain points and desires.`;
    
    const userPrompt = `Book Title: ${book.title}
Subtitle: ${book.structure?.subtitle || ''}
Topic: ${book.topic}
Target Audience: ${book.structure?.audience || ''}
Writing Style: ${book.structure?.style || 'Clear and engaging'}
Tone: ${book.structure?.tone || 'Conversational'}
Market Position: ${book.structure?.marketPosition || ''}
Unique Value: ${book.structure?.uniqueValue || ''}

${partTitle ? `Part: ${partTitle}` : ''}
Chapter ${chapter.number}: ${chapter.title}
Description: ${chapterDetails?.description || ''}
${chapterDetails?.keyTopics ? `Key Topics to Cover: ${chapterDetails.keyTopics.join(', ')}` : ''}
${chapterDetails?.keyPoints ? `Key Points to Include: ${chapterDetails.keyPoints.join(', ')}` : ''}
Target Word Count: ${chapterDetails?.estimatedWords || 4000} words

${previousChapters.length > 0 ? `Previous chapters covered: ${previousChapters.join(', ')}` : 'This is the first chapter.'}

Special Content Types:
${chapter.number === 0 && book.structure?.prologue ? `This is the PROLOGUE. Use the following content as guidance: ${book.structure.prologue}` : ''}
${chapter.number === 0 && !book.structure?.prologue && book.structure?.introduction ? `This is the INTRODUCTION. Use the following content as guidance: ${book.structure.introduction}` : ''}
${chapter.number === (book.structure?.parts ? 
  Math.max(...book.structure.parts.flatMap((part: any) => part.chapters.map((ch: any) => ch.number))) + 1 : 
  (book.structure?.chapters ? book.structure.chapters.length + 1 : 999)
) && book.structure?.conclusion ? `This is the CONCLUSION. Use the following content as guidance: ${book.structure.conclusion}` : ''}

Write this chapter following these guidelines:
1. Use the specified ${book.structure?.tone || 'conversational'} tone throughout
2. Follow the ${book.structure?.style || 'clear and engaging'} writing style
3. Address the target audience's specific needs and interests
4. Include practical examples and actionable insights
5. Maintain consistency with previous chapters
6. Aim for approximately ${chapterDetails?.estimatedWords || 4000} words
7. Format the content as proper markdown:
   - Use ## for the main chapter title
   - Use ### for subsections
   - Use **bold** for emphasis
   - Use - or * for bullet points
   - Use > for blockquotes
   - Ensure proper paragraph spacing (empty line between paragraphs)
   - Use numbered lists where appropriate
8. Start with the chapter title as ## heading
9. Structure the content with clear subsections using ### headings
10. If this is a special section (prologue, introduction, conclusion), adapt the formatting accordingly`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const model = 'qwen/qwen-plus';
    
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
    // Use a safe approach for accessing chapter's estimated words
    let estimatedWords = 3000; // Default
    if (chapterDetails?.estimatedWords) {
      estimatedWords = chapterDetails.estimatedWords;
    }
    const maxTokens = Math.min(Math.ceil(estimatedWords * 1.5), 8000);
    
    const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n');
    const response = await executeOpenRouterRequest({
      model,
      prompt,
      messages,
      temperature,
      max_tokens: maxTokens
    });

    // Update chapter with generated content
    const content = response.choices[0].message.content || '';
    
    // Create update payload based on whether metadata column exists
    let updatePayload: any = {
      content,
      status: 'in_progress',
      updated_at: new Date().toISOString()
    };
    
    // Also update word count
    const wordCount = content.split(/\s+/).filter(Boolean).length;
    updatePayload.word_count = wordCount;
    
    console.log(`Updating chapter with ${wordCount} words`);
    
    const { data: updatedChapter, error: updateError } = await supabaseAdmin // Use supabaseAdmin
      .from('chapters')
      .update(updatePayload)
      .eq('id', chapterId)
      .select();
    
    if (updateError) {
      console.error('Error updating chapter:', updateError);
      throw updateError;
    }
    
    if (!updatedChapter || updatedChapter.length === 0) {
      throw new Error('Chapter update failed - no data returned');
    }
    
    const firstUpdatedChapter = updatedChapter[0];


    // Update book's updated_at timestamp
    await supabaseAdmin // Use supabaseAdmin
      .from('books')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', chapter.book_id);

    res.json({ chapter: firstUpdatedChapter });
  } catch (error: any) {
    console.error('Error generating chapter:', error);
    res.status(500).json({ error: error.message || 'Failed to generate chapter' });
  }
};

export const reviseChapter = async (req: Request, res: Response) => {
  try {
    const { chapterId, revisionInstructions } = req.body;
    
    console.log(`Attempting to revise chapter with ID: ${chapterId}`);
    console.log(`Revision instructions: ${revisionInstructions.substring(0, 100)}...`);

    // Get chapter details with explicit error handling
    console.log(`Looking for chapter with ID: ${chapterId}`);
    
    const chapterResult = await supabaseAdmin // Use supabaseAdmin
      .from('chapters')
      .select('*')
      .eq('id', chapterId);

    if (chapterResult.error) {
      console.error(`Chapter query error:`, chapterResult.error);
      throw new Error(`Failed to retrieve chapter: ${chapterResult.error.message}`);
    }
    
    if (!chapterResult.data || chapterResult.data.length === 0) {
      console.error(`No chapter found with ID: ${chapterId}`);
      
      // Additional diagnostics to help debug the issue
      const allChaptersResult = await supabaseAdmin // Use supabaseAdmin
        .from('chapters')
        .select('id, book_id, title')
        .limit(10);
      
      if (allChaptersResult.error) {
        console.error('Error checking for any chapters:', allChaptersResult.error);
      } else if (allChaptersResult.data.length === 0) {
        console.error('No chapters exist in the database at all');
      } else {
        console.error(`Found ${allChaptersResult.data.length} chapters in database, but none with ID ${chapterId}`);
        console.error('First few chapters:', allChaptersResult.data);
      }
      
      throw new Error(`Chapter not found with ID: ${chapterId}. This likely means the chapter wasn't created properly when the book was set up.`);
    }
    
    const chapter = chapterResult.data[0];
    console.log(`Found chapter:`, chapter.id, chapter.title);

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
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const model = 'anthropic/claude-3.7-sonnet';
    
    const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n');
    const response2 = await executeOpenRouterRequest({
      model,
      prompt,
      messages,
      temperature: 0.7,
      max_tokens: 4000
    });

    // Update chapter with revised content
    const revisedContent = response2.choices[0].message.content || '';
    
    // Create update payload with word count
    const wordCount = revisedContent.split(/\s+/).filter(Boolean).length;
    const updatePayload = {
      content: revisedContent,
      status: 'in_progress',
      updated_at: new Date().toISOString(),
      word_count: wordCount
    };
    
    console.log(`Updating chapter with ${wordCount} words of revised content`);
    
    const { data: updatedChapter, error: updateError } = await supabaseAdmin // Use supabaseAdmin
      .from('chapters')
      .update(updatePayload)
      .eq('id', chapterId)
      .select();

    if (updateError) {
      console.error('Error updating chapter:', updateError);
      throw updateError;
    }
    
    if (!updatedChapter || updatedChapter.length === 0) {
      throw new Error('Chapter update failed - no data returned');
    }
    
    // Update book's updated_at timestamp
    await supabaseAdmin // Use supabaseAdmin
      .from('books')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', chapter.book_id);

    res.json({ chapter: updatedChapter[0] });
  } catch (error: any) {
    console.error('Error revising chapter:', error);
    res.status(500).json({ error: error.message || 'Failed to revise chapter' });
  }
};
