import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Archive, BarChart2, CheckCircle, Loader2, XCircle, AlertTriangle } from 'lucide-react';
import { useProjectWorkflowStore } from '@/store/projectWorkflowStore';
import { useDispatch } from 'react-redux';
import { addToast } from '@/store/slices/uiSlice';
import * as deliveryService from '@/services/deliveryService';
import * as analyticsService from '@/services/analyticsService';

const ArchivingAnalytics: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeOperation, setActiveOperation] = useState<string | null>(null);
  const [showArchiveOptions, setShowArchiveOptions] = useState<boolean>(false);
  const [showAnalytics, setShowAnalytics] = useState<boolean>(false);
  const [showOutcomeForm, setShowOutcomeForm] = useState<boolean>(false);
  const [performanceMetrics, setPerformanceMetrics] = useState<deliveryService.PerformanceMetrics | null>(null);
  const [archiveOptions, setArchiveOptions] = useState({
    reason: '',
    includeVersionHistory: true,
    includeComments: true
  });
  const [outcomeData, setOutcomeData] = useState<{
    status: 'won' | 'lost' | 'pending' | 'other';
    details: string;
    feedback?: string;
    nextSteps?: string;
  }>({
    status: 'pending',
    details: '',
    feedback: '',
    nextSteps: ''
  });
  
  // Get project ID from store
  const { projectId } = useProjectWorkflowStore();
  const dispatch = useDispatch();
  
  const handleArchive = async () => {
    if (!projectId) {
      dispatch(addToast({
        type: 'error',
        message: 'No project available to archive'
      }));
      return;
    }
    
    if (showArchiveOptions) {
      // Archive with options
      setIsLoading(true);
      setActiveOperation('archive');
      
      try {
        const result = await deliveryService.archiveProject(projectId, archiveOptions);
        
        if (result.status === 'success') {
          dispatch(addToast({
            type: 'success',
            message: result.message
          }));
          
          setShowArchiveOptions(false);
        } else {
          dispatch(addToast({
            type: 'error',
            message: result.message
          }));
        }
      } catch (error) {
        console.error('Failed to archive project:', error);
        dispatch(addToast({
          type: 'error',
          message: 'Failed to archive project'
        }));
      } finally {
        setIsLoading(false);
        setActiveOperation(null);
      }
    } else {
      // Show archive options
      setShowArchiveOptions(true);
      setShowAnalytics(false);
      setShowOutcomeForm(false);
    }
  };
  
  const handleViewAnalytics = async () => {
    if (!projectId) {
      dispatch(addToast({
        type: 'error',
        message: 'No project available for analytics'
      }));
      return;
    }
    
    if (showAnalytics && performanceMetrics) {
      // Analytics are already loaded and shown
      setShowAnalytics(false);
    } else {
      // Load and show analytics
      setIsLoading(true);
      setActiveOperation('analytics');
      setShowArchiveOptions(false);
      setShowOutcomeForm(false);
      
      try {
        const metrics = await deliveryService.getPerformanceMetrics(projectId);
        setPerformanceMetrics(metrics);
        setShowAnalytics(true);
        
        dispatch(addToast({
          type: 'success',
          message: 'Performance metrics loaded'
        }));
      } catch (error) {
        console.error('Failed to load performance metrics:', error);
        dispatch(addToast({
          type: 'error',
          message: 'Failed to load performance metrics'
        }));
      } finally {
        setIsLoading(false);
        setActiveOperation(null);
      }
    }
  };
  
  const handleRecordOutcome = async () => {
    if (!projectId) {
      dispatch(addToast({
        type: 'error',
        message: 'No project available to record outcome'
      }));
      return;
    }
    
    if (showOutcomeForm) {
      // Submit outcome form
      if (!outcomeData.details.trim()) {
        dispatch(addToast({
          type: 'error',
          message: 'Please provide outcome details'
        }));
        return;
      }
      
      setIsLoading(true);
      setActiveOperation('outcome');
      
      try {
        const result = await deliveryService.recordProjectOutcome(projectId, outcomeData);
        
        if (result.success) {
          dispatch(addToast({
            type: 'success',
            message: result.message
          }));
          
          setShowOutcomeForm(false);
        } else {
          dispatch(addToast({
            type: 'error',
            message: result.message
          }));
        }
      } catch (error) {
        console.error('Failed to record project outcome:', error);
        dispatch(addToast({
          type: 'error',
          message: 'Failed to record project outcome'
        }));
      } finally {
        setIsLoading(false);
        setActiveOperation(null);
      }
    } else {
      // Show outcome form
      setShowOutcomeForm(true);
      setShowArchiveOptions(false);
      setShowAnalytics(false);
      
      // Check if outcome already exists
      try {
        const existingOutcome = await deliveryService.getProjectOutcome(projectId);
        
        if (existingOutcome) {
          setOutcomeData(existingOutcome);
          
          dispatch(addToast({
            type: 'info',
            message: 'Existing outcome loaded'
          }));
        }
      } catch (error) {
        console.error('Failed to check existing outcome:', error);
      }
    }
  };
  
  const closeAllPanels = () => {
    setShowArchiveOptions(false);
    setShowAnalytics(false);
    setShowOutcomeForm(false);
  };

  return (
    <Card className="p-4 border border-neutral-light bg-white/30 shadow-sm relative">
      <h4 className="font-semibold text-neutral-dark text-lg mb-3 border-b border-neutral-light/40 pb-2">Archiving & Analytics</h4>
      
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-md">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
            <p className="text-sm text-neutral-dark">
              {activeOperation === 'archive' && 'Archiving project...'}
              {activeOperation === 'analytics' && 'Loading analytics...'}
              {activeOperation === 'outcome' && 'Recording outcome...'}
              {!activeOperation && 'Processing...'}
            </p>
          </div>
        </div>
      )}
      
      {/* Archive Options Panel */}
      {showArchiveOptions && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h5 className="font-medium text-sm">Archive Project</h5>
            <Button variant="ghost" size="sm" onClick={closeAllPanels} className="h-6 w-6 p-0">
              <XCircle size={16} />
            </Button>
          </div>
          
          <div className="border rounded-md p-3 bg-white/50">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium block mb-1">Reason for Archiving</label>
                <textarea 
                  className="settings-input text-xs w-full min-h-[60px]"
                  placeholder="Project completed, superseded, or other reason..."
                  value={archiveOptions.reason}
                  onChange={(e) => setArchiveOptions({...archiveOptions, reason: e.target.value})}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="include-versions" 
                  checked={archiveOptions.includeVersionHistory}
                  onChange={(e) => setArchiveOptions({...archiveOptions, includeVersionHistory: e.target.checked})}
                />
                <label htmlFor="include-versions" className="text-xs text-neutral-medium">
                  Include version history
                </label>
              </div>
              
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="include-comments" 
                  checked={archiveOptions.includeComments}
                  onChange={(e) => setArchiveOptions({...archiveOptions, includeComments: e.target.checked})}
                />
                <label htmlFor="include-comments" className="text-xs text-neutral-medium">
                  Include comments and feedback
                </label>
              </div>
              
              <div className="pt-2 border-t border-neutral-light/40">
                <p className="text-xs text-neutral-medium mb-2">
                  <AlertTriangle size={12} className="inline-block mr-1 text-warning" />
                  Archiving will move this project to the archive section. It can be restored later if needed.
                </p>
                
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    onClick={closeAllPanels}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="danger"
                    size="sm" 
                    className="text-xs text-white ml-2"
                    onClick={handleArchive}
                  >
                    Archive Project
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Analytics Panel */}
      {showAnalytics && performanceMetrics && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h5 className="font-medium text-sm">Performance Analytics</h5>
            <Button variant="ghost" size="sm" onClick={closeAllPanels} className="h-6 w-6 p-0">
              <XCircle size={16} />
            </Button>
          </div>
          
          <div className="border rounded-md p-3 bg-white/50">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
              <div className="p-2 border rounded-md bg-white/80 text-center">
                <p className="text-xs text-neutral-medium">Views</p>
                <p className="text-lg font-bold text-primary">{performanceMetrics.views}</p>
              </div>
              
              <div className="p-2 border rounded-md bg-white/80 text-center">
                <p className="text-xs text-neutral-medium">Unique Viewers</p>
                <p className="text-lg font-bold text-primary">{performanceMetrics.uniqueViewers}</p>
              </div>
              
              <div className="p-2 border rounded-md bg-white/80 text-center">
                <p className="text-xs text-neutral-medium">Avg. View Time</p>
                <p className="text-lg font-bold text-primary">
                  {Math.floor(performanceMetrics.averageViewDuration / 60)}:{(performanceMetrics.averageViewDuration % 60).toString().padStart(2, '0')}
                </p>
              </div>
              
              <div className="p-2 border rounded-md bg-white/80 text-center">
                <p className="text-xs text-neutral-medium">Completion Rate</p>
                <p className="text-lg font-bold text-primary">{performanceMetrics.completionRate}%</p>
              </div>
            </div>
            
            <div className="p-2 border rounded-md bg-white/80 mb-3">
              <h6 className="text-xs font-medium mb-2">Engagement Score</h6>
              <div className="w-full bg-neutral-light/30 rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${performanceMetrics.engagementScore}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-neutral-medium mt-1">
                <span>0</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>
            
            <div className="p-2 border rounded-md bg-white/80">
              <h6 className="text-xs font-medium mb-2">Top Slides by View Time</h6>
              <ul className="space-y-1">
                {performanceMetrics.topSlides.map((slide, index) => (
                  <li key={slide.slideId} className="flex justify-between items-center text-xs">
                    <span className="text-neutral-dark">{index + 1}. {slide.slideTitle}</span>
                    <span className="text-neutral-medium">
                      {Math.floor(slide.viewTime / 60)}:{(slide.viewTime % 60).toString().padStart(2, '0')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {/* Outcome Form Panel */}
      {showOutcomeForm && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h5 className="font-medium text-sm">Record Project Outcome</h5>
            <Button variant="ghost" size="sm" onClick={closeAllPanels} className="h-6 w-6 p-0">
              <XCircle size={16} />
            </Button>
          </div>
          
          <div className="border rounded-md p-3 bg-white/50">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium block mb-1">Outcome Status</label>
                <select 
                  className="settings-input text-xs w-full"
                  value={outcomeData.status}
                  onChange={(e) => setOutcomeData({...outcomeData, status: e.target.value as any})}
                >
                  <option value="won">Won / Successful</option>
                  <option value="lost">Lost / Unsuccessful</option>
                  <option value="pending">Pending Decision</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="text-xs font-medium block mb-1">Outcome Details</label>
                <textarea 
                  className="settings-input text-xs w-full min-h-[60px]"
                  placeholder="Describe the outcome in detail..."
                  value={outcomeData.details}
                  onChange={(e) => setOutcomeData({...outcomeData, details: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-xs font-medium block mb-1">Feedback Received (Optional)</label>
                <textarea 
                  className="settings-input text-xs w-full min-h-[60px]"
                  placeholder="Any feedback from stakeholders or clients..."
                  value={outcomeData.feedback || ''}
                  onChange={(e) => setOutcomeData({...outcomeData, feedback: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-xs font-medium block mb-1">Next Steps (Optional)</label>
                <textarea 
                  className="settings-input text-xs w-full min-h-[60px]"
                  placeholder="What happens next with this project or client..."
                  value={outcomeData.nextSteps || ''}
                  onChange={(e) => setOutcomeData({...outcomeData, nextSteps: e.target.value})}
                />
              </div>
              
              <div className="flex justify-end pt-2 border-t border-neutral-light/40">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={closeAllPanels}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="text-xs text-white ml-2"
                  onClick={handleRecordOutcome}
                  disabled={!outcomeData.details.trim()}
                >
                  Save Outcome
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Tool Buttons (only show if no panel is open) */}
      {!showArchiveOptions && !showAnalytics && !showOutcomeForm && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs justify-start" 
            onClick={handleArchive}
            disabled={isLoading || !projectId}
          >
            <Archive size={14} className="mr-1"/> Archive Project
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs justify-start" 
            onClick={handleViewAnalytics}
            disabled={isLoading || !projectId}
          >
            <BarChart2 size={14} className="mr-1"/> View Performance Analytics
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs justify-start" 
            onClick={handleRecordOutcome}
            disabled={isLoading || !projectId}
          >
            <CheckCircle size={14} className="mr-1"/> Record Project Outcome
          </Button>
        </div>
      )}
      
      <p className="text-xs text-neutral-medium mt-2">
        Archive the project for long-term storage or review its performance.
      </p>
    </Card>
  );
};

export default ArchivingAnalytics;