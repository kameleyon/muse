import React, { useMemo } from 'react'; // Removed useState, useEffect
import { Card } from '@/components/ui/Card';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import VisualElementRenderer from './VisualElementRenderer'; // Direct import

interface GenerationPreviewProps {
  content?: string;
  templateId?: string;
  brandColors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
  fonts?: {
    headingFont: string;
    bodyFont: string;
  };
}

const GenerationPreview: React.FC<GenerationPreviewProps> = ({
  content = '', // Default to empty string
  templateId = 'default',
  brandColors = {
    primary: '#ae5630', // Use theme default
    secondary: '#232321', // Use theme default
    accent: '#9d4e2c' // Use theme default
  },
  fonts = {
    headingFont: 'Comfortaa, sans-serif', // Use theme default
    bodyFont: 'Questrial, sans-serif' // Use theme default
  }
}) => {

  // Apply template-specific styling
  const getTemplateStyles = () => {
    const baseStyles = {
      '--primary-color': brandColors.primary,
      '--secondary-color': brandColors.secondary,
      '--accent-color': brandColors.accent,
      '--heading-font': fonts.headingFont,
      '--body-font': fonts.bodyFont,
    } as React.CSSProperties;
    return baseStyles;
  };

  // Custom components for markdown rendering with template styles
  const markdownComponents = useMemo(() => ({
    h1: ({ node, ...props }: any) => <h1 style={{ fontFamily: fonts.headingFont, color: brandColors.primary, fontSize: '1.8rem', paddingBottom: '0.5rem', marginTop: '2rem', marginBottom: '1.5rem' }} {...props} />,
    h2: ({ node, ...props }: any) => <h2 style={{ fontFamily: fonts.headingFont, color: brandColors.secondary, fontSize: '1.5rem', marginTop: '2.5rem', marginBottom: '1.5rem' }} {...props} />,
    h3: ({ node, ...props }: any) => <h3 style={{ fontFamily: fonts.headingFont, color: brandColors.secondary, fontSize: '1.25rem', marginTop: '1.25rem', marginBottom: '0.5rem' }} {...props} />,
    p: ({ node, ...props }: any) => <p style={{ fontFamily: fonts.bodyFont, marginBottom: '0.75rem', lineHeight: '1.6', fontSize: '0.95rem' }} {...props} />,
    ul: ({ node, ...props }: any) => <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }} {...props} />,
    li: ({ node, ...props }: any) => <li style={{ fontFamily: fonts.bodyFont, marginBottom: '0.25rem', fontSize: '0.95rem' }} {...props} />,
    a: ({ node, ...props }: any) => <a style={{ color: brandColors.accent, textDecoration: 'none' }} {...props} />,
    blockquote: ({ node, ...props }: any) => <blockquote style={{ borderLeft: `3px solid ${brandColors.accent}`, paddingLeft: '1rem', fontStyle: 'italic', color: brandColors.secondary, margin: '1rem 0' }} {...props} />,
    pre: ({ node, ...props }: any) => <pre style={{ backgroundColor: '#f7f7f7', padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '0.85rem', fontFamily: 'monospace', marginBottom: '1rem' }} {...props} />,

    // Visual Element Handling (code blocks)
    code: ({ node, className, children, ...props }: any) => {
      if (className === 'language-visual-specification') {
        try {
          const specText = String(children);
          // Determine type (default to chart)
          let type: 'chart' | 'table' | 'diagram' | 'infographic' = 'chart';
          if (specText.toLowerCase().includes('table')) type = 'table';
          else if (specText.toLowerCase().includes('diagram')) type = 'diagram';
          else if (specText.toLowerCase().includes('infographic')) type = 'infographic';

          // Extract title
          const titleMatch = specText.match(/Title:\s*([\s\S]*?)(?=\nData:|\nElements:|\nLayout:|\nColor Usage:|\n\`\`\`)/);
          const title = titleMatch ? titleMatch[1].trim() : 'Visual Element';

          // Extract the raw description/data part
          const dataMatch = specText.match(/Data:\s*([\s\S]*?)(?=\nElements:|\nLayout:|\nColor Usage:|\n\`\`\`)/);
          const rawDataContent = dataMatch ? dataMatch[1].trim() : specText; // Fallback to full spec if Data: not found

          return (
            <VisualElementRenderer
              specData={{ type, title, rawData: rawDataContent }} // Pass extracted description/data
              brandColors={brandColors}
            />
          );
        } catch (e) {
          console.error("Error parsing visual specification:", e);
          return (
            <div className="visual-element-placeholder p-3 my-4 rounded border text-sm italic text-neutral-medium" style={{ borderColor: `${brandColors.primary}30`, background: `${brandColors.primary}05`}}>
              [Visual Element Error: Could not parse specification]
            </div>
          );
        }
      }
      // Render normal code blocks
      return <code className={className} {...props}>{children}</code>;
    },

    // Visual Element Handling (img placeholders) & Fix via.placeholder.com errors
    img: ({ node, src, alt, ...props }: any) => {
       // If it's a placeholder pattern (no src, specific alt text)
       if (!src && alt && (alt.startsWith('Visualization:') || alt.startsWith('Visual:') || alt?.includes('Logo') || alt?.includes('Company Logo') || alt?.includes('Chart') || alt?.includes('Graph'))) {
         try {
           // Special case for the company logo
           if (alt.includes('Company Logo') && alt.includes('brain') && alt.includes('circuit')) {
             return (
               <div className="flex justify-center my-4">
                 <div className="px-4 py-3 rounded font-bold text-white text-xl flex items-center" style={{backgroundColor: '#6c2323'}}>
                   <svg viewBox="0 0 50 50" width="30" height="30" className="mr-2">
                     <path d="M25,10 C15,10 10,20 10,25 C10,35 20,40 25,40 C30,40 40,35 40,25 C40,15 35,10 25,10 Z" fill="none" stroke="white" strokeWidth="2" />
                     <path d="M20,20 L30,30 M30,20 L20,30 M25,15 L25,35" stroke="white" strokeWidth="1" />
                   </svg>
                   InstaSmart
                 </div>
               </div>
             );
           }

           let type: 'chart' | 'table' | 'diagram' | 'infographic' = 'chart';
           if (alt.toLowerCase().includes('table')) type = 'table';
           else if (alt.toLowerCase().includes('diagram') || alt.toLowerCase().includes('split-screen')) type = 'diagram';
           else if (alt.toLowerCase().includes('infographic')) type = 'infographic';

           const title = alt.split(':').length > 1 ? alt.split(':')[1].trim() : alt;

           // Pass the alt text itself as the rawData description
           return (
             <VisualElementRenderer
               specData={{ type, title, rawData: alt }}
               brandColors={{ primary: '#6c2323', secondary: '#167683', accent: brandColors.accent }}
             />
           );
         } catch (e) {
           console.error("Error rendering visual element from img placeholder:", e);
           return (
             <div className="visual-element-placeholder p-3 my-4 rounded border text-sm italic text-neutral-medium" style={{ borderColor: '#6c232330', background: '#6c232305'}}>
               [Visual Element: {alt}]
             </div>
           );
         }
       }
       // Explicitly ignore via.placeholder.com URLs
       if (src && src.includes('via.placeholder.com')) {
            console.warn(`Ignoring placeholder image URL: ${src}`);
            return null; // Don't render these images
       }
       // Render other valid images
       if (src) {
            return <img src={src} alt={alt} style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px', margin: '1rem 0' }} {...props} />;
       }
       // Render valid images (removed duplicate code)
       if (src) {
           // Ignore placeholder.com URLs
           if (src.includes('via.placeholder.com')) {
               console.warn(`Ignoring placeholder image URL: ${src}`);
               return null; // Don't render these images
           }
           return <img src={src} alt={alt} style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px', margin: '1rem 0' }} {...props} />;
       }
       // Return null if no src and not a recognized placeholder pattern
       return null;
    }
  }), [brandColors, fonts]);

  return (
    <Card className="p-4 border border-neutral-light bg-white shadow-md h-[700px] flex flex-col">
      <h4 className="font-semibold text-neutral-dark mb-4 text-center text-sm flex-shrink-0">
        Real-Time Preview
      </h4>
      <div
        className={`flex-grow overflow-y-auto text-sm text-neutral-dark bg-white/50 p-4 rounded custom-scrollbar template-${templateId} whitespace-pre-wrap`}
        style={{ overflowWrap: 'break-word', ...getTemplateStyles() }}
      >
        {content ? (
          // Render content directly using ReactMarkdown
          <ReactMarkdown
             remarkPlugins={[remarkGfm]}
             components={markdownComponents} // Use our custom renderers
           >
             {content}
           </ReactMarkdown>
        ) : (
          <p className="text-neutral-medium italic text-center mt-10">
            Click "Start Content Generation" to begin...
          </p>
        )}
      </div>
    </Card>
  );
};

export default GenerationPreview;