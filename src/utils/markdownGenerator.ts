/**
 * Markdown Generator Utility
 * Provides functions to generate markdown content with advanced visualizations
 */

import { generateExampleChartData } from './chartUtils';

/**
 * Generates a sample chart code block for various chart types
 */
export const generateChartMarkdown = (type: string = 'bar', title?: string): string => {
  const chartData = generateExampleChartData(type);
  const chartTitle = title || `Sample ${type.charAt(0).toUpperCase() + type.slice(1)} Chart`;
  
  return `## ${chartTitle}\n\n\`\`\`chart\n${JSON.stringify(chartData, null, 2)}\n\`\`\`\n\n`;
};

/**
 * Generates a sample table in markdown format
 */
export const generateTableMarkdown = (
  headers: string[] = ['Category', 'Value', 'Change'],
  rows: string[][] = [
    ['Product A', '45,000', '+12%'],
    ['Product B', '23,000', '-5%'],
    ['Product C', '78,500', '+28%'],
    ['Product D', '17,200', '+2%']
  ],
  title?: string
): string => {
  const tableTitle = title || 'Sample Data Table';
  let markdown = `## ${tableTitle}\n\n`;
  
  // Add header row
  markdown += '| ' + headers.join(' | ') + ' |\n';
  
  // Add separator row
  markdown += '| ' + headers.map(() => '---').join(' | ') + ' |\n';
  
  // Add data rows
  rows.forEach(row => {
    markdown += '| ' + row.join(' | ') + ' |\n';
  });
  
  return markdown + '\n';
};

/**
 * Generates a sample flowchart or diagram in markdown format
 */
export const generateDiagramMarkdown = (title?: string): string => {
  const diagramTitle = title || 'Process Flow Diagram';
  
  return `## ${diagramTitle}\n\n\`\`\`diagram
graph TD
    A[Start] --> B{Decision Point}
    B -->|Yes| C[Process 1]
    B -->|No| D[Process 2]
    C --> E[End]
    D --> E
\`\`\`\n\n`;
};

/**
 * Generates an example markdown document with various visualization types
 */
export const generateSampleMarkdown = (options?: {
  includeCharts?: boolean;
  includeTables?: boolean;
  includeDiagrams?: boolean;
  chartTypes?: string[];
}): string => {
  const {
    includeCharts = true,
    includeTables = true,
    includeDiagrams = true,
    chartTypes = ['bar', 'line', 'pie']
  } = options || {};
  
  let markdown = `# Sample Visualization Document\n\n`;
  
  markdown += `This is a sample document demonstrating the visualization capabilities of MagicMuse.\n\n`;
  
  if (includeCharts) {
    markdown += `## Data Visualizations\n\n`;
    markdown += `The following charts demonstrate different ways to visualize your data.\n\n`;
    
    chartTypes.forEach(type => {
      markdown += generateChartMarkdown(type);
    });
  }
  
  if (includeTables) {
    markdown += `## Tabular Data\n\n`;
    markdown += `Tables can be used to present structured data in a clear format.\n\n`;
    
    markdown += generateTableMarkdown(
      ['Product', 'Q1 Sales', 'Q2 Sales', 'Q3 Sales', 'Q4 Sales'],
      [
        ['Product A', '$45,000', '$52,000', '$48,000', '$62,000'],
        ['Product B', '$23,000', '$21,000', '$26,000', '$31,000'],
        ['Product C', '$78,500', '$82,000', '$91,000', '$96,500'],
        ['Product D', '$17,200', '$18,500', '$20,100', '$22,300']
      ],
      'Quarterly Sales Performance'
    );
  }
  
  if (includeDiagrams) {
    markdown += `## Process Flows\n\n`;
    markdown += `Diagrams can help illustrate complex processes or relationships.\n\n`;
    
    markdown += generateDiagramMarkdown('User Onboarding Flow');
  }
  
  markdown += `## Combining Visualizations\n\n`;
  markdown += `For maximum impact, you can combine different visualization types to tell a complete story.\n\n`;
  
  markdown += `### Sales Growth Analysis\n\n`;
  markdown += `Our top-performing product categories show consistent growth over the past year.\n\n`;
  
  markdown += generateChartMarkdown('line', 'Monthly Sales Trends');
  
  markdown += `The breakdown by product category reveals our strengths and opportunities:\n\n`;
  
  markdown += generateTableMarkdown(
    ['Category', 'Revenue', 'Growth', 'Market Share'],
    [
      ['Electronics', '$2.4M', '+18%', '32%'],
      ['Apparel', '$1.8M', '+12%', '24%'],
      ['Home Goods', '$1.2M', '+15%', '16%'],
      ['Accessories', '$0.9M', '+22%', '12%']
    ],
    'Category Performance'
  );
  
  return markdown;
};

/**
 * Generates example chart data for a specific use case
 */
export const generateContextualChartData = (context: string): string => {
  switch (context.toLowerCase()) {
    case 'sales':
      return `\`\`\`chart
[
  {"name": "Jan", "value": 4200},
  {"name": "Feb", "value": 3800},
  {"name": "Mar", "value": 5100},
  {"name": "Apr", "value": 5400},
  {"name": "May", "value": 6200},
  {"name": "Jun", "value": 7500}
]
\`\`\``;
    
    case 'comparison':
      return `\`\`\`chart
[
  {"name": "Product A", "current": 4200, "previous": 3600},
  {"name": "Product B", "current": 3800, "previous": 4100},
  {"name": "Product C", "current": 5100, "previous": 4300},
  {"name": "Product D", "current": 5400, "previous": 5200}
]
\`\`\``;
    
    case 'distribution':
      return `\`\`\`chart
[
  {"name": "Category A", "value": 35},
  {"name": "Category B", "value": 25},
  {"name": "Category C", "value": 20},
  {"name": "Category D", "value": 15},
  {"name": "Category E", "value": 5}
]
\`\`\``;
    
    case 'trends':
      return `\`\`\`chart
[
  {"name": "2019", "revenue": 8200, "expenses": 6100, "profit": 2100},
  {"name": "2020", "revenue": 7400, "expenses": 6300, "profit": 1100},
  {"name": "2021", "revenue": 9600, "expenses": 6800, "profit": 2800},
  {"name": "2022", "revenue": 12400, "expenses": 8200, "profit": 4200},
  {"name": "2023", "revenue": 15800, "expenses": 9600, "profit": 6200},
  {"name": "2024", "revenue": 18200, "expenses": 10800, "profit": 7400}
]
\`\`\``;
    
    default:
      return generateChartMarkdown('bar');
  }
};
