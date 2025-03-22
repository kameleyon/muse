import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { availableModels } from '@/services/ai/openrouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface ModelSelectorProps {
  selectedModel: string;
  onSelect: (modelId: string) => void;
  disabled?: boolean;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onSelect,
  disabled = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get selected model details
  const selectedModelDetails = availableModels.find(model => model.id === selectedModel) || availableModels[0];

  return (
    <div>
      <div 
        className="flex items-center justify-between cursor-pointer p-3 border border-neutral-light dark:border-neutral-dark rounded-md"
        onClick={() => !disabled && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          {selectedModel.includes('claude') ? (
            <svg width="24" height="24" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
              <path fillRule="evenodd" clipRule="evenodd" d="M25 50C38.8071 50 50 38.8071 50 25C50 11.1929 38.8071 0 25 0C11.1929 0 0 11.1929 0 25C0 38.8071 11.1929 50 25 50Z" fill="#F2B705"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M19.2676 23.0149C20.7775 23.0149 22.0149 21.7851 22.0149 20.2676C22.0149 18.7501 20.7775 17.5202 19.2676 17.5202C17.7501 17.5202 16.5202 18.7501 16.5202 20.2676C16.5202 21.7851 17.7501 23.0149 19.2676 23.0149Z" fill="#2D3142"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M30.7324 23.0149C32.2499 23.0149 33.4798 21.7851 33.4798 20.2676C33.4798 18.7501 32.2499 17.5202 30.7324 17.5202C29.2225 17.5202 27.9851 18.7501 27.9851 20.2676C27.9851 21.7851 29.2225 23.0149 30.7324 23.0149Z" fill="#2D3142"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M18.6678 34.3582C20.3759 35.4478 22.5224 36.0075 25 36.0075C27.4776 36.0075 29.6241 35.4478 31.3322 34.3582C33.1354 33.206 34.3284 31.4328 34.3284 29.1044V29.0522C34.3284 28.3022 33.6907 27.6642 32.9404 27.6642C32.1904 27.6642 31.5522 28.3022 31.5522 29.0522C31.5522 30.2985 30.8559 31.3097 29.7239 32.0187C28.5073 32.7873 26.9137 33.2313 25 33.2313C23.0863 33.2313 21.4927 32.7873 20.2761 32.0187C19.1441 31.3097 18.4478 30.2985 18.4478 29.0522C18.4478 28.3022 17.8096 27.6642 17.0596 27.6642C16.3093 27.6642 15.6716 28.3022 15.6716 29.0522V29.1044C15.6716 31.4328 16.8646 33.206 18.6678 34.3582Z" fill="#2D3142"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
              <path d="M10.5 14C10.5 13.1716 11.1716 12.5 12 12.5C12.8284 12.5 13.5 13.1716 13.5 14C13.5 14.8284 12.8284 15.5 12 15.5C11.1716 15.5 10.5 14.8284 10.5 14Z" fill="#16A34A"/>
              <path d="M8.5 12.5L10.7071 10.2929C11.0976 9.90237 11.0976 9.26921 10.7071 8.87868C10.3166 8.48816 9.68342 8.48816 9.29289 8.87868L5.29289 12.8787C4.90237 13.2692 4.90237 13.9024 5.29289 14.2929L9.29289 18.2929C9.68342 18.6834 10.3166 18.6834 10.7071 18.2929C11.0976 17.9024 11.0976 17.2692 10.7071 16.8787L8.5 14.5H15C15.8284 14.5 16.5 13.8284 16.5 13V9C16.5 8.17157 17.1716 7.5 18 7.5H19.5" stroke="#16A34A" strokeWidth="1.5"/>
            </svg>
          )}
          <div>
            <div className="font-medium">{selectedModelDetails.name}</div>
            <div className="text-xs text-neutral-medium truncate max-w-md">{selectedModelDetails.description}</div>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-xs text-neutral-medium mr-2">${selectedModelDetails.costPer1KTokens.toFixed(5)}/1K tokens</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden mt-2"
          >
            <div className="grid grid-cols-1 gap-3 p-1">
              {availableModels.map((model) => (
                <Card 
                  key={model.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedModel === model.id ? 'border-primary' : ''
                  }`}
                  onClick={() => {
                    onSelect(model.id);
                    setIsExpanded(false);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium mb-1">{model.name}</h3>
                        <p className="text-sm text-neutral-medium mb-2">{model.description}</p>
                        <p className="text-xs text-neutral-medium">{model.strengths}</p>
                      </div>
                      <div className="text-xs bg-neutral-light/30 dark:bg-neutral-dark/30 text-neutral-medium px-2 py-1 rounded-full">
                        ${model.costPer1KTokens.toFixed(5)}/1K tokens
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModelSelector;
