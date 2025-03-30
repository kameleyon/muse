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
// Import the new section components
import VoiceInputCalibration from './voiceSpeech/VoiceInputCalibration';
import VoiceCommandSettings from './voiceSpeech/VoiceCommandSettings';
import SpecializedDictationSettings from './voiceSpeech/SpecializedDictationSettings';
import ReadAloudSettings from './voiceSpeech/ReadAloudSettings';
import NoiseFilteringSettings from './voiceSpeech/NoiseFilteringSettings';

const VoiceSpeechSettings: React.FC = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  // Note: State related to individual sections has been moved into child components.
  // Global save/reset logic remains here.

  // Handle saving ALL voice/speech settings
  const handleSaveSettings = async () => {
    try {
      setIsLoading(true);
      // TODO: Gather state from child components if needed
      console.log("Simulating save for all voice/speech settings...");

      // Simulate API call
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

  // Handle resetting ALL voice/speech settings to default
  const handleResetSettings = () => {
    // TODO: Implement logic to reset state in child components
    console.log("Resetting all voice/speech settings to default (Not fully implemented)...");
    dispatch(
      addToast({
        type: 'info',
        message: 'Settings reset to default (visual only for now)',
      })
    );
    // If state were managed here, it would be reset, e.g.:
    // setVoiceInput(true);
    // setReadAloud(true);
    // setAccentType('neutral');
    // setSpecializedDictation('general');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Voice and Speech Settings</CardTitle>
        <CardDescription>
          Configure voice input and text-to-speech features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6"> {/* Added space-y-6 */}
        {/* Render the section components */}
        <VoiceInputCalibration />
        <VoiceCommandSettings />
        <SpecializedDictationSettings />
        <ReadAloudSettings />
        <NoiseFilteringSettings />
      </CardContent>
      <CardFooter className="settings-footer">
        <Button
          variant="outline"
          className="mr-2"
          onClick={handleResetSettings}
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
