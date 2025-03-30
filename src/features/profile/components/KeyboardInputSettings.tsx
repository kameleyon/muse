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
import ShortcutSettings from './keyboard/ShortcutSettings';
import MacroSettings from './keyboard/MacroSettings';
import InputDeviceSettings from './keyboard/InputDeviceSettings';
import DeviceSpecificSettings from './keyboard/DeviceSpecificSettings';
import PredictiveTextSettings from './keyboard/PredictiveTextSettings';
import AccessibilityDeviceSettings from './keyboard/AccessibilityDeviceSettings';

const KeyboardInputSettings: React.FC = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  // Note: State related to individual sections (e.g., customShortcuts, macroCreation, inputDevices)
  // has been moved into the respective child components (ShortcutSettings, MacroSettings, etc.).
  // If global state management (like Redux or Zustand) were used for settings,
  // these states would be managed there instead of locally within each child.

  // Handle saving ALL keyboard/input settings
  const handleSaveSettings = async () => {
    try {
      setIsLoading(true);
      // TODO: Gather state from child components if needed (e.g., via refs or callback props)
      // OR: If using global state, dispatch an action to save the relevant slice.
      // For now, we just simulate the save action.
      console.log("Simulating save for all keyboard settings...");

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

  // Handle resetting ALL keyboard/input settings to default
  const handleResetSettings = () => {
    // TODO: Implement logic to reset state in child components
    // This might involve passing reset functions as props or using global state actions.
    console.log("Resetting all keyboard settings to default (Not fully implemented)...");
    dispatch(
      addToast({
        type: 'info',
        message: 'Settings reset to default (visual only for now)',
      })
    );
    // Visually reset (if state was managed here, it would be reset here)
    // setCustomShortcuts(true);
    // setMacroCreation(true);
    // setInputDevices(['keyboard', 'mouse']);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Keyboard and Input Configuration</CardTitle>
        <CardDescription>
          Configure keyboard shortcuts, input devices, and input behavior
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6"> {/* Added space-y-6 for spacing between sections */}
        {/* Render the section components */}
        <ShortcutSettings />
        <MacroSettings />
        <InputDeviceSettings />
        <DeviceSpecificSettings />
        <PredictiveTextSettings />
        <AccessibilityDeviceSettings />
      </CardContent>
      <CardFooter className="settings-footer">
        <Button
          variant="outline"
          className="mr-2"
          onClick={handleResetSettings} // Use the new reset handler
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
