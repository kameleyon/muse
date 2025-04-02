import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Label } from '@/components/ui/Label';

const ImportOptions: React.FC = () => {
  const [activeTab, setActiveTab] = useState('file');
  const [importUrl, setImportUrl] = useState('');
  const [outlineContent, setOutlineContent] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = () => {
    setIsImporting(true);
    // Simulate import process
    setTimeout(() => {
      setIsImporting(false);
    }, 2000);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold font-heading text-secondary mb-4">Import Content (Optional)</h3>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 md:w-[400px]">
          <TabsTrigger value="file">Upload File</TabsTrigger>
          <TabsTrigger value="url">Import from URL</TabsTrigger>
          <TabsTrigger value="outline">Create from Outline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="file" className="space-y-4">
          <div className="border-2 border-dashed border-neutral-light rounded-lg p-6 text-center">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-neutral-muted" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-sm text-neutral-muted mb-4">
              Drag and drop file here, or click to select file
            </p>
            <div>
              <Button variant="outline" size="sm" className="relative">
                Browse Files
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  accept=".docx,.txt,.md,.pdf"
                />
              </Button>
            </div>
            <p className="text-xs text-neutral-muted mt-4">
              Supported formats: .docx, .txt, .md, .pdf
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="url" className="space-y-4">
          <div>
            <Label htmlFor="importUrl" className="block mb-2">URL to Import From</Label>
            <Input
              id="importUrl"
              type="url"
              value={importUrl}
              onChange={(e) => setImportUrl(e.target.value)}
              placeholder="https://example.com/blog-post"
              className="w-full"
            />
            <p className="text-xs text-neutral-muted mt-1">
              Enter the URL of the content you'd like to import as a starting point.
            </p>
          </div>
          <Button 
            onClick={handleImport} 
            disabled={!importUrl || isImporting} 
            variant="outline" 
            className="w-full sm:w-auto"
          >
            {isImporting ? 'Importing...' : 'Import Content'}
          </Button>
        </TabsContent>
        
        <TabsContent value="outline" className="space-y-4">
          <div>
            <Label htmlFor="outlineContent" className="block mb-2">Blog Post Outline</Label>
            <Textarea
              id="outlineContent"
              value={outlineContent}
              onChange={(e) => setOutlineContent(e.target.value)}
              placeholder="# Introduction
- Point 1
- Point 2

## Section 1
- Main idea
- Supporting detail
- Example

## Section 2
..."
              className="w-full h-48 font-mono text-sm"
            />
            <p className="text-xs text-neutral-muted mt-1">
              Paste your outline using markdown formatting or simple bullet points.
            </p>
          </div>
          <Button 
            onClick={handleImport} 
            disabled={!outlineContent || isImporting} 
            variant="outline" 
            className="w-full sm:w-auto"
          >
            {isImporting ? 'Processing...' : 'Use Outline'}
          </Button>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ImportOptions;
