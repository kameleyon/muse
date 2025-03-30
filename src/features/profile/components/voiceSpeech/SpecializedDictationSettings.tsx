import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input'; // Import Input
import { Briefcase } from 'lucide-react';

// Define types for clarity
type DictationDomain = 'general' | 'medical' | 'legal' | 'technical' | 'creative';

const SpecializedDictationSettings: React.FC = () => {
  // Local state for this section
  const [specializedDictation, setSpecializedDictation] = useState<DictationDomain>('general');
  const [autoSwitchModes, setAutoSwitchModes] = useState(true);
  const [customTerminologyFile, setCustomTerminologyFile] = useState<File | null>(null); // State for file upload

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setCustomTerminologyFile(event.target.files[0]);
      // TODO: Add logic to actually upload/process the file
      console.log("Selected file:", event.target.files[0].name);
    }
  };

  const getDomainDescription = (domain: DictationDomain): string => {
    switch (domain) {
      case 'medical': return 'Optimized for medical terms, procedures, and documentation';
      case 'legal': return 'Optimized for legal terminology, citations, and documents';
      case 'technical': return 'Optimized for scientific and technical terminology';
      case 'creative': return 'Optimized for narrative, dialog, and descriptive language';
      default: return '';
    }
  };

  return (
    <div className="settings-form-section">
      <h3 className="settings-form-title">Specialized Dictation Modes</h3>
      <p className="settings-form-description">Configure specialized dictation for specific domains</p>

      <div className="space-y-4 mt-4">
        <div>
          <label className="settings-label">Specialized Domain</label>
          <select
            className="settings-select"
            value={specializedDictation}
            onChange={(e) => setSpecializedDictation(e.target.value as DictationDomain)}
          >
            <option value="general">General</option>
            <option value="medical">Medical</option>
            <option value="legal">Legal</option>
            <option value="technical">Technical/Scientific</option>
            <option value="creative">Creative Writing</option>
          </select>
        </div>

        {specializedDictation !== 'general' && (
          <div className="p-3 bg-[#f9f7f1] rounded-md border border-[#bcb7af]">
            <p className="text-sm font-medium flex items-center">
              <Briefcase size={16} className="mr-2 text-[#3d3d3a]" />
              {specializedDictation.charAt(0).toUpperCase() + specializedDictation.slice(1)} terminology module active
            </p>
            <p className="text-xs text-[#3d3d3a] mt-1">
              {getDomainDescription(specializedDictation)}
            </p>
          </div>
        )}

        <div className="toggle-switch-container">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={autoSwitchModes}
              onChange={() => setAutoSwitchModes(!autoSwitchModes)}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">Automatically switch modes based on document type</span>
        </div>

        <div>
          <label className="settings-label">Terminology Training</label>
          <div className="flex gap-2 items-center"> {/* Use items-center */}
            <label htmlFor="terminology-upload" className="sr-only">Upload custom terminology file</label>
            <Input
              id="terminology-display" // Display only
              type="text"
              className="settings-input flex-1"
              placeholder="Upload custom terminology file"
              value={customTerminologyFile ? customTerminologyFile.name : ""}
              readOnly
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('terminology-upload')?.click()} // Trigger hidden input
            >
              Browse
            </Button>
            <input
              type="file"
              id="terminology-upload"
              accept=".csv, .txt" // Specify acceptable file types
              onChange={handleFileChange}
              className="hidden" // Hide the actual file input
            />
          </div>
          <p className="text-xs text-[#3d3d3a] mt-1">
            CSV or TXT file with specialized terminology to improve recognition accuracy
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpecializedDictationSettings;