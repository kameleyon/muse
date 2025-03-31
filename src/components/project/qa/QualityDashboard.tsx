import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Gauge, ListChecks, BarChartHorizontal, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useProjectWorkflowStore } from '@/store/projectWorkflowStore';
import { useDispatch } from 'react-redux';
import { addToast } from '@/store/slices/uiSlice';
import * as qaService from '@/services/qaService';

// Define types matching ProjectArea state
type QualityMetrics = { 
  overallScore: number; 
  categories: { name: string; score: number }[]; 
  issues: { id: string; severity: string; text: string }[]; 
};

// Define Props
interface QualityDashboardProps {
  metrics: QualityMetrics | null;
  isLoading: boolean;
}

const QualityDashboard: React.FC<QualityDashboardProps> = ({ metrics: propMetrics, isLoading: propIsLoading }) => {
  const [localMetrics, setLocalMetrics] = useState<QualityMetrics | null>(null);
  const [localIsLoading, setLocalIsLoading] = useState<boolean>(false);
  
  // Get project ID and editor content from store
  const { projectId, editorContent } = useProjectWorkflowStore();
  const dispatch = useDispatch();
  
  // Use either local state or props (for backward compatibility)
  const displayMetrics = localMetrics || propMetrics;
  const displayIsLoading = localIsLoading || propIsLoading;
  
  // Load quality metrics on mount if we have a project ID and content
  useEffect(() => {
    if (projectId && editorContent && !displayMetrics && !displayIsLoading) {
      loadQualityMetrics();
    }
  }, [projectId, editorContent]);
  
  const loadQualityMetrics = async () => {
    if (!projectId || !editorContent) {
      dispatch(addToast({
        type: 'error',
        message: 'No content available for quality analysis'
      }));
      return;
    }
    
    setLocalIsLoading(true);
    
    try {
      const metrics = await qaService.getQualityMetrics(projectId, editorContent);
      setLocalMetrics(metrics);
      
      dispatch(addToast({
        type: 'success',
        message: 'Quality analysis complete'
      }));
    } catch (error) {
      console.error('Quality analysis failed:', error);
      dispatch(addToast({
        type: 'error',
        message: 'Quality analysis failed'
      }));
      
      setLocalMetrics({
        overallScore: 70,
        categories: [
          { name: 'Content Quality', score: 70 },
          { name: 'Design Effectiveness', score: 70 },
          { name: 'Narrative Structure', score: 70 },
          { name: 'Data Integrity', score: 70 },
          { name: 'Persuasiveness', score: 70 }
        ],
        issues: [
          { id: 'error-1', severity: 'critical', text: `Error during quality analysis: ${error instanceof Error ? error.message : String(error)}` }
        ]
      });
    } finally {
      setLocalIsLoading(false);
    }
  };
  
  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-error'; 
      case 'warning': return 'text-warning'; 
      case 'info': return 'text-blue-600'; 
      default: return 'text-neutral-medium';
    }
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-green-500';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-yellow-700';
    return 'text-error';
  };

  return (
    <Card className="p-4 border border-neutral-light bg-white/30 shadow-sm h-full relative"> 
      <h4 className="font-semibold text-neutral-dark text-lg mb-3 border-b border-neutral-light/40 pb-2 flex justify-between items-center">
        <span>Quality Dashboard</span>
        {!displayIsLoading && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0" 
            onClick={loadQualityMetrics}
            title="Refresh quality metrics"
            disabled={!projectId || !editorContent}
          >
            <RefreshCw size={14} />
          </Button>
        )}
      </h4>
      
      {displayIsLoading ? (
         <div className="absolute inset-0 bg-white/70 flex justify-center items-center z-10 rounded-md">
           <div className="flex flex-col items-center">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
             <p className="text-sm text-neutral-dark">Analyzing quality...</p>
           </div>
         </div>
      ) : !displayMetrics ? (
         <div className="text-center text-neutral-medium italic p-4">
           <p className="mb-4">Quality data not available.</p>
           <Button 
             variant="outline" 
             size="sm" 
             onClick={loadQualityMetrics}
             disabled={!projectId || !editorContent}
           >
             Analyze Quality
           </Button>
         </div>
      ) : (
         <div className="space-y-4">
           {/* Overall Score */}
           <div className="text-center">
              <label className="settings-label flex items-center justify-center gap-1 mb-1"><Gauge size={14}/> Overall Score</label>
              <p className="text-4xl font-bold" style={{ color: '#ae5630' }}>{displayMetrics.overallScore}<span className="text-lg font-normal">/100</span></p>
              <p className="text-xs text-neutral-medium mt-1">(Benchmark: 85)</p>
           </div>

           {/* Category Breakdown */}
           <div>
              <label className="settings-label flex items-center gap-1 mb-2"><BarChartHorizontal size={14}/> Category Scores</label>
              <ul className="space-y-1 text-xs">
                {displayMetrics.categories.map(cat => (
                  <li key={cat.name} className="flex justify-between items-center">
                    <span>{cat.name}</span>
                    <span className={`font-medium ${getScoreColor(cat.score)}`}>{cat.score}</span>
                  </li>
                ))}
              </ul>
           </div>

           {/* Issue Summary */}
           <div>
              <label className="settings-label flex items-center gap-1 mb-2"><ListChecks size={14}/> Issue Summary</label>
              <ul className="space-y-1 text-xs max-h-24 overflow-y-auto custom-scrollbar pr-1">
                 {displayMetrics.issues.map(issue => (
                    <li key={issue.id} className={`flex items-start gap-1 ${getSeverityClass(issue.severity)}`}>
                       <span className="mt-0.5">•</span> 
                       <span>{issue.text}</span>
                    </li>
                 ))}
                 {displayMetrics.issues.length === 0 && <li className="text-neutral-medium italic">No major issues found.</li>}
              </ul>
           </div>
         </div>
      )}
    </Card>
  );
};

// Export the component
export default QualityDashboard;