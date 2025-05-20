"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviseChapter = exports.generateChapter = exports.generateBookStructure = exports.generateMarketResearch = void 0;
const supabase_1 = require("../services/supabase");
const openrouter_1 = require("../services/openrouter");
// Clean JSON response helper
function cleanJsonResponse(response) {
    console.log("Received response from AI model, attempting to extract JSON...");
    try {
        // First try direct JSON parse
        return JSON.parse(response);
    }
    catch (e) {
        console.log("Failed to parse direct JSON, trying to extract from response:", e.message);
        try {
            // Extract JSON from markdown code blocks
            const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
            if (jsonMatch) {
                try {
                    const json = JSON.parse(jsonMatch[1].trim());
                    console.log("Successfully extracted JSON from code block");
                    return json;
                }
                catch (e2) {
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
                }
                catch (e3) {
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
                    const partStart = partMatch.index;
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
                                estimatedWords: 3000
                            }))
                        });
                    }
                }
            }
            else {
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
        }
        catch (finalError) {
            console.error("Failed all JSON parsing attempts:", finalError);
            throw new Error('Failed to parse JSON response and could not create fallback structure');
        }
    }
}
const generateMarketResearch = async (req, res) => {
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
        const model = 'openai/gpt-4o-mini';
        const completion = await (0, openrouter_1.executeOpenRouterRequest)({
            model,
            prompt: messages.map(m => `${m.role}: ${m.content}`).join('\n'),
            temperature: 0.7,
            max_tokens: 3000
        });
        const marketResearch = cleanJsonResponse(completion.choices[0].message.content);
        res.json({ marketResearch });
    }
    catch (error) {
        console.error('Error generating market research:', error);
        res.status(500).json({ error: error.message || 'Failed to generate market research' });
    }
};
exports.generateMarketResearch = generateMarketResearch;
const generateBookStructure = async (req, res) => {
    try {
        const { topic, marketResearch, references = [] } = req.body;
        const systemPrompt = `You are an expert book outliner who creates JSON-structured book outlines. Your entire response MUST be valid, parseable JSON with no text before or after the JSON object. Based on the market research provided, create a comprehensive book structure.

CRITICAL JSON FORMAT REQUIREMENTS:
1. Output ONLY well-formed, valid JSON that can be parsed directly with JSON.parse()
2. Do NOT include markdown formatting, code blocks, or any explanation text
3. Ensure all keys are properly quoted with double quotes
4. Ensure no trailing commas in arrays or objects
5. Ensure all string values are properly quoted with double quotes
6. DO NOT use single quotes for strings in your JSON

CONTENT REQUIREMENTS:
1. Create 30-32 total chapters organized into 7-8 parts
2. Each part should contain 4-6 thematically related chapters
3. Each chapter should have a descriptive title and explanation
4. Include a prologue, introduction, and conclusion
5. Match the example format precisely

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

Create a book structure using this professional format:

EXAMPLE FORMAT:
Title: The 52 Keys for Wealth Creation
Subtitle: How to Play the Hand You're Dealt: A Cardology System for Financial Mastery

Market Position:
The definitive guide bridging ancient cardology wisdom with modern financial strategy, positioned at the intersection of alternative spirituality and practical business development

Unique Value:
The first comprehensive system translating cardology from a divinatory practice into a strategic financial planning tool with concrete applications for career selection, business timing, and wealth manifestation

Acknowledgement:
To those who have preserved the ancient wisdom of cardology through generations, and to the seekers who understand that our greatest power lies in playing the unique hand we've been dealt.

Prologue:
The deck of 52 playing cards you've handled throughout your life holds far more than games of chance—it contains a sophisticated system for navigating your financial destiny. What if I told you that your birth date corresponds to specific cards that reveal your natural wealth-building abilities? What if business success could be timed according to cosmic cycles mapped within this ordinary deck? This isn't about predicting the future—it's about strategically aligning with energies that have always been available to you.

Introduction:
# Introduction: Beyond the Game of Chance
In a world where financial success often seems like a game of chance, what if you discovered that you've been holding the keys to wealth creation in your hands all along? Not in the metaphorical sense, but literally—in the form of playing cards you've known since childhood. 

[Introduction continues with 1-2 paragraphs explaining the premise]

Part I: THE FOUNDATIONS OF CARDOLOGY FOR WEALTH CREATION
Chapter 1: The Ancient System Hidden in Plain Sight
Explores the origins and history of cardology, distinguishing it from cartomancy and other divinatory practices. Introduces the concept of the 52-card deck as a mathematical and energetic system that maps human experience and time cycles.
~3500 words

Chapter 2: Your Financial DNA: Understanding Birth Cards
Explains how to calculate your birth cards and life spread using your birth date. Details the significance of your Birth Card, Planetary Ruling Card, and how these form the foundation of your financial blueprint.
~4000 words

[... More chapters organized in logical parts ...]

Conclusion:
# Conclusion: Mastering the Game
As we conclude our journey through the 52 keys of wealth creation, I hope you now see that ordinary playing cards hold extraordinary potential as tools for financial mastery. Cardology isn't about mystical predictions or leaving your success to chance—it's about strategic alignment with the energetic patterns that have influenced human experience for centuries.

[Conclusion continues with 1-2 paragraphs summarizing key takeaways]

Based on this market research, create a comprehensive book structure that:
1. Addresses all identified pain points
2. Fulfills the audience's desires
3. Fills the market gaps
4. Uses the recommended tone and style
5. Is structured for maximum engagement with the target audience
6. Is organized into logical parts with related chapters grouped together (aim for 6-8 parts)
7. Includes at least 30-32 total chapters (with 4-6 chapters per part)
8. Includes word count estimates for each chapter
9. Contains a compelling market position, unique value proposition, and prologue

You must respond with ONLY valid JSON in this exact format:
{
  "title": "Suggested book title",
  "subtitle": "Compelling subtitle",
  "audience": "refined target audience description",
  "style": "specific writing style based on research",
  "tone": "specific tone based on research",
  "marketPosition": "how to position this book in the market",
  "uniqueValue": "what makes this book different",
  "acknowledgement": "a brief acknowledgement section",
  "prologue": "a compelling prologue that hooks the reader",
  "introduction": "a detailed introduction with heading and 1-2 paragraphs explaining the premise",
  "conclusion": "a meaningful conclusion with heading and 1-2 paragraphs summarizing key takeaways",
  "parts": [
    {
      "partNumber": 1,
      "partTitle": "PART TITLE IN ALL CAPS",
      "chapters": [
        {
          "number": 1,
          "title": "Chapter Title",
          "description": "Brief description addressing specific pain points/desires",
          "estimatedWords": 3000,
          "keyTopics": ["topic1", "topic2"]
        }
      ]
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
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
        ];
        const model = 'openai/gpt-4o'; // Switch back to GPT-4o as it produces more reliable JSON responses
        const completion = await (0, openrouter_1.executeOpenRouterRequest)({
            model,
            prompt: messages.map(m => `${m.role}: ${m.content}`).join('\n'),
            temperature: 0.7,
            max_tokens: 8000 // Increased from 4000 to support more comprehensive structures
        });
        // Log the first 500 characters of the response for debugging
        const rawResponse = completion.choices[0].message.content;
        console.log("Raw response from AI (first 500 chars):", rawResponse.substring(0, 500));
        // Try to clean and parse the JSON response
        const structure = cleanJsonResponse(rawResponse);
        res.json({ structure });
    }
    catch (error) {
        console.error('Error generating book structure:', error);
        res.status(500).json({ error: error.message || 'Failed to generate book structure' });
    }
};
exports.generateBookStructure = generateBookStructure;
const generateChapter = async (req, res) => {
    try {
        const { chapterId } = req.body;
        // Get chapter details
        const { data: chapter, error: chapterError } = await supabase_1.supabaseClient
            .from('chapters')
            .select('*')
            .eq('id', chapterId)
            .single();
        if (chapterError)
            throw chapterError;
        // Get book details
        const { data: book, error: bookError } = await supabase_1.supabaseClient
            .from('books')
            .select('*')
            .eq('id', chapter.book_id)
            .single();
        if (bookError)
            throw bookError;
        // Get previous chapters for context
        const { data: allChapters } = await supabase_1.supabaseClient
            .from('chapters')
            .select('number, title')
            .eq('book_id', chapter.book_id)
            .lt('number', chapter.number)
            .order('number');
        const previousChapters = allChapters?.map((ch) => ch.title) || [];
        // Find current chapter details from the structure
        let chapterDetails;
        let partTitle = '';
        // Check if using the parts structure
        if (book.structure?.parts) {
            for (const part of book.structure.parts) {
                const foundChapter = part.chapters.find((ch) => ch.number === chapter.number);
                if (foundChapter) {
                    chapterDetails = foundChapter;
                    partTitle = part.partTitle;
                    break;
                }
            }
        }
        else if (book.structure?.chapters) {
            // Fallback to flat chapters array
            chapterDetails = book.structure.chapters.find((ch) => ch.number === chapter.number);
        }
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
Target Word Count: ${chapterDetails?.estimatedWords || 3000} words

${previousChapters.length > 0 ? `Previous chapters covered: ${previousChapters.join(', ')}` : 'This is the first chapter.'}

Special Content Types:
${chapter.number === 0 && book.structure?.prologue ? `This is the PROLOGUE. Use the following content as guidance: ${book.structure.prologue}` : ''}
${chapter.number === 0 && !book.structure?.prologue && book.structure?.introduction ? `This is the INTRODUCTION. Use the following content as guidance: ${book.structure.introduction}` : ''}
${chapter.number === (book.structure?.parts ?
            Math.max(...book.structure.parts.flatMap((part) => part.chapters.map((ch) => ch.number))) + 1 :
            (book.structure?.chapters ? book.structure.chapters.length + 1 : 999)) && book.structure?.conclusion ? `This is the CONCLUSION. Use the following content as guidance: ${book.structure.conclusion}` : ''}

Write this chapter following these guidelines:
1. Use the specified ${book.structure?.tone || 'conversational'} tone throughout
2. Follow the ${book.structure?.style || 'clear and engaging'} writing style
3. Address the target audience's specific needs and interests
4. Include practical examples and actionable insights
5. Maintain consistency with previous chapters
6. Aim for approximately ${chapterDetails?.estimatedWords || 3000} words
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
        const model = 'anthropic/claude-3.5-sonnet-20240620';
        // Adjust temperature based on tone
        let temperature = 0.7;
        if (book.structure?.tone?.toLowerCase().includes('creative') ||
            book.structure?.tone?.toLowerCase().includes('inspirational')) {
            temperature = 0.9;
        }
        else if (book.structure?.tone?.toLowerCase().includes('academic') ||
            book.structure?.tone?.toLowerCase().includes('technical')) {
            temperature = 0.5;
        }
        // Adjust max_tokens based on estimated words (roughly 1.3 tokens per word)
        const maxTokens = Math.min(Math.ceil((book.structure?.chapters?.[chapter.number - 1]?.estimatedWords || 3000) * 1.5), 8000);
        const response = await (0, openrouter_1.executeOpenRouterRequest)({
            model,
            prompt: messages.map(m => `${m.role}: ${m.content}`).join('\n'),
            temperature,
            max_tokens: maxTokens
        });
        // Update chapter with generated content
        const content = response.choices[0].message.content;
        const { data: updatedChapter, error: updateError } = await supabase_1.supabaseClient
            .from('chapters')
            .update({
            content,
            status: 'in_progress',
            updated_at: new Date().toISOString()
        })
            .eq('id', chapterId)
            .select()
            .single();
        if (updateError)
            throw updateError;
        // Update book's updated_at timestamp
        await supabase_1.supabaseClient
            .from('books')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', chapter.book_id);
        res.json({ chapter: updatedChapter });
    }
    catch (error) {
        console.error('Error generating chapter:', error);
        res.status(500).json({ error: error.message || 'Failed to generate chapter' });
    }
};
exports.generateChapter = generateChapter;
const reviseChapter = async (req, res) => {
    try {
        const { chapterId, revisionInstructions } = req.body;
        // Get chapter details
        const { data: chapter, error: chapterError } = await supabase_1.supabaseClient
            .from('chapters')
            .select('*')
            .eq('id', chapterId)
            .single();
        if (chapterError)
            throw chapterError;
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
        const model = 'anthropic/claude-3.5-sonnet-20240620';
        const response2 = await (0, openrouter_1.executeOpenRouterRequest)({
            model,
            prompt: messages.map(m => `${m.role}: ${m.content}`).join('\n'),
            temperature: 0.7,
            max_tokens: 4000
        });
        // Update chapter with revised content
        const revisedContent = response2.choices[0].message.content;
        const { data: updatedChapter, error: updateError } = await supabase_1.supabaseClient
            .from('chapters')
            .update({
            content: revisedContent,
            status: 'in_progress',
            updated_at: new Date().toISOString()
        })
            .eq('id', chapterId)
            .select()
            .single();
        if (updateError)
            throw updateError;
        res.json({ chapter: updatedChapter });
    }
    catch (error) {
        console.error('Error revising chapter:', error);
        res.status(500).json({ error: error.message || 'Failed to revise chapter' });
    }
};
exports.reviseChapter = reviseChapter;
