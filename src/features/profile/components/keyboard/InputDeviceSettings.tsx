import React, { useState } from 'react';
import { Keyboard, PenTool, Fingerprint } from 'lucide-react'; // Removed unused Mouse icon

// Define type for input devices for clarity
type InputDevice = 'keyboard' | 'mouse' | 'touch' | 'pen' | 'voice';

const InputDeviceSettings: React.FC = () => {
  const [inputDevices, setInputDevices] = useState<InputDevice[]>(['keyboard', 'mouse']); // Default devices
  const [penPressure, setPenPressure] = useState(3);
  const [enablePalmRejection, setEnablePalmRejection] = useState(true);
  const [enablePenHover, setEnablePenHover] = useState(true);
  const [touchSensitivity, setTouchSensitivity] = useState(3);
  const [enableMultiTouch, setEnableMultiTouch] = useState(true);

  const toggleInputDevice = (device: InputDevice) => {
    setInputDevices(prev =>
      prev.includes(device) ? prev.filter(d => d !== device) : [...prev, device]
    );
  };

  return (
    <div className="settings-form-section">
      <h3 className="settings-form-title">Input Device Optimization</h3>
      <p className="settings-form-description">Configure supported input devices and their behavior</p>

      <div className="space-y-4 mt-4">
        <div>
          <label className="settings-label">Supported Input Devices</label>
          <div className="space-y-2">
            {/* Keyboard */}
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-[#ae5630]"
                checked={inputDevices.includes('keyboard')}
                onChange={() => toggleInputDevice('keyboard')}
              />
              <span className="ml-2 text-sm flex items-center">
                <Keyboard size={16} className="mr-1 text-[#3d3d3a]" /> Keyboard
              </span>
            </label>
            {/* Mouse */}
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-[#ae5630]"
                checked={inputDevices.includes('mouse')}
                onChange={() => toggleInputDevice('mouse')}
              />
              <span className="ml-2 text-sm">Mouse</span> {/* Icon removed as it wasn't imported */}
            </label>
            {/* Touch */}
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-[#ae5630]"
                checked={inputDevices.includes('touch')}
                onChange={() => toggleInputDevice('touch')}
              />
              <span className="ml-2 text-sm flex items-center">
                <Fingerprint size={16} className="mr-1 text-[#3d3d3a]" /> Touch screen
              </span>
            </label>
            {/* Pen */}
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-[#ae5630]"
                checked={inputDevices.includes('pen')}
                onChange={() => toggleInputDevice('pen')}
              />
              <span className="ml-2 text-sm flex items-center">
                <PenTool size={16} className="mr-1 text-[#3d3d3a]" /> Pen/Stylus
              </span>
            </label>
            {/* Voice */}
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

        {/* Pen Settings */}
        {inputDevices.includes('pen') && (
          <div>
            <label className="settings-label">Pen/Stylus Settings</label>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-[#3d3d3a] mb-1 block">Pressure Sensitivity ({penPressure})</label>
                <input
                  type="range" min="1" max="5" step="1"
                  value={penPressure}
                  onChange={(e) => setPenPressure(Number(e.target.value))}
                  className="w-full h-2 bg-[#bcb7af] rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="toggle-switch-container">
                <label className="toggle-switch">
                  <input type="checkbox" checked={enablePalmRejection} onChange={() => setEnablePalmRejection(!enablePalmRejection)} />
                  <span className="toggle-slider"></span>
                </label>
                <span className="toggle-label">Enable palm rejection</span>
              </div>
              <div className="toggle-switch-container">
                <label className="toggle-switch">
                  <input type="checkbox" checked={enablePenHover} onChange={() => setEnablePenHover(!enablePenHover)} />
                  <span className="toggle-slider"></span>
                </label>
                <span className="toggle-label">Pen hover preview</span>
              </div>
            </div>
          </div>
        )}

        {/* Touch Settings */}
        {inputDevices.includes('touch') && (
          <div>
            <label className="settings-label">Touch Screen Settings</label>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-[#3d3d3a] mb-1 block">Touch Sensitivity ({touchSensitivity})</label>
                <input
                  type="range" min="1" max="5" step="1"
                  value={touchSensitivity}
                  onChange={(e) => setTouchSensitivity(Number(e.target.value))}
                  className="w-full h-2 bg-[#bcb7af] rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="toggle-switch-container">
                <label className="toggle-switch">
                  <input type="checkbox" checked={enableMultiTouch} onChange={() => setEnableMultiTouch(!enableMultiTouch)} />
                  <span className="toggle-slider"></span>
                </label>
                <span className="toggle-label">Multi-touch gestures</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputDeviceSettings;