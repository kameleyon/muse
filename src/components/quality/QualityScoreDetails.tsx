import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import './QualityScoreDetails.css';

interface QualityMetrics {
  overallScore: number;
  breakdown: {
    [key: string]: {
      score: number;
      maxScore: number;
      percentage: number;
      issues: string[];
      highlights: string[];
    };
  };
  suggestions: string[];
  timestamp: string;
}

interface QualityScoreDetailsProps {
  chapterId: string;
  onClose: () => void;
}

const QualityScoreDetails: React.FC<QualityScoreDetailsProps> = ({ chapterId, onClose }) => {
  const [metrics, setMetrics] = useState<QualityMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    analyzeChapter();
  }, [chapterId]);

  const analyzeChapter = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/api/quality/analyze-chapter', { chapterId });
      const data = response.data;
      setMetrics(data.qualityMetrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const getCriteriaLabel = (key: string): string => {
    const labels: { [key: string]: string } = {
      audienceAlignment: 'Audience Alignment',
      readability: 'Readability',
      accuracy: 'Accuracy',
      engagement: 'Engagement',
      correctness: 'Grammar & Spelling',
      styleGuide: 'Style Guide',
      delivery: 'Delivery & Flow',
      originality: 'Originality',
      repetition: 'Word Variety',
      vocabulary: 'Vocabulary',
      aiPatterns: 'AI Detection',
      purposeAlignment: 'Purpose Alignment',
      factualAccuracy: 'Fact Checking'
    };
    return labels[key] || key;
  };

  const getCriteriaColor = (percentage: number): string => {
    if (percentage >= 95) return 'excellent';
    if (percentage >= 90) return 'good';
    if (percentage >= 80) return 'moderate';
    if (percentage >= 70) return 'needs-improvement';
    return 'poor';
  };

  if (isLoading) {
    return (
      <div className="quality-details-modal">
        <div className="quality-details-content">
          <div className="quality-details-loading">
            <div className="spinner"></div>
            <p>Analyzing content quality...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="quality-details-modal">
        <div className="quality-details-content">
          <div className="quality-details-error">
            <p>Error: {error || 'Failed to load quality metrics'}</p>
            <button onClick={analyzeChapter}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quality-details-modal">
      <div className="quality-details-content">
        <div className="quality-details-header">
          <h3>Quality Analysis Details</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="quality-details-overview">
          <div className="overall-score">
            <span className="score-large">{metrics.overallScore}</span>
            <span className="score-label">Overall Score</span>
          </div>
          
          {metrics.suggestions.length > 0 && (
            <div className="suggestions">
              <h4>Top Suggestions</h4>
              <ul>
                {metrics.suggestions.slice(0, 3).map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="quality-criteria-grid">
          {Object.entries(metrics.breakdown).map(([key, detail]) => (
            <div key={key} className="criteria-card">
              <div className="criteria-header">
                <span className="criteria-name">{getCriteriaLabel(key)}</span>
                <span className={`criteria-score ${getCriteriaColor(detail.percentage)}`}>
                  {Math.round(detail.percentage)}%
                </span>
              </div>
              
              <div className="criteria-bar">
                <div
                  className={`criteria-bar-fill ${getCriteriaColor(detail.percentage)}`}
                  style={{ width: `${Math.round(detail.percentage)}%` }}
                />
              </div>
              
              {detail.issues.length > 0 && (
                <div className="criteria-issues">
                  <strong>Issues:</strong>
                  <ul>
                    {detail.issues.slice(0, 2).map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {detail.highlights.length > 0 && (
                <div className="criteria-highlights">
                  <strong>Strengths:</strong>
                  <ul>
                    {detail.highlights.slice(0, 2).map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="quality-details-footer">
          <p className="analysis-time">
            Analysis performed: {new Date(metrics.timestamp).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QualityScoreDetails;