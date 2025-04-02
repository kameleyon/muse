import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

// Simple progress bar component to replace the missing Progress import
const SimpleProgressBar = ({ value = 0, className = "" }) => {
  return (
    <div className={`w-full bg-neutral-light/30 rounded-full h-1.5 ${className}`}>
      <div 
        className="bg-primary rounded-full h-1.5" 
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};

interface SEOPerformance {
  ranking?: number;
  keywords?: {
    keyword: string;
    position: number;
    change: number;
  }[];
  backlinks?: number;
  impressions?: number;
  ctr?: number;
}

interface ContentImpactAssessmentProps {
  seoPerformance: SEOPerformance | null;
}

const ContentImpactAssessment: React.FC<ContentImpactAssessmentProps> = ({
  seoPerformance
}) => {
  // Default SEO performance data if not provided
  const defaultSeoPerformance: SEOPerformance = {
    ranking: 14,
    keywords: [
      { keyword: 'content marketing strategy', position: 8, change: 4 },
      { keyword: 'blog content planning', position: 12, change: 2 },
      { keyword: 'content marketing ROI', position: 15, change: -2 },
      { keyword: 'content strategy template', position: 18, change: 5 }
    ],
    backlinks: 23,
    impressions: 1458,
    ctr: 3.2
  };
  
  // Use provided SEO performance or default
  const seo = seoPerformance || defaultSeoPerformance;
  
  return (
    <Card className="p-4">
      <h3 className="text-base font-semibold font-heading text-secondary mb-4">Content Impact Assessment</h3>
      
      <div className="space-y-5">
        <div>
          <h4 className="text-sm font-medium text-neutral-dark mb-3">SEO Performance</h4>
          
          <div className="bg-neutral-light/10 p-3 rounded-md mb-3">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm">Google Ranking Position</div>
              <div className="text-xl font-bold text-primary">{seo.ranking}</div>
            </div>
            
            <SimpleProgressBar value={(100 - (seo.ranking || 100)) || 0} />
            
            <div className="flex justify-between text-xs text-neutral-muted mt-1">
              <span>Higher ranking = better visibility</span>
              <span>Goal: Top 10</span>
            </div>
          </div>
          
          <div className="space-y-2 mb-3">
            <h5 className="text-xs font-medium text-neutral-dark">Ranking Keywords</h5>
            
            {seo.keywords?.map((keyword, index) => (
              <div 
                key={index}
                className="flex justify-between items-center p-2 bg-white rounded-md border border-neutral-light"
              >
                <span className="text-sm">{keyword.keyword}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{keyword.position}</span>
                  <span className={`text-xs ${
                    keyword.change > 0 ? 'text-green-500' : keyword.change < 0 ? 'text-red-500' : 'text-neutral-muted'
                  }`}>
                    {keyword.change > 0 ? '↑' : keyword.change < 0 ? '↓' : '–'} {Math.abs(keyword.change)}
                  </span>
                </div>
              </div>
            ))}
            
            <div className="flex justify-between items-baseline mt-3">
              <div className="flex gap-4">
                <div>
                  <div className="text-xs text-neutral-muted">Backlinks</div>
                  <div className="text-sm font-medium">{seo.backlinks}</div>
                </div>
                <div>
                  <div className="text-xs text-neutral-muted">Impressions</div>
                  <div className="text-sm font-medium">{seo.impressions?.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-neutral-muted">CTR</div>
                  <div className="text-sm font-medium">{seo.ctr}%</div>
                </div>
              </div>
              
              <Button variant="outline" size="sm">
                View Full Report
              </Button>
            </div>
          </div>
        </div>
        
        <div className="pt-3 border-t border-neutral-light">
          <h4 className="text-sm font-medium text-neutral-dark mb-3">Content Effectiveness</h4>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-sm">Reader Satisfaction</div>
              <div className="flex items-center gap-1">
                <div className="text-amber-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-amber-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-amber-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-amber-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-neutral-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium ml-2">4.0/5</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm">Authority Score</div>
              <div className="flex items-center">
                <div className="w-24 h-2 bg-neutral-light/30 rounded-full overflow-hidden mr-2">
                  <div className="bg-green-500 h-full" style={{ width: '70%' }}></div>
                </div>
                <span className="text-sm font-medium">70/100</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm">Engagement Rate</div>
              <div className="flex items-center">
                <div className="w-24 h-2 bg-neutral-light/30 rounded-full overflow-hidden mr-2">
                  <div className="bg-yellow-500 h-full" style={{ width: '58%' }}></div>
                </div>
                <span className="text-sm font-medium">58%</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm">Conversion Rate</div>
              <div className="flex items-center">
                <div className="w-24 h-2 bg-neutral-light/30 rounded-full overflow-hidden mr-2">
                  <div className="bg-primary h-full" style={{ width: '12%' }}></div>
                </div>
                <span className="text-sm font-medium">12%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-3 border-t border-neutral-light">
          <h4 className="text-sm font-medium text-neutral-dark mb-3">Business Impact</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-neutral-light/10 p-3 rounded-md">
              <div className="text-xs text-neutral-muted mb-1">Attributed Leads</div>
              <div className="text-xl font-bold text-primary">28</div>
              <div className="text-xs text-green-500">+12% vs goal</div>
            </div>
            
            <div className="bg-neutral-light/10 p-3 rounded-md">
              <div className="text-xs text-neutral-muted mb-1">Revenue Impact</div>
              <div className="text-xl font-bold text-primary">$2,450</div>
              <div className="text-xs text-green-500">+8% vs goal</div>
            </div>
            
            <div className="bg-neutral-light/10 p-3 rounded-md">
              <div className="text-xs text-neutral-muted mb-1">Cost per Lead</div>
              <div className="text-xl font-bold text-primary">$18</div>
              <div className="text-xs text-green-500">-22% vs benchmark</div>
            </div>
            
            <div className="bg-neutral-light/10 p-3 rounded-md">
              <div className="text-xs text-neutral-muted mb-1">ROI</div>
              <div className="text-xl font-bold text-primary">325%</div>
              <div className="text-xs text-green-500">+125% vs goal</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ContentImpactAssessment;
