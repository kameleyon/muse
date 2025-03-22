import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { contentPresets } from '@/services/ai/openrouter';
import { Button } from '@/components/ui/Button';

interface PresetSelectorProps {
  contentType: string;
  selectedPreset: string | null;
  onSelect: (preset: any) => void;
  disabled?: boolean;
}

const PresetSelector: React.FC<PresetSelectorProps> = ({
  contentType,
  selectedPreset,
  onSelect,
  disabled = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filteredPresets, setFilteredPresets] = useState(contentPresets);

  // Filter presets by content type
  useEffect(() => {
    if (contentType) {
      setFilteredPresets(contentPresets.filter(preset => preset.type === contentType));
    } else {
      setFilteredPresets(contentPresets);
    }
  }, [contentType]);

  // Get selected preset details
  const selectedPresetDetails = selectedPreset 
    ? contentPresets.find(preset => preset.id === selectedPreset) 
    : null;

  return (
    <div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Preset Templates</label>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredPresets.map((preset) => (
          <motion.div
            key={preset.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-3 rounded-md cursor-pointer border transition-colors duration-200 ${
              selectedPreset === preset.id
                ? 'border-primary bg-primary/10'
                : 'border-neutral-light dark:border-neutral-dark hover:border-neutral-medium'
            }`}
            onClick={() => !disabled && onSelect(preset)}
          >
            <div className="flex flex-col h-full">
              <h3 className="font-medium mb-1">{preset.name}</h3>
              <p className="text-xs text-neutral-medium mb-2 flex-grow">{preset.description}</p>
              <div className="flex justify-between items-center text-xs text-neutral-medium">
                <span>
                  {preset.parameters.model.includes('claude')
                    ? 'Claude'
                    : preset.parameters.model.includes('gpt')
                    ? 'GPT'
                    : 'AI'} model
                </span>
                <span>
                  {preset.parameters.temperature.toFixed(1)} temperature
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredPresets.length === 0 && (
        <div className="text-center p-4 text-neutral-medium">
          No presets available for this content type.
        </div>
      )}
    </div>
  );
};

export default PresetSelector;
