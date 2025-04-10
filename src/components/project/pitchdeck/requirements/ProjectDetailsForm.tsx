import React, { useState } from 'react';
import { Input } from '../../../ui/Input';
import { Label } from '../../../ui/Label';
import { Textarea } from '../../../ui/Textarea';

const ProjectDetailsForm: React.FC = () => {
  //const [projectName, setProjectName] = useState('');
  const [projectDetails, setprojectDetails] = useState('');
  const [projectGoals, setProjectGoals] = useState('');

  return (
    <div className="space-y-6">
      <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium mb-4">Project Goals and Details</h3>
                     
        {/* Project Goals */}
        <div className="mb-4">
          <Label htmlFor="projectGoals" className="block text-sm font-medium mb-1">
            Project Goals
          </Label>
          <Textarea
            id="projectGoals"
            value={projectGoals}
            onChange={(e) => setProjectGoals(e.target.value)}
            placeholder="Enter project goals"
            className="w-full min-h-[100px]"
          />
        </div>
        {/* Project Description */}
        <div className="mb-4">
          <Label htmlFor="projectDetails" className="block text-sm font-medium mb-1">
            Additional Details
          </Label>
          <Textarea
            id="projectDetails"
            value={projectDetails}
            onChange={(e) => setprojectDetails(e.target.value)}
            placeholder="Enter project description"
            className="w-full min-h-[100px]"
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsForm;