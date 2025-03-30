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
import AutomatedBackupSettings from './backupRecovery/AutomatedBackupSettings';
import BackupLocationSettings from './backupRecovery/BackupLocationSettings';
import BackupSecuritySettings from './backupRecovery/BackupSecuritySettings';
import BackupPrioritizationSettings from './backupRecovery/BackupPrioritizationSettings';
import DisasterRecoverySettings from './backupRecovery/DisasterRecoverySettings';

const BackupRecoverySettings: React.FC = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  // Note: State related to individual sections has been moved into child components.
  // Global save/reset logic remains here.

  // Handle saving ALL backup settings
  const handleSaveSettings = async () => {
    try {
      setIsLoading(true);
      // TODO: Gather state from child components if needed
      console.log("Simulating save for all backup settings...");

      // Simulate API call
      await new Promise((r) => setTimeout(r, 1000));

      dispatch(
        addToast({
          type: 'success',
          message: 'Backup and recovery settings saved successfully',
        })
      );
    } catch (error) {
      dispatch(
        addToast({
          type: 'error',
          message: 'Failed to save backup settings',
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resetting ALL backup settings to default
  const handleResetSettings = () => {
    // TODO: Implement logic to reset state in child components
    console.log("Resetting all backup settings to default (Not fully implemented)...");
    dispatch(
      addToast({
        type: 'info',
        message: 'Settings reset to default (visual only for now)',
      })
    );
    // If state were managed here, it would be reset, e.g.:
    // setAutoBackup(true);
    // setBackupFrequency('daily');
    // setBackupLocation('cloud');
    // setEncryptedBackups(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Backup and Recovery</CardTitle>
        <CardDescription>
          Configure how MagicMuse backs up and restores your content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6"> {/* Added space-y-6 */}
        {/* Render the section components */}
        <AutomatedBackupSettings />
        <BackupLocationSettings />
        <BackupSecuritySettings />
        <BackupPrioritizationSettings />
        <DisasterRecoverySettings />
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

export default BackupRecoverySettings;
