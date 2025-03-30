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
import DeviceListSettings from './crossDevice/DeviceListSettings';
import SyncFrequencySettings from './crossDevice/SyncFrequencySettings';
import ContentPrioritizationSettings from './crossDevice/ContentPrioritizationSettings';
import ConflictResolutionSettings from './crossDevice/ConflictResolutionSettings';
import CapabilityAwarenessSettings from './crossDevice/CapabilityAwarenessSettings';
import HandoffSettings from './crossDevice/HandoffSettings';

const CrossDeviceSettings: React.FC = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  // Note: State related to individual sections has been moved into child components.
  // Global save/reset logic remains here.

  // Handle saving ALL cross-device settings
  const handleSaveSettings = async () => {
    try {
      setIsLoading(true);
      // TODO: Gather state from child components if needed
      console.log("Simulating save for all cross-device settings...");

      // Simulate API call
      await new Promise((r) => setTimeout(r, 1000));

      dispatch(
        addToast({
          type: 'success',
          message: 'Cross-device synchronization settings saved successfully',
        })
      );
    } catch (error) {
      dispatch(
        addToast({
          type: 'error',
          message: 'Failed to save synchronization settings',
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resetting ALL cross-device settings to default
  const handleResetSettings = () => {
    // TODO: Implement logic to reset state in child components
    console.log("Resetting all cross-device settings to default (Not fully implemented)...");
    dispatch(
      addToast({
        type: 'info',
        message: 'Settings reset to default (visual only for now)',
      })
    );
    // If state were managed here, it would be reset, e.g.:
    // setSyncFrequency('automatic');
    // setContentPriority('recent');
    // setConflictResolution('ask');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cross-Device Synchronization</CardTitle>
        <CardDescription>
          Configure how MagicMuse synchronizes across your devices
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6"> {/* Added space-y-6 */}
        {/* Render the section components */}
        <DeviceListSettings />
        <SyncFrequencySettings />
        <ContentPrioritizationSettings />
        <ConflictResolutionSettings />
        <CapabilityAwarenessSettings />
        <HandoffSettings />
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

export default CrossDeviceSettings;
