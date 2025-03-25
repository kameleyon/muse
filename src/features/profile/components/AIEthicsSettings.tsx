import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToast } from '@/store/slices/uiSlice';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';

const AIEthicsSettings: React.FC = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  
  // AI Ethics Settings
  const [biasDetection, setBiasDetection] = useState(true);
  const [contentWarnings, setContentWarnings] = useState(true);
  const [inclusivityChecker, setInclusivityChecker] = useState(true);
  const [ethicalBoundaries, setEthicalBoundaries] = useState('moderate');
  const [attributionLevel, setAttributionLevel] = useState('standard');
  
  // Handle AI Ethics Settings Update
  const handleSaveSettings = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API call with delay
      await new Promise((r) => setTimeout(r, 1000));
      
      dispatch(
        addToast({
          type: 'success',
          message: 'AI Ethics settings saved successfully',
        })
      );
    } catch (error) {
      dispatch(
        addToast({
          type: 'error',
          message: 'Failed to save AI Ethics settings',
        })
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Responsible AI Settings</CardTitle>
        <CardDescription>
          Configure ethical AI usage boundaries and transparency settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="settings-form-section">
          <h3 className="settings-form-title">Bias Detection</h3>
          <p className="settings-form-description">Control how MagicMuse identifies and manages potential bias</p>
          
          <div className="space-y-4 mt-4">
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={biasDetection}
                  onChange={() => setBiasDetection(!biasDetection)} 
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Enable bias detection in AI-generated content</span>
            </div>
            
            <div>
              <label className="settings-label">Bias Detection Sensitivity</label>
              <div className="mt-2">
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  defaultValue="3"
                  className="w-full h-2 bg-[#bcb7af] rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-[#3d3d3a] mt-1">
                  <span className="text-xs sm:text-sm">Low</span>
                  <span className="hidden sm:inline text-xs sm:text-sm">Moderate</span>
                  <span className="text-xs sm:text-sm">High</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Content Warnings</h3>
          <p className="settings-form-description">Configure how MagicMuse handles potentially sensitive content</p>
          
          <div className="space-y-4 mt-4">
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={contentWarnings}
                  onChange={() => setContentWarnings(!contentWarnings)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Show content warnings for sensitive topics</span>
            </div>
            
            <div>
              <label className="settings-label">Warning Categories</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                  <span className="ml-2 text-sm">Violence</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                  <span className="ml-2 text-sm">Discrimination</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                  <span className="ml-2 text-sm">Political Content</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                  <span className="ml-2 text-sm">Adult Themes</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Inclusivity Checker</h3>
          <p className="settings-form-description">Configure how MagicMuse promotes inclusive language</p>
          
          <div className="space-y-4 mt-4">
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={inclusivityChecker}
                  onChange={() => setInclusivityChecker(!inclusivityChecker)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Enable inclusivity suggestions</span>
            </div>
            
            <div>
              <label className="settings-label">Suggestion Timing</label>
              <select className="settings-select">
                <option>Real-time (as you type)</option>
                <option>On demand (when requested)</option>
                <option>During content review</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Ethical AI Usage Boundaries</h3>
          <p className="settings-form-description">Define how strictly MagicMuse adheres to ethical guidelines</p>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="settings-label">Ethical Boundary Level</label>
              <select 
                className="settings-select"
                value={ethicalBoundaries}
                onChange={(e) => setEthicalBoundaries(e.target.value)}
              >
                <option value="strict">Strict (Most conservative)</option>
                <option value="moderate">Moderate (Balanced approach)</option>
                <option value="flexible">Flexible (Context-aware)</option>
              </select>
              <p className="text-xs text-[#3d3d3a] mt-1">
                This affects what types of content the AI will generate or suggest
              </p>
            </div>
            
            <div className="text-xs text-[#3d3d3a] bg-[#f9f7f1] p-3 rounded-md border border-[#bcb7af]">
              <p>Note: Even with flexible settings, MagicMuse maintains core ethical standards and will not generate harmful or illegal content.</p>
            </div>
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Attribution and Transparency</h3>
          <p className="settings-form-description">Configure how MagicMuse attributes AI-generated content</p>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="settings-label">Attribution Level</label>
              <select 
                className="settings-select"
                value={attributionLevel}
                onChange={(e) => setAttributionLevel(e.target.value)}
              >
                <option value="minimal">Minimal (No visible attribution)</option>
                <option value="standard">Standard (Attribution as needed)</option>
                <option value="comprehensive">Comprehensive (Always indicate AI generation)</option>
              </select>
            </div>
            
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Show AI confidence levels for factual statements</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="settings-footer flex-col sm:flex-row">
        <Button 
          variant="outline" 
          className="mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto order-2 sm:order-1"
          onClick={() => {
            setBiasDetection(true);
            setContentWarnings(true);
            setInclusivityChecker(true);
            setEthicalBoundaries('moderate');
            setAttributionLevel('standard');
          }}
        >
          Reset to Default
        </Button>
        <Button 
          variant="primary" 
          className="text-white w-full sm:w-auto order-1 sm:order-2"
          isLoading={isLoading}
          onClick={handleSaveSettings}
        >
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AIEthicsSettings;
