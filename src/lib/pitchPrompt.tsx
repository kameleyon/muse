import React from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  LineChart,
  BarChart,
  PieChart,
  AreaChart,
  Area,
  Bar,
  Line,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { ChartRenderer } from '../components/ChartRenderer'; // Import the shared component
import { MarkdownVisualizer } from '../components/content/visualization/MarkdownVisualizer';
import { enhanceMarkdownWithCharts, extractChartData } from '../utils/chartUtils';

/* MODULE 1: Data Collection */
// Define the full 14-slide default structure (fallback if not in state)
const defaultSlideStructure = [
  { id: 'slide-1', title: 'Cover Slide', type: 'cover', description: 'Company Logo, Project Name, Tagline or Short Mission Statement', isRequired: true },
  { id: 'slide-2', title: 'Problem', type: 'problem', description: 'Define the problem your product/service aims to solve', isRequired: true },
  { id: 'slide-3', title: 'Solution', type: 'solution', description: 'Explain how your product/service solves the problem', isRequired: true },
  { id: 'slide-4', title: 'How It Works', type: 'how_it_works', description: 'Explain the mechanics of your solution', isRequired: true },
  { id: 'slide-5', title: 'Core Features', type: 'features', description: 'Highlight the main features and benefits', isRequired: true },
  { id: 'slide-6', title: 'Market Opportunity', type: 'market_analysis', description: 'Market size, trends, and growth potential', isRequired: true },
  { id: 'slide-7', title: 'Business Model', type: 'business_model', description: 'Revenue streams and monetization strategy', isRequired: true },
  { id: 'slide-8', title: 'Competitive Advantage', type: 'competition', description: 'What sets you apart from competitors', isRequired: true },
  { id: 'slide-9', title: 'Go-to-Market Strategy', type: 'go_to_market', description: 'Plan for acquiring customers and scaling', isRequired: true },
  { id: 'slide-10', title: 'Financial Projections', type: 'financials', description: 'Key financial metrics and forecasts', isRequired: true },
  { id: 'slide-11', title: 'Team & Expertise', type: 'team', description: 'Key team members and their qualifications', isRequired: true },
  { id: 'slide-12', title: 'Roadmap & Milestones', type: 'roadmap', description: 'Timeline of key achievements and future goals', isRequired: true },
  { id: 'slide-13', title: 'Call to Action', type: 'call_to_action', description: 'Specific ask and next steps', isRequired: true },
  { id: 'slide-14', title: 'Appendix', type: 'appendix', description: 'Additional supporting information (optional)', isRequired: false }
];

export const collectProjectData = (projectId: string, store: any) => {
  const state = store.getState();
  
  // Use the slide structure from state, or fall back to the default if not available
  const slideStructure = state.slideStructure && state.slideStructure.length > 0 
    ? state.slideStructure 
    : defaultSlideStructure;
    
  return {
    projectInfo: {
      id: projectId,
      name: state.projectName,
      description: state.description,
      pitchDeckType: state.selectedPitchDeckTypeId,
      tags: state.tags,
      goals: state.projectGoals || "", // Include project goals from Step 2
      additionalDetails: state.additionalDetails || "" // Include additional details from Step 2
    },
    audience: {
      name: state.audienceName,
      industry: state.industry,
      size: state.size,
      concerns: state.personaConcerns
    },
    design: {
      templateId: state.selectedTemplateId,
      brandLogo: state.brandLogo || null, // Include brand logo if available
      colors: {
        primary: state.primaryColor,
        secondary: state.secondaryColor,
        accent: state.accentColor,
        highlight: state.highlightColor || '#ff7300',
        background: state.backgroundColor || '#ffffff'
      },
      fonts: {
        heading: state.headingFont,
        body: state.bodyFont
      },
      complexity: state.complexityLevel // Include complexity level
    },
    structure: slideStructure,
    slideCount: slideStructure.length // Include the slide count explicitly
  };
};

/* MODULE 2: Research Prompt Generator */
export const generateResearchPrompt = (projectData: any) => {
  const projectName = projectData?.projectInfo?.name || 'the project';
  const industry = projectData?.audience?.industry || 'relevant industry';
  const audienceName = projectData?.audience?.name || 'target audience';
  const audienceSize = projectData?.audience?.size || 'unknown size';
  const complexityLevel = projectData?.design?.complexity || 'intermediate';
  
  // Determine research detail level based on complexity
  let researchDepth = '';
  if (complexityLevel === 'basic') {
    researchDepth = 'Provide essential research with key facts and figures. Focus on the most important data points and keep analysis concise.';
  } else if (complexityLevel === 'intermediate') {
    researchDepth = 'Provide balanced research with relevant data and moderate analysis. Include supporting information while maintaining clarity.';
  } else if (complexityLevel === 'advanced') {
    researchDepth = 'Provide comprehensive research with detailed data, in-depth analysis, and nuanced insights. Include multiple data points and thorough explanations.';
  }

  return `
    I need comprehensive research for a pitch deck on "${projectName}".
    Industry: ${industry}
    Target audience: ${audienceName}, size: ${audienceSize}
    
    RESEARCH COMPLEXITY: ${complexityLevel.toUpperCase()}
    ${researchDepth}

    Please provide detailed information on:
    1. Market size and growth projections (with specific and accurate numbers and data)
    2. Competitive analysis (3-7 main competitors with strengths/weaknesses)
    3. Customer pain points and needs (give 3-5 elaborated in a substancial paragraph each)
    4. Industry trends and future outlook (remains straightforward but give a deep analysis supported by accurate information )
    5. Potential business models and revenue streams (remains straightforward but give a comprehensive data and information supported by accurate information )
    6. Key risks and mitigation strategies (list between 4-7 that will be address in a straightforward and profesional way)

    Format the data to enable visualization:
    - Use standard Markdown table syntax directly for tables.
    - Include numerical data for charts as JSON arrays within code blocks labeled "chart". Example: \`\`\`chart [{"name": "Category A", "value": 30}, ...] \`\`\`
    - Use standard Markdown lists or paragraphs for relationship data or process flows.
    - For advanced charts, include type and options like: \`\`\`chart {"data": [...], "type": "bar", "options": {"showValues": true}} \`\`\`

    Structure your response with clear sections and data summaries. Ensure data formats are precise for rendering.
    
    Important: DO NOT EVER AT ANY POINT USE EMOJIS. Do not use any emojis in your response.
  `;
};

/* MODULE 3: Typewriter Effect */
export const useTypewriterEffect = (finalText: string, speed: number = 10) => {
  const [displayText, setDisplayText] = React.useState('');

  React.useEffect(() => {
    if (!finalText) {
      setDisplayText('');
      return;
    }

    // Check if the text contains chart code blocks
    const hasChartBlocks = finalText.includes('```chart');
    
    if (hasChartBlocks) {
      // If there are chart blocks, render the entire text immediately
      // to ensure charts are properly rendered
      console.log("Chart blocks detected, rendering entire text immediately");
      setDisplayText(finalText);
      return;
    }
    
    // Otherwise, use the typewriter effect
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      if (currentIndex <= finalText.length) {
        setDisplayText(finalText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(intervalId);
      }
    }, speed);
    return () => clearInterval(intervalId);
  }, [finalText, speed]);

  return displayText;
};

/* MODULE 4: Markdown Renderer */
// NOTE: This is a specific MarkdownRenderer instance defined within pitchPrompt.tsx.
// It's separate from the main one in src/lib/markdown.tsx.
export const MarkdownRenderer: React.FC<{
  content: string;
  brandColors: { 
    primary?: string; 
    secondary?: string; 
    accent?: string;
    highlight?: string;
    background?: string;
  };
  fonts?: {
    headingFont?: string;
    bodyFont?: string;
  };
  options?: {
    enhanceVisuals?: boolean;
    showCharts?: boolean;
    showTables?: boolean;
    showDiagrams?: boolean;
    chartHeight?: number;
    animateCharts?: boolean;
  };
  components?: Components;
}> = ({ 
  content, 
  brandColors, 
  fonts = {
    headingFont: 'var(--heading-font)',
    bodyFont: 'var(--body-font)',
  }, 
  options = {
    enhanceVisuals: true,
    showCharts: true,
    showTables: true,
    showDiagrams: true,
    chartHeight: 300,
    animateCharts: true
  },
  components = {} 
}) => {
  // Use the enhanced MarkdownVisualizer component for rendering
  return (
    <MarkdownVisualizer 
      content={content}
      enhanceVisuals={options.enhanceVisuals}
      brandColors={brandColors}
      fonts={fonts}
      options={{
        showCharts: options.showCharts,
        showTables: options.showTables,
        showDiagrams: options.showDiagrams,
        chartHeight: options.chartHeight,
        animateCharts: options.animateCharts
      }}
    />
  );
};

/* MODULE 5: Visual Content Generator */
// Updated to leverage the new chartUtils functions
export const extractVisualContent = (researchText: string) => {
  return extractChartData(researchText);
};

