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
import { Mic, Volume2, VolumeX, Play, Pause, Timer, FastForward, Headphones, Briefcase, Volume } from 'lucide-react';

const VoiceSpeechSettings: React.FC = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  
  // Voice and Speech Settings
  const [voiceInput, setVoiceInput] = useState(true);
  const [readAloud, setReadAloud] = useState(true);
  const [accentType, setAccentType] = useState('neutral');
  const [specializedDictation, setSpecializedDictation] = useState('general');
  
  // Handle Voice and Speech Settings Update
  const handleSaveSettings = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API call with delay
      await new Promise((r) => setTimeout(r, 1000));
      
      dispatch(
        addToast({
          type: 'success',
          message: 'Voice and speech settings saved successfully',
        })
      );
    } catch (error) {
      dispatch(
        addToast({
          type: 'error',
          message: 'Failed to save voice and speech settings',
        })
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Voice and Speech Settings</CardTitle>
        <CardDescription>
          Configure voice input and text-to-speech features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="settings-form-section">
          <h3 className="settings-form-title">Voice Input Calibration</h3>
          <p className="settings-form-description">Configure how MagicMuse processes your voice input</p>
          
          <div className="space-y-4 mt-4">
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={voiceInput}
                  onChange={() => setVoiceInput(!voiceInput)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Enable voice input</span>
            </div>
            
            {voiceInput && (
              <>
                <div>
                  <label className="settings-label">Microphone Test</label>
                  <div className="flex items-center gap-4 p-3 bg-[#f9f7f1] rounded-md border border-[#bcb7af]">
                    <Mic size={24} className="text-[#ae5630]" />
                    <div className="flex-1">
                      <div className="h-2 bg-[#bcb7af] rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-[#ae5630]"></div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Test Mic
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="settings-label">Accent Adaptation</label>
                  <select 
                    className="settings-select"
                    value={accentType}
                    onChange={(e) => setAccentType(e.target.value)}
                  >
                    <option value="neutral">General (Neutral Accent)</option>
                    <option value="american">American English</option>
                    <option value="british">British English</option>
                    <option value="australian">Australian English</option>
                    <option value="indian">Indian English</option>
                    <option value="custom">Custom Adaptation</option>
                  </select>
                </div>
                
                {accentType === 'custom' && (
                  <div>
                    <label className="settings-label">Custom Accent Training</label>
                    <div className="space-y-2">
                      <p className="text-xs text-[#3d3d3a]">Record yourself reading the following passages to help MagicMuse adapt to your accent.</p>
                      <Button variant="outline" size="sm">
                        Start Voice Training
                      </Button>
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="settings-label">Background Noise Filtering</label>
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
                      <span>Low</span>
                      <span>Medium</span>
                      <span>High</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Voice Command Customization</h3>
          <p className="settings-form-description">Configure custom voice commands</p>
          
          <div className="space-y-4 mt-4">
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Enable voice commands</span>
            </div>
            
            <div>
              <label className="settings-label">Command Sensitivity</label>
              <select className="settings-select">
                <option>Low (Fewer false activations)</option>
                <option>Medium (Balanced)</option>
                <option>High (More responsive)</option>
              </select>
            </div>
            
            <div>
              <label className="settings-label">Custom Commands</label>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
                  <div>
                    <p className="text-sm font-medium">"New paragraph"</p>
                    <p className="text-xs text-[#3d3d3a]">Inserts a new paragraph</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 px-2">Edit</Button>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
                  <div>
                    <p className="text-sm font-medium">"Save document"</p>
                    <p className="text-xs text-[#3d3d3a]">Saves the current document</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 px-2">Edit</Button>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
                  <div>
                    <p className="text-sm font-medium">"Apply heading style"</p>
                    <p className="text-xs text-[#3d3d3a]">Formats as heading</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 px-2">Edit</Button>
                </div>
              </div>
              
              <Button variant="outline" size="sm">
                Add Custom Command
              </Button>
            </div>
            
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Voice command confirmation feedback</span>
            </div>
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Specialized Dictation Modes</h3>
          <p className="settings-form-description">Configure specialized dictation for specific domains</p>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="settings-label">Specialized Domain</label>
              <select 
                className="settings-select"
                value={specializedDictation}
                onChange={(e) => setSpecializedDictation(e.target.value)}
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
                  {specializedDictation === 'medical' && 'Medical terminology module active'}
                  {specializedDictation === 'legal' && 'Legal terminology module active'}
                  {specializedDictation === 'technical' && 'Technical terminology module active'}
                  {specializedDictation === 'creative' && 'Creative writing module active'}
                </p>
                <p className="text-xs text-[#3d3d3a] mt-1">
                  {specializedDictation === 'medical' && 'Optimized for medical terms, procedures, and documentation'}
                  {specializedDictation === 'legal' && 'Optimized for legal terminology, citations, and documents'}
                  {specializedDictation === 'technical' && 'Optimized for scientific and technical terminology'}
                  {specializedDictation === 'creative' && 'Optimized for narrative, dialog, and descriptive language'}
                </p>
              </div>
            )}
            
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Automatically switch modes based on document type</span>
            </div>
            
            <div>
              <label className="settings-label">Terminology Training</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="settings-input"
                  placeholder="Upload custom terminology file"
                />
                <Button variant="outline" size="sm">Browse</Button>
              </div>
              <p className="text-xs text-[#3d3d3a] mt-1">
                CSV or TXT file with specialized terminology to improve recognition accuracy
              </p>
            </div>
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Read Aloud Voice</h3>
          <p className="settings-form-description">Configure text-to-speech voice and preferences</p>
          
          <div className="space-y-4 mt-4">
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={readAloud}
                  onChange={() => setReadAloud(!readAloud)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Enable read aloud feature</span>
            </div>
            
            {readAloud && (
              <>
                <div>
                  <label className="settings-label">Voice Selection</label>
                  <select className="settings-select">
                    <option>Emma (Female, US English)</option>
                    <option>James (Male, US English)</option>
                    <option>Sophie (Female, UK English)</option>
                    <option>Thomas (Male, UK English)</option>
                    <option>System Default Voice</option>
                  </select>
                </div>
                
                <div>
                  <label className="settings-label">Voice Sample</label>
                  <div className="flex items-center gap-2 p-3 bg-[#f9f7f1] rounded-md border border-[#bcb7af]">
                    <Button variant="outline" size="sm" className="w-8 h-8 p-0 flex items-center justify-center">
                      <Play size={16} />
                    </Button>
                    <div className="flex-1">
                      <div className="h-2 bg-[#bcb7af] rounded-full overflow-hidden">
                        <div className="h-full w-1/4 bg-[#ae5630]"></div>
                      </div>
                    </div>
                    <Volume size={16} className="text-[#3d3d3a]" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="settings-label">Speaking Rate</label>
                    <div className="flex items-center gap-2">
                      <Timer size={16} className="text-[#3d3d3a]" />
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        defaultValue="3"
                        className="w-full h-2 bg-[#bcb7af] rounded-lg appearance-none cursor-pointer"
                      />
                      <FastForward size={16} className="text-[#3d3d3a]" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="settings-label">Volume</label>
                    <div className="flex items-center gap-2">
                      <VolumeX size={16} className="text-[#3d3d3a]" />
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        defaultValue="4"
                        className="w-full h-2 bg-[#bcb7af] rounded-lg appearance-none cursor-pointer"
                      />
                      <Volume2 size={16} className="text-[#3d3d3a]" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="settings-label">Audio Output</label>
                  <select className="settings-select">
                    <option>System Default Device</option>
                    <option>Built-in Speakers</option>
                    <option>Headphones</option>
                    <option>External Speakers</option>
                  </select>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Highlight text while reading</span>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Auto-pause at punctuation</span>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Noise Filtering</h3>
          <p className="settings-form-description">Configure background noise handling</p>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="settings-label">Noise Cancellation Level</label>
              <select className="settings-select">
                <option>Off</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Adaptive</option>
              </select>
            </div>
            
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Automatic gain control</span>
            </div>
            
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Echo cancellation</span>
            </div>
            
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Pause dictation when background noise is high</span>
            </div>
            
            <div className="p-3 bg-[#f9f7f1] rounded-md border border-[#bcb7af]">
              <p className="text-sm font-medium flex items-center">
                <Headphones size={16} className="mr-2 text-[#3d3d3a]" />
                Pro Tip
              </p>
              <p className="text-xs text-[#3d3d3a] mt-1">
                For best dictation results, use a noise-cancelling headset microphone in a quiet environment.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="settings-footer">
        <Button 
          variant="outline" 
          className="mr-2"
          onClick={() => {
            setVoiceInput(true);
            setReadAloud(true);
            setAccentType('neutral');
            setSpecializedDictation('general');
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

export default VoiceSpeechSettings;
