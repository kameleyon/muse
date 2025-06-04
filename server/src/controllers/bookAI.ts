import { Request, Response } from 'express';
import { supabaseClient, supabaseAdmin } from '../services/supabase';
import { executeOpenRouterRequest } from '../services/openrouter';
import config from '../config';

// Helper function to extract references from chapter content
function extractReferencesFromContent(content: string): string[] {
  const references: string[] = [];
  
  // Extract citations in format (Source Name, Year)
  const citationRegex = /\(([^,]+),\s*(\d{4})\)/g;
  let match;
  
  while ((match = citationRegex.exec(content)) !== null) {
    const sourceName = match[1].trim();
    const year = match[2];
    const reference = `${sourceName} (${year})`;
    
    if (!references.includes(reference)) {
      references.push(reference);
    }
  }
  
  return references;
}

// Helper function to update book's centralized references
async function updateBookReferences(bookId: string, newReferences: string[]): Promise<void> {
  try {
    // Get current book structure
    const { data: book, error: bookError } = await supabaseAdmin
      .from('books')
      .select('structure')
      .eq('id', bookId)
      .single();
    
    if (bookError) {
      console.error('Error fetching book for references update:', bookError);
      return;
    }
    
    const currentStructure = book.structure || {};
    const currentReferences = currentStructure.references || '';
    
    // Parse existing references
    const existingRefs = currentReferences.split('\n').filter((ref: string) => ref.trim().length > 0);
    
    // Add new references that don't already exist
    const allReferences = [...existingRefs];
    newReferences.forEach(ref => {
      if (!allReferences.includes(ref)) {
        allReferences.push(ref);
      }
    });
    
    // Sort references alphabetically
    allReferences.sort();
    
    // Update book structure with new references
    const updatedStructure = {
      ...currentStructure,
      references: allReferences.join('\n')
    };
    
    const { error: updateError } = await supabaseAdmin
      .from('books')
      .update({ structure: updatedStructure })
      .eq('id', bookId);
    
    if (updateError) {
      console.error('Error updating book references:', updateError);
    } else {
      console.log(`Updated references for book ${bookId}: ${newReferences.length} new references added`);
    }
  } catch (error) {
    console.error('Error in updateBookReferences:', error);
  }
}

// Helper function to auto-generate appendix content
async function updateBookAppendix(bookId: string, chapterContent: string): Promise<void> {
  try {
    // Get current book structure and all chapters
    const { data: book, error: bookError } = await supabaseAdmin
      .from('books')
      .select('structure, topic, title')
      .eq('id', bookId)
      .single();
    
    if (bookError) {
      console.error('Error fetching book for appendix update:', bookError);
      return;
    }

    const { data: chapters, error: chaptersError } = await supabaseAdmin
      .from('chapters')
      .select('content')
      .eq('book_id', bookId)
      .not('content', 'is', null);

    if (chaptersError) {
      console.error('Error fetching chapters for appendix:', chaptersError);
      return;
    }

    // Extract concepts and tools from all chapter content
    const allContent = chapters?.map(ch => ch.content).join(' ') || '';
    const concepts = new Set<string>();
    const tools = new Set<string>();
    const frameworks = new Set<string>();

    // Extract key concepts (common self-improvement terms)
    const conceptMatches = allContent.match(/\b(framework|methodology|technique|strategy|approach|model|system|process|tool|template|checklist|worksheet|assessment|exercise|habit|practice|routine|mindset|principle|concept|theory|method|step|phase|stage|level)\b/gi);
    if (conceptMatches) {
      conceptMatches.forEach(match => concepts.add(match.toLowerCase()));
    }

    // Extract actionable tools/templates mentioned
    const toolMatches = allContent.match(/\b(template|worksheet|checklist|planner|tracker|journal|assessment|evaluation|guide|roadmap|blueprint)\b/gi);
    if (toolMatches) {
      toolMatches.forEach(match => tools.add(match.toLowerCase()));
    }

    // Extract frameworks mentioned
    const frameworkMatches = allContent.match(/\b([A-Z][a-z]+ (Framework|Method|System|Model|Approach))/g);
    if (frameworkMatches) {
      frameworkMatches.forEach(match => frameworks.add(match));
    }

    // Generate comprehensive appendix content
    const appendixSections = [];

    // Section A: Tools and Templates
    if (tools.size > 0) {
      appendixSections.push(`**A. Tools and Templates**
- Daily Progress Tracker
- Goal Setting Worksheet  
- Habit Formation Checklist
- Self-Assessment Template
- Weekly Reflection Journal
- Action Plan Template
- Progress Monitoring Chart
- Resource Planning Worksheet`);
    }

    // Section B: Frameworks and Methods
    if (frameworks.size > 0 || concepts.size > 0) {
      appendixSections.push(`**B. Frameworks and Methods Reference**
- The ${book.topic} Implementation Framework
- Step-by-Step Process Guide
- Decision-Making Matrix
- Progress Evaluation Methods
- Common Challenges and Solutions
- Best Practices Checklist`);
    }

    // Section C: Resources
    appendixSections.push(`**C. Additional Resources**
- Recommended Books for Further Reading
- Online Communities and Support Groups
- Professional Development Courses
- Apps and Digital Tools
- Websites and Blogs
- Podcasts and Videos
- Expert Networks and Mentorship Programs`);

    // Section D: FAQ
    appendixSections.push(`**D. Frequently Asked Questions**
- How long does it typically take to see results?
- What if I miss a day or fall off track?
- How do I adapt this approach to my specific situation?
- Where can I find additional support?
- How do I measure my progress effectively?
- What are the most common mistakes to avoid?`);

    // Section E: Emergency Action Plans
    appendixSections.push(`**E. Emergency Action Plans**
- When You Feel Stuck: 5-Step Recovery Plan
- Dealing with Setbacks: Resilience Strategy
- Motivation Maintenance: Quick Wins List
- Crisis Management: Emergency Contacts and Resources
- Burnout Prevention: Warning Signs and Actions`);

    const generatedAppendix = appendixSections.join('\n\n');

    // Update book structure with generated appendix
    const currentStructure = book.structure || {};
    const updatedStructure = {
      ...currentStructure,
      appendix: generatedAppendix
    };

    const { error: updateError } = await supabaseAdmin
      .from('books')
      .update({ structure: updatedStructure })
      .eq('id', bookId);

    if (updateError) {
      console.error('Error updating book appendix:', updateError);
    } else {
      console.log(`Updated appendix for book ${bookId} with ${appendixSections.length} sections`);
    }
  } catch (error) {
    console.error('Error in updateBookAppendix:', error);
  }
}

// Clean JSON response helper
function cleanJsonResponse(response: string): any {
  console.log("Attempting to parse AI response as JSON...");
  console.log("Response length:", response.length);
  
  try {
    // Attempt 1: Direct JSON parse
    return JSON.parse(response);
  } catch (e1: any) {
    console.warn("Direct JSON.parse failed. Trying to extract from markdown code block. Error: " + e1.message);
    try {
      // Attempt 2: Extract JSON from markdown code blocks
      // Regex to find ```json ... ``` or ``` ... ```
      const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch && jsonMatch[1]) {
        const extractedJson = jsonMatch[1].trim();
        console.log("Extracted JSON from code block. Attempting to parse.");
        return JSON.parse(extractedJson);
      } else {
        console.warn("No JSON code block found in AI response.");
        
        // Attempt 3: Try to fix truncated JSON
        try {
          // Check if response looks like truncated JSON
          if (response.trim().startsWith('{')) {
            console.log("Response looks like JSON but might be truncated. Attempting to fix...");
            
            // Try to find where the JSON might be cut off
            let fixedJson = response.trim();
            
            // Count opening and closing braces/brackets
            const openBraces = (fixedJson.match(/{/g) || []).length;
            const closeBraces = (fixedJson.match(/}/g) || []).length;
            const openBrackets = (fixedJson.match(/\[/g) || []).length;
            const closeBrackets = (fixedJson.match(/\]/g) || []).length;
            
            console.log(`Brace count - Open: ${openBraces}, Close: ${closeBraces}`);
            console.log(`Bracket count - Open: ${openBrackets}, Close: ${closeBrackets}`);
            
            // If we're missing closing brackets/braces, try to add them
            if (openBrackets > closeBrackets || openBraces > closeBraces) {
              // Add missing closing brackets
              for (let i = 0; i < openBrackets - closeBrackets; i++) {
                fixedJson += ']';
              }
              // Add missing closing braces
              for (let i = 0; i < openBraces - closeBraces; i++) {
                fixedJson += '}';
              }
              
              console.log("Attempting to parse fixed JSON...");
              return JSON.parse(fixedJson);
            }
          }
        } catch (fixError: any) {
          console.error("Failed to fix truncated JSON:", fixError.message);
        }
        
        // Log the beginning and end of the response to help diagnose
        console.error("AI response (first 500 chars):", response.substring(0, 500));
        console.error("AI response (last 500 chars):", response.substring(response.length - 500));
        throw new Error('AI response is not valid JSON and no JSON code block was found.');
      }
    } catch (e2: any) {
      console.error("Failed to parse JSON from code block. Error: " + e2.message);
      // Log the beginning of the response to help diagnose
      console.error("Original AI response (first 500 chars):", response.substring(0, 500));
      console.error("Original AI response (last 500 chars):", response.substring(response.length - 500));
      throw new Error('Failed to parse AI response as JSON after attempting direct and code block extraction.');
    }
  }
}

export const generateMarketResearch = async (req: Request, res: Response) => {
  try {
    const { topic, references = [] } = req.body;

    const systemPrompt = `You are an expert market researcher specializing in book publishing and typography psychology. Analyze the given topic and provide comprehensive market research to guide the book creation process. 

When recommending fonts, consider:
- Readability and eye strain for the target reading level
- Genre conventions and reader expectations
- Psychological impact on the target audience
- Compatibility between heading and body fonts
- Free availability on Google Fonts

Your response MUST be valid JSON that can be parsed directly with JSON.parse().`;
    
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
8. Reading level and content specifications
9. Design and formatting requirements
10. Top 3 free Google Fonts that would make the book successful based on the target audience psychology, reading habits, and genre expectations

You must respond with ONLY valid JSON in this exact format:
{
  "targetAudience": {
    "demographics": "detailed demographics",
    "psychographics": "interests, values, behaviors",
    "painPoints": ["pain point 1", "pain point 2"],
    "desires": ["desire 1", "desire 2"],
    "dailyLife": "specific examples of daily life scenarios this audience faces"
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
  },
  "readingLevel": "Flesch Reading Ease score (e.g., Standard 60-69)",
  "gradeLevel": "target grade level (e.g., 8th-9th grade)",
  "sentenceLength": "preferred sentence length (e.g., short, medium, long)",
  "vocabularyLevel": "vocabulary complexity (e.g., accessible but varied, technical, simple)",
  "design": {
    "colors": "primary: #hexcode, secondary: #hexcode, accent: #hexcode",
    "visualElements": "recommended number of charts/visuals per chapter",
    "formatting": "specific formatting preferences for target audience",
    "fonts": {
      "primary": {
        "name": "Font name (e.g., Open Sans)",
        "googleFontUrl": "https://fonts.google.com/specimen/Font+Name",
        "reasoning": "why this font is perfect for the target audience"
      },
      "secondary": {
        "name": "Font name (e.g., Merriweather)",
        "googleFontUrl": "https://fonts.google.com/specimen/Font+Name",
        "reasoning": "why this font complements the primary font"
      },
      "alternative": {
        "name": "Font name (e.g., Source Sans Pro)",
        "googleFontUrl": "https://fonts.google.com/specimen/Font+Name",
        "reasoning": "why this is a good alternative option"
      }
    }
  },
  "contentSpecs": {
    "examplesPerChapter": "recommended number of real-world examples",
    "exerciseInclusion": "true/false - whether to include exercises",
    "specialInstructions": "any specific content requirements"
  }
}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    // Use the configured research model from config
    const model = config.openRouter.defaultResearchModel || 'openai/gpt-4o-search-preview';
    
    console.log(`Generating market research for topic: ${topic} using model: ${model}`);
    const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n');
    const completion = await executeOpenRouterRequest({
      model,
      prompt,
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 4000
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
1. Create a book structure with multiple parts. Each part should contain 4-7 thematically related chapters. These are the main content chapters.
2. The total estimated word count for the entire book (including Prologue, Introduction, main chapters, and Conclusion) should be between 110,000 and 145,000 words.
3. Each main chapter (within the 'parts' array) must have a creative and descriptive title, a detailed explanation/description of its content and purpose, an estimated word count, key topics to be covered, and 3-5 key points the reader should take away. Chapter numbering should be sequential for these main chapters, starting from 1.
4. Generate content for 'prologue', 'introduction', and 'conclusion' as top-level string fields in the JSON. These are NOT chapters within the 'parts' array and should NOT be numbered as chapters.
   - The 'prologue' string should contain a prologue (1,500-2,500 words) that immediately engages readers by: Opening with a vivid scene, surprising statement, or relatable problem; Establishing the book's core premise or conflict within the first 500 words; Including specific sensory details and concrete examples; Creating emotional connection through personal anecdote or universal experience; Ending with a clear promise of what the book will deliver; Matching the book's specified tone and target audience. 
   - The 'introduction' string should contain a comprehensive introduction (2,500-4,000 words) that: Opens with a clear, engaging heading that captures the book's essence; Includes 3-5 substantial sections that progressively build the book's foundation; Establishes the problem/opportunity this book addresses; Shares why this book exists now and why the author is uniquely qualified; Provides a roadmap of what readers will learn/gain from each section; Includes 2-3 specific examples or mini-case studies; Addresses common misconceptions or objections; Ends with clear instructions on how to use this book; Uses subheadings to break up text every 400-600 words; Matches the book's specified tone and speaks directly to target audience pain points. 
   - The 'conclusion' string should contain a powerful conclusion (2,500-4,000 words) that: Opens with an evocative heading that signals completion and new beginning; Synthesizes key insights without merely repeating chapter summaries; Includes 3-5 substantial sections that build toward a crescendo; Addresses the 'what now?' question with concrete next steps; Acknowledges the reader's journey and growth through the book; Paints a vivid picture of the reader's potential future state; Includes a memorable final message or call-to-action; Provides additional resources or community connections; Uses subheadings to structure the conclusion's narrative arc; Circles back to opening themes while showing transformation; Matches book's tone while adding inspirational elevation. MUST end with 
5. The 'acknowledgement' field should contain a concise acknowledgement section (100-200 words) that: Thanks 2-3 key individuals or groups who made the book possible; Includes specific contributions rather than generic thanks; Mentions early readers, mentors, or community members who shaped the work; Acknowledges family/personal support briefly but genuinely; References any organizations, platforms, or communities integral to the book; Maintains professional warmth without excessive sentimentality; Ends with a forward-looking note about the book's intended impact; Matches the book's tone while being slightly more personal. The 'appendix' and 'references' fields should be brief top-level strings. 'coverPageDetails' is also a top-level object. These are not part of the main chapter flow or word count intensive sections like Prologue/Intro/Conclusion.
6. Be creative with part titles and actual chapter titles based on the topic and market research.
7. Ensure the JSON format is strictly followed as per the example.

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
- Recommended Reading Level: ${marketResearch.readingLevel}
- Recommended Grade Level: ${marketResearch.gradeLevel}
- Recommended Sentence Length: ${marketResearch.sentenceLength}
- Recommended Vocabulary Level: ${marketResearch.vocabularyLevel}



You must respond with ONLY valid JSON in this exact format:
{
  "title": "Suggested book title",
  "subtitle": "Compelling subtitle",
  "audience": "refined target audience description",
  "style": "specific writing style based on research",
  "tone": "specific tone based on research",
  "marketPosition": "Define market position (75-150 words) using this framework: Primary category/shelf placement; 2-3 successful comp titles and how this book differs; Target retailer categories; Price point positioning (premium/accessible/budget) with justification; Format priorities (hardcover/paperback/audio/digital); One-sentence elevator pitch for booksellers.",
  "uniqueValue": "Write a compelling unique value proposition (50-100 words) that identifies ONE primary differentiator from existing books in this category, states a specific benefit readers get here they can't find elsewhere, uses concrete language rather than abstract claims, avoids overused terms like 'comprehensive,' 'ultimate,' or 'revolutionary,' includes a measurable outcome or transformation when possible, formatted as 2-3 punchy sentences that could work as back-cover copy.",
  "acknowledgement": "Brief acknowledgement outline (50-100 words) describing who to thank and why",
  "prologue": "## Prologue Title\\n\\nBrief prologue outline (100-200 words) describing the opening scene or hook that will engage readers",
  "introduction": "# Introduction Title\\n\\nBrief introduction outline (100-200 words) describing what will be covered",
  "conclusion": "# Conclusion Title\\n\\nBrief conclusion outline (100-200 words) describing the wrap-up and call to action",
  "appendix": "Optional: Brief appendix content, if applicable.",
  "references": "Optional: Brief references or bibliography, if applicable.",
  "coverPageDetails": {
    "title": "Main Book Title (Generated by AI)",
    "subtitle": "Compelling Subtitle (Generated by AI)",
    "authorName": "Author Name (Can be placeholder or based on input if provided)"
  },
  "parts": [
    {
      "partNumber": 1,
      "partTitle": "Creative Title for Part I (Generated by AI)",
      "chapters": [
        {
          "number": 1, // Start actual chapter numbering from 1
          "title": "Creative Title for Chapter 1 (Generated by AI)",
          "description": "Detailed description of Chapter 1's content, purpose, and relevance to the part's theme and audience needs.",
          "estimatedWords": 5000, // Example, AI to distribute words to meet total
          "keyTopics": ["Main topic of Ch1", "Sub-topic A for Ch1", "Sub-topic B for Ch1"]
        }
        // ... AI to add 4-7 more chapters to this part, with sequential numbering ...
      ]
    }
    // ... AI to add more parts, each with 4-7 chapters and sequential part numbers ...
  ],
  "totalWords": 145000, // AI calculates this sum from all chapter estimatedWords + prologue + intro + conclusion, aiming for 110k-145k.
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

    // Use the configured book structure model from config
    const model = config.openRouter.bookStructureModel || 'anthropic/claude-3.7-sonnet';
    
    console.log(`Using model: ${model} for book structure generation`);
    
    const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n');
    const completion = await executeOpenRouterRequest({
      model,
      prompt,
      messages: messages as any,
      temperature: 0.8,
      max_tokens: 50000
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
    const { chapterId, streamMode = false } = req.body;
    
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
      let estimatedWords = 5000;
      
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

    // Enforce 5K maximum word limit
    // const MAX_WORDS = 5000; // User request: Use estimatedWords from book structure directly
    const targetWords = chapterDetails?.estimatedWords || 8000; // Default to 8000 if not specified
    const maxTargetWords = targetWords + 2000;
    const idealConclusionStart = maxTargetWords - 500;
    
    const systemPrompt = `You are an expert book writer specializing in creating content that resonates with specific target audiences. Write in the exact tone and style specified, addressing the audience's pain points and desires.
    
Your target word count range for this chapter is between ${targetWords - 100} (minimum) and ${maxTargetWords} (maximum).
Aim for a total word count near ${targetWords}, but prioritize natural flow and complete thoughts.
It is acceptable to go over ${targetWords} up to ${maxTargetWords}.
Begin to conclude the chapter content naturally when you are around ${idealConclusionStart} words, ensuring a satisfying wrap-up by ${maxTargetWords}.
Do NOT truncate content abruptly.

CRITICAL MISSION: Your primary objective is to write high-quality, coherent content that falls within the range of ${targetWords - 100} to ${maxTargetWords} words.

NEVER ASK QUESTIONS: Do not ask for confirmation, clarification, or permission to continue. Write the content directly without any meta-commentary about the writing process.



Write this chapter following these STRICT guidelines:

**CONTENT QUALITY & VOICE:**
1. Write at a ${book.marketResearch?.readingLevel} Flesch Reading Ease level (${book.marketResearch?.gradeLevel})
2. Use ${book.structure?.tone} tone with ${book.marketResearch?.sentenceLength} sentence lengths
3. Vocabulary complexity: ${book.marketResearch?.vocabularyLevel}
4. FORBIDDEN PHRASES: Never use "picture this", "imagine", "celestial", "buckle up", "let's dive in", "journey", "unlock", "transform your life", "game-changer", "revolutionary", "ultimate guide", "Picture this", "Let's dive", "mystical", or any other terms or expressions that known and unknown AI Jargon and makes the content not legit or unserious. NO EMOJI!
5. AVOID: Starting sections with questions, excessive metaphors, emoji, exclamation points (max 1 per 1000 words)
6. DO: Vary sentence openings, use specific examples from ${book.marketResearch?.targetAudience?.dailyLife}, ground abstract concepts in concrete scenarios
7. ABSOLUTELY FORBIDDEN: Never include "Key Points" sections, bullet point summaries, word count notifications, or any meta-commentary about the content structure

**CONSISTENCY REQUIREMENTS:**
7. Review previous chapters to ensure NO repeated: examples, case studies, anecdotes, or conceptual explanations
8. Unique examples only - flag if similar territory covered in: ${previousChapters.length > 0 ? previousChapters.join(', ') : 'N/A'}
9. Maintain consistent terminology established in: ${book.glossary}

**FORMATTING SPECIFICATIONS:**
10. DO NOT repeat the chapter title (already provided in structure)
11. START with captivating first sentence - no throat-clearing or preview
12. Paragraph indentation: Use 2 spaces at start of each paragraph
13. Line spacing: Single space between all elements (including between bullet point titles and lists)
14. Format the content as proper markdown:
   - Use ## for the main chapter title
   - Use ### for subsections
   - Use #### for important point in subsctions
   - Use **bold** for emphasis
   - Use - or * for bullet points
   - Use > for blockquotes
   
   - Ensure proper paragraph spacing (empty line between paragraphs)
   - Use numbered lists where appropriate
   - Use backticks for inline code or technical terms
15. Include ${book.marketResearch?.design?.visualElements || chapterDetails?.visualElements} data visualizations using markdown tables or ASCII-style simple graphs when data supports it
16. Color palette references: ${book.marketResearch?.design?.colors || book.design?.colors}

**CHAPTER SPECIFICATIONS:**
17. **CRITICAL WORD COUNT GUIDELINES:**
    - Minimum total words: ${targetWords - 100}.
    - Ideal total words: Around ${targetWords}.
    - Maximum total words: ${maxTargetWords}.
    - Start concluding the chapter around ${idealConclusionStart} words.
    - Prioritize completing thoughts naturally over hitting an exact number. It is PREFERRED to go slightly over ${targetWords} (up to ${maxTargetWords}) rather than cutting content short.
    - If content is naturally shorter, ensure it still meets the minimum of ${targetWords - 100} words by adding relevant details, examples, or explanations.
    - Do NOT abruptly truncate sentences or paragraphs.
18. Include ${book.marketResearch?.contentSpecs?.examplesPerChapter || chapterDetails?.examples} real-world examples
19. ${book.marketResearch?.contentSpecs?.exerciseInclusion === 'true' || chapterDetails?.exercises ? 'Include practical exercises' : 'Focus on narrative flow'}
20. Target audience specifics: ${book.marketResearch?.targetAudience?.demographics}

**SPECIAL INSTRUCTIONS:**
${book.marketResearch?.contentSpecs?.specialInstructions || chapterDetails?.specialInstructions}
${chapter.number === 0 || (chapter.number === (book.structure?.parts ? 
  Math.max(...book.structure.parts.flatMap((part: any) => part.chapters.map((ch: any) => ch.number))) + 1 : 
  (book.structure?.chapters ? book.structure.chapters.length + 1 : 999)
)) ? 'Adapt format for special section requirements' : ''}`;
    
    const userPrompt = `Book Title: ${book.title}
Subtitle: ${book.structure?.subtitle}
Topic: ${book.topic}
Target Audience: ${book.structure?.audience}
Writing Style: ${book.structure?.style}
Tone: ${book.structure?.tone}
Market Position: ${book.structure?.marketPosition}
Unique Value: ${book.structure?.uniqueValue}

${partTitle ? `Part: ${partTitle}` : ''}
Chapter ${chapter.number}: ${chapter.title}
Description: ${chapterDetails?.description}
${chapterDetails?.keyTopics ? `Key Topics to Cover: ${chapterDetails.keyTopics.join(', ')}` : ''}

**Target Word Count Range: ${targetWords - 100} (min) to ${maxTargetWords} (max). Aim for ~${targetWords}. Start concluding around ${idealConclusionStart} words.**

${previousChapters.length > 0 ? `Previous chapters covered: ${previousChapters.join(', ')}` : 'This is the first chapter.'}

Special Content Types:
${chapter.number === 0 && book.structure?.prologue ? `This is the PROLOGUE. Use the following content as guidance: ${book.structure.prologue}` : ''}
${chapter.number === 0 && !book.structure?.prologue && book.structure?.introduction ? `This is the INTRODUCTION. Use the following content as guidance: ${book.structure.introduction}` : ''}
${chapter.number === (book.structure?.parts ? 
  Math.max(...book.structure.parts.flatMap((part: any) => part.chapters.map((ch: any) => ch.number))) + 1 : 
  (book.structure?.chapters ? book.structure.chapters.length + 1 : 999)
) && book.structure?.conclusion ? `This is the CONCLUSION. Use the following content as guidance: ${book.structure.conclusion}` : ''}



ABSOLUTE REQUIREMENTS: 
- Write content directly. Do NOT ask questions like "Would you like me to continue?" or "Should I proceed with...?" 
- Just write the chapter content continuously until you reach the exact word count
- NEVER include "Key Points" bullet sections or summaries at the end of sections
- NEVER include word count notifications in your output like "(Word count: 1250)"
- NEVER add meta-commentary about content structure or organization
- Focus solely on delivering engaging, continuous prose without structural annotations

`;

    // STEP 1: Search for supporting data using search-enabled model
    const searchPrompt = `You are a research assistant specializing in gathering current, factual information to support book content.

Topic: ${book.topic}
Chapter ${chapter.number}: ${chapter.title}
Chapter Description: ${chapterDetails?.description || ''}
Key Topics: ${chapterDetails?.keyTopics ? chapterDetails.keyTopics.join(', ') : ''}
Target Audience: ${book.marketResearch?.targetAudience?.demographics || ''}

TASK: Search the internet for the following types of current supporting data:
1. Recent statistics, studies, or research related to this chapter's topics
2. Current examples, case studies, or real-world applications
3. Expert quotes or insights from credible sources
4. Latest trends or developments in this field
5. Factual data that supports the key points: ${chapterDetails?.keyPoints ? chapterDetails.keyPoints.join(', ') : ''}

REQUIREMENTS:
- Focus on information published within the last 2-3 years when possible
- Prioritize credible sources (academic papers, government data, established publications)
- Include exact publication dates and source URLs
- Gather 8-12 distinct pieces of supporting information
- Include specific numbers, percentages, or measurable data when available

FORMAT your response as a structured research report with:
- Source citations with full URLs
- Publication dates
- Key statistics or facts
- Relevant quotes from experts
- How each piece of data relates to the chapter content

Begin your research now.`;

    const searchMessages = [
      { role: 'system', content: 'You are a thorough research assistant with web search capabilities. Provide comprehensive, current information with proper citations.' },
      { role: 'user', content: searchPrompt }
    ];

    console.log('Step 1: Gathering supporting research data...');
    // Use the configured research model for search
    const searchModel = config.openRouter.defaultResearchModel || 'openai/gpt-4o-search-preview';
    console.log(`Using search model: ${searchModel} for research data gathering`);
    
    const searchResponse = await executeOpenRouterRequest({
      model: searchModel,
      prompt: searchMessages.map(m => `${m.role}: ${m.content}`).join('\n'),
      messages: searchMessages as any,
      temperature: 0.4,
      max_tokens: 40000
    });

    const researchData = searchResponse.choices[0].message.content || '';
    console.log('Research data gathered:', researchData.substring(0, 500) + '...');

    // STEP 2: Write the chapter using the research data with Claude
    const enhancedUserPrompt = `${userPrompt}

SUPPORTING RESEARCH DATA:
${researchData}

INTEGRATION INSTRUCTIONS:
- Seamlessly integrate the research data into your chapter content
- Include specific statistics, examples, and expert insights from the research
- Add proper citations throughout the text in this format: (Source Name, Year)
- Compile all sources into a "References" section at the end of the chapter
- Ensure all claims are backed by the provided research data
- Use the research to strengthen your key points and examples

Write high-quality content that follows all the guidelines above while incorporating the research data naturally.

CHAPTER STRUCTURE REQUIREMENTS:
- Do NOT include a "References" section at the end of the chapter
- Include citations in-text using format: (Source Name, Year)
- All references will be compiled automatically into the book's main References chapter


`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: enhancedUserPrompt }
    ];

    // Use a more reliable model for chapter generation
    const model = 'google/gemini-2.5-flash-preview';
    
    // Define parameter profiles for different tones
    const creativeProfile = {
      temperature: 0.9,
      top_p: 0.7,
      repetition_penalty: 2.5, // Note: OpenRouter uses frequency_penalty and presence_penalty.
                               // We might need to map this or use one of those if 'repetition_penalty' isn't directly supported by the chosen model via OpenRouter.
                               // For now, we pass it as is. Some models might support it.
      length_penalty: 1.0,
      style_guidance: 0.7, // Custom param, might be ignored if not supported
      text_guidance: 0.85, // Custom param, might be ignored if not supported
      // frequency_penalty: 0.5, // Example if mapping repetition_penalty
      // presence_penalty: 0.5,  // Example if mapping repetition_penalty
    };

    const academicProfile = {
      temperature: 0.4,
      top_p: 0.6,
      repetition_penalty: 1.2,
      length_penalty: 1.0,
      style_guidance: 0.2,
      text_guidance: 0.9,
      // frequency_penalty: 0.1,
      // presence_penalty: 0.1,
    };

    const defaultProfile = {
      temperature: 0.8, // Default temperature
      top_p: 1.0,       // Default top_p
      // repetition_penalty, length_penalty, style_guidance, text_guidance will use OpenRouter defaults if not set
    };

    let selectedProfile = defaultProfile;
    const tone = book.structure?.tone?.toLowerCase() || '';

    if (tone.includes('creative') || tone.includes('inspirational')) {
      selectedProfile = creativeProfile;
      console.log('Using Creative generation profile.');
    } else if (tone.includes('academic') || tone.includes('technical') || tone.includes('formal')) {
      selectedProfile = academicProfile;
      console.log('Using Academic generation profile.');
    } else {
      console.log('Using Default generation profile.');
    }
    
    console.log(`Using model: ${model} with profile: ${JSON.stringify(selectedProfile)} for chapter generation`);
    
    // Configure chunked generation with overlapping - larger chunks for faster generation
    const WORDS_PER_CHUNK = 1250; // Generate in larger chunks to reduce the number of API calls
    const numChunks = Math.ceil(targetWords / WORDS_PER_CHUNK);
    
    console.log(`Generating chapter in ${numChunks} chunks of ~${WORDS_PER_CHUNK} words each with overlapping generation`);
    
    // Generate content in chunks with overlapping generation
    let fullContent = '';
    let previousContent = '';
    const chunkPromises: Promise<string>[] = [];
    const chunkResults: string[] = new Array(numChunks);
    
    // If streaming mode, set up SSE headers
    if (streamMode) {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no' // Disable nginx buffering
      });
      
      // Send initial progress event
      const initialData = {
        type: 'progress',
        chunkIndex: 0,
        totalChunks: numChunks,
        percentage: 0,
        message: 'Generating content...',
        estimatedTotalWords: targetWords
      };
      res.write(`data: ${JSON.stringify(initialData)}\n\n`);
    }

    // Function to generate a single chunk
    const generateChunk = async (chunkIndex: number, previousChunkContent: string): Promise<string> => {
      const isFirstChunk = chunkIndex === 0;
      const isLastChunk = chunkIndex === numChunks - 1;
      let chunkWords = isLastChunk ?
        (targetWords - (chunkIndex * WORDS_PER_CHUNK)) : // Initial estimate for remaining words
        WORDS_PER_CHUNK;

      if (isLastChunk) {
        // For the last chunk, ensure it's prompted for enough words to conclude,
        // but not excessively more than WORDS_PER_CHUNK unless necessary to reach min target.
        // Also, consider the maxTargetWords.
        const wordsSoFar = chunkIndex * WORDS_PER_CHUNK;
        const minWordsNeededForChapter = Math.max(0, (targetWords - 100) - wordsSoFar);
        const maxWordsAllowedForChapter = Math.max(0, maxTargetWords - wordsSoFar);
        
        // Aim for at least a decent chunk size, or what's needed for min, capped by max.
        chunkWords = Math.min(maxWordsAllowedForChapter, Math.max(WORDS_PER_CHUNK / 2, minWordsNeededForChapter, chunkWords));
        // Ensure chunkWords is not negative if already over max.
        chunkWords = Math.max(0, chunkWords);
      }
      
      // Modify prompt for continuation
      let chunkPrompt = enhancedUserPrompt;
      if (!isFirstChunk) {
        chunkPrompt = `${enhancedUserPrompt}

CONTINUATION INSTRUCTIONS:
You are continuing to write Chapter ${chapter.number}: ${chapter.title}.

Previous content written so far (last ~200 words to provide context):
...${previousChunkContent.slice(-1200)}

CAREFULLY REVIEW THE END OF THE PREVIOUS CONTENT. Your task is to SEAMLESSLY continue with NEW information.
DO NOT REPEAT, REPHRASE, OR SUMMARIZE what was just written in the 'Previous content written so far'.
Your response should be the *next* logical section of the chapter.

Continue writing the next part of the chapter, aiming for approximately ${chunkWords} words for this chunk.
${isLastChunk ? `This is the ABSOLUTE FINAL CHUNK of Chapter ${chapter.number}: ${chapter.title}. Your primary goal for this chunk is to bring the entire chapter to a satisfying and complete conclusion. Ensure all main points are resolved and the narrative arc is finished. The total chapter word count MUST be between ${targetWords - 100} and ${maxTargetWords}. You should be actively concluding the chapter's themes and arguments now. Write approximately ${chunkWords} words to achieve this full conclusion.` : 'Continue naturally from where you left off, introducing new material.'}

WORD COUNT GUIDELINE FOR THIS CHUNK: Aim for approximately ${chunkWords} words. Prioritize natural flow, completing thoughts, and introducing NEW content over hitting an exact number for this specific chunk. Keep the overall chapter target range (${targetWords - 100} to ${maxTargetWords}) in mind.

CRITICAL: Write the content directly without asking questions or seeking confirmation. Do NOT ask "Would you like me to continue?" or similar questions. Just write the chapter content.

ABSOLUTELY FORBIDDEN IN YOUR OUTPUT:
- Do NOT include "Key Points" sections or bullet point summaries
- Do NOT include word count notifications like "(Word count: 1250)"
- Do NOT include any meta-commentary about the content or structure
- Just write the actual chapter content continuously`;
      } else {
        chunkPrompt = `${enhancedUserPrompt}



WORD COUNT GUIDELINE FOR THIS CHUNK: Aim for approximately ${chunkWords} words. Prioritize natural flow, completing thoughts, and introducing NEW content over hitting an exact number for this specific chunk. Keep the overall chapter target range (${targetWords - 100} to ${maxTargetWords}) in mind.

CRITICAL: Write the content directly without asking questions or seeking confirmation. Do NOT ask "Would you like me to continue?" or similar questions. Just write the chapter content.

ABSOLUTELY FORBIDDEN IN YOUR OUTPUT:
- Do NOT include "Key Points" sections or bullet point summaries
- Do NOT include word count notifications like "(Word count: 1250)"
- Do NOT include any meta-commentary about the content or structure
- Just write the actual chapter content continuously`;
      }
      
      const chunkMessages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: chunkPrompt }
      ];
      
      let chunkMaxTokens = Math.ceil(chunkWords * 1.5); // Standard buffer
      if (isLastChunk) {
        // Significantly larger buffer for the final chunk to ensure full conclusion and allow for natural sentence endings.
        chunkMaxTokens = Math.ceil(chunkWords * 2.5);
      }
      
      console.log(`Starting generation of chunk ${chunkIndex + 1}/${numChunks} (~${chunkWords} words)`);
      
      const prompt = chunkMessages.map(m => `${m.role}: ${m.content}`).join('\n');
      try {
        const response = await executeOpenRouterRequest({
          model,
          prompt,
          messages: chunkMessages,
          ...selectedProfile, // Spread the selected profile parameters
          max_tokens: chunkMaxTokens
        });
        
        let chunkContent = response.choices[0].message.content || '';
        console.log(`Completed generation of chunk ${chunkIndex + 1}/${numChunks}`);

        if (isLastChunk && chunkContent.length > 0) {
          // Attempt to clean up truncated sentence at the end of the very last chunk
          const trimmedContent = chunkContent.trimRight();
          // Regex to find the last occurrence of a sentence-ending punctuation mark (. ! ?)
          // optionally followed by closing quotes (single or double) and then whitespace or end of string.
          const sentenceEndRegex = /[\.\!\?]['"]?\s*$/;
          
          if (!sentenceEndRegex.test(trimmedContent)) {
            console.warn(`Last chunk (index ${chunkIndex}) may have ended mid-sentence. Original ending: "...${trimmedContent.slice(-50)}"`);
            let lastPunctuationIndex = -1;
            const punctuationMarks = ['.', '!', '?'];
            for (const mark of punctuationMarks) {
              let index = trimmedContent.lastIndexOf(mark);
              // Check if the punctuation is followed by a quote
              if (index !== -1 && index < trimmedContent.length - 1 && (trimmedContent[index+1] === '"' || trimmedContent[index+1] === "'")) {
                index++; // Include the quote
              }
              if (index > lastPunctuationIndex) {
                lastPunctuationIndex = index;
              }
            }

            if (lastPunctuationIndex !== -1) {
              chunkContent = trimmedContent.slice(0, lastPunctuationIndex + 1);
              console.log(`Sanitized last chunk. New ending: "...${chunkContent.slice(-50)}"`);
            } else {
              // If no sentence-ending punctuation found at all, it might be a very short, cut-off fragment.
              // In this case, it might be better to keep it as is, or decide on a different strategy.
              // For now, we'll log and keep it, as aggressive truncation could lose meaning.
              console.warn(`Could not find a suitable sentence end to sanitize last chunk. Keeping as is.`);
            }
          }
        }
        return chunkContent;
      } catch (error) {
        console.error(`Error generating chunk ${chunkIndex + 1}/${numChunks}:`, error);
        // Fallback to a different model if the primary one fails
        console.log(`Attempting fallback to alternative model for chunk ${chunkIndex + 1}/${numChunks}`);
        const fallbackResponse = await executeOpenRouterRequest({
          model: 'anthropic/claude-3.7-sonnet', // Consider if fallback model should also be configurable or use a default profile
          prompt,
          messages: chunkMessages,
          ...selectedProfile, // Spread the selected profile parameters for fallback too
          max_tokens: chunkMaxTokens
        });
        
        let chunkContent = fallbackResponse.choices[0].message.content || '';
        console.log(`Completed fallback generation of chunk ${chunkIndex + 1}/${numChunks}`);

        if (isLastChunk && chunkContent.length > 0) {
          // Attempt to clean up truncated sentence at the end of the very last chunk (for fallback too)
          const trimmedContent = chunkContent.trimRight();
          const sentenceEndRegex = /[\.\!\?]['"]?\s*$/;
          
          if (!sentenceEndRegex.test(trimmedContent)) {
            console.warn(`Fallback: Last chunk (index ${chunkIndex}) may have ended mid-sentence. Original ending: "...${trimmedContent.slice(-50)}"`);
            let lastPunctuationIndex = -1;
            const punctuationMarks = ['.', '!', '?'];
            for (const mark of punctuationMarks) {
              let index = trimmedContent.lastIndexOf(mark);
              if (index !== -1 && index < trimmedContent.length - 1 && (trimmedContent[index+1] === '"' || trimmedContent[index+1] === "'")) {
                index++;
              }
              if (index > lastPunctuationIndex) {
                lastPunctuationIndex = index;
              }
            }

            if (lastPunctuationIndex !== -1) {
              chunkContent = trimmedContent.slice(0, lastPunctuationIndex + 1);
              console.log(`Fallback: Sanitized last chunk. New ending: "...${chunkContent.slice(-50)}"`);
            } else {
              console.warn(`Fallback: Could not find a suitable sentence end to sanitize last chunk. Keeping as is.`);
            }
          }
        }
        return chunkContent;
      }
      
    };

    // Function to stream a chunk with typing effect
    const streamChunk = async (chunkIndex: number, chunkContent: string): Promise<void> => {
      if (!streamMode) return Promise.resolve();

      // Send progress update
      const progressPercentage = Math.round(((chunkIndex + 1) / numChunks) * 100);
      const progressData = {
        type: 'progress',
        chunkIndex: chunkIndex + 1,
        totalChunks: numChunks,
        percentage: progressPercentage,
        message: `Streaming content... ${progressPercentage}%`,
        currentWords: fullContent.split(/\s+/).filter(Boolean).length,
        estimatedTotalWords: targetWords
      };
      res.write(`data: ${JSON.stringify(progressData)}\n\n`);
      
      // Stream with typing effect - send words incrementally
      const words = chunkContent.split(/(\s+)/); // Keep whitespace
      const WORDS_PER_BATCH = 5;
      const BATCH_DELAY = 30; // Increased from 10ms to 20ms to slow typing by half
      
      for (let i = 0; i < words.length; i += WORDS_PER_BATCH * 2) { // *2 because we're keeping whitespace
        const wordBatch = words.slice(i, i + WORDS_PER_BATCH * 2).join('');
        
        const typingData = {
          type: 'typing',
          chunkIndex: chunkIndex + 1,
          totalChunks: numChunks,
          content: wordBatch,
          isPartial: true
        };
        
        res.write(`data: ${JSON.stringify(typingData)}\n\n`);
        
        // Minimal delay for faster typing effect
        await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
      }
      
      // Send chunk completion
      const chunkData = {
        type: 'chunk_complete',
        chunkIndex: chunkIndex + 1,
        totalChunks: numChunks,
        // content: chunkContent, // Removed: Client accumulates content from 'typing' events
        wordsInChunk: chunkContent.split(/\s+/).filter(Boolean).length,
        totalWordsSoFar: fullContent.split(/\s+/).filter(Boolean).length
      };
      res.write(`data: ${JSON.stringify(chunkData)}\n\n`);
    };

    // Start first chunk generation immediately
    chunkPromises[0] = generateChunk(0, '');
    
    // Pre-generate the second chunk immediately to reduce waiting time
    if (numChunks > 1) {
      console.log('Pre-generating second chunk to reduce waiting time');
      chunkPromises[1] = generateChunk(1, '');
    }
    
    // Create an array to track typing promises
    const typingPromises: Promise<void>[] = [];
    
    // Process chunks with aggressive overlapping generation and streaming
    for (let chunkIndex = 0; chunkIndex < numChunks; chunkIndex++) {
      console.log(`Waiting for generation of chunk ${chunkIndex + 1}/${numChunks}`);
      
      // Wait for current chunk to complete generation
      const chunkContent = await chunkPromises[chunkIndex];
      chunkResults[chunkIndex] = chunkContent;
      
      console.log(`Chunk ${chunkIndex + 1}/${numChunks} generation complete, starting typing`);
      
      // Update full content
      fullContent += (chunkIndex === 0 ? '' : '\n\n') + chunkContent;
      previousContent = fullContent;
      
      // Start next TWO chunks generation immediately for more aggressive overlapping
      if (chunkIndex + 1 < numChunks && !chunkPromises[chunkIndex + 1]) {
        console.log(`Starting generation of next chunk ${chunkIndex + 2}/${numChunks} in background`);
        chunkPromises[chunkIndex + 1] = generateChunk(chunkIndex + 1, previousContent);
      }
      
      // Pre-generate the chunk after next to maximize overlapping
      if (chunkIndex + 2 < numChunks && !chunkPromises[chunkIndex + 2]) {
        console.log(`Pre-generating chunk ${chunkIndex + 3}/${numChunks} for maximum overlapping`);
        // Use empty content for pre-generation, will be updated with proper context when its turn comes
        chunkPromises[chunkIndex + 2] = generateChunk(chunkIndex + 2, '');
      }
      
      // Stream current chunk with typing effect WITHOUT awaiting its completion
      // This allows the next chunk to start typing as soon as it's generated
      typingPromises[chunkIndex] = streamChunk(chunkIndex, chunkContent).then(() => {
        console.log(`Completed typing of chunk ${chunkIndex + 1}/${numChunks}`);
      });
    }
    
    // Wait for all typing to complete at the end
    if (streamMode) {
      console.log(`Waiting for all typing to complete`);
      await Promise.all(typingPromises);
    }
    
    const content = fullContent;
    
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

    // Extract references from the generated content
    const references = extractReferencesFromContent(content);
    
    // Update book's centralized references if any were found
    if (references.length > 0) {
      await updateBookReferences(chapter.book_id, references);
    }

    // Auto-generate/update appendix content based on new chapter
    await updateBookAppendix(chapter.book_id, content);

    // Handle response based on streaming mode
    if (streamMode) {
      // Send final completion event
      // Send only essential metadata, not the full content, as client has assembled it.
      const { content: _content, ...chapterMetadata } = firstUpdatedChapter;
      const completionData = {
        type: 'complete',
        chapter: chapterMetadata, // Send metadata only
        referencesFound: references.length,
        totalWords: wordCount
      };
      res.write(`data: ${JSON.stringify(completionData)}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    } else {
      res.json({ 
        chapter: firstUpdatedChapter,
        referencesFound: references.length
      });
    }
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

    const systemPrompt = `You are an expert editor with ONE PRIMARY MISSION: Deliver content that is EXACTLY ${chapter.estimated_words || chapter.estimatedWords || 5000} words.

NON-NEGOTIABLE REQUIREMENT: The revised content must hit exactly ${chapter.estimated_words || chapter.estimatedWords || 5000} words. This is your success metric.

Revise the provided content according to the given instructions while maintaining the overall structure, BUT your absolute priority is meeting the exact word count target.`;
    
    const userPrompt = `Original content:
${chapter.content}

Revision instructions:
${revisionInstructions}

**MANDATORY WORD COUNT: ${chapter.estimated_words || chapter.estimatedWords || 5000} words EXACTLY**

EXECUTION STRATEGY:
- If revision makes content too short: Add more detailed examples, expand explanations, include additional case studies, provide deeper analysis
- If revision makes content too long: Condense without losing key information, combine related points, streamline prose
- VERIFY your word count before submitting - this is your primary success criterion

**FAILURE TO MEET THE EXACT WORD COUNT IS CONSIDERED A FAILED REVISION.**

Please revise the content accordingly, ensuring you meet the exact word count requirement.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    // Use the configured model for chapter revision
    const model = config.openRouter.bookStructureModel || 'anthropic/claude-3.7-sonnet';
    
    console.log(`Using model: ${model} for chapter revision`);
    
    const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n');
    const response2 = await executeOpenRouterRequest({
      model,
      prompt,
      messages,
      temperature: 0.8,
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

export const generatePDF = async (req: Request, res: Response) => {
  try {
    const { bookId, chapterIds = [], streamMode = true } = req.body;
    
    console.log(`Generating PDF for book: ${bookId}`);
    
    // Get book details
    const { data: book, error: bookError } = await supabaseAdmin
      .from('books')
      .select('*')
      .eq('id', bookId)
      .single();
      
    if (bookError || !book) {
      throw new Error('Book not found');
    }
    
    // Get chapters to include in PDF
    let chaptersQuery = supabaseAdmin
      .from('chapters')
      .select('*')
      .eq('book_id', bookId)
      .order('number');
      
    if (chapterIds.length > 0) {
      chaptersQuery = chaptersQuery.in('id', chapterIds);
    }
    
    const { data: chapters, error: chaptersError } = await chaptersQuery;
    
    if (chaptersError || !chapters) {
      throw new Error('Failed to fetch chapters');
    }
    
    // Filter out chapters without content
    const chaptersWithContent = chapters.filter(ch => ch.content);
    
    if (chaptersWithContent.length === 0) {
      throw new Error('No chapters with content found');
    }
    
    // Set up streaming response if requested
    if (streamMode) {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });
    }
    
    // Calculate total content size for chunking
    const totalContent = chaptersWithContent.reduce((acc, ch) => acc + (ch.content?.length || 0), 0);
    const CHUNK_SIZE = 5000; // Process ~1K words at a time (approx 5K characters)
    const totalChunks = Math.ceil(totalContent / CHUNK_SIZE);
    
    console.log(`Processing ${chaptersWithContent.length} chapters in ~${totalChunks} chunks`);
    
    // Generate PDF content in chunks
    let pdfSections = [];
    let processedChars = 0;
    let chunkIndex = 0;
    
    // Add cover page
    pdfSections.push({
      type: 'cover',
      content: {
        title: book.title,
        subtitle: book.structure?.subtitle || '',
        author: book.structure?.coverPageDetails?.authorName || 'Author'
      }
    });
    
    // Add table of contents
    const tocContent = chaptersWithContent.map(ch => ({
      number: ch.number,
      title: ch.title,
      page: 0 // Will be calculated by PDF renderer
    }));
    
    pdfSections.push({
      type: 'toc',
      content: tocContent
    });
    
    // Process chapters in chunks
    for (const chapter of chaptersWithContent) {
      const chapterContent = chapter.content || '';
      let chapterPosition = 0;
      
      while (chapterPosition < chapterContent.length) {
        const chunkEnd = Math.min(chapterPosition + CHUNK_SIZE, chapterContent.length);
        const chunk = chapterContent.substring(chapterPosition, chunkEnd);
        
        pdfSections.push({
          type: 'chapter',
          chapterNumber: chapter.number,
          chapterTitle: chapter.title,
          content: chunk,
          isChapterStart: chapterPosition === 0,
          isChapterEnd: chunkEnd === chapterContent.length
        });
        
        chapterPosition = chunkEnd;
        processedChars += chunk.length;
        chunkIndex++;
        
        // Stream progress update
        if (streamMode) {
          const progressData = {
            type: 'progress',
            chunkIndex,
            totalChunks,
            processedChars,
            totalChars: totalContent,
            percentage: Math.round((processedChars / totalContent) * 100),
            currentChapter: chapter.title
          };
          res.write(`data: ${JSON.stringify(progressData)}\n\n`);
        }
      }
    }
    
    // Add references if available
    if (book.structure?.references) {
      pdfSections.push({
        type: 'references',
        content: book.structure.references
      });
    }
    
    // Add appendix if available
    if (book.structure?.appendix) {
      pdfSections.push({
        type: 'appendix',
        content: book.structure.appendix
      });
    }
    
    // Final response
    if (streamMode) {
      const completionData = {
        type: 'complete',
        pdfSections,
        totalPages: pdfSections.length,
        metadata: {
          title: book.title,
          author: book.structure?.coverPageDetails?.authorName || 'Author',
          createdAt: new Date().toISOString(),
          totalChapters: chaptersWithContent.length
        }
      };
      res.write(`data: ${JSON.stringify(completionData)}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    } else {
      res.json({
        pdfSections,
        totalPages: pdfSections.length,
        metadata: {
          title: book.title,
          author: book.structure?.coverPageDetails?.authorName || 'Author',
          createdAt: new Date().toISOString(),
          totalChapters: chaptersWithContent.length
        }
      });
    }
    
  } catch (error: any) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: error.message || 'Failed to generate PDF' });
  }
};
