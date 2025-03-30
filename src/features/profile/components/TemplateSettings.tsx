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
import TemplateCreationSettings from './templates/TemplateCreationSettings';
import TemplateOrganizationSettings from './templates/TemplateOrganizationSettings';
import TemplateSharingSettings from './templates/TemplateSharingSettings';
import DefaultTemplateSettings from './templates/DefaultTemplateSettings';
import BrandTemplateSettings from './templates/BrandTemplateSettings';
import TemplateVariableSettings from './templates/TemplateVariableSettings';

const TemplateSettings: React.FC = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  // Note: State related to individual sections has been moved into child components.
  // Global save/reset logic remains here.

  // Handle saving ALL template settings
  const handleSaveSettings = async () => {
    try {
      setIsLoading(true);
      // TODO: Gather state from child components if needed
      console.log("Simulating save for all template settings...");

      // Simulate API call
      await new Promise((r) => setTimeout(r, 1000));

      dispatch(
        addToast({
          type: 'success',
          message: 'Template settings saved successfully',
        })
      );
    } catch (error) {
      dispatch(
        addToast({
          type: 'error',
          message: 'Failed to save template settings',
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resetting ALL template settings to default
  const handleResetSettings = () => {
    // TODO: Implement logic to reset state in child components
    console.log("Resetting all template settings to default (Not fully implemented)...");
    dispatch(
      addToast({
        type: 'info',
        message: 'Settings reset to default (visual only for now)',
      })
    );
    // If state were managed here, it would be reset, e.g.:
    // setTemplateSharing(true);
    // setDefaultTemplate('blank');
    // setOrganizationTemplates(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Template Settings</CardTitle>
        <CardDescription>
          Configure how templates are created, organized, and shared
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6"> {/* Added space-y-6 */}
        {/* Render the section components */}
        <TemplateCreationSettings />
        <TemplateOrganizationSettings />
        <TemplateSharingSettings />
        <DefaultTemplateSettings />
        <BrandTemplateSettings />
        <TemplateVariableSettings />
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

export default TemplateSettings;
