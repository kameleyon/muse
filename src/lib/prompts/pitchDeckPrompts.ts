// src/lib/prompts/pitchDeckPrompts.ts

// Define the slide structure type separately for better type safety
interface SlideInfo {
  id: string;
  title: string;
  type: string;
  description?: string;
  customPrompt?: string;
  includeVisual?: boolean;
  visualType?: 'chart' | 'diagram' | 'table' | 'infographic';
}

// Comprehensive ProjectInfo interface to structure all input data
interface ProjectInfo {
  // Step 1: Project Setup Data
  projectId: string;
  projectName: string;
  pitchDeckType: string; // e.g., 'investment', 'sales'
  description?: string;
  tags?: string[];
  teamMembers?: string[];
  privacy?: 'private' | 'team' | 'public';
  
  // Step 2: Audience & Requirements Data
  audience?: {
    name: string; // Client/Audience name
    orgType: string; // Organization type (corporation, startup, nonprofit, etc.)
    industry: string; // Industry (SaaS, E-commerce, Fintech, etc.)
    size: 'Small' | 'Medium' | 'Enterprise'; // Company size
    personaRole?: string; // Decision-maker role/title
    personaConcerns?: string[]; // Primary concerns
    personaCriteria?: string[]; // Decision criteria
    personaCommPrefs?: string[]; // Communication preferences
  };
  
  // Step 3: Design & Structure Data
  design?: {
    templateId?: string; // Selected template ID
    brandLogo?: string; // Logo URL or base64
    primaryColor?: string; // Primary brand color
    secondaryColor?: string; // Secondary brand color
    accentColor?: string; // Accent color
    headingFont?: string; // Heading font
    bodyFont?: string; // Body font
    complexityLevel?: 'basic' | 'intermediate' | 'advanced'; // Content complexity
  };
  
  // Slide structure data (from Step 3)
  slideStructure?: SlideInfo[];
  
  // Generation Options (Step 4)
  generationOptions?: {
    factCheckLevel: 'basic' | 'standard' | 'thorough';
    visualsEnabled: boolean;
    contentTone?: 'formal' | 'conversational' | 'persuasive';
  };
}

/**
 * Generates a prompt for the research model to gather background information,
 * market data, and competitor insights with appropriate factual depth.
 */
