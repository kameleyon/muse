import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Lightbulb, X } from 'lucide-react';

// Define the structure of a suggestion (adjust as needed)
export interface AISuggestion {
  id: string;
  originalText?: string; // Optional: Text to be replaced
  suggestedText: string;
  explanation?: string; // Optional: Why the suggestion is made
  // Add other fields like type (clarity, grammar, etc.) if needed
}

interface AISuggestionsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  suggestions: AISuggestion[];
  onApplySuggestion: (suggestion: AISuggestion) => void; // Function to apply suggestion
  isLoading: boolean; // To show loading state
}

const AISuggestionsSidebar: React.FC<AISuggestionsSidebarProps> = ({ 
  isOpen, 
  onClose, 
  suggestions, 
  onApplySuggestion,
  isLoading 
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    // Using fixed positioning for simplicity, adjust layout as needed
    // Set fixed height, e.g., 600px, and adjust positioning (e.g., top-1/2 -translate-y-1/2 for vertical centering, or fixed bottom/right)
    // Position above chat toggle button (bottom: 20px + height: 50px + gap: 10px = 80px)
    <div className="fixed bottom-[130px] right-2 h-[700px] w-80 bg-white/50 rounded-2xl shadow-xl z-40 border border-[#bcb7af] flex flex-col"> {/* Changed bottom-5 to bottom-[80px] */}
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-neutral-light flex-shrink-0"> {/* Added flex-shrink-0 */}
        <h4 className="font-semibold text-neutral-dark text-lg flex items-center gap-2">
          <Lightbulb size={18} /> AI Suggestions
        </h4>
        <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close suggestions">
          <X size={18} />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-grow overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="text-center text-neutral-medium p-4">Loading suggestions...</div>
        ) : suggestions.length > 0 ? (
          suggestions.map((suggestion) => (
            <Card key={suggestion.id} className="p-3 border border-neutral-light hover:shadow-md transition-shadow">
              {suggestion.originalText && (
                 <p className="text-xs text-red-600 line-through mb-1">Original: {suggestion.originalText}</p>
              )}
              <p className="text-sm text-green-700 mb-1">Suggestion: {suggestion.suggestedText}</p>
              {suggestion.explanation && (
                 <p className="text-xs text-neutral-medium mb-2">{suggestion.explanation}</p>
              )}
              <Button
                variant="outline"
                size="sm" // Changed size to sm
                onClick={() => onApplySuggestion(suggestion)}
              >
                Apply Suggestion
              </Button>
            </Card>
          ))
        ) : (
          <div className="text-center text-neutral-medium p-4">No suggestions found.</div>
        )}
      </div>
    </div>
  );
};

export default AISuggestionsSidebar;