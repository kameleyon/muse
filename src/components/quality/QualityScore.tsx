import React, { useState } from 'react';
import './QualityScore.css';
import QualityScoreDetails from './QualityScoreDetails';

interface QualityScoreProps {
  score: number;
  lastCheck?: string;
  chapterId: string;
  onRefresh?: () => void;
  isLoading?: boolean;
}

const QualityScore: React.FC<QualityScoreProps> = ({
  score,
  lastCheck,
  chapterId,
  onRefresh,
  isLoading = false
}) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const getScoreColor = (score: number): string => {
    if (score >= 97) return 'excellent';
    if (score >= 93) return 'good';
    if (score >= 85) return 'moderate';
    if (score >= 70) return 'needs-improvement';
    return 'poor';
  };
  
  const getScoreLabel = (score: number): string => {
    if (score >= 97) return 'Excellent';
    if (score >= 93) return 'Good';
    if (score >= 85) return 'Moderate';
    if (score >= 70) return 'Needs Work';
    return 'Poor';
  };
  
  const formatLastCheck = (timestamp?: string): string => {
    if (!timestamp) return 'Never';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };
  
  return (
    <div className="quality-score-wrapper">
      <div className="quality-score-container">
        <div className="quality-score-main">
          <div className={`quality-score-badge ${getScoreColor(score)}`}>
            {isLoading ? (
              <div className="quality-score-loading">
                <div className="spinner"></div>
              </div>
            ) : (
              <>
                <span className="quality-score-number">{score}</span>
                <span className="quality-score-max">/100</span>
              </>
            )}
          </div>
          
          <div className="quality-score-info">
            <div className="quality-score-label">
              Quality Score: <strong>{getScoreLabel(score)}</strong>
            </div>
            <div className="quality-score-meta">
              Last checked: {formatLastCheck(lastCheck)}
            </div>
          </div>
          
          <div className="quality-score-actions">
            <button
              className="quality-score-details-btn"
              onClick={() => setShowDetails(!showDetails)}
              disabled={isLoading}
            >
              {showDetails ? 'Hide' : 'View'} Details
            </button>
            
            {onRefresh && (
              <button
                className="quality-score-refresh-btn"
                onClick={onRefresh}
                disabled={isLoading}
                title="Re-analyze quality"
              >
                ↻
              </button>
            )}
          </div>
        </div>
        
        {score < 93 && !showDetails && (
          <div className="quality-score-hint">
            <span className="hint-icon">💡</span>
            <span>Click "View Details" for improvement suggestions</span>
          </div>
        )}
      </div>
      
      {showDetails && (
        <QualityScoreDetails
          chapterId={chapterId}
          onClose={() => setShowDetails(false)}
        />
      )}
    </div>
  );
};

export default QualityScore;