export const createResearchPrompt = (info: ProjectInfo): string => {
  // Extract fact-check level for research depth
  const factCheckLevel = info.generationOptions?.factCheckLevel || 'standard';
  
  // Basic project info prompt
  let prompt = `Gather comprehensive background information for creating a ${info.pitchDeckType} pitch deck for a project named "${info.projectName}".`;
  
  // Add project description
  if (info.description) {
    prompt += ` The project is described as: ${info.description}.`;
  }
  
  // Add tags for context
  if (info.tags && info.tags.length > 0) {
    prompt += ` Key themes/tags associated with the project are: ${info.tags.join(', ')}.`;
  }
  
  // Add audience information from Step 2
  if (info.audience) {
    prompt += `\n\nTarget Audience Information:`;
    prompt += `\n- Organization: ${info.audience.name || 'Not specified'}`;
    prompt += `\n- Organization Type: ${info.audience.orgType || 'Not specified'}`;
    prompt += `\n- Industry: ${info.audience.industry || 'Not specified'}`;
    prompt += `\n- Size: ${info.audience.size || 'Not specified'}`;
    
    // Add decision-maker persona if available
    if (info.audience.personaRole) {
      prompt += `\n\nDecision-Maker Persona:`;
      prompt += `\n- Role/Title: ${info.audience.personaRole}`;
      
      if (info.audience.personaConcerns && info.audience.personaConcerns.length > 0) {
        prompt += `\n- Primary Concerns: ${info.audience.personaConcerns.join(', ')}`;
      }
      
      if (info.audience.personaCriteria && info.audience.personaCriteria.length > 0) {
        prompt += `\n- Decision Criteria: ${info.audience.personaCriteria.join(', ')}`;
      }
      
      if (info.audience.personaCommPrefs && info.audience.personaCommPrefs.length > 0) {
        prompt += `\n- Communication Preferences: ${info.audience.personaCommPrefs.join(', ')}`;
      }
    }
  }
  
  // Add specifics based on pitch deck type
  if (info.pitchDeckType === 'investment' || info.pitchDeckType === 'startup') {
    prompt += `\n\nFocus on market size, growth trends, funding environments, key competitors, investment benchmarks, and target audience validation for this type of project/product.`;
    prompt += `\nFor an investment pitch, especially look for statistics on similar companies' valuations, ROI figures, market adoption rates, and success stories.`;
  } else if (info.pitchDeckType === 'sales') {
    prompt += `\n\nFocus on typical client pain points this product/service might solve, common objections, relevant industry case studies, competitor positioning, pricing models, and ROI metrics.`;
    prompt += `\nFor a sales pitch, especially look for conversion metrics, implementation timelines, cost-benefit analyses, and testimonials from similar companies.`;
  } else if (info.pitchDeckType === 'partnership') {
    prompt += `\n\nFocus on synergy opportunities, mutual benefits, complementary strengths, case studies of successful partnerships in the industry, and strategic fit analyses.`;
    prompt += `\nFor a partnership pitch, especially look for examples of successful collaborations, integration points, and shared value creation models.`;
  } else {
    prompt += `\n\nFocus on general industry context, potential stakeholders, relevant market data, and common success factors for projects of this nature.`;
  }
  
  // Adjust research depth based on fact-check level
  if (factCheckLevel === 'thorough') {
    prompt += `\n\nConducting THOROUGH research is critical. Please:
    - Search for multiple reliable and recent sources for each data point
    - Prioritize peer-reviewed studies, official statistics, and industry reports
    - Cross-reference data from multiple sources when possible
    - Include specific source citations for all major claims and statistics
    - Seek contradicting viewpoints and alternative perspectives
    - Analyze historical trends alongside current data
    - Provide confidence levels for projections and estimates (high/medium/low)`;
  } else if (factCheckLevel === 'basic') {
    prompt += `\n\nConducting ESSENTIAL research is needed. Please:
    - Find reliable sources for key data points
    - Focus on the most important market statistics and competitor information
    - Provide general sources for major claims
    - Prioritize speed while ensuring accuracy on critical facts`;
  } else { // standard
    prompt += `\n\nConducting STANDARD research is required. Please:
    - Use reliable sources for all significant data points
    - Include source citations for important claims and statistics
    - Balance depth with efficiency, focusing on most relevant information
    - Validate key assumptions and market claims`;
  }
  
  // Add visual data gathering instructions if visuals are enabled
  if (info.generationOptions?.visualsEnabled !== false) {
    prompt += `\n\nPlease also gather data suitable for visual representations in the pitch deck:
    - Key market statistics that could be presented in charts/graphs
    - Competitive landscape data that could be visualized in a 2x2 matrix or comparison table
    - Timeline information that could be represented in a roadmap
    - Product/service feature information that could be shown in an infographic
    - Financial/ROI data that could be displayed in tables or charts`;
  }
  
  // Add detailed research structure request
  prompt += `\n\nProvide structured information covering:
1. Market Overview: Size, growth rate, key trends, and future projections.
2. Target Audience Insights: Demographics, needs, pain points, and buying behaviors.
3. Competitive Landscape: Key players, their strengths/weaknesses, market share, and positioning strategy.
4. Relevant Statistics/Data Points: Key numbers to support claims, including source citations.
5. Potential Challenges/Risks: Common hurdles in this market/industry and how companies typically address them.
6. Success Factors: What differentiates successful companies in this space.
7. Industry-Specific Considerations: Regulations, technological trends, or other factors specific to this industry.

Format the output clearly using Markdown with appropriate headings, bullet points, and emphasis for key data points.`;

  return prompt;
};

/**
 * Creates a prompt for generating content for a specific slide
 */
