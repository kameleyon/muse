import React from 'react';
import { Card } from '@/components/ui/Card';
import { Gauge, ListChecks, BarChartHorizontal, Loader2 } from 'lucide-react'; // Added Loader2

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

const QualityDashboard: React.FC<QualityDashboardProps> = ({ metrics, isLoading }) => {
  
  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-error'; 
      case 'warning': return 'text-warning'; 
      case 'info': return 'text-blue-600'; 
      default: return 'text-neutral-medium';
    }
  };

  return (
    <Card className="p-4 border border-neutral-light bg-white/30 shadow-sm h-full"> 
      <h4 className="font-semibold text-neutral-dark text-lg mb-3 border-b border-neutral-light/40 pb-2">Quality Dashboard</h4>
      
      {isLoading ? (
         <div className="flex justify-center items-center h-40">
            <Loader2 size={24} className="animate-spin text-primary"/>
         </div>
      ) : !metrics ? (
         <div className="text-center text-neutral-medium italic p-4">
            Quality data not available. Run checks or refresh.
         </div>
      ) : (
         <div className="space-y-4">
           {/* Overall Score */}
           <div className="text-center">
              <label className="settings-label flex items-center justify-center gap-1 mb-1"><Gauge size={14}/> Overall Score</label>
              <p className="text-4xl font-bold text-primary">{metrics.overallScore}<span className="text-lg font-normal">/100</span></p>
              <p className="text-xs text-neutral-medium mt-1">(Benchmark: 85)</p>
           </div>

           {/* Category Breakdown */}
           <div>
              <label className="settings-label flex items-center gap-1 mb-2"><BarChartHorizontal size={14}/> Category Scores</label>
              <ul className="space-y-1 text-xs">
                {metrics.categories.map(cat => (
                  <li key={cat.name} className="flex justify-between items-center">
                    <span>{cat.name}</span>
                    <span className={`font-medium ${cat.score >= 80 ? 'text-green-600' : cat.score >= 60 ? 'text-yellow-600' : 'text-error'}`}>{cat.score}</span>
                  </li>
                ))}
              </ul>
           </div>

           {/* Issue Summary */}
           <div>
              <label className="settings-label flex items-center gap-1 mb-2"><ListChecks size={14}/> Issue Summary</label>
              <ul className="space-y-1 text-xs max-h-24 overflow-y-auto custom-scrollbar pr-1"> {/* Added scroll */}
                 {metrics.issues.map(issue => (
                    <li key={issue.id} className={`flex items-start gap-1 ${getSeverityClass(issue.severity)}`}>
                       <span className="mt-0.5">*</span> 
                       <span>{issue.text}</span>
                    </li>
                 ))}
                 {metrics.issues.length === 0 && <li className="text-neutral-medium italic">No major issues found.</li>}
              </ul>
           </div>
         </div>
      )}
    </Card>
  );
};

export default QualityDashboard;