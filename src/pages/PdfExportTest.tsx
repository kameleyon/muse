import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { generateFormattedPdf } from '@/services/exportService';
import ContentEditor from '@/components/project/pitchdeck/editing/ContentEditor';

/**
 * PdfExportTest - A test page for demonstrating PDF export functionality
 */
const PdfExportTest: React.FC = () => {
  const [content, setContent] = useState<string>(`
    <h1>Revolutionizing Learning with InstaSmart</h1>
    <div style="text-align: center;">
      <img src="/logo-placeholder.svg" alt="Logo" style="width: 100px; height: 100px;" />
    </div>
    <p>Welcome to InstaSmart —an AI-powered educational platform designed to create personalized learning experiences. Our mission is to make education accessible, engaging, and tailored to every learner's unique needs, paving the way for the next generation of smart learning.</p>
    
    <h2>Addressing the Learning Gap</h2>
    <p>The traditional one-size-fits-all approach to education leaves many learners behind. Students often encounter challenges such as:</p>
    <p><strong>Inflexible Learning Paths</strong>: Static curriculums fail to cater to individual preferences, skill levels, and learning paces.</p>
    <p><strong>Engagement Issues</strong>: Outdated materials and lack of interactive tools result in disengaged learners.</p>
    <p><strong>Accessibility Barriers</strong>: Conventional platforms often overlook the diverse needs of learners with disabilities or specific requirements.</p>
    <p><strong>Data Privacy Concerns</strong>: With the rise of digital learning, ensuring secure and private data handling has become paramount.</p>
    
    <p>According to recent studies:</p>
    <p><strong>87% of users</strong> prioritize privacy and security in educational apps.</p>
    <p>The <strong>average cost of a data breach</strong> in the educational sector is $5.85 million.</p>
    
    <h2>Our Solution: InstaSmart</h2>
    <p>InstaSmart transforms personalized learning by utilizing advanced AI to generate customized syllabuses and adaptive learning pathways. Our platform dynamically adjusts content based on:</p>
    <p><strong>Skill Levels</strong>: Catering to both beginners and advanced learners.</p>
    <p><strong>Preferred Learning Styles</strong>: Incorporating visual, auditory, and kinesthetic elements.</p>
    <p><strong>Reading Proficiency</strong>: Simplifying or enriching content as needed.</p>
    <p><strong>Communication Preferences</strong>: Offering voice interfaces and augmented reality visualizations.</p>
    
    <p>Through real-time analytics, InstaSmart continuously refines the learning journey, ensuring every student achieves their full potential.</p>
    
    <h2>How InstaSmart Works</h2>
    <p>InstaSmart employs a streamlined three-step process:</p>
    <pre><code class="language-json">
[
  {"step": "Step 1: Input", "value": 30},
  {"step": "Step 2: Generation", "value": 50},
  {"step": "Step 3: Adaptation", "value": 20}
]
    </code></pre>
    <p>This seamless integration ensures users enjoy a consistent and intuitive experience across devices.</p>
    
    <h2>Core Features of InstaSmart</h2>
    <h3>Learning Redefined:</h3>
    <p><strong>Dynamic Content</strong>: Real-time adjustments based on learning progress.</p>
    <p><strong>Interactive Tools</strong>: Voice interfaces, AR visualizations, and synchronized text narration.</p>
    <p><strong>Accessibility</strong>: Dyslexia-friendly modes and compliance with global accessibility standards.</p>
    <p><strong>Collaborative Learning</strong>: Group learning sessions and shared progress tracking.</p>
    <p><strong>Enterprise Solutions</strong>: Integration with LMS, detailed analytics dashboards, and blockchain-certified credentials.</p>
    
    <table>
      <thead>
        <tr>
          <th>Feature</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>AI Syllabus Generator</td>
          <td>Produces personalized curriculums instantly.</td>
        </tr>
        <tr>
          <td>Adaptive Quizzes</td>
          <td>Tailored questions that adjust difficulty.</td>
        </tr>
        <tr>
          <td>Mobile Learning</td>
          <td>Seamlessly available on all devices.</td>
        </tr>
        <tr>
          <td>Offline Mode</td>
          <td>Learn without internet connectivity.</td>
        </tr>
      </tbody>
    </table>
    
    <h2>Market Opportunity</h2>
    <p>The global EdTech market stands at a staggering <strong>$389.1 billion</strong> in 2023 and is projected to grow to <strong>$1,379.3 billion by 2030</strong>, with a CAGR of 19.8%.</p>
    
    <pre><code class="language-json">
[
  {"year": "2023", "marketSize": 389.1},
  {"year": "2024", "marketSize": 465.8},
  {"year": "2025", "marketSize": 556.5},
  {"year": "2026", "marketSize": 663.4},
  {"year": "2027", "marketSize": 790.7},
  {"year": "2028", "marketSize": 942.9},
  {"year": "2029", "marketSize": 1125.4},
  {"year": "2030", "marketSize": 1379.3}
]
    </code></pre>
    
    <p>Key growth drivers include:</p>
    <p><strong>AI and IoT Integration</strong></p>
  `);

  const handleExportPdf = async () => {
    if (!content) {
      alert('Please enter some content first');
      return;
    }

    await generateFormattedPdf(
      'test-export',
      content,
      {
        title: 'InstaSmart Presentation',
        fileName: 'instasmart-presentation',
        brandColors: {
          primary: '#ae5630',
          secondary: '#232321',
          accent: '#9d4e2c',
          title: 'InstaSmart Presentation'
        }
      }
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">PDF Export Test</h1>
        <p className="mb-6">
          This page demonstrates the PDF export functionality. Edit the content below and click "Export to PDF" to generate a PDF that matches the content editor's appearance.
        </p>
        
        <div className="mb-6">
          <Button 
            variant="primary" 
            onClick={handleExportPdf}
            className="flex items-center gap-2"
          >
            Export to PDF
          </Button>
        </div>
      </Card>
      
      <Card className="p-0 overflow-hidden">
        <div className="p-4 bg-neutral-100 border-b border-neutral-200">
          <h2 className="font-semibold">Content Editor</h2>
        </div>
        <div className="p-0">
          <ContentEditor 
            content={content}
            onChange={setContent}
            brandColors={{
              primary: '#ae5630',
              secondary: '#232321',
              accent: '#9d4e2c'
            }}
            brandFonts={{
              headingFont: 'Comfortaa, sans-serif',
              bodyFont: 'Questrial, sans-serif'
            }}
          />
        </div>
      </Card>
    </div>
  );
};

export default PdfExportTest;
