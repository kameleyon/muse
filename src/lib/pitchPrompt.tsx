import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  LineChart, BarChart, PieChart, Area, Bar, Line, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

// MODULE 1: Data Collection from Steps 1-4
export const collectProjectData = (
  projectId: string,
  store: any // Store reference
) => {
  const state = store.getState();
  return {
    projectInfo: {
      id: projectId,
      name: state.projectName,
      description: state.description,
      pitchDeckType: state.selectedPitchDeckTypeId,
      tags: state.tags,
    },
    audience: {
      name: state.audienceName,
      industry: state.industry,
      size: state.size,
      concerns: state.personaConcerns,
    },
    design: {
      templateId: state.selectedTemplateId,
      colors: {
        primary: state.primaryColor,
        secondary: state.secondaryColor,
        accent: state.accentColor,
      },
      fonts: {
        heading: state.headingFont,
        body: state.bodyFont,
      },
    },
    structure: state.slideStructure,
  };
};

// MODULE 2: Research Prompt Generator
export const generateResearchPrompt = (projectData: any) => {
  return `
    I need comprehensive research for a pitch deck on "${projectData.projectInfo.name}".
    Industry: ${projectData.audience.industry}
    Target audience: ${projectData.audience.name}, size: ${projectData.audience.size}
    
    Please provide detailed information on:
    1. Market size and growth projections (with specific numbers)
    2. Competitive analysis (3-5 main competitors with strengths/weaknesses)
    3. Customer pain points and needs
    4. Industry trends and future outlook
    5. Potential business models and revenue streams
    6. Key risks and mitigation strategies
    
    Format the data to enable visualization:
    - Include table data in a format that can be rendered as HTML tables
    - Include numerical data that can be visualized in charts
    - Include relationship data that can be visualized in diagrams
    
    Structure your response with clear sections and data summaries.
  `;
};

// MODULE 3: Typewriter Effect
export const useTypewriterEffect = (
  finalText: string,
  speed: number = 10
) => {
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

// MODULE 4: Markdown Renderer
export const MarkdownRenderer: React.FC<{
  content: string,
  brandColors: any,
  components?: any
}> = ({ content, brandColors, components = {} }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 style={{ color: brandColors.primary, fontFamily: 'var(--heading-font)' }}>
            {children}
          </h1>
        ),
        // Add more custom renderers as needed
        ...components
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

// MODULE 5: Visual Content Generator
export const extractVisualContent = (researchText: string) => {
  // Extract tables
  const tableRegex = /```table\s+([\s\S]*?)```/g;
  const tables = [];
  let tableMatch;
  while ((tableMatch = tableRegex.exec(researchText)) !== null) {
    tables.push(tableMatch[1]);
  }
  
  // Extract chart data
  const chartRegex = /```chart\s+([\s\S]*?)```/g;
  const charts = [];
  let chartMatch;
  while ((chartMatch = chartRegex.exec(researchText)) !== null) {
    try {
      charts.push(JSON.parse(chartMatch[1]));
    } catch (e) {
      console.error("Failed to parse chart data:", e);
    }
  }
  
  // Extract diagram data
  const diagramRegex = /```diagram\s+([\s\S]*?)```/g;
  const diagrams = [];
  let diagramMatch;
  while ((diagramMatch = diagramRegex.exec(researchText)) !== null) {
    diagrams.push(diagramMatch[1]);
  }
  
  return { tables, charts, diagrams };
};

// Visualization Components
export const DataTable: React.FC<{ data: string }> = ({ data }) => {
  // Parse and render table from string data
  const rows = data.trim().split('\n');
  const headers = rows[0].split('|').map(h => h.trim()).filter(Boolean);
  const bodyRows = rows.slice(1).map(row => 
    row.split('|').map(cell => cell.trim()).filter(Boolean)
  );
  
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          {headers.map((header, i) => (
            <th key={i} className="border p-2 bg-gray-100">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {bodyRows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j} className="border p-2">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const ChartRenderer: React.FC<{ 
  data: any, 
  type: 'bar' | 'line' | 'pie' | 'area',
  colors: any
}> = ({ data, type, colors }) => {
  // Render appropriate chart based on type
  return (
    <ResponsiveContainer width="100%" height={300}>
      {type === 'bar' ? (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill={colors.primary} />
        </BarChart>
      ) : type === 'line' ? (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke={colors.primary} />
        </LineChart>
      ) : type === 'pie' ? (
        <PieChart>
          <Tooltip />
          <Legend />
          <Pie 
            data={data} 
            dataKey="value" 
            nameKey="name" 
            fill={colors.primary} 
            label 
          />
        </PieChart>
      ) : (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="value" fill={colors.primary} stroke={colors.secondary} />
        </LineChart>
      )}
    </ResponsiveContainer>
  );
};

// MODULE 6: Content Generation Prompt
export const generateFullContentPrompt = (projectData: any, researchData: string) => {
  return `
    Generate a complete, polished pitch deck for "${projectData.projectInfo.name}" with the following specs:
    
    PROJECT INFO:
    ${JSON.stringify(projectData.projectInfo, null, 2)}
    
    AUDIENCE:
    ${JSON.stringify(projectData.audience, null, 2)}
    
    DESIGN PREFERENCES:
    ${JSON.stringify(projectData.design, null, 2)}
    
    SLIDE STRUCTURE:
    ${JSON.stringify(projectData.structure, null, 2)}
    
    RESEARCH FINDINGS:
    ${researchData}
    
    Guidelines:
    1. Format your response in Markdown.
    2. Create content sections using descriptive headers (## for main headers, ### for subheaders).
    3. DO NOT include "Slide X:" prefixes or slide numbers in any headers or text.
    4. For visualizations, use special code blocks to enable React-based charts:
       - Tables: \`\`\`table (with markdown-formatted table content)
       - Charts: \`\`\`chart (with JSON data in the format: [{"name": "Category A", "value": 30}, ...])
       - Diagrams: \`\`\`diagram (with description)
    5. Maintain a professional ${projectData.design.templateId} style throughout.
    6. Focus on ${projectData.audience.concerns.join(', ')} as key concerns.
    
    Create compelling, well-structured content with visualizations, without explicitly labeling content as slides or using slide numbering.
  `;
};

// Usage Component Example
export const ContentGenerator: React.FC<{ projectId: string }> = ({ projectId }) => {
  // This is a stub implementation that will be fleshed out in the actual integration
  // It needs to return JSX to satisfy the React.FC type
  return (
    <div className="content-generator">
      <h3>Content Generator</h3>
      <p>Project ID: {projectId}</p>
      <p>This component will be implemented to orchestrate the generation process.</p>
    </div>
  );
};
