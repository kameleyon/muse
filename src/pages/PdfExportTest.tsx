import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';

/**
 * PDF Export Test - Page to test PDF export functionality
 * Tests margin handling, chart rendering, and color preservation
 */
const PdfExportTest: React.FC = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState<string>(`# MagicMuse PDF Export Test

## Testing Margin Handling
This test document will verify proper margin handling in PDF exports.

## Testing Color Preservation
- The **Primary Color** should be displayed properly
- The *Secondary Color* should be displayed properly
- The [Accent Color](#) should be displayed properly

## Testing Chart Rendering

### Line Chart Test
\`\`\`chart
[
  {"name": "Jan", "value": 400, "trend": 240},
  {"name": "Feb", "value": 300, "trend": 139},
  {"name": "Mar", "value": 200, "trend": 980},
  {"name": "Apr", "value": 278, "trend": 390},
  {"name": "May", "value": 189, "trend": 480},
  {"name": "Jun", "value": 239, "trend": 380}
]
\`\`\`

### Bar Chart Test
\`\`\`chart
[
  {"name": "Category A", "value": 400},
  {"name": "Category B", "value": 300},
  {"name": "Category C", "value": 200},
  {"name": "Category D", "value": 278},
  {"name": "Category E", "value": 189}
]
\`\`\`

### Testing Table Rendering

| Feature | Benefit | Key Metrics |
| ------- | ------- | ----------- |
| AI Syllabus Generator | Tailored content for each learner | Personalization: 98% |
| Adaptive Quizzes | Real-time difficulty adjustment | Retention: +25% |
| Augmented Reality Learning | Immersive visualizations | Engagement: +30% |
| Cross-Platform Sync | Seamless access across devices | Usage: 95% |
| Dyslexia-Friendly Mode | Enhanced accessibility | Accessibility: 100% |

## Testing Page Breaks and Long Content
This section tests how the PDF generator handles long content and page breaks. The content should flow naturally across pages without awkward breaks or content loss.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, vitae aliquam nisl nunc vitae nisl. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, vitae aliquam nisl nunc vitae nisl.

* Item 1 with some extended text to test wrapping behavior
* Item 2 with more text
* Item 3 with even more text to ensure proper handling of list items across page boundaries
* Item 4 with content

### More Charts for Testing Multiple Pages

\`\`\`chart
{
  "type": "line",
  "data": [
    {"name": "2020", "revenue": 300, "expenses": 200, "profit": 100},
    {"name": "2021", "revenue": 500, "expenses": 300, "profit": 200},
    {"name": "2022", "revenue": 700, "expenses": 400, "profit": 300},
    {"name": "2023", "revenue": 900, "expenses": 500, "profit": 400},
    {"name": "2024", "revenue": 1100, "expenses": 600, "profit": 500}
  ]
}
\`\`\`

This should complete our comprehensive PDF export test document.`);

  const [title, setTitle] = useState<string>('PDF Export Test');
  const [fileName, setFileName] = useState<string>('pdf-export-test');
  const [primaryColor, setPrimaryColor] = useState<string>('#ae5630');
  const [secondaryColor, setSecondaryColor] = useState<string>('#232321');
  const [accentColor, setAccentColor] = useState<string>('#9d4e2c');

  const handleExport = () => {
    navigate('/pdf-export', {
      state: {
        content,
        title,
        fileName,
        brandColors: {
          primary: primaryColor,
          secondary: secondaryColor,
          accent: accentColor,
          highlight: accentColor,
          background: '#ffffff'
        }
      }
    });
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">PDF Export Test</h1>
      
      <Card className="p-6 mb-6">
        <div className="grid gap-4 mb-4">
          <div>
            <Label htmlFor="title">Document Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <Label htmlFor="fileName">File Name (without extension)</Label>
            <Input
              id="fileName"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex items-center">
                <Input
                  id="primaryColor"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-full"
                />
                <div 
                  className="w-6 h-6 ml-2 border" 
                  style={{ backgroundColor: primaryColor }}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="secondaryColor">Secondary Color</Label>
              <div className="flex items-center">
                <Input
                  id="secondaryColor"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-full"
                />
                <div 
                  className="w-6 h-6 ml-2 border" 
                  style={{ backgroundColor: secondaryColor }}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="accentColor">Accent Color</Label>
              <div className="flex items-center">
                <Input
                  id="accentColor"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-full"
                />
                <div 
                  className="w-6 h-6 ml-2 border" 
                  style={{ backgroundColor: accentColor }}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <Label htmlFor="content">Test Content</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-96 font-mono text-sm"
          />
        </div>
        
        <Button onClick={handleExport} className="w-full">
          Test PDF Export
        </Button>
      </Card>
      
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Test Instructions</h2>
        <div className="space-y-4">
          <p>
            This test page allows you to test the PDF export functionality with custom content and colors.
            The default test content includes:
          </p>
          
          <ul className="list-disc pl-6 space-y-2">
            <li>Margin handling tests</li>
            <li>Color preservation tests</li>
            <li>Chart rendering tests (line and bar charts)</li>
            <li>Table rendering tests</li>
            <li>Page break handling tests with long content</li>
          </ul>
          
          <p>
            You can customize the colors to verify proper color application in the exported PDF.
            Click the "Test PDF Export" button to generate a PDF with the current settings.
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <h3 className="font-bold text-yellow-800">Common Issues Fixed</h3>
            <ul className="list-disc pl-6 space-y-1 text-yellow-700">
              <li>Chart rendering issues - Charts now properly render with correct colors</li>
              <li>Margin handling issues - Content now respects page margins</li>
              <li>Color preservation issues - Brand colors are now properly applied throughout the document</li>
              <li>Page break issues - Content now flows naturally across pages</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PdfExportTest;