export const createSlideContentPrompt = (
  slideInfo: SlideInfo,
  slideIndex: number,
  totalSlides: number,
  projectInfo: ProjectInfo,
  researchData: string,
  previousSlidesContent?: string[]
): string => {
  // Basic slide prompt with context
  let prompt = `Generate content for slide ${slideIndex} of ${totalSlides} in a ${projectInfo.pitchDeckType} pitch deck for "${projectInfo.projectName}". `;
  prompt += `This slide is the "${slideInfo.title}" slide (type: ${slideInfo.type}).`;
  
  // Add slide description if available
  if (slideInfo.description) {
    prompt += `\n\nSlide description: ${slideInfo.description}`;
  }
  
  // Add custom prompt if provided
  if (slideInfo.customPrompt) {
    prompt += `\n\nCustom instructions for this slide: ${slideInfo.customPrompt}`;
  }
  
  // Add audience-specific context
  if (projectInfo.audience) {
    prompt += `\n\nTarget audience: ${JSON.stringify(projectInfo.audience, null, 2)}`;
    
    // Add audience-specific considerations for key slides
    if (['problem', 'solution', 'value_proposition', 'call_to_action'].includes(slideInfo.type)) {
      prompt += `\n\nFor this "${slideInfo.type}" slide, address the specific concerns and criteria of the target audience.`;
      
      if (projectInfo.audience.personaConcerns && projectInfo.audience.personaConcerns.length > 0) {
        prompt += ` Focus on their key concerns: ${projectInfo.audience.personaConcerns.join(', ')}.`;
      }
      
      if (projectInfo.audience.personaCriteria && projectInfo.audience.personaCriteria.length > 0) {
        prompt += ` Address their decision criteria: ${projectInfo.audience.personaCriteria.join(', ')}.`;
      }
    }
  }
  
  // Add complexity-based instructions
  if (projectInfo.design?.complexityLevel) {
    prompt += `\n\nContent complexity level: ${projectInfo.design.complexityLevel.toUpperCase()}`;
    
    switch (projectInfo.design.complexityLevel) {
      case 'basic':
        prompt += `\n- Keep content simple and accessible
- Focus on 1-3 key points only
- Use straightforward language
- Avoid jargon and technical terms
- Limit text to essential information
- Content should be scannable in under 10 seconds`;
        break;
      case 'intermediate':
        prompt += `\n- Balance detail with accessibility
- Provide moderate supporting evidence
- Include some industry-specific terminology with brief explanations
- Use supporting statistics where relevant
- Maintain clarity while adding nuance
- Content should be digestible in about 20 seconds`;
        break;
      case 'advanced':
        prompt += `\n- Provide comprehensive details and nuance
- Include substantial supporting evidence and data points
- Use appropriate industry terminology
- Explore deeper implications and connections
- Include expert-level insights
- Can contain more detailed information requiring up to 30 seconds to digest`;
        break;
    }
  }
  
  // Add visual instructions if applicable
  if (slideInfo.includeVisual || slideInfo.visualType) {
    prompt += `\n\nThis slide should include visual content of type: ${slideInfo.visualType || 'appropriate for the content'}.`;
    prompt += `\nProvide specific data and descriptions that should be visualized, formatted as: 
\`\`\`visual-data
[Detailed description of what should be visualized and how]
[Include actual data points, labels, and relationships to be shown]
\`\`\``;
  }
  
  // Add content tone instructions based on generation options
  if (projectInfo.generationOptions?.contentTone) {
    prompt += `\n\nContent tone should be: ${projectInfo.generationOptions.contentTone.toUpperCase()}`;
    switch (projectInfo.generationOptions.contentTone) {
      case 'formal':
        prompt += ` - professional, precise, and authoritative language appropriate for executive-level audiences.`;
        break;
      case 'conversational':
        prompt += ` - friendly, relatable, and approachable while maintaining professionalism.`;
        break;
      case 'persuasive':
        prompt += ` - compelling, action-oriented, and emotionally engaging to drive decision-making.`;
        break;
    }
  }
  
  // Add branding instructions
  if (projectInfo.design) {
    prompt += `\n\nBranding guidelines:`;
    prompt += `\n- Consistently refer to the project as "${projectInfo.projectName}"`;
    prompt += `\n- ${projectInfo.design.primaryColor ? `Use primary brand color (${projectInfo.design.primaryColor}) for key elements` : ''}`;
    prompt += `\n- ${projectInfo.design.secondaryColor ? `Use secondary brand color (${projectInfo.design.secondaryColor}) for supporting elements` : ''}`;
    prompt += `\n- ${projectInfo.design.headingFont ? `Headings should appear in ${projectInfo.design.headingFont} font` : ''}`;
    prompt += `\n- ${projectInfo.design.bodyFont ? `Body text should appear in ${projectInfo.design.bodyFont} font` : ''}`;
  }
  
  // Add context from previous slides if available
  if (previousSlidesContent && previousSlidesContent.length > 0) {
    prompt += `\n\nEnsure this slide builds cohesively on previous content. The most recent slide contained: "${previousSlidesContent[previousSlidesContent.length - 1].substring(0, 300)}..."`;
  }
  
  // Add slide-specific instructions based on type
  prompt += getSlideTypeSpecificInstructions(slideInfo.type);
  
  // Add research data context
  prompt += `\n\nUse the following research data to inform the content:\n${researchData}`;
  
  // Add output formatting instructions
  prompt += `\n\nFormat the output as clean Markdown suited for a presentation slide. Include:
- A clear slide title (use # for heading)
- Concise bullet points (use * for bullets)
- Bold text for key points (use ** for bold)
- If data visualization is needed, indicate clearly what should be visualized

Keep text minimal and impactful - pitch decks should not be text-heavy. Focus on the 2-3 most important points for this slide type.`;

  return prompt;
};

