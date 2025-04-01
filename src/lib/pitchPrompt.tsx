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
        accent: state.accentColor
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
    - Include table data in Markdown table format within code blocks labeled "table".
    - Include numerical data for charts as JSON arrays within code blocks labeled "chart". For example: [{"name": "Category A", "value": 30}, ...].
    - Include relationship data or process flows as descriptions within code blocks labeled "diagram".

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
export const MarkdownRenderer: React.FC<{
  content: string;
  brandColors: { primary?: string };
  components?: Components;
}> = ({ content, brandColors, components = {} }) => {
  const primaryColor = brandColors?.primary || '#000000';
  const headingFont = 'var(--heading-font)';

  const customRenderers: Components = {
    h1: ({ node, ...props }) => (
      <h1 style={{ color: primaryColor, fontFamily: headingFont }} {...props} />
    ),
    h2: ({ node, ...props }) => (
      <h2 style={{ color: primaryColor, fontFamily: headingFont }} {...props} />
    ),
    h3: ({ node, ...props }) => (
      <h3 style={{ color: primaryColor, fontFamily: headingFont }} {...props} />
    ),
    // Added inline?: boolean to the function signature
    code({ node, inline, className, children, ...props }: { node?: any; inline?: boolean; className?: string; children?: React.ReactNode }) {
      const match = /language-(\w+)/.exec(className || '');
      const codeContent = String(children).replace(/\n$/, '');

      if (!inline && match) {
        const lang = match[1];
        if (lang === 'chart') {
          return <ChartRenderer data={codeContent} colors={brandColors || {}} />;
        }
        if (lang === 'table') {
          return <DataTable data={codeContent} />;
        }
        if (lang === 'diagram') {
          return (
            <div className="p-4 border rounded bg-gray-50 my-4">
              Diagram: {codeContent}
            </div>
          );
        }
      }
      return <code className={className} {...props}>{children}</code>;
    },
    ...components
  };

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={customRenderers}>
      {content}
    </ReactMarkdown>
  );
};

/* MODULE 5: Visual Content Generator */
export const extractVisualContent = (researchText: string) => {
  const tableRegex = /```table\s+([\s\S]*?)```/g;
  const tables = [...researchText.matchAll(tableRegex)].map(match => match[1]);

  const chartRegex = /```chart\s+([\s\S]*?)```/g;
  const charts = [...researchText.matchAll(chartRegex)].map(match => match[1]);

  const diagramRegex = /```diagram\s+([\s\S]*?)```/g;
  const diagrams = [...researchText.matchAll(diagramRegex)].map(match => match[1]);

  return { tables, charts, diagrams };
};

/* DataTable for "table" blocks */
export const DataTable: React.FC<{ data: string }> = ({ data }) => {
  if (!data || typeof data !== 'string') {
    return (
      <div className="text-red-500">
        Invalid table data provided for code block labeled "table".
      </div>
    );
  }
  const rows = data
    .trim()
    .split('\n')
    .map(row => row.trim())
    .filter(Boolean);
  if (rows.length < 1) {
    return (
      <div className="text-gray-500">
        No table data available or invalid format in code block labeled "table".
      </div>
    );
  }
  const headers = rows[0]
    .split('|')
    .map(h => h.trim())
    .filter(Boolean);
  if (headers.length === 0) {
    return (
      <div className="text-red-500">
        Invalid table header format in code block labeled "table".
      </div>
    );
  }
  const dataRowStartIndex = rows.length > 1 && rows[1].includes('---') ? 2 : 1;
  const bodyRows = rows
    .slice(dataRowStartIndex)
    .map(row => row.split('|').map(cell => cell.trim()).slice(0, headers.length));

  return (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full border-collapse table-auto border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            {headers.map((header, i) => (
              <th key={i} className="border border-gray-300 p-2 text-left font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {row.map((cell, j) => (
                <td key={j} className="border border-gray-300 p-2 align-top">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ p: React.Fragment }}>
                    {cell || ''}
                  </ReactMarkdown>
                </td>
              ))}
              {Array.from({ length: headers.length - row.length }).map((_, k) => (
                <td key={`empty-${i}-${k}`} className="border border-gray-300 p-2 align-top" />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* ChartRenderer for "chart" blocks */
export const ChartRenderer: React.FC<{
  data: string;
  type?: 'bar' | 'line' | 'pie' | 'area';
  colors: { primary?: string; secondary?: string; accent?: string };
}> = ({ data, type, colors }) => {
  let chartData;
  const primaryColor = colors?.primary || '#8884d8';
  const secondaryColor = colors?.secondary || '#82ca9d';

  try {
    chartData = JSON.parse(data);
    if (!Array.isArray(chartData)) {
      throw new Error("Chart data must be an array.");
    }
    if (chartData.length > 0) {
      const firstItem = chartData[0];
      if (
        typeof firstItem !== 'object' ||
        firstItem === null ||
        typeof firstItem.name === 'undefined' ||
        typeof firstItem.value === 'undefined'
      ) {
        console.warn("Chart data items might be missing 'name' or 'value' properties, or are not objects.");
      }
    }
  } catch (e: any) {
    console.error("Failed to parse chart data:", e.message, "Raw Data:", data);
    return (
      <div className="text-red-600 p-4 border border-red-300 rounded bg-red-50 my-4">
        <strong>Error Parsing Chart Data</strong>
        <br />
        <p className="text-sm mt-1">Message: {e.message}</p>
        <p className="text-sm mt-1">
          Please ensure the content within the code block labeled chart is valid JSON and follows the format: <code>{'[{"name": "Example", "value": 0}]'}</code>
        </p>
        <pre className="mt-2 p-2 bg-gray-100 text-xs overflow-auto max-h-20">{data}</pre>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="text-gray-500 p-4 border rounded my-4">
        No data available for chart.
      </div>
    );
  }

  const chartType = type || 'bar';

  return (
    <div className="my-4">
      <ResponsiveContainer width="100%" height={300}>
        {chartType === 'bar' ? (
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill={primaryColor} />
          </BarChart>
        ) : chartType === 'line' ? (
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke={primaryColor} activeDot={{ r: 8 }} />
          </LineChart>
        ) : chartType === 'pie' ? (
          <PieChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <Tooltip />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill={primaryColor}
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            />
          </PieChart>
        ) : chartType === 'area' ? (
          <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="value" fill={primaryColor} stroke={secondaryColor || primaryColor} />
          </AreaChart>
        ) : (
          <div className="text-red-500 p-4 border border-red-300 rounded">
            Unsupported chart type specified: {chartType}
          </div>
        )}
      </ResponsiveContainer>
    </div>
  );
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
    4. Integrate visualizations seamlessly within the content using the specified code blocks:
       - Tables: Use Markdown table syntax within code blocks labeled "table".
       - Charts: Use JSON format within code blocks labeled "chart".
       - Diagrams: Provide a textual description within code blocks labeled "diagram".
    5. Maintain a professional tone consistent with the "${templateId}" style.
    6. Address the audience's key concerns: ${audienceConcerns}.
    7. Ensure the generated content is compelling, concise, and directly uses the research findings.

    Create the full pitch deck content below based on these instructions.
  `;
};

/* Usage Component */
export const ContentGenerator: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [generatedContent, setGeneratedContent] = React.useState('');
  const brandColors = { primary: '#4A90E2', secondary: '#50E3C2', accent: '#F5A623' };

  React.useEffect(() => {
    // Implement your real-time content generation logic here.
    // For example, call your API using the projectId and update state with the result.
  }, [projectId]);

  return (
    <div className="content-generator p-4">
      <h3 className="text-xl font-bold mb-4">Pitch Deck Preview</h3>
      <MarkdownRenderer content={generatedContent} brandColors={brandColors} />
    </div>
  );
};
