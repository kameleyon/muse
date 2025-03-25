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

const LearningSettings: React.FC = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  
  // Learning Settings
  const [featureDiscovery, setFeatureDiscovery] = useState(true);
  const [onboardingLevel, setOnboardingLevel] = useState('standard');
  const [skillLevel, setSkillLevel] = useState('intermediate');
  const [tipVisibility, setTipVisibility] = useState('moderate');
  const [learningPath, setLearningPath] = useState(true);
  
  // Handle Learning Settings Update
  const handleSaveSettings = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API call with delay
      await new Promise((r) => setTimeout(r, 1000));
      
      dispatch(
        addToast({
          type: 'success',
          message: 'Learning and development settings saved successfully',
        })
      );
    } catch (error) {
      dispatch(
        addToast({
          type: 'error',
          message: 'Failed to save learning settings',
        })
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning and Development</CardTitle>
        <CardDescription>
          Configure learning features and onboarding experience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="settings-form-section">
          <h3 className="settings-form-title">Onboarding Experience</h3>
          <p className="settings-form-description">Customize your learning journey with MagicMuse</p>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="settings-label">Onboarding Experience Level</label>
              <select 
                className="settings-select"
                value={onboardingLevel}
                onChange={(e) => setOnboardingLevel(e.target.value)}
              >
                <option value="minimal">Minimal (Quick start)</option>
                <option value="standard">Standard (Guided introduction)</option>
                <option value="comprehensive">Comprehensive (Deep tutorials)</option>
              </select>
            </div>
            
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={featureDiscovery}
                  onChange={() => setFeatureDiscovery(!featureDiscovery)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Show feature discovery notifications</span>
            </div>
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Skill Level Adaptation</h3>
          <p className="settings-form-description">Configure how MagicMuse adapts to your experience level</p>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="settings-label">Your Skill Level</label>
              <select 
                className="settings-select"
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value)}
              >
                <option value="beginner">Beginner (Extra guidance)</option>
                <option value="intermediate">Intermediate (Standard interface)</option>
                <option value="advanced">Advanced (Power user features)</option>
                <option value="expert">Expert (Advanced workflows)</option>
              </select>
            </div>
            
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Automatically adapt based on usage patterns</span>
            </div>
            
            <div>
              <label className="settings-label">Interface Complexity</label>
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
                  <span>Simplified</span>
                  <span>Standard</span>
                  <span>Advanced</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Tips and Guidance</h3>
          <p className="settings-form-description">Configure how MagicMuse provides tips and help</p>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="settings-label">Tip Visibility</label>
              <select 
                className="settings-select"
                value={tipVisibility}
                onChange={(e) => setTipVisibility(e.target.value)}
              >
                <option value="minimal">Minimal (Essential tips only)</option>
                <option value="moderate">Moderate (Occasional tips)</option>
                <option value="frequent">Frequent (Regular guidance)</option>
                <option value="off">Off (No tips)</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                <span className="ml-2 text-sm">Writing tips</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                <span className="ml-2 text-sm">Workflow tips</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                <span className="ml-2 text-sm">AI usage tips</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                <span className="ml-2 text-sm">Keyboard shortcuts</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Learning Path Tracking</h3>
          <p className="settings-form-description">Configure personalized learning recommendations</p>
          
          <div className="space-y-4 mt-4">
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={learningPath}
                  onChange={() => setLearningPath(!learningPath)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Enable learning path recommendations</span>
            </div>
            
            <div>
              <label className="settings-label">Learning Focus Areas</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                  <span className="ml-2 text-sm">AI Collaboration</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                  <span className="ml-2 text-sm">Advanced Editing</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                  <span className="ml-2 text-sm">Content Strategy</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                  <span className="ml-2 text-sm">Productivity Features</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                  <span className="ml-2 text-sm">Team Collaboration</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                  <span className="ml-2 text-sm">Publishing Workflows</span>
                </label>
              </div>
            </div>
            
            <div>
              <Button variant="outline" size="sm">
                View Your Learning Progress
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="settings-footer">
        <Button 
          variant="outline" 
          className="mr-2"
          onClick={() => {
            setFeatureDiscovery(true);
            setOnboardingLevel('standard');
            setSkillLevel('intermediate');
            setTipVisibility('moderate');
            setLearningPath(true);
          }}
        >
          Reset to Default
        </Button>
        <Button 
          variant="primary" 
          className="text-white"
          isLoading={isLoading}
          onClick={handleSaveSettings}
        >
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LearningSettings;
