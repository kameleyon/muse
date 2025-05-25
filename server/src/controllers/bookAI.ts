import { Request, Response } from 'express';
import { supabaseClient, supabaseAdmin } from '../services/supabase';
import { executeOpenRouterRequest } from '../services/openrouter';

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
8. Reading level and content specifications
9. Design and formatting requirements

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
    "formatting": "specific formatting preferences for target audience"
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
1. Create a book structure with multiple parts. Each part should contain 4-7 thematically related chapters. These are the main content chapters.
2. The total estimated word count for the entire book (including Prologue, Introduction, main chapters, and Conclusion) should be between 125,000 and 184,000 words.
3. Each main chapter (within the 'parts' array) must have a creative and descriptive title, a detailed explanation/description of its content and purpose, an estimated word count, key topics to be covered, and 3-5 key points the reader should take away. Chapter numbering should be sequential for these main chapters, starting from 1.
4. Generate content for 'prologue', 'introduction', and 'conclusion' as top-level string fields in the JSON. These are NOT chapters within the 'parts' array and should NOT be numbered as chapters.
   - The 'prologue' string should contain a prologue (1,500-2,500 words) following these STRICT CONTENT GUIDELINES: Write at specified Flesch Reading Ease level; Use specified tone with specified sentence lengths; Use specified vocabulary complexity; FORBIDDEN PHRASES: Never use "picture this", "imagine", "celestial", "buckle up", "let's dive in", "journey", "unlock", "transform your life", "game-changer", "revolutionary", "ultimate guide"; AVOID: Starting sections with questions, excessive metaphors, emoji, exclamation points (max 1 per 1000 words); DO: Vary sentence openings, use specific examples from target audience daily life, ground abstract concepts in concrete scenarios; FORMAT: Use proper markdown with ### for subsections, **bold** for emphasis, paragraph spacing; CONTENT: Opens with a vivid scene, surprising statement, or relatable problem; Establishes the book's core premise or conflict within the first 500 words; Including specific sensory details and concrete examples; Creating emotional connection through personal anecdote or universal experience; Ending with a clear promise of what the book will deliver; Addresses target audience pain points and desires directly. MUST end with "***\n#### Key Points from Prologue\n- Point 1\n- Point 2\n- Point 3\n- Point 4\n- Point 5\n***"
   - The 'introduction' string should contain a comprehensive introduction (2,500-4,000 words) following these STRICT CONTENT GUIDELINES: Write at specified Flesch Reading Ease level; Use specified tone with specified sentence lengths; Use specified vocabulary complexity; FORBIDDEN PHRASES: Never use "picture this", "imagine", "celestial", "buckle up", "let's dive in", "journey", "unlock", "transform your life", "game-changer", "revolutionary", "ultimate guide"; AVOID: Starting sections with questions, excessive metaphors, emoji, exclamation points (max 1 per 1000 words); DO: Vary sentence openings, use specific examples from target audience daily life, ground abstract concepts in concrete scenarios; FORMAT: Use proper markdown with ### for subsections, **bold** for emphasis, paragraph spacing; CONTENT: Opens with a clear, engaging heading that captures the book's essence; Includes 3-5 substantial sections that progressively build the book's foundation; Establishes the problem/opportunity this book addresses; Shares why this book exists now and why the author is uniquely qualified; Provides a roadmap of what readers will learn/gain from each section; Includes 2-3 specific examples or mini-case studies; Addresses common misconceptions or objections; Ends with clear instructions on how to use this book; Uses subheadings to break up text every 400-600 words; Addresses target audience pain points and desires directly. MUST end with "***\n#### Key Points from Introduction\n- Point 1\n- Point 2\n- Point 3\n- Point 4\n- Point 5\n***"
   - The 'conclusion' string should contain a powerful conclusion (2,500-4,000 words) following these STRICT CONTENT GUIDELINES: Write at specified Flesch Reading Ease level; Use specified tone with specified sentence lengths; Use specified vocabulary complexity; FORBIDDEN PHRASES: Never use "picture this", "imagine", "celestial", "buckle up", "let's dive in", "journey", "unlock", "transform your life", "game-changer", "revolutionary", "ultimate guide"; AVOID: Starting sections with questions, excessive metaphors, emoji, exclamation points (max 1 per 1000 words); DO: Vary sentence openings, use specific examples from target audience daily life, ground abstract concepts in concrete scenarios; FORMAT: Use proper markdown with ### for subsections, **bold** for emphasis, paragraph spacing; CONTENT: Opens with an evocative heading that signals completion and new beginning; Synthesizes key insights without merely repeating chapter summaries; Includes 3-5 substantial sections that build toward a crescendo; Addresses the 'what now?' question with concrete next steps; Acknowledges the reader's journey and growth through the book; Paints a vivid picture of the reader's potential future state; Includes a memorable final message or call-to-action; Provides additional resources or community connections; Uses subheadings to structure the conclusion's narrative arc; Circles back to opening themes while showing transformation; Addresses target audience pain points and desires with solutions. MUST end with "***\n#### Key Points from Conclusion\n- Point 1\n- Point 2\n- Point 3\n- Point 4\n- Point 5\n***"
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
- Target Audience Daily Life: ${marketResearch.targetAudience.dailyLife || 'everyday modern life scenarios'}

IMPORTANT: Use these exact market research specifications in the prologue, introduction, and conclusion content. The AI must write at the specified reading level, use the specified tone and sentence lengths, address the specific pain points and desires, and incorporate examples from the target audience's daily life.



You must respond with ONLY valid JSON in this exact format:
{
  "title": "Suggested book title",
  "subtitle": "Compelling subtitle",
  "audience": "refined target audience description",
  "style": "specific writing style based on research",
  "tone": "specific tone based on research",
  "marketPosition": "Define market position (75-150 words) using this framework: Primary category/shelf placement; 2-3 successful comp titles and how this book differs; Target retailer categories; Price point positioning (premium/accessible/budget) with justification; Format priorities (hardcover/paperback/audio/digital); One-sentence elevator pitch for booksellers.",
  "uniqueValue": "Write a compelling unique value proposition (50-100 words) that identifies ONE primary differentiator from existing books in this category, states a specific benefit readers get here they can't find elsewhere, uses concrete language rather than abstract claims, avoids overused terms like 'comprehensive,' 'ultimate,' or 'revolutionary,' includes a measurable outcome or transformation when possible, formatted as 2-3 punchy sentences that could work as back-cover copy.",
  "acknowledgement": "Concise acknowledgement section (100-200 words) that thanks 2-3 key individuals or groups who made the book possible, includes specific contributions rather than generic thanks, mentions early readers, mentors, or community members who shaped the work, acknowledges family/personal support briefly but genuinely, references any organizations, platforms, or communities integral to the book, maintains professional warmth without excessive sentimentality, ends with a forward-looking note about the book's intended impact, and matches the book's tone while being slightly more personal.",
  "prologue": "## Prologue Title Chosen by AI\\n\\nPrologue content (1,500-2,500 words) written at ${marketResearch.readingLevel} reading level with ${marketResearch.recommendations.tone} tone and ${marketResearch.sentenceLength} sentences. Addresses ${marketResearch.targetAudience.painPoints.join(', ')} pain points and ${marketResearch.targetAudience.desires.join(', ')} desires. Uses examples from ${marketResearch.targetAudience.dailyLife || 'target audience daily life'}. AVOIDS forbidden phrases: 'picture this', 'imagine', 'journey', 'unlock', 'transform your life', 'game-changer', 'revolutionary', 'ultimate guide'. Opens with vivid scene, establishes core premise, includes sensory details, creates emotional connection, ends with clear promise...\\n\\n***\\n#### Key Points from Prologue\\n- Point 1\\n- Point 2\\n- Point 3\\n- Point 4\\n- Point 5\\n***",
  "introduction": "# Introduction Title Chosen by AI\\n\\nComprehensive introduction content (2,500-4,000 words) written at ${marketResearch.readingLevel} reading level with ${marketResearch.recommendations.tone} tone and ${marketResearch.sentenceLength} sentences. Addresses ${marketResearch.targetAudience.painPoints.join(', ')} pain points and ${marketResearch.targetAudience.desires.join(', ')} desires. Uses examples from ${marketResearch.targetAudience.dailyLife || 'target audience daily life'}. AVOIDS forbidden phrases: 'picture this', 'imagine', 'journey', 'unlock', 'transform your life', 'game-changer', 'revolutionary', 'ultimate guide'. Establishes problem/opportunity, shares why book exists now, provides roadmap, includes examples, addresses misconceptions, ends with usage instructions...\\n\\n***\\n#### Key Points from Introduction\\n- Point 1\\n- Point 2\\n- Point 3\\n- Point 4\\n- Point 5\\n***",
  "conclusion": "# Evocative Conclusion Title Chosen by AI\\n\\nPowerful conclusion content (2,500-4,000 words) written at ${marketResearch.readingLevel} reading level with ${marketResearch.recommendations.tone} tone and ${marketResearch.sentenceLength} sentences. Addresses ${marketResearch.targetAudience.painPoints.join(', ')} pain points with solutions and ${marketResearch.targetAudience.desires.join(', ')} desires fulfillment. Uses examples from ${marketResearch.targetAudience.dailyLife || 'target audience daily life'}. AVOIDS forbidden phrases: 'picture this', 'imagine', 'journey', 'unlock', 'transform your life', 'game-changer', 'revolutionary', 'ultimate guide'. Synthesizes key insights, addresses 'what now?' question, acknowledges reader journey, paints future state picture, includes memorable final message...\\n\\n***\\n#### Key Points from Conclusion\\n- Point 1\\n- Point 2\\n- Point 3\\n- Point 4\\n- Point 5\\n***",
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
          "keyPoints": ["Key takeaway 1 for Ch1", "Key takeaway 2 for Ch1", "Key takeaway 3 for Ch1"],
          "keyTopics": ["Main topic of Ch1", "Sub-topic A for Ch1", "Sub-topic B for Ch1"]
        }
        // ... AI to add 4-7 more chapters to this part, with sequential numbering ...
      ]
    }
    // ... AI to add more parts, each with 4-7 chapters and sequential part numbers ...
  ],
  "totalWords": 185000, // AI calculates this sum from all chapter estimatedWords + prologue + intro + conclusion, aiming for 125k-184k.
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

    const model = 'anthropic/claude-sonnet-4'; 
    
    const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n');
    const completion = await executeOpenRouterRequest({
      model,
      prompt,
      messages,
      temperature: 0.7,
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

    const systemPrompt = `You are an expert book writer specializing in creating content that resonates with specific target audiences. Write in the exact tone and style specified, addressing the audience's pain points and desires.

Write this chapter following these STRICT guidelines:

**CONTENT QUALITY & VOICE:**
1. Write at a ${book.marketResearch?.readingLevel || 'Standard (60-69)'} Flesch Reading Ease level (${book.marketResearch?.gradeLevel || '8th-9th grade'})
2. Use ${book.structure?.tone || 'conversational'} tone with ${book.marketResearch?.sentenceLength || 'medium'} sentence lengths
3. Vocabulary complexity: ${book.marketResearch?.vocabularyLevel || 'accessible but varied'}
4. FORBIDDEN PHRASES: Never use "picture this", "imagine", "celestial", "buckle up", "let's dive in", "journey", "unlock", "transform your life", "game-changer", "revolutionary", "ultimate guide"
5. AVOID: Starting sections with questions, excessive metaphors, emoji, exclamation points (max 1 per 1000 words)
6. DO: Vary sentence openings, use specific examples from ${book.marketResearch?.targetAudience?.dailyLife || 'everyday modern life'}, ground abstract concepts in concrete scenarios

**CONSISTENCY REQUIREMENTS:**
7. Review previous chapters to ensure NO repeated: examples, case studies, anecdotes, or conceptual explanations
8. Unique examples only - flag if similar territory covered in: ${previousChapters.length > 0 ? previousChapters.join(', ') : 'N/A'}
9. Maintain consistent terminology established in: ${book.glossary || 'chapter 1'}

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
   - Use *** Your key-point text goes here ***
   - Ensure proper paragraph spacing (empty line between paragraphs)
   - Use numbered lists where appropriate
   - Use backticks for inline code or technical terms
15. Include ${book.marketResearch?.design?.visualElements || chapterDetails?.visualElements || '1-2'} data visualizations using markdown tables or ASCII-style simple graphs when data supports it
16. Color palette references: ${book.marketResearch?.design?.colors || book.design?.colors || 'primary: purple, secondary: gold, accent: white'}

**CHAPTER SPECIFICATIONS:**
17. Word count: ${chapterDetails?.estimatedWords || 5000} words (±10%)
18. Include ${book.marketResearch?.contentSpecs?.examplesPerChapter || chapterDetails?.examples || '3-4'} real-world examples
19. ${book.marketResearch?.contentSpecs?.exerciseInclusion === 'true' || chapterDetails?.exercises ? 'Include practical exercises' : 'Focus on narrative flow'}
20. Target audience specifics: ${book.marketResearch?.targetAudience?.demographics || '25-45, urban, professional'}

**SPECIAL INSTRUCTIONS:**
${book.marketResearch?.contentSpecs?.specialInstructions || chapterDetails?.specialInstructions || 'None'}
${chapter.number === 0 || (chapter.number === (book.structure?.parts ? 
  Math.max(...book.structure.parts.flatMap((part: any) => part.chapters.map((ch: any) => ch.number))) + 1 : 
  (book.structure?.chapters ? book.structure.chapters.length + 1 : 999)
)) ? 'Adapt format for special section requirements' : ''}`;
    
    const userPrompt = `Book Title: ${book.title}
Subtitle: ${book.structure?.subtitle || ''}
Topic: ${book.topic}
Target Audience: ${book.structure?.audience || ''}
Writing Style: ${book.structure?.style || 'Clear and engaging'}
Tone: ${book.structure?.tone || 'Conversational'}
Market Position: ${book.structure?.marketPosition || ''}
Unique Value: ${book.structure?.uniqueValue || ''}

Market Research Specifications:
- Target Audience: ${book.marketResearch?.targetAudience?.demographics || '25-45, urban, professional'}
- Audience Pain Points: ${book.marketResearch?.targetAudience?.painPoints?.join(', ') || 'general life challenges'}
- Audience Desires: ${book.marketResearch?.targetAudience?.desires?.join(', ') || 'personal growth, success'}
- Audience Daily Life: ${book.marketResearch?.targetAudience?.dailyLife || 'everyday modern life scenarios'}
- Market Gaps: ${book.marketResearch?.marketAnalysis?.gaps?.join(', ') || 'not specified'}
- Recommended Tone: ${book.marketResearch?.recommendations?.tone || book.structure?.tone || 'conversational'}
- Recommended Style: ${book.marketResearch?.recommendations?.style || book.structure?.style || 'clear and engaging'}
- Recommended Reading Level: ${book.marketResearch?.readingLevel || 'Standard (60-69)'}
- Recommended Grade Level: ${book.marketResearch?.gradeLevel || '8th-9th grade'}
- Recommended Sentence Length: ${book.marketResearch?.sentenceLength || 'medium'}
- Recommended Vocabulary Level: ${book.marketResearch?.vocabularyLevel || 'accessible but varied'}

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

At the end of each chapter, add the key points, as defined
***
#### Key Points to takeaway from this chapter
- [Key takeaway 1 from this chapter]
- [Key takeaway 2 from this chapter] 
- [Key takeaway 3 from this chapter]
- [Key takeaway 4 from this chapter]
- [Key takeaway 5 from this chapter]
***
Write high-quality content that follows all the guidelines above.`;

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
    const searchResponse = await executeOpenRouterRequest({
      model: 'openai/gpt-4o-search-preview',
      prompt: searchMessages.map(m => `${m.role}: ${m.content}`).join('\n'),
      messages: searchMessages as any,
      temperature: 0.3,
      max_tokens: 4000
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
- End each chapter with a "#### Key Points" section containing 3-5 bullet points summarizing the chapter
- Do NOT include a "References" section at the end of the chapter
- Include citations in-text using format: (Source Name, Year)
- All references will be compiled automatically into the book's main References chapter


`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: enhancedUserPrompt }
    ];

    const model = 'anthropic/claude-sonnet-4';
    
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
    let estimatedWords = 4000; // Default
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

    // Extract references from the generated content
    const references = extractReferencesFromContent(content);
    
    // Update book's centralized references if any were found
    if (references.length > 0) {
      await updateBookReferences(chapter.book_id, references);
    }

    // Auto-generate/update appendix content based on new chapter
    await updateBookAppendix(chapter.book_id, content);

    res.json({ 
      chapter: firstUpdatedChapter,
      referencesFound: references.length
    });
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
