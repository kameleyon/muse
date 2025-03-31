// src/lib/prompts/pitchDeckPrompts.tsx

import * as React from 'react';
import { useState, useEffect, useRef, ReactNode } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title as ChartTitle, Tooltip, Legend } from 'chart.js';
import { Bar as BarChart } from 'react-chartjs-2';

// Register Chart.js components (this is required once in your app’s lifecycle)
ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTitle, Tooltip, Legend);

/** 
 * SlideInfo interface (same as your original but we won't SHOW title in the prompt).
 * We'll still keep the data structure for internal usage if needed.
 */
export interface SlideInfo {
  id: string;
  title: string;          // We'll store it, but not display it in the prompt
  type: string;
  description?: string;
  customPrompt?: string;
  includeVisual?: boolean;
  visualType?: 'chart' | 'diagram' | 'table' | 'infographic';
}

/**
 * ProjectInfo interface (same as your original).
 */
export interface ProjectInfo {
  projectId: string;
  projectName: string;
  pitchDeckType: string;
  description?: string;
  tags?: string[];
  teamMembers?: string[];
  privacy?: 'private' | 'team' | 'public';

  audience?: {
    name: string;
    orgType: string;
    industry: string;
    size: 'Small' | 'Medium' | 'Enterprise';
    personaRole?: string;
    personaConcerns?: string[];
    personaCriteria?: string[];
    personaCommPrefs?: string[];
  };

  design?: {
    templateId?: string;
    brandLogo?: string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    headingFont?: string;
    bodyFont?: string;
    complexityLevel?: 'basic' | 'intermediate' | 'advanced';
  };

  slideStructure?: SlideInfo[];

  generationOptions?: {
    factCheckLevel: 'basic' | 'standard' | 'thorough';
    visualsEnabled: boolean;
    contentTone?: 'formal' | 'conversational' | 'persuasive';
  };
}

/**
 * (1) PROMPT GENERATION FUNCTIONS
 * Below we keep your original logic for creating prompts,
 * but we ensure we do NOT use slide.title in the strings.
 */

/** 
 * Gathers comprehensive background info for the pitch deck.
 */
export const createResearchPrompt = (info: ProjectInfo): string => {
  const factCheckLevel = info.generationOptions?.factCheckLevel || 'standard';

  let promptText = `Gather comprehensive background information for creating a ${info.pitchDeckType} pitch deck for a project named "${info.projectName}".`;

  if (info.description) {
    promptText += ` The project is described as: ${info.description}.`;
  }

  if (info.tags && info.tags.length > 0) {
    promptText += ` Key themes/tags associated with the project are: ${info.tags.join(', ')}.`;
  }

  // Audience
  if (info.audience) {
    promptText += `\n\nTarget Audience Information:`;
    promptText += `\n- Organization: ${info.audience.name || 'Not specified'}`;
    promptText += `\n- Organization Type: ${info.audience.orgType || 'Not specified'}`;
    promptText += `\n- Industry: ${info.audience.industry || 'Not specified'}`;
    promptText += `\n- Size: ${info.audience.size || 'Not specified'}`;

    if (info.audience.personaRole) {
      promptText += `\n\nDecision-Maker Persona:`;
      promptText += `\n- Role/Title: ${info.audience.personaRole}`;
      if (info.audience.personaConcerns && info.audience.personaConcerns.length > 0) {
        promptText += `\n- Primary Concerns: ${info.audience.personaConcerns.join(', ')}`;
      }
      if (info.audience.personaCriteria && info.audience.personaCriteria.length > 0) {
        promptText += `\n- Decision Criteria: ${info.audience.personaCriteria.join(', ')}`;
      }
      if (info.audience.personaCommPrefs && info.audience.personaCommPrefs.length > 0) {
        promptText += `\n- Communication Preferences: ${info.audience.personaCommPrefs.join(', ')}`;
      }
    }
  }

  // Deck-type specifics
  if (info.pitchDeckType === 'investment' || info.pitchDeckType === 'startup') {
    promptText += `\n\nFocus on market size, growth trends, funding environments, key competitors, investment benchmarks, and target audience validation.`;
    promptText += `\nInclude statistics on valuations, ROI figures, adoption rates, and success stories.`;
  } else if (info.pitchDeckType === 'sales') {
    promptText += `\n\nFocus on typical client pain points, common objections, competitor positioning, pricing models, and ROI metrics.`;
    promptText += `\nLook for conversion metrics, implementation timelines, cost-benefit analyses, and testimonials.`;
  } else if (info.pitchDeckType === 'partnership') {
    promptText += `\n\nFocus on synergy opportunities, mutual benefits, complementary strengths, successful case studies, and fit analyses.`;
    promptText += `\nLook for examples of successful collaborations, integration points, and shared value creation models.`;
  } else {
    promptText += `\n\nFocus on general industry context, potential stakeholders, relevant market data, and common success factors.`;
  }

  // Fact-check
  if (factCheckLevel === 'thorough') {
    promptText += `\n\nTHOROUGH research required. Please:
    - Search multiple reliable, recent sources 
    - Cross-reference data 
    - Include specific source citations for major claims 
    - Seek contradicting viewpoints 
    - Provide confidence levels for projections.`;
  } else if (factCheckLevel === 'basic') {
    promptText += `\n\nESSENTIAL research needed. Please:
    - Find reliable sources for key data 
    - Focus on most important statistics and competitor info 
    - Provide general sources 
    - Prioritize speed while ensuring accuracy.`;
  } else {
    promptText += `\n\nSTANDARD research required. Please:
    - Use reliable sources for all significant data 
    - Include source citations for important claims 
    - Validate key assumptions 
    - Balance depth with efficiency.`;
  }

  // Visual instructions
  if (info.generationOptions?.visualsEnabled !== false) {
    promptText += `\n\nAlso gather data suitable for visual representations:
    - Key market stats for charts/graphs
    - Competitive landscape data for a matrix or table
    - Timeline info for a roadmap
    - Product/service features for infographics
    - Financial/ROI data for tables or charts.`;
  }

  // Structured coverage
  promptText += `\n\nProvide structured information covering:
1. Market Overview
2. Target Audience Insights
3. Competitive Landscape
4. Relevant Statistics/Data Points (with citations)
5. Potential Challenges/Risks
6. Success Factors
7. Industry-Specific Considerations

Format the output clearly using Markdown with headings, bullet points, and emphasis.`;

  return promptText;
};

/** 
 * Creates a prompt for generating content for a specific slide
 * WITHOUT referencing the slide.title in the string.
 */
