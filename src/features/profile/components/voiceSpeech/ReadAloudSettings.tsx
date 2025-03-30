import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Volume2, VolumeX, Play, Timer, FastForward, Headphones, Volume } from 'lucide-react';

// Define types for clarity
type VoiceOption = 'emma_us' | 'james_us' | 'sophie_uk' | 'thomas_uk' | 'system';
type AudioOutputDevice = 'system' | 'speakers' | 'headphones' | 'external';

const ReadAloudSettings: React.FC = () => {
  // Local state for this section
  const [readAloud, setReadAloud] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>('emma_us');
  const [speakingRate, setSpeakingRate] = useState(3); // Example: 1-5 scale
  const [volume, setVolume] = useState(4); // Example: 1-5 scale
  const [audioOutput, setAudioOutput] = useState<AudioOutputDevice>('system');
  const [highlightText, setHighlightText] = useState(true);
  const [autoPause, setAutoPause] = useState(false);
  const [isPlayingSample, setIsPlayingSample] = useState(false); // For sample playback UI

  // TODO: Implement actual audio playback logic
  const handlePlaySample = () => {
    console.log("Playing sample for voice:", selectedVoice);
    setIsPlayingSample(true);
    // Simulate playback ending
    setTimeout(() => setIsPlayingSample(false), 2000);
  };

  return (
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
            {/* Voice Selection */}
            <div>
              <label className="settings-label">Voice Selection</label>
              <select
                className="settings-select"
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value as VoiceOption)}
              >
                <option value="emma_us">Emma (Female, US English)</option>
                <option value="james_us">James (Male, US English)</option>
                <option value="sophie_uk">Sophie (Female, UK English)</option>
                <option value="thomas_uk">Thomas (Male, UK English)</option>
                <option value="system">System Default Voice</option>
              </select>
            </div>

            {/* Voice Sample */}
            <div>
              <label className="settings-label">Voice Sample</label>
              <div className="flex items-center gap-2 p-3 bg-[#f9f7f1] rounded-md border border-[#bcb7af]">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-8 h-8 p-0 flex items-center justify-center"
                  onClick={handlePlaySample}
                  disabled={isPlayingSample}
                >
                  {/* TODO: Show Pause icon when playing */}
                  <Play size={16} />
                </Button>
                <div className="flex-1">
                  {/* TODO: Update progress bar during playback */}
                  <div className="h-2 bg-[#bcb7af] rounded-full overflow-hidden">
                    <div className={`h-full bg-[#ae5630] ${isPlayingSample ? 'w-1/4' : 'w-0'}`}></div>
                  </div>
                </div>
                <Volume size={16} className="text-[#3d3d3a]" />
              </div>
            </div>

            {/* Rate and Volume */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="settings-label">Speaking Rate</label>
                <div className="flex items-center gap-2">
                  <Timer size={16} className="text-[#3d3d3a]" />
                  <input
                    type="range" min="1" max="5" step="1"
                    value={speakingRate}
                    onChange={(e) => setSpeakingRate(Number(e.target.value))}
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
                    type="range" min="1" max="5" step="1"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full h-2 bg-[#bcb7af] rounded-lg appearance-none cursor-pointer"
                  />
                  <Volume2 size={16} className="text-[#3d3d3a]" />
                </div>
              </div>
            </div>

            {/* Audio Output */}
            <div>
              <label className="settings-label">Audio Output</label>
              <select
                className="settings-select"
                value={audioOutput}
                onChange={(e) => setAudioOutput(e.target.value as AudioOutputDevice)}
              >
                <option value="system">System Default Device</option>
                <option value="speakers">Built-in Speakers</option>
                <option value="headphones">Headphones</option>
                <option value="external">External Speakers</option>
              </select>
            </div>

            {/* Highlight Text */}
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={highlightText}
                  onChange={() => setHighlightText(!highlightText)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Highlight text while reading</span>
            </div>

            {/* Auto-pause */}
            <div className="toggle-switch-container">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={autoPause}
                  onChange={() => setAutoPause(!autoPause)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Auto-pause at punctuation</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReadAloudSettings;