import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';

const PerformanceTracker: React.FC = () => {
  return (
    <Card className="p-4">
      <h3 className="text-base font-semibold font-heading text-secondary mb-3">Performance Tracking</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-neutral-dark mb-2">Tracking Setup</h4>
          <div className="space-y-3">
            <div className="flex items-start space-x-4">
              <div className="w-5 h-5 pt-0.5 text-green-500 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h5 className="text-sm font-medium">Google Analytics</h5>
                <p className="text-xs text-neutral-muted">
                  Track visitors, page views, and user behavior
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-5 h-5 pt-0.5 text-green-500 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h5 className="text-sm font-medium">UTM Parameters</h5>
                <p className="text-xs text-neutral-muted">
                  Track traffic sources with custom UTM parameters
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-5 h-5 pt-0.5 text-yellow-500 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h5 className="text-sm font-medium">Conversion Tracking</h5>
                <p className="text-xs text-neutral-muted">
                  Track form submissions, signups, and purchases
                </p>
                <Button variant="outline" size="sm" className="mt-1">
                  Configure
                </Button>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-5 h-5 pt-0.5 text-yellow-500 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h5 className="text-sm font-medium">Social Engagement</h5>
                <p className="text-xs text-neutral-muted">
                  Track shares, likes, and comments across platforms
                </p>
                <Button variant="outline" size="sm" className="mt-1">
                  Configure
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-3 border-t border-neutral-light">
          <h4 className="text-sm font-medium text-neutral-dark mb-2">Success Metrics</h4>
          <div className="space-y-2">
            <div className="bg-neutral-light/10 p-3 rounded-md">
              <Label className="text-xs font-medium block mb-1">
                Traffic Goals
              </Label>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-sm font-medium text-primary">500</div>
                  <div className="text-xs text-neutral-muted">Views (24h)</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-primary">2,500</div>
                  <div className="text-xs text-neutral-muted">Views (Week)</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-primary">10,000</div>
                  <div className="text-xs text-neutral-muted">Views (Month)</div>
                </div>
              </div>
            </div>
            
            <div className="bg-neutral-light/10 p-3 rounded-md">
              <Label className="text-xs font-medium block mb-1">
                Engagement Goals
              </Label>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-sm font-medium text-primary">3:30</div>
                  <div className="text-xs text-neutral-muted">Avg. Time</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-primary">75%</div>
                  <div className="text-xs text-neutral-muted">Read Rate</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-primary">50</div>
                  <div className="text-xs text-neutral-muted">Comments</div>
                </div>
              </div>
            </div>
            
            <div className="bg-neutral-light/10 p-3 rounded-md">
              <Label className="text-xs font-medium block mb-1">
                Conversion Goals
              </Label>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-sm font-medium text-primary">100</div>
                  <div className="text-xs text-neutral-muted">Subscriptions</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-primary">25</div>
                  <div className="text-xs text-neutral-muted">Lead Gen</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-primary">10</div>
                  <div className="text-xs text-neutral-muted">Sales</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-3 border-t border-neutral-light">
          <h4 className="text-sm font-medium text-neutral-dark mb-2">Reporting Setup</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-sm font-medium">Performance Report</h5>
                <p className="text-xs text-neutral-muted">
                  Weekly summary of key metrics
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-sm font-medium">ROI Calculator</h5>
                <p className="text-xs text-neutral-muted">
                  Track business impact of content
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-sm font-medium">Custom Dashboard</h5>
                <p className="text-xs text-neutral-muted">
                  Build a custom metrics dashboard
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PerformanceTracker;