export const createSlideContentPrompt = (
  slideInfo: SlideInfo,
  projectInfo: ProjectInfo,
  researchData: string,
  previousSlidesContent?: string[]
): string => {
  // Basic approach: no mention of slide index or title
  let promptText = `Generate concise content for a ${projectInfo.pitchDeckType} pitch deck about "${projectInfo.projectName}".`;

  if (slideInfo.description) {
    promptText += `\n\nSlide description: ${slideInfo.description}`;
  }

  if (slideInfo.customPrompt) {
    promptText += `\n\nCustom instructions: ${slideInfo.customPrompt}`;
  }

  // Audience context
  if (projectInfo.audience) {
    promptText += `\n\nTarget audience: ${JSON.stringify(projectInfo.audience, null, 2)}`;

    // If it's a "problem", "solution", etc., focus on concerns
    if (['problem', 'solution', 'value_proposition', 'call_to_action'].includes(slideInfo.type)) {
      promptText += `\nAddress the specific concerns/criteria of the target audience.`;
      if (projectInfo.audience.personaConcerns && projectInfo.audience.personaConcerns.length > 0) {
        promptText += ` Key concerns: ${projectInfo.audience.personaConcerns.join(', ')}.`;
      }
      if (projectInfo.audience.personaCriteria && projectInfo.audience.personaCriteria.length > 0) {
        promptText += ` Decision criteria: ${projectInfo.audience.personaCriteria.join(', ')}.`;
      }
    }
  }

  // Complexity
  if (projectInfo.design?.complexityLevel) {
    promptText += `\n\nContent complexity level: ${projectInfo.design.complexityLevel.toUpperCase()}`;
    switch (projectInfo.design.complexityLevel) {
      case 'basic':
        promptText += `\n- Keep content simple and accessible
- Focus on 1-3 key points
- Use plain language, minimal text
- Avoid jargon
- Scannable in 10s or less`;
        break;
      case 'intermediate':
        promptText += `\n- Balance detail with accessibility
- Provide moderate supporting evidence
- Use some industry terminology with brief explanations
- Include relevant statistics
- Scannable in ~20s`;
        break;
      case 'advanced':
        promptText += `\n- Provide comprehensive detail
- Include substantial supporting evidence
- Use appropriate industry terminology
- Explore deeper implications
- Up to ~30s to digest`;
        break;
    }
  }

  // Visual instruction
  if (slideInfo.includeVisual || slideInfo.visualType) {
    promptText += `\n\nThis content requires a visual (${slideInfo.visualType || 'best fit'}). Provide data or descriptions in:
\`\`\`visual-data
[What should be visualized and how? Include data points, labels, relationships]
\`\`\``;
  }

  // Tone
  if (projectInfo.generationOptions?.contentTone) {
    const tone = projectInfo.generationOptions.contentTone;
    promptText += `\n\nContent tone: ${tone.toUpperCase()} - `;
    switch (tone) {
      case 'formal':
        promptText += `professional, precise, authoritative.`;
        break;
      case 'conversational':
        promptText += `friendly, relatable, approachable.`;
        break;
      case 'persuasive':
        promptText += `action-oriented, emotionally engaging, motivational.`;
        break;
    }
  }

  // Branding
  if (projectInfo.design) {
    promptText += `\n\nBranding Guidelines:
- Always refer to project as "${projectInfo.projectName}"
- ${projectInfo.design.primaryColor ? `Primary color: ${projectInfo.design.primaryColor}` : ''}
- ${projectInfo.design.secondaryColor ? `Secondary color: ${projectInfo.design.secondaryColor}` : ''}
- ${projectInfo.design.headingFont ? `Heading font: ${projectInfo.design.headingFont}` : ''}
- ${projectInfo.design.bodyFont ? `Body font: ${projectInfo.design.bodyFont}` : ''}`;
  }

  // Previous slide content
  if (previousSlidesContent && previousSlidesContent.length > 0) {
    const lastSlide = previousSlidesContent[previousSlidesContent.length - 1];
    const snippet = lastSlide.substring(0, 200);
    promptText += `\n\nEnsure continuity with previous slide content: "${snippet}..."`;
  }

  // Slide-type specific instructions
  promptText += getSlideTypeSpecificInstructions(slideInfo.type);

  // Research data
  promptText += `\n\nIncorporate the following research data:\n${researchData}`;

  // Output format
  promptText += `\n\n**Format** as compact Markdown with:
- A short heading or subtitle
- A bullet list of key points (use "*")
- Bold important text (use "**")
- Minimal, impactful text (2-3 main points).
`;

  return promptText;
};

// Slide-type specific instructions
function getSlideTypeSpecificInstructions(slideType: string): string {
  // No references to the slide title here, just generic instructions
  switch (slideType) {
    case 'problem':
    case 'pain_point':
      return `\n\n(Problem) 
- Explain the critical issues faced 
- Provide data or anecdotes for impact 
- Emphasize urgency/need to solve.`;
    case 'solution':
      return `\n\n(Solution)
- Introduce core solution approach 
- Highlight 2-3 major benefits 
- Show how it addresses the stated problem.`;
    case 'value_proposition':
      return `\n\n(Value Proposition)
- Clearly state the unique value 
- Emphasize how it differs from existing options 
- Quantify benefits if possible (ROI, time saved, etc.).`;
    // ... other cases as needed ...
    default:
      return `\n\n(Generic Slide)
- Provide relevant, concise info 
- Focus on 2-3 key points 
- Use visuals where appropriate.`;
  }
}

/**
 * (2) A PROMPT FOR CREATING THE ENTIRE PITCH DECK IN ONE GO
 */
export const createPitchDeckContentPrompt = (info: ProjectInfo, researchData: string): string => {
  let prompt = `Generate content for a ${info.pitchDeckType} pitch deck about "${info.projectName}".\n`;
  if (info.description) prompt += `Description: ${info.description}\n`;
  if (info.tags) prompt += `Tags: ${info.tags.join(', ')}\n`;

  // Audience
  if (info.audience) {
    prompt += `\nAudience:
- Name: ${info.audience.name}
- Type: ${info.audience.orgType}
- Industry: ${info.audience.industry}
- Size: ${info.audience.size}
${info.audience.personaRole ? `- Persona Role: ${info.audience.personaRole}` : ''}`;
    // etc.
  }

  // Design
  if (info.design) {
    prompt += `\nDesign:
- Template: ${info.design.templateId || 'Default'}
- Colors: ${info.design.primaryColor}, ${info.design.secondaryColor}, ${info.design.accentColor}
- Fonts: ${info.design.headingFont}, ${info.design.bodyFont}
- Complexity: ${info.design.complexityLevel}`;
  }

  // Generation options
  if (info.generationOptions) {
    prompt += `\nOptions:
- FactCheck: ${info.generationOptions.factCheckLevel}
- Visuals: ${info.generationOptions.visualsEnabled ? 'Yes' : 'No'}
- Tone: ${info.generationOptions.contentTone}`;
  }

  // Research data
  prompt += `\n\nResearch Data:\n${researchData}\n`;

  // Slide structure
  if (info.slideStructure && info.slideStructure.length > 0) {
    prompt += `\nSlides:\n`;
    info.slideStructure.forEach((slide, i) => {
      prompt += `# Slide ${i + 1}: ${slide.description || '(no description)'}\n`;
    });
  } else {
    prompt += `\nNo explicit slides given. Generate a typical sequence for a ${info.pitchDeckType} pitch deck.`;
  }

  // Final instructions
  prompt += `\n\nFormat output as a series of slides in Markdown with:
- A short heading/subtitle
- Bullet points
- Bold key phrases
- Visual suggestions if relevant (chart/table/diagram/infographic)
`;

  return prompt;
};

/**
 * (3) GENERATING VISUAL ELEMENTS: We can produce a spec
 * to be used with Chart.js or another library.
 */
export const createVisualGenerationPrompt = (
  slideInfo: SlideInfo,
  slideContent: string,
  projectInfo: ProjectInfo,
  visualType?: 'chart' | 'diagram' | 'table' | 'infographic'
): string => {
  const determinedType = visualType || slideInfo.visualType || 'chart';

  let prompt = `Produce a ${determinedType} based on the following slide content:\n\n${slideContent}`;

  // Branding
  if (projectInfo.design) {
    prompt += `\n\nBrand guidelines:
- Primary Color: ${projectInfo.design.primaryColor}
- Secondary Color: ${projectInfo.design.secondaryColor}
- Accent Color: ${projectInfo.design.accentColor}`;
  }

  prompt += `\n\nOutput in JSON or CSV for easy rendering. 
If chart, specify axis labels, legends, etc. 
If table, define headers and rows. 
If diagram or infographic, outline shapes/flow.`;

  return prompt;
};

//////////////////////////////////////////////////////////////////////////////////////
// BELOW is an example of how you might implement a React component that uses       //
// the prompts above, displays slides one-by-one, and uses Chart.js for any charts. //
//////////////////////////////////////////////////////////////////////////////////////

/**
 * A small hook to provide a "typewriter" effect for text.
 * You can adjust the typingSpeed or logic as desired.
 */
function useTypewriter(text: string, typingSpeed: number = 50) {
  const [typedText, setTypedText] = useState('');
  const indexRef = useRef(0);

  useEffect(() => {
    setTypedText(''); // reset each time text changes
    indexRef.current = 0;
  }, [text]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTypedText((prev) => {
        if (indexRef.current < text.length) {
          const nextChar = text.charAt(indexRef.current);
          indexRef.current += 1;
          return prev + nextChar;
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, typingSpeed);

    return () => clearInterval(timer);
  }, [text, typingSpeed]);

  return typedText;
}

/**
 * Example React component to render "slides" with a typed effect.
 * This is a simplistic demonstration:
 *  - We assume we have pre-generated content for each slide
 *  - We display each slide's text with a typewriter effect
 *  - If the slide has chart data, we show a chart
 */
interface SlideContent {
  id: string;
  markdownText: string;
  chartData?: any; // optional data structure for a chart
}

interface PitchDeckProps {
  slides: SlideContent[];
}

/**
 * `PitchDeck` component:
 * - Renders each slide with typed text
 * - Optionally shows a Bar chart if chartData is provided
 * - Clicking a "Next Slide" button moves to the next
 */
export const PitchDeck: React.FC<PitchDeckProps> = ({ slides }): JSX.Element => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSlide = slides[currentIndex];
  const typedText = useTypewriter(currentSlide.markdownText, 30); // slower typing speed

  const nextSlide = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Example chart config (Bar chart)
  // In a real scenario, you'd customize based on the "chartData" you have
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Example Chart' },
    },
  };

  const dataForChart = {
    labels: currentSlide?.chartData?.labels || ['A', 'B', 'C'],
    datasets: [
      {
        label: 'Example',
        data: currentSlide?.chartData?.values || [12, 19, 3],
        backgroundColor: 'rgba(53,162,235,0.6)',
      },
    ],
  };

  return (
    <div style={{ margin: '20px', maxWidth: '600px' }}>
      <h2>Pitch Deck Slide {currentIndex + 1}</h2>

      {/* The typed text area */}
      <div style={{ whiteSpace: 'pre-wrap', marginBottom: '1em' }}>
        {typedText}
      </div>

      {/* If there's chart data, display the chart */}
      {currentSlide.chartData && (
        <div style={{ marginTop: '20px' }}>
          <BarChart options={chartOptions} data={dataForChart} />
        </div>
      )}

      <button onClick={nextSlide} disabled={currentIndex >= slides.length - 1}>
        Next Slide
      </button>
    </div>
  );
};

/*
USAGE EXAMPLE:

const sampleSlides: SlideContent[] = [
  {
    id: '1',
    markdownText: "## Introduction\n* **Welcome** to our pitch deck\n* We aim to solve a major problem...\n",
    chartData: {
      labels: ['2021', '2022', '2023'],
      values: [10, 50, 75],
    },
  },
  {
    id: '2',
    markdownText: "## Problem Statement\n* The market is fragmented...\n* **Key pain points**: cost, complexity.",
  },
  // ...
];

function App() {
  return <PitchDeck slides={sampleSlides} />;
}

export default App;

--------------------------------------------------------------------------------------
NOTES:
1. We've removed references to `slide.title` in the prompt strings themselves.
2. The code above demonstrates how you'd incorporate:
   - React
   - Chart.js (via `react-chartjs-2`)
   - A typed effect 
   - Well-structured text output

You can adapt these prompts to your own data flow (e.g., call an AI API, generate
slide text, store the results, then pass them to <PitchDeck> for display). 
3. If you need tables or infographics, just adapt the component to render them 
   (or create separate components for those visuals) depending on the data. 
4. The `PitchDeck` component is purely an **example** to show typed text and 
   Chart.js usage in a React environment. Adjust as needed for production.
*/ 