/* MODULE 6: Content Generation Prompt */
export const generateFullContentPrompt = (projectData: any, researchData: string) => {
  const projectName = projectData?.projectInfo?.name || 'the project';
  const audienceConcerns = projectData?.audience?.concerns?.join(', ') || 'key audience concerns';
  const templateId = projectData?.design?.templateId || 'default';
  const complexityLevel = projectData?.design?.complexity || 'intermediate';
  const slideCount = projectData?.slideCount || 14;
  
  // Determine content detail level based on complexity
  let detailLevel = '';
  if (complexityLevel === 'basic') {
    detailLevel = 'Create concise, straightforward content with essential information only. Keep explanations brief and focus on the most important points.';
  } else if (complexityLevel === 'intermediate') {
    detailLevel = 'Balance detail and brevity. Include supporting information and explanations while maintaining clarity and focus.';
  } else if (complexityLevel === 'advanced') {
    detailLevel = 'Create comprehensive, detailed content with in-depth analysis, supporting data, and thorough explanations. Include nuanced insights and address potential questions or objections.';
  }

  // Extract logo information for emphasis
  const logoInfo = projectData?.design?.brandLogo ? "User has uploaded a custom logo." : "No custom logo uploaded, use placeholder.";
  
  return `
    Generate a complete, polished pitch deck for "${projectName}" with the following specs:

    PROJECT INFO:
    ${JSON.stringify(projectData?.projectInfo || {}, null, 2)}

    AUDIENCE:
    ${JSON.stringify(projectData?.audience || {}, null, 2)}

    DESIGN PREFERENCES:
    ${JSON.stringify(projectData?.design || {}, null, 2)}
    
    LOGO INFORMATION: ${logoInfo}

    SLIDE STRUCTURE (TOTAL: ${slideCount} SLIDES):
    ${JSON.stringify(projectData?.structure || [], null, 2)}

    RESEARCH FINDINGS (Use this data to populate the deck content):
    ${researchData}

    CONTENT COMPLEXITY: ${complexityLevel.toUpperCase()}
    ${detailLevel}

    Guidelines:
    1. Format your response entirely in Markdown.
    2. CRITICAL: You MUST create content for EXACTLY ${slideCount} slides as defined in the SLIDE STRUCTURE above. Follow the SLIDE STRUCTURE exactly, including respecting any specified visualType properties. The standard structure has 14 slides, but the user may have modified this. Do not add or remove slides from what is provided.
    3. Structure the content logically according to the provided slide structure. Use Markdown headers (##) for slide titles/sections.
    4. For the Cover Slide (which has a visualType of "logo"), include a placeholder for the company logo only if one exists in LOGO INFORMATION. If the user has uploaded a logo, add an empty line with just: ![Logo](/logo-placeholder.svg)
       This logo image will be automatically replaced with the user's uploaded logo.
       If no logo has been uploaded, DO NOT include any logo placeholder or label.
       IMPORTANT: Logo placeholders must always be on their own line, outside of any code blocks.
    5. DO NOT include literal slide numbers or prefixes or name like cover, problem - say it differently
    6. Integrate visualizations seamlessly within the content:
       - Tables: Use standard Markdown table syntax directly. Make sure tables have clear headers and are properly formatted.
         Example:
         | Category | Value | Percentage |
         |----------|-------|------------|
         | Product A| 1200  | 40%        |
         | Product B| 900   | 30%        |
         | Product C| 600   | 20%        |
         | Product D| 300   | 10%        |
       
  
       - Do not write Line 1, Line 2, Line 3, but right the specific label Name
       - DO NOT USE PIE CHART, LINE, BAR OR DIAGRAM CHART -- Use scattered or line charts instead
       - DO NOT WRITE RAW CODES - USE TABLE ONLY AS SUPPORTING DATA
    6. Maintain a professional tone consistent with the "${templateId}" style.
    7. Address the audience's key concerns: ${audienceConcerns}.
    8. Ensure the generated content is compelling, concise, and directly uses the research findings.
    9. Include at least 3 different types of charts (bar, line, pie, radar, etc.) to illustrate key data points.
    10. DO NOT EVER use any emojis in your response.
    11. IMPORTANT: For the Cover Slide, DO NOT draw or create a logo - just include the placeholder "![Logo](/logo-placeholder.svg)" which will be automatically replaced with the user's uploaded logo.
    12. IMPORTANT: Always use current dates and timelines. Today's date is ${new Date().toLocaleDateString()}. For roadmaps, milestones, and projections, start from the current year (${new Date().getFullYear()}) and use realistic future dates.
    13. Write the content with substance and important information/facts to catch the investors' attention and persuasive. 
    14. DO NOT GENERATE TABLE THAT NEEDS SCROLLBAR.
    15. EACH SLIDE WRITE A PARAGRAPH TO ELABORATE ON THE SECTION AND THEN ADD THE LIST, TABLE AND OTHER SUPPORTING DATA. 
  

    Create the full pitch deck content below based on these instructions.
  `;
};

/* Usage Component */
// Updated to use the enhanced options for the MarkdownRenderer
export const ContentGenerator: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [generatedContent, setGeneratedContent] = React.useState('');
  const brandColors = { 
    primary: '#4A90E2', 
    secondary: '#50E3C2', 
    accent: '#F5A623',
    highlight: '#FF7300',
    background: '#FFFFFF'
  };
  
  const fonts = {
    headingFont: 'Comfortaa, sans-serif',
    bodyFont: 'Questrial, sans-serif'
  };
  
  const options = {
    enhanceVisuals: true,
    showCharts: true,
    showTables: true,
    showDiagrams: true,
    chartHeight: 300,
    animateCharts: true
  };

  React.useEffect(() => {
    // Implement your real-time content generation logic here.
    // For example, call your API using the projectId and update state with the result.
  }, [projectId]);

  return (
    <div className="content-generator p-4">
      <h3 className="text-xl font-bold mb-4">Pitch Deck Preview</h3>
      <MarkdownRenderer 
        content={generatedContent} 
        brandColors={brandColors} 
        fonts={fonts}
        options={options}
      />
    </div>
  );
};
