import React, { useState, useEffect } from 'react';
import './QualityScore.css';
import QualityScoreDetails from './QualityScoreDetails';

interface QualityScoreProps {
  score: number;
  lastCheck?: string;
  chapterId: string;
  onRefresh?: () => void;
  isLoading?: boolean;
  breakdown?: {
    vocabulary?: { percentage: number };
    aiPatterns?: { percentage: number };
    readability?: { percentage: number };
    engagement?: { percentage: number };
  };
}

const QualityScore: React.FC<QualityScoreProps> = ({
  score,
  lastCheck,
  chapterId,
  onRefresh,
  isLoading = false,
  breakdown
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  
  // Animate score changes
  useEffect(() => {
    if (!isLoading && score > 0) {
      const timer = setTimeout(() => {
        setAnimatedScore(score);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [score, isLoading]);
  
  // Realistic score thresholds aligned with enhanced backend
  const getScoreColor = (score: number): string => {
    if (score >= 92) return 'excellent';   // Lowered from 97
    if (score >= 85) return 'good';        // Lowered from 93
    if (score >= 75) return 'moderate';    // Lowered from 85
    if (score >= 65) return 'needs-improvement'; // Lowered from 70
    return 'poor';
  };
  
  const getScoreLabel = (score: number): string => {
    if (score >= 92) return 'Excellent';
    if (score >= 85) return 'Good';
    if (score >= 75) return 'Moderate';
    if (score >= 65) return 'Needs Work';
    return 'Poor';
  };

  const getScoreDescription = (score: number): string => {
    if (score >= 92) return 'Outstanding quality with excellent vocabulary and natural flow';
    if (score >= 85) return 'High quality content with good readability and engagement';
    if (score >= 75) return 'Solid content with room for vocabulary and style improvements';
    if (score >= 65) return 'Acceptable content that needs refinement';
    return 'Significant improvements needed for vocabulary and writing style';
  };

  const getProgressPercentage = (score: number): number => {
    // Convert score to progress percentage (65-100 range maps to 0-100%)
    return Math.max(0, Math.min(100, ((score - 65) / 35) * 100));
  };
  
  const formatLastCheck = (timestamp?: string): string => {
    if (!timestamp) return 'Never';
    
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      
      if (diffMinutes < 5) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) return `${diffDays}d ago`;
      
      return date.toLocaleDateString();
    } catch (error) {
      return 'Unknown';
    }
  };

  const getTopIssues = (): string[] => {
    if (!breakdown) return [];
    
    const issues: Array<{area: string, score: number, label: string}> = [
      { area: 'vocabulary', score: breakdown.vocabulary?.percentage || 100, label: 'Vocabulary Variety' },
      { area: 'aiPatterns', score: breakdown.aiPatterns?.percentage || 100, label: 'Writing Style' },
      { area: 'readability', score: breakdown.readability?.percentage || 100, label: 'Readability' },
      { area: 'engagement', score: breakdown.engagement?.percentage || 100, label: 'Engagement' }
    ];
    
    return issues
      .filter(issue => issue.score < 80)
      .sort((a, b) => a.score - b.score)
      .slice(0, 2)
      .map(issue => issue.label);
  };

  const topIssues = getTopIssues();
  const progressPercentage = getProgressPercentage(animatedScore);
  
  return (
    <div className="quality-score-wrapper">
      <div className="quality-score-container">
        <div className="quality-score-main">
          <div className={`quality-score-badge ${getScoreColor(animatedScore)}`}>
            {isLoading ? (
              <div className="quality-score-loading">
                <div className="spinner"></div>
                <span className="loading-text">Analyzing...</span>
              </div>
            ) : (
              <>
                <div className="score-circle">
                  <svg className="score-progress" viewBox="0 0 36 36">
                    <path
                      className="score-progress-bg"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeOpacity="0.1"
                    />
                    <path
                      className="score-progress-fill"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray={`${progressPercentage}, 100`}
                      style={{ 
                        transition: 'stroke-dasharray 0.8s ease-in-out',
                        transform: 'rotate(-90deg)',
                        transformOrigin: '50% 50%'
                      }}
                    />
                  </svg>
                  <div className="score-number-container">
                    <span className="quality-score-number">
                      {animatedScore}
                    </span>
                    <span className="quality-score-max">/100</span>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="quality-score-info">
            <div className="quality-score-label">
              Quality Score: <strong className={getScoreColor(animatedScore)}>{getScoreLabel(animatedScore)}</strong>
            </div>
            <div className="quality-score-description">
              {getScoreDescription(animatedScore)}
            </div>
            <div className="quality-score-meta">
              <span className="last-check">Last checked: {formatLastCheck(lastCheck)}</span>
              {breakdown && (
                <span className="breakdown-preview">
                  Vocab: {breakdown.vocabulary?.percentage || 0}% | 
                  Style: {breakdown.aiPatterns?.percentage || 0}% | 
                  Read: {breakdown.readability?.percentage || 0}%
                </span>
              )}
            </div>
            
            {topIssues.length > 0 && (
              <div className="quality-score-issues">
                <span className="issues-label">Focus areas:</span>
                <div className="issues-tags">
                  {topIssues.map((issue, index) => (
                    <span key={index} className="issue-tag">
                      {issue}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="quality-score-actions">
            <button
              className="quality-score-details-btn"
              onClick={() => setShowDetails(!showDetails)}
              disabled={isLoading}
              aria-label={`${showDetails ? 'Hide' : 'View'} detailed quality breakdown`}
            >
              <span>{showDetails ? 'Hide' : 'View'} Details</span>
              <span className={`details-icon ${showDetails ? 'expanded' : ''}`}>▼</span>
            </button>
            
            {onRefresh && (
              <button
                className="quality-score-refresh-btn"
                onClick={onRefresh}
                disabled={isLoading}
                title="Re-analyze quality"
                aria-label="Refresh quality analysis"
              >
                <span className={`refresh-icon ${isLoading ? 'spinning' : ''}`}>↻</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Updated threshold for hint */}
        {animatedScore < 85 && !showDetails && !isLoading && (
          <div className="quality-score-hint">
            <span className="hint-icon">💡</span>
            <span>
              {animatedScore < 75 
                ? 'Significant improvements available - check details for specific guidance'
                : 'Good foundation - view details to reach excellent quality'
              }
            </span>
          </div>
        )}

        {/* Quality trend indicator */}
        {lastCheck && !isLoading && (
          <div className="quality-trend">
            <div className="trend-indicators">
              <div className={`trend-indicator ${getScoreColor(animatedScore)}`}>
                <span className="trend-dot"></span>
                <span className="trend-label">Current Quality</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {showDetails && (
        <div className="quality-details-container">
          <QualityScoreDetails
            chapterId={chapterId}
            onClose={() => setShowDetails(false)}
          />
        </div>
      )}
    </div>
  );
};

export default QualityScore;