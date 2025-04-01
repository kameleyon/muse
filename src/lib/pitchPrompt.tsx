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
export const collectProjectData = (projectId: string, store: any) => {
  const state = store.getState();
  return {
    projectInfo: {
      id: projectId,
      name: state.projectName,
      description: state.description,
      pitchDeckType: state.selectedPitchDeckTypeId,
      tags: state.tags
    },
    audience: {
      name: state.audienceName,
      industry: state.industry,
      size: state.size,
      concerns: state.personaConcerns
    },
    design: {
      templateId: state.selectedTemplateId,
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
      }
    },
    structure: state.slideStructure
  };
};

/* MODULE 2: Research Prompt Generator */
export const generateResearchPrompt = (projectData: any) => {
  const projectName = projectData?.projectInfo?.name || 'the project';
  const industry = projectData?.audience?.industry || 'relevant industry';
  const audienceName = projectData?.audience?.name || 'target audience';
  const audienceSize = projectData?.audience?.size || 'unknown size';

  return `
    I need comprehensive research for a pitch deck on "${projectName}".
    Industry: ${industry}
    Target audience: ${audienceName}, size: ${audienceSize}

    Please provide detailed information on:
    1. Market size and growth projections (with specific numbers)
    2. Competitive analysis (3-5 main competitors with strengths/weaknesses)
    3. Customer pain points and needs
    4. Industry trends and future outlook
    5. Potential business models and revenue streams
    6. Key risks and mitigation strategies

    Format the data to enable visualization:
    - Use standard Markdown table syntax directly for tables.
    - Include numerical data for charts as JSON arrays within code blocks labeled "chart". Example: \`\`\`chart [{"name": "Category A", "value": 30}, ...] \`\`\`
    - Use standard Markdown lists or paragraphs for relationship data or process flows.
    - For advanced charts, include type and options like: \`\`\`chart {"data": [...], "type": "bar", "options": {"showValues": true}} \`\`\`

    Structure your response with clear sections and data summaries. Ensure data formats are precise for rendering.
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

  return `
    Generate a complete, polished pitch deck for "${projectName}" with the following specs:

    PROJECT INFO:
    ${JSON.stringify(projectData?.projectInfo || {}, null, 2)}

    AUDIENCE:
    ${JSON.stringify(projectData?.audience || {}, null, 2)}

    DESIGN PREFERENCES:
    ${JSON.stringify(projectData?.design || {}, null, 2)}

    SLIDE STRUCTURE:
    ${JSON.stringify(projectData?.structure || [], null, 2)}

    RESEARCH FINDINGS (Use this data to populate the deck content):
    ${researchData}

    Guidelines:
    1. Format your response entirely in Markdown.
    2. Structure the content logically according to the provided slide structure. Use Markdown headers (##) for slide titles/sections.
    3. DO NOT include literal slide numbers or prefixes.
    4. Integrate visualizations seamlessly within the content:
       - Tables: Use standard Markdown table syntax directly.
       - Charts: Use JSON format within code blocks labeled "chart". Example:
         \`\`\`chart 
         {"data": [{"name": "Example", "value": 0}], "type": "bar", "options": {"showValues": true}} 
         \`\`\`
       - You can also use simpler chart format: \`\`\`chart [{"name": "Example", "value": 0}] \`\`\`
       - Diagrams: Use standard Markdown lists or paragraphs for descriptions.
    5. Maintain a professional tone consistent with the "${templateId}" style.
    6. Address the audience's key concerns: ${audienceConcerns}.
    7. Ensure the generated content is compelling, concise, and directly uses the research findings.
    8. Include at least 3 different types of charts (bar, line, pie, radar, etc.) to illustrate key data points.

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
