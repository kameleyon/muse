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
import { Keyboard, PenTool, Edit, PlusCircle, Laptop, Smartphone, Tablet, RotateCcw, Fingerprint, AlertTriangle } from 'lucide-react';

const KeyboardInputSettings: React.FC = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  
  // Keyboard and Input Settings
  const [customShortcuts, setCustomShortcuts] = useState(true);
  const [macroCreation, setMacroCreation] = useState(true);
  const [inputDevices, setInputDevices] = useState(['keyboard', 'mouse']);
  
  // Handle Keyboard and Input Settings Update
  const handleSaveSettings = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API call with delay
      await new Promise((r) => setTimeout(r, 1000));
      
      dispatch(
        addToast({
          type: 'success',
          message: 'Keyboard and input settings saved successfully',
        })
      );
    } catch (error) {
      dispatch(
        addToast({
          type: 'error',
          message: 'Failed to save keyboard and input settings',
        })
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleInputDevice = (device: 'keyboard' | 'mouse' | 'touch' | 'pen' | 'voice') => {
    if (inputDevices.includes(device)) {
      setInputDevices(inputDevices.filter(d => d !== device));
    } else {
      setInputDevices([...inputDevices, device]);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Keyboard and Input Configuration</CardTitle>
        <CardDescription>
          Configure keyboard shortcuts, input devices, and input behavior
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="settings-form-section">
          <h3 className="settings-form-title">Keyboard Shortcuts</h3>
          <p className="settings-form-description">Configure custom keyboard shortcuts for common actions</p>
          
          <div className="space-y-4 mt-4">
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={customShortcuts}
                  onChange={() => setCustomShortcuts(!customShortcuts)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Enable custom keyboard shortcuts</span>
            </div>
            
            {customShortcuts && (
              <>
                <div>
                  <label className="settings-label">Common Actions</label>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
                      <div>
                        <p className="text-sm font-medium">New Document</p>
                        <p className="text-xs text-[#3d3d3a]">Creates a new document</p>
                      </div>
                      <div className="flex gap-1">
                        <div className="px-2 py-1 bg-white border border-[#bcb7af] rounded text-sm">Ctrl</div>
                        <div className="px-2 py-1 bg-white border border-[#bcb7af] rounded text-sm">N</div>
                        <Button variant="ghost" size="sm" className="h-6 ml-1">Edit</Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
                      <div>
                        <p className="text-sm font-medium">Save Document</p>
                        <p className="text-xs text-[#3d3d3a]">Saves the current document</p>
                      </div>
                      <div className="flex gap-1">
                        <div className="px-2 py-1 bg-white border border-[#bcb7af] rounded text-sm">Ctrl</div>
                        <div className="px-2 py-1 bg-white border border-[#bcb7af] rounded text-sm">S</div>
                        <Button variant="ghost" size="sm" className="h-6 ml-1">Edit</Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
                      <div>
                        <p className="text-sm font-medium">AI Suggestions</p>
                        <p className="text-xs text-[#3d3d3a]">Triggers AI assistance</p>
                      </div>
                      <div className="flex gap-1">
                        <div className="px-2 py-1 bg-white border border-[#bcb7af] rounded text-sm">Alt</div>
                        <div className="px-2 py-1 bg-white border border-[#bcb7af] rounded text-sm">Space</div>
                        <Button variant="ghost" size="sm" className="h-6 ml-1">Edit</Button>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    <PlusCircle size={16} className="mr-1" />
                    Add Custom Shortcut
                  </Button>
                </div>
                
                <div>
                  <label className="settings-label">Preset Configurations</label>
                  <select className="settings-select">
                    <option>MagicMuse Default</option>
                    <option>Word Processor Style</option>
                    <option>Code Editor Style</option>
                    <option>Custom Configuration</option>
                  </select>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Show keyboard shortcuts in tooltips</span>
                </div>
                
                <div className="flex items-center p-3 bg-[#f9f7f1] rounded-md border border-[#bcb7af]">
                  <Keyboard size={20} className="mr-2 text-[#3d3d3a]" />
                  <div>
                    <p className="text-sm font-medium">Keyboard Shortcuts Reference</p>
                    <p className="text-xs text-[#3d3d3a]">View all available keyboard shortcuts</p>
                  </div>
                  <Button variant="outline" size="sm" className="ml-auto">
                    View All
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Macro Creation</h3>
          <p className="settings-form-description">Configure automated macros for repeated actions</p>
          
          <div className="space-y-4 mt-4">
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={macroCreation}
                  onChange={() => setMacroCreation(!macroCreation)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Enable macro creation</span>
            </div>
            
            {macroCreation && (
              <>
                <div>
                  <label className="settings-label">Saved Macros</label>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
                      <div>
                        <p className="text-sm font-medium">Format Heading</p>
                        <p className="text-xs text-[#3d3d3a]">Applies heading style with numbered format</p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-6">Run</Button>
                        <Button variant="ghost" size="sm" className="h-6">Edit</Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
                      <div>
                        <p className="text-sm font-medium">Insert Template Block</p>
                        <p className="text-xs text-[#3d3d3a]">Inserts standard content block</p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-6">Run</Button>
                        <Button variant="ghost" size="sm" className="h-6">Edit</Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
                      <div>
                        <p className="text-sm font-medium">Prepare for Export</p>
                        <p className="text-xs text-[#3d3d3a]">Formats document for export</p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-6">Run</Button>
                        <Button variant="ghost" size="sm" className="h-6">Edit</Button>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    <PlusCircle size={16} className="mr-1" />
                    Create New Macro
                  </Button>
                </div>
                
                <div>
                  <label className="settings-label">Macro Trigger Options</label>
                  <div className="space-y-2">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Keyboard shortcuts</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                      <span className="ml-2 text-sm">Menu selection</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Voice command</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                      <span className="ml-2 text-sm">Automatic (based on context)</span>
                    </label>
                  </div>
                </div>
                
                <div className="toggle-switch-container">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Show confirmation before running macros</span>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Input Device Optimization</h3>
          <p className="settings-form-description">Configure supported input devices and their behavior</p>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="settings-label">Supported Input Devices</label>
              <div className="space-y-2">
                <label className="inline-flex items-center">
                  <input 
                    type="checkbox" 
                    className="form-checkbox text-[#ae5630]" 
                    checked={inputDevices.includes('keyboard')}
                    onChange={() => toggleInputDevice('keyboard')}
                  />
                  <span className="ml-2 text-sm flex items-center">
                    <Keyboard size={16} className="mr-1 text-[#3d3d3a]" />
                    Keyboard
                  </span>
                </label>
                <label className="inline-flex items-center">
                  <input 
                    type="checkbox" 
                    className="form-checkbox text-[#ae5630]" 
                    checked={inputDevices.includes('mouse')}
                    onChange={() => toggleInputDevice('mouse')}
                  />
                  <span className="ml-2 text-sm">Mouse</span>
                </label>
                <label className="inline-flex items-center">
                  <input 
                    type="checkbox" 
                    className="form-checkbox text-[#ae5630]" 
                    checked={inputDevices.includes('touch')}
                    onChange={() => toggleInputDevice('touch')}
                  />
                  <span className="ml-2 text-sm flex items-center">
                    <Fingerprint size={16} className="mr-1 text-[#3d3d3a]" />
                    Touch screen
                  </span>
                </label>
                <label className="inline-flex items-center">
                  <input 
                    type="checkbox" 
                    className="form-checkbox text-[#ae5630]" 
                    checked={inputDevices.includes('pen')}
                    onChange={() => toggleInputDevice('pen')}
                  />
                  <span className="ml-2 text-sm flex items-center">
                    <PenTool size={16} className="mr-1 text-[#3d3d3a]" />
                    Pen/Stylus
                  </span>
                </label>
                <label className="inline-flex items-center">
                  <input 
                    type="checkbox" 
                    className="form-checkbox text-[#ae5630]" 
                    checked={inputDevices.includes('voice')}
                    onChange={() => toggleInputDevice('voice')}
                  />
                  <span className="ml-2 text-sm">Voice (microphone)</span>
                </label>
              </div>
            </div>
            
            {inputDevices.includes('pen') && (
              <div>
                <label className="settings-label">Pen/Stylus Settings</label>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-[#3d3d3a] mb-1 block">Pressure Sensitivity</label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      defaultValue="3"
                      className="w-full h-2 bg-[#bcb7af] rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="toggle-switch-container">
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className="toggle-label">Enable palm rejection</span>
                  </div>
                  <div className="toggle-switch-container">
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className="toggle-label">Pen hover preview</span>
                  </div>
                </div>
              </div>
            )}
            
            {inputDevices.includes('touch') && (
              <div>
                <label className="settings-label">Touch Screen Settings</label>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-[#3d3d3a] mb-1 block">Touch Sensitivity</label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      defaultValue="3"
                      className="w-full h-2 bg-[#bcb7af] rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="toggle-switch-container">
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className="toggle-label">Multi-touch gestures</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Device-Specific Settings</h3>
          <p className="settings-form-description">Configure input behavior for different device types</p>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="settings-label">Current Device</label>
              <div className="flex items-center p-3 bg-[#f9f7f1] rounded-md border border-[#bcb7af]">
                <Laptop size={20} className="mr-2 text-[#3d3d3a]" />
                <p className="text-sm">Windows Desktop / Laptop</p>
              </div>
            </div>
            
            <div>
              <label className="settings-label">Device Configurations</label>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
                  <div className="flex items-center">
                    <Laptop size={16} className="mr-2 text-[#3d3d3a]" />
                    <span className="text-sm">Desktop/Laptop</span>
                  </div>
                  <Button variant="outline" size="sm" className="h-7">Current</Button>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
                  <div className="flex items-center">
                    <Tablet size={16} className="mr-2 text-[#3d3d3a]" />
                    <span className="text-sm">Tablet</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7">Configure</Button>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-[#f9f7f1] rounded-md">
                  <div className="flex items-center">
                    <Smartphone size={16} className="mr-2 text-[#3d3d3a]" />
                    <span className="text-sm">Mobile</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7">Configure</Button>
                </div>
              </div>
            </div>
            
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Automatically adapt interface for device type</span>
            </div>
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Predictive Text</h3>
          <p className="settings-form-description">Configure predictive text behavior</p>
          
          <div className="space-y-4 mt-4">
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Enable predictive text</span>
            </div>
            
            <div>
              <label className="settings-label">Prediction Level</label>
              <select className="settings-select">
                <option>Minimal (word completion only)</option>
                <option>Standard (word and short phrase)</option>
                <option>Enhanced (full sentence suggestions)</option>
                <option>Advanced (context-aware suggestions)</option>
              </select>
            </div>
            
            <div>
              <label className="settings-label">Prediction Sources</label>
              <div className="space-y-2">
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                  <span className="ml-2 text-sm">Common vocabulary</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                  <span className="ml-2 text-sm">Your writing patterns</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                  <span className="ml-2 text-sm">Current document context</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                  <span className="ml-2 text-sm">Your previous documents</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" />
                  <span className="ml-2 text-sm">Advanced AI suggestions</span>
                </label>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-yellow-50 rounded-md border border-yellow-200">
              <AlertTriangle size={20} className="mr-2 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                Using advanced AI suggestions for predictive text may increase resource usage and affect performance on slower devices.
              </p>
            </div>
          </div>
        </div>
        
        <div className="settings-form-section">
          <h3 className="settings-form-title">Accessibility Devices</h3>
          <p className="settings-form-description">Configure support for accessibility input devices</p>
          
          <div className="space-y-4 mt-4">
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Enable accessibility device support</span>
            </div>
            
            <div>
              <label className="settings-label">Supported Devices</label>
              <div className="space-y-2">
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                  <span className="ml-2 text-sm">Screen readers</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                  <span className="ml-2 text-sm">Switch controls</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                  <span className="ml-2 text-sm">Alternative keyboards</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                  <span className="ml-2 text-sm">Eye tracking devices</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox text-[#ae5630]" defaultChecked />
                  <span className="ml-2 text-sm">Voice control</span>
                </label>
              </div>
            </div>
            
            <div>
              <Button variant="outline" size="sm">
                Accessibility Device Setup Guide
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
            setCustomShortcuts(true);
            setMacroCreation(true);
            setInputDevices(['keyboard', 'mouse']);
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

export default KeyboardInputSettings;
