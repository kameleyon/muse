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
import AssetOrganizationSettings from './resourceLibrary/AssetOrganizationSettings';
import UsageAnalyticsSettings from './resourceLibrary/UsageAnalyticsSettings';
import AssetExpirationSettings from './resourceLibrary/AssetExpirationSettings';
import LicenseManagementSettings from './resourceLibrary/LicenseManagementSettings';
import AssetVersioningSettings from './resourceLibrary/AssetVersioningSettings';
import StorageImportSettings from './resourceLibrary/StorageImportSettings';

const ResourceLibrarySettings: React.FC = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  // Note: State related to individual sections has been moved into child components.
  // Global save/reset logic remains here.

  // Handle saving ALL resource library settings
  const handleSaveSettings = async () => {
    try {
      setIsLoading(true);
      // TODO: Gather state from child components if needed (e.g., via refs or callback props)
      // OR: If using global state, dispatch an action to save the relevant slice.
      console.log("Simulating save for all resource library settings...");

      // Simulate API call
      await new Promise((r) => setTimeout(r, 1000));

      dispatch(
        addToast({
          type: 'success',
          message: 'Resource library settings saved successfully',
        })
      );
    } catch (error) {
      dispatch(
        addToast({
          type: 'error',
          message: 'Failed to save resource library settings',
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resetting ALL resource library settings to default
  const handleResetSettings = () => {
    // TODO: Implement logic to reset state in child components
    console.log("Resetting all resource library settings to default (Not fully implemented)...");
    dispatch(
      addToast({
        type: 'info',
        message: 'Settings reset to default (visual only for now)',
      })
    );
    // If state were managed here, it would be reset, e.g.:
    // setResourceTracking(true);
    // setExpirationReminders(true);
    // setAssetVersion(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Library Configuration</CardTitle>
        <CardDescription>
          Configure how digital assets are organized and managed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6"> {/* Added space-y-6 */}
        {/* Render the section components */}
        <AssetOrganizationSettings />
        <UsageAnalyticsSettings />
        <AssetExpirationSettings />
        <LicenseManagementSettings />
        <AssetVersioningSettings />
        <StorageImportSettings />
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

export default ResourceLibrarySettings;
