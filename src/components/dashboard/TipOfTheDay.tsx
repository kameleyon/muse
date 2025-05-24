import React, { useState, useEffect } from 'react';

const TipOfTheDay: React.FC = () => {
  const [tipContent, setTipContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const featuresList = `
- Pitch Deck Generation (7 steps: Setup, Requirements, Design, Generation, Editing, QA, Delivery)
- Executive Summary Creation (Report, Business Plan, Project)
- Blog Post Generation (How-to, Listicle, Trends Analysis)
- Ad Copy Generation (Social Media, Search Engine)
- Technical Documentation (Process, Step-by-step, Task Sequence, IO Spec)
- Content Enhancement (Tone, Clarity, Conciseness)
- Content Strategy (Topic Clusters, Gap Analysis)
- Template Selection & Brand Customization
- PDF & PPTX Export
- Collaboration Features (@mentions)
- Version Control (Save Points)
- Analytics Dashboard
- Fiction Development (Characters, Plot Structure, World Building)
- Email Marketing Campaigns (Welcome Sequence, Promotional, Re-engagement)
- Social Media Calendar Planning (Weekly, Monthly, Quarterly Strategy)
- Research Paper Structure (Literature Review, Methodology, Results Analysis)
- Legal Document Creation (Contracts, Privacy Policies, Terms of Service)
- Brand Voice Consistency (Style Guide Enforcement, Terminology Checking)
- Content Repurposing (Long-form to Social Media, Blog to Newsletter)
- Audience-Specific Language Optimization (Technical Depth, Cultural Context)
- Interactive Progress Tracking (Section Completion, Quality Scoring)
- Alternative Version Generation (Conservative, Balanced, Bold Approaches)
- Visual Element Creation (Charts, Tables, Diagrams, Image Integration)
- Readability Scoring & Improvement (Sentence Structure, Paragraph Flow)
- Real-time Collaboration (User Presence, Concurrent Editing, Section Locking)
- SEO Optimization (Keyword Integration, Meta Description Generation)
- Citation & Reference Management (Multi-format, Bibliography Organization)
- Speaker Notes Generation (Talking Points, Time Allocation, Q&A Preparation)
- Project Archiving & Analytics (Engagement Tracking, Outcome Recording)
- Character Development (Psychological Profiles, Motivation, Backstory)
- Industry-specific Content (Healthcare, Technology, Finance, Education)
- Narrative Structure Analysis (Flow, Transition Phrases, Logical Progression)
- Data Visualization Recommendations (Chart Types, Table Structure)
- Multi-language Support (Translation, Localization, Cultural Adaptation)
- Compliance Checking (Regulatory Requirements, Legal Risk Assessment)
- Custom Template Development (Brand-specific, Industry-focused)
- Quality Metric Tracking (Content Quality, Design Effectiveness, Data Integrity)
- Competitive Analysis Tools (Differentiation Matrix, Market Positioning)
- Supplementary Materials Generation (Leave-behind Documents, Appendices)
- Interactive Prototyping (User Testing, Feedback Collection)
  `;

  useEffect(() => {
    const fetchTip = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "model": "anthropic/claude-sonnet-4",
            "messages": [
              {
                "role": "system",
                "content": `You are an assistant for MagicMuse, an AI writing companion. Your task is to provide a single, helpful, and engaging 'Tip of the Day' related to one of the app's features. Make it sound insightful and encourage users to explore the feature. Aim for 1-2 concise sentences. Only return the tip text itself, without any introductory phrases like "Here's a tip:" or quotation marks.`
              },
              {
                "role": "user",
                "content": `Generate a random, engaging 'Tip of the Day' based on one of the following MagicMuse features:\n\n${featuresList}\n\nMake it sound helpful and insightful, encouraging exploration. make it short concise catchy, a bit casual and witty yet still professional. NO EMOJI. less than 100 words.`
              }
            ],
            "max_tokens": 150, // Slightly increased max_tokens for potentially more descriptive tips
            "temperature": 0.8
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // Add check for data.choices before accessing index 0
        const tip = data?.choices?.[0]?.message?.content?.trim();

         if (tip) {
           setTipContent(tip);
         } else {
           console.log("OpenRouter Response (Tip):", data); // Log full response
           throw new Error("No tip content received");
         }

      } catch (error) {
        console.error("Failed to fetch tip:", error);
        // Fallback to a default tip on error
        setTipContent("Use the '@mentions' feature in your content to link to team members and collaborate more effectively.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTip();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="px-6 py-4 min-h-[60px] flex items-center"> {/* Added min-height and flex for loading */}
      {isLoading ? (
        <p className="text-neutral-medium text-sm italic">Loading tip...</p>
      ) : (
        <p className="text-neutral-medium text-sm">{tipContent}</p>
      )}
    </div>
  );
};

export default TipOfTheDay;