/**
 * Helper function to get slide-specific instructions based on slide type
 */
function getSlideTypeSpecificInstructions(slideType: string): string {
  switch (slideType) {
    case 'title':
    case 'cover':
      return `\n\nFor a TITLE/COVER slide:
- Create a compelling, concise title that captures the essence of the pitch
- Include a powerful subtitle or tagline (if appropriate)
- Keep text minimal - this is a visual anchor for the presentation
- May include presenter name, company, and date if relevant`;
      
    case 'problem':
    case 'pain_point':
      return `\n\nFor a PROBLEM/PAIN POINT slide:
- Clearly articulate the problem being solved
- Use statistics or examples to demonstrate the problem's significance
- Focus on the audience's perspective and how the problem affects them
- Make the problem relatable and emotionally resonant
- If applicable, highlight the cost of inaction or staying with status quo`;
      
    case 'solution':
      return `\n\nFor a SOLUTION slide:
- Present your solution clearly and concisely
- Focus on how it addresses the previously stated problem
- Highlight 2-3 key benefits or features that directly solve the pain points
- Avoid technical jargon unless absolutely necessary for the audience
- Include a visual representation of the solution if possible`;
      
    case 'value_proposition':
      return `\n\nFor a VALUE PROPOSITION slide:
- Articulate a clear, compelling statement of the unique value offered
- Explain why this solution is different/better than alternatives
- Quantify benefits when possible (e.g., saves 40% of time, increases ROI by 2x)
- Focus on outcomes rather than features
- Connect directly to audience pain points and decision criteria`;
      
    case 'market':
    case 'market_analysis':
      return `\n\nFor a MARKET ANALYSIS slide:
- Include key market size figures (TAM, SAM, SOM if applicable)
- Highlight market growth rate and trends
- Identify key market segments and their characteristics
- Include visual representation of market data (chart/graph)
- Keep focus on the opportunity and why this market matters`;
      
    case 'competition':
    case 'competitive_landscape':
      return `\n\nFor a COMPETITIVE LANDSCAPE slide:
- Identify key competitors in the market
- Highlight your differentiators and comparative advantages
- Use a competitive matrix or positioning map if possible
- Be honest but highlight your strengths against weaknesses of competitors
- Avoid disparaging competitors - stay factual and professional`;
      
    case 'product':
    case 'product_details':
      return `\n\nFor a PRODUCT/SERVICE DETAILS slide:
- Focus on key features that solve the stated problem
- Highlight unique aspects and competitive advantages
- Use visual representation of the product/service if possible
- Connect features to benefits and outcomes
- Keep technical details appropriate to audience knowledge level`;
      
    case 'business_model':
      return `\n\nFor a BUSINESS MODEL slide:
- Clearly explain how the business makes money
- Include pricing strategy if appropriate
- Highlight revenue streams and cost structure
- Show path to profitability if applicable
- Use visual representation of the business model if possible`;
      
    case 'traction':
    case 'validation':
      return `\n\nFor a TRACTION/VALIDATION slide:
- Highlight key metrics and milestones achieved
- Include customer testimonials or case studies if available
- Show growth trends using visual charts if possible
- Focus on metrics that matter most to this audience type
- Demonstrate market validation and proof of concept`;
      
    case 'team':
      return `\n\nFor a TEAM slide:
- Focus on key team members and their relevant experience
- Highlight expertise directly related to solving the stated problem
- Include accomplishments that build credibility
- Keep bios very brief - focus on why this team can execute
- Include advisors or board members if relevant to establishing credibility`;
      
    case 'financials':
    case 'financial_projections':
      return `\n\nFor a FINANCIALS slide:
- Include key financial projections (revenue, expenses, profitability)
- Show growth trajectory and key financial milestones
- Include clear timeline for projections
- Highlight key assumptions underlying projections
- Use visual charts to represent financial data
- Keep details appropriate to audience (more for investors, less for partners)`;
      
    case 'roadmap':
    case 'timeline':
      return `\n\nFor a ROADMAP/TIMELINE slide:
- Show clear timeline with key milestones
- Include past achievements and future goals
- Focus on strategic priorities rather than feature lists
- Use visual timeline representation
- Demonstrate thoughtful planning and realistic execution timeline`;
      
    case 'investment':
    case 'ask':
      return `\n\nFor an INVESTMENT/ASK slide:
- Clearly state what you're asking for (funding amount, partnership terms, etc.)
- Explain how the resources will be used
- Show potential returns or benefits to the audience
- Include timeline for use of resources
- Be specific and confident in your ask`;
      
    case 'call_to_action':
    case 'closing':
      return `\n\nFor a CALL TO ACTION/CLOSING slide:
- Include a clear, compelling next step for the audience
- Restate the core value proposition
- Create a sense of urgency or opportunity
- Include contact information or specific action instructions
- End with a memorable statement or reinforcement of key message`;
      
    default:
      return `\n\nFor this ${slideType.toUpperCase()} slide:
- Include relevant, concise content appropriate for this slide type
- Focus on 2-3 key points maximum
- Use visual elements if appropriate
- Ensure the content connects to the overall pitch narrative
- Tailor information to the needs and interests of the target audience`;
  }
}

/**
 * Generates a prompt for the content model using the research findings
 * to create the actual pitch deck content for all slides.
 */
export const createPitchDeckContentPrompt = (info: ProjectInfo, researchData: string): string => {
  // Basic prompt with project info
  let prompt = `Based on the following research data and project information, generate the content for a ${info.pitchDeckType} pitch deck for "${info.projectName}".

Project Name: ${info.projectName}
Pitch Deck Type: ${info.pitchDeckType}
${info.description ? `Project Description: ${info.description}\n` : ''}
${info.tags && info.tags.length > 0 ? `Project Tags: ${info.tags.join(', ')}\n` : ''}`;

  // Add audience information
  if (info.audience) {
    prompt += `\nTarget Audience Information:
Organization: ${info.audience.name || 'Not specified'}
Organization Type: ${info.audience.orgType || 'Not specified'}
Industry: ${info.audience.industry || 'Not specified'}
Size: ${info.audience.size || 'Not specified'}`;

    // Add decision-maker persona if available
    if (info.audience.personaRole) {
      prompt += `\nDecision-Maker Persona:
Role/Title: ${info.audience.personaRole}
${info.audience.personaConcerns && info.audience.personaConcerns.length > 0 ? `Primary Concerns: ${info.audience.personaConcerns.join(', ')}` : ''}
${info.audience.personaCriteria && info.audience.personaCriteria.length > 0 ? `Decision Criteria: ${info.audience.personaCriteria.join(', ')}` : ''}
${info.audience.personaCommPrefs && info.audience.personaCommPrefs.length > 0 ? `Communication Preferences: ${info.audience.personaCommPrefs.join(', ')}` : ''}`;
    }
  }

  // Add design information
  if (info.design) {
    prompt += `\nDesign Information:
Template: ${info.design.templateId || 'Default'}
Primary Color: ${info.design.primaryColor || 'Not specified'}
Secondary Color: ${info.design.secondaryColor || 'Not specified'}
Accent Color: ${info.design.accentColor || 'Not specified'}
Heading Font: ${info.design.headingFont || 'Not specified'}
Body Font: ${info.design.bodyFont || 'Not specified'}
Content Complexity: ${info.design.complexityLevel || 'Intermediate'}`;
  }

  // Add generation options
  if (info.generationOptions) {
    prompt += `\nGeneration Options:
Fact-Check Level: ${info.generationOptions.factCheckLevel || 'Standard'}
Visuals Enabled: ${info.generationOptions.visualsEnabled !== false ? 'Yes' : 'No'}
Content Tone: ${info.generationOptions.contentTone || 'Professional'}`;
  }

  // Add research data
  prompt += `\n\nResearch Data:
---
${researchData}
---`;

  // Add slide structure information
  if (info.slideStructure && info.slideStructure.length > 0) {
    prompt += `\n\nGenerate content for the following ${info.slideStructure.length} slides based on the provided structure:`;
    info.slideStructure.forEach((slide, index) => {
      prompt += `\n${index + 1}. ${slide.title} (${slide.type})${slide.description ? `: ${slide.description}` : ''}`;
    });
  } else {
    // Default slide structure if none provided
    prompt += `\n\nGenerate content for the following standard pitch deck sections (adapt as needed for a ${info.pitchDeckType} type):
1. Cover/Title Slide (Include project name, tagline if possible)
2. Problem/Opportunity
3. Solution Overview
4. Value Proposition
5. Market Analysis (Use research data)
6. Business Model (If applicable)
7. Product/Service Details
8. Competitive Landscape (Use research data)
9. Team Introduction (Placeholder if no team info provided)
10. Timeline/Roadmap (Placeholder)
11. Financial Projections (Placeholder or based on objective)
12. Call to Action`;
  }

  // Add complexity-based instructions
  if (info.design?.complexityLevel) {
    prompt += `\n\nContent Complexity Guidelines:`;
    switch (info.design.complexityLevel) {
      case 'basic':
        prompt += `
- Keep content simple and accessible
- Focus on key points only
- Use straightforward language
- Limit jargon and technical terms
- Create approximately 10-15 slides total with minimal text per slide`;
        break;
      case 'intermediate':
        prompt += `
- Balance detail with accessibility
- Provide moderate supporting evidence
- Include some industry-specific terminology
- Add brief explanations for complex concepts
- Create approximately 15-20 slides total with balanced text and visuals`;
        break;
      case 'advanced':
        prompt += `
- Provide comprehensive details and nuance
- Include substantial supporting evidence
- Use appropriate industry terminology
- Explore deeper implications and connections
- Create approximately 20-25 slides total with more detailed content`;
        break;
      default:
        prompt += `
- Balance detail with accessibility
- Provide moderate supporting evidence`;
    }
  }

  // Visual generation instructions
  if (info.generationOptions?.visualsEnabled !== false) {
    prompt += `\n\nVisual Content Instructions:
- For Market Analysis slides: Include data for charts/graphs showing market size, growth trends, or segmentation
- For Competitive Landscape slides: Include data for comparison tables or positioning matrices
- For Financial slides: Include data for projections charts or ROI tables
- For Product/Feature slides: Include data for infographics or feature highlight visuals
- For Timeline/Roadmap slides: Include data for visual timeline representations

For each visual element, provide data in this format:
\`\`\`visual-data
[VISUAL TYPE: chart/table/diagram/infographic]
[TITLE: Visual element title]
[DATA: Actual data points, labels, relationships to show]
[NOTES: Any additional information about visualization]
\`\`\``;
  }

  // Add tone instructions based on generation options
  if (info.generationOptions?.contentTone) {
    prompt += `\n\nContent Tone Instructions:`;
    switch (info.generationOptions.contentTone) {
      case 'formal':
        prompt += `
- Use professional, precise language throughout
- Maintain an authoritative tone appropriate for executive-level audiences
- Prioritize clarity and factual presentation
- Use industry-standard terminology appropriate for the audience
- Minimize colloquialisms and casual expressions`;
        break;
      case 'conversational':
        prompt += `
- Use a friendly, approachable tone while maintaining professionalism
- Include occasional rhetorical questions to engage the audience
- Use "you" and "your" language to directly address the audience
- Make complex concepts relatable through everyday analogies
- Balance warmth with credibility`;
        break;
      case 'persuasive':
        prompt += `
- Use compelling, action-oriented language throughout
- Include emotional appeals that resonate with the audience's concerns
- Emphasize benefits and outcomes over features
- Create a sense of urgency and opportunity
- Use powerful verbs and impactful statements
- Include strategic calls-to-action throughout`;
        break;
    }
  }

  // Formatting instructions
  prompt += `\n\nOutput Format Instructions:
- Structure the output clearly using Markdown
- Use headings for slide titles (e.g., '## Problem/Opportunity')
- Use bullet points for key points
- Bold important text or statistics
- For each slide, include:
  1. A clear slide title/heading
  2. Concise content appropriate for the slide type
  3. Visual data suggestions in the format specified above (if applicable)
  4. Notes on any special formatting or emphasis needed

Ensure the content is cohesive across all slides, with a clear narrative flow from the problem through to the call to action.`;

  return prompt;
};

/**
 * Generates a prompt for creating visual elements for specific slides
 */
export const createVisualGenerationPrompt = (
  slideInfo: SlideInfo,
  slideContent: string,
  projectInfo: ProjectInfo,
  visualType?: 'chart' | 'diagram' | 'table' | 'infographic'
): string => {
  // Determine visual type if not provided
  const determinedVisualType = visualType || slideInfo.visualType || determineAppropriateVisualType(slideInfo.type);
  
  // Basic prompt
  let prompt = `Generate a ${determinedVisualType} for the "${slideInfo.title}" slide (type: ${slideInfo.type}) in a ${projectInfo.pitchDeckType} pitch deck.`;
  
  // Add content context
  prompt += `\n\nThe slide content is:\n${slideContent}`;
  
  // Add branding instructions
  if (projectInfo.design) {
    prompt += `\n\nUse the following brand colors in the visualization:`;
    prompt += `\n- Primary Color: ${projectInfo.design.primaryColor || 'Not specified'}`;
    prompt += `\n- Secondary Color: ${projectInfo.design.secondaryColor || 'Not specified'}`;
    prompt += `\n- Accent Color: ${projectInfo.design.accentColor || 'Not specified'}`;
  }
  
  // Add specific instructions based on visual type
  switch (determinedVisualType) {
    case 'chart':
      prompt += `\n\nChart Generation Instructions:
- Determine the most appropriate chart type (bar, line, pie, etc.) based on the data
- Include a clear title and axis labels
- Keep the design clean and minimalist
- Use the brand colors appropriately
- Focus on highlighting the most important data points
- Include a legend if multiple data series are present`;
      break;
      
    case 'diagram':
      prompt += `\n\nDiagram Generation Instructions:
- Create a clear, intuitive diagram that illustrates the relationships or processes
- Use appropriate shapes and connectors to show flow or hierarchy
- Label all elements clearly
- Use the brand colors appropriately
- Keep text minimal and focused on key points
- Ensure the diagram is immediately understandable`;
      break;
      
    case 'table':
      prompt += `\n\nTable Generation Instructions:
- Create a clean, well-organized table with clear headers
- Highlight key data points or rows/columns as appropriate
- Use the brand colors for headers and highlights
- Keep content concise - tables should be scannable
- Include only the most relevant data points
- Use appropriate formatting for numbers (%, $, etc.)`;
      break;
      
    case 'infographic':
      prompt += `\n\nInfographic Generation Instructions:
- Create a visually engaging representation of the key information
- Use icons, shapes, and minimal text to convey concepts
- Organize information in a logical flow
- Use the brand colors appropriately
- Highlight 3-5 key points or statistics maximum
- Keep the design clean and professional`;
      break;
  }
  
  // Add slide-specific visual instructions
  prompt += getVisualInstructionsForSlideType(slideInfo.type, determinedVisualType);
  
  // Output format instructions
  prompt += `\n\nProvide the output in the following format:
\`\`\`visual-specification
Type: ${determinedVisualType}
Title: [Clear title for the visual]
Data: [Structured data points and relationships]
Elements: [Key elements to include]
Layout: [Description of layout and organization]
Color Usage: [How to apply the brand colors]
\`\`\``;

  return prompt;
};

/**
 * Determines the appropriate visual type based on slide type
 */
function determineAppropriateVisualType(slideType: string): 'chart' | 'diagram' | 'table' | 'infographic' {
  switch (slideType) {
    case 'market':
    case 'market_analysis':
    case 'traction':
    case 'financials':
      return 'chart';
      
    case 'process':
    case 'business_model':
    case 'solution':
    case 'roadmap':
    case 'timeline':
      return 'diagram';
      
    case 'competition':
    case 'competitive_landscape':
    case 'team':
      return 'table';
      
    case 'problem':
    case 'value_proposition':
    case 'product':
    case 'product_details':
    default:
      return 'infographic';
  }
}

/**
 * Gets specific visual instructions based on slide type
 */
function getVisualInstructionsForSlideType(slideType: string, visualType: string): string {
  switch (slideType) {
    case 'market':
    case 'market_analysis':
      return `\n\nFor Market Analysis visuals:
- Prioritize showing market size, growth rate, and segmentation
- Consider using pie charts for market share, bar charts for comparison, or line charts for trends
- Highlight the specific segment you're targeting within the total market
- Include 2-3 key statistics that support your market opportunity`;
      
    case 'competitive_landscape':
    case 'competition':
      return `\n\nFor Competitive Landscape visuals:
- If using a table: Create a feature/benefit comparison table highlighting your advantages
- If using a diagram: Consider a 2x2 positioning matrix showing competitors by key variables
- Clearly show your differentiators and positioning
- Use color to highlight your company's position or advantages`;
      
    case 'financials':
    case 'financial_projections':
      return `\n\nFor Financial visuals:
- Show revenue, expense, and profit projections over time
- Consider including key metrics like CAC, LTV, or burn rate if relevant
- Use bar or line charts for projections over time
- Highlight break-even point and key financial milestones
- Keep detailed numbers minimal - focus on trends and key figures`;
      
    case 'roadmap':
    case 'timeline':
      return `\n\nFor Roadmap/Timeline visuals:
- Create a clear timeline showing past achievements and future milestones
- Organize by quarters or appropriate time periods
- Group milestones by category if applicable (product, market, team, etc.)
- Use color coding to distinguish between different types of milestones
- Highlight current position on the timeline`;
      
    case 'product':
    case 'product_details':
      return `\n\nFor Product/Service visuals:
- Create a visual representation of key features or benefits
- Use icons or simple illustrations to represent each feature
- Organize in a logical hierarchy or process flow
- Highlight the 3-5 most important aspects of the product/service
- Connect features to benefits where possible`;
      
    case 'solution':
      return `\n\nFor Solution visuals:
- Illustrate how your solution addresses the problem
- Consider a before/after comparison if applicable
- Show the process or mechanism of your solution
- Use simple, intuitive visual elements
- Focus on the outcome or benefit provided`;
      
    case 'business_model':
      return `\n\nFor Business Model visuals:
- Visualize how you generate revenue and deliver value
- Show key relationships between stakeholders
- Illustrate revenue streams and cost structure
- Use a flow diagram to show how value is created and captured
- Highlight the most innovative or profitable aspects`;
      
    default:
      return `\n\nFor this slide type:
- Create a clear, professional visual that enhances understanding
- Focus on the 2-3 most important pieces of information
- Keep the design clean and aligned with the presentation style
- Ensure the visual adds value beyond what text alone would provide`;
  }
}