// src/lib/prompts/pitchDeckPrompts.ts

// Interfaces to potentially structure input data later
interface ProjectInfo {
  projectName: string;
  pitchDeckType: string; // e.g., 'investment', 'sales'
  description?: string;
  tags?: string[]; // Add tags
  audience?: any; // Data from Step 2
  product?: any; // Data from Step 2
  objective?: any; // Data from Step 2
  // ... add other relevant data from previous steps
}

/**
 * Generates a prompt for the research model (e.g., GPT-4o Search Preview)
 * to gather background information, market data, and competitor insights.
 */
export const createResearchPrompt = (info: ProjectInfo): string => {
  // Basic prompt, can be expanded significantly
  let prompt = `Gather comprehensive background information for creating a ${info.pitchDeckType} pitch deck for a project named "${info.projectName}".`;
  if (info.description) {
    prompt += ` The project is described as: ${info.description}.`;
  }
  if (info.tags && info.tags.length > 0) {
    prompt += ` Key themes/tags associated with the project are: ${info.tags.join(', ')}.`;
  }
  // Add specifics based on pitch deck type
  if (info.pitchDeckType === 'investment' || info.pitchDeckType === 'startup') {
     prompt += ` Focus on market size, trends, key competitors, potential investment benchmarks, and target audience validation for this type of project/product.`;
  } else if (info.pitchDeckType === 'sales') {
     prompt += ` Focus on typical client pain points this product/service might solve, common objections, relevant industry case studies, and competitor solutions.`;
  } else {
     prompt += ` Focus on general industry context, potential stakeholders, and relevant market data.`;
  }
  
  // Add audience/product specifics if available (from Step 2 state)
  // prompt += ` The target audience is... ${info.audience?.name || 'not specified'}.`;
  // prompt += ` The product/service is... ${info.product?.name || 'not specified'}.`;

  prompt += ` Provide structured information covering:
1.  Market Overview: Size, growth rate, key trends.
2.  Target Audience Insights: Demographics, needs, pain points.
3.  Competitive Landscape: Key players, their strengths/weaknesses, market share if available.
4.  Relevant Statistics/Data Points: Key numbers to support claims.
5.  Potential Challenges/Risks: Common hurdles in this market/industry.

Format the output clearly using Markdown.`;

  return prompt;
};

/**
 * Generates a prompt for the content model (e.g., Claude Sonnet)
 * using the research findings to create the actual pitch deck content.
 */
export const createPitchDeckContentPrompt = (info: ProjectInfo, researchData: string): string => {
  // Basic prompt, can be expanded significantly
  let prompt = `Based on the following research data and project information, generate the content for a ${info.pitchDeckType} pitch deck for "${info.projectName}".

Project Name: ${info.projectName}
Pitch Deck Type: ${info.pitchDeckType}
${info.description ? `Project Description: ${info.description}\n` : ''}
+${info.tags && info.tags.length > 0 ? `Project Tags: ${info.tags.join(', ')}\n` : ''}
${info.audience ? `Target Audience Info: ${JSON.stringify(info.audience)}\n` : ''}
${info.product ? `Product Info: ${JSON.stringify(info.product)}\n` : ''}
${info.objective ? `Objective Info: ${JSON.stringify(info.objective)}\n` : ''}

Research Data:
---
${researchData}
---

Generate the content for the following standard pitch deck sections (adapt as needed for a ${info.pitchDeckType} type):
- Cover/Title Slide (Include project name, tagline if possible)
- Problem/Opportunity
- Solution Overview
- Value Proposition
- Market Analysis (Use research data)
- Business Model (If applicable)
- Product/Service Details
- Competitive Landscape (Use research data)
- Team Introduction (Placeholder if no team info provided)
- Timeline/Roadmap (Placeholder)
- Financial Projections (Placeholder or based on objective)
- Call to Action

Ensure the tone is appropriate for a ${info.pitchDeckType} pitch. Structure the output clearly using Markdown, with clear headings for each section (e.g., '## Problem/Opportunity'). Be concise yet persuasive.`;

  return prompt;
};