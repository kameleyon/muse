import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Coins, TrendingUp, AlertTriangle, Info } from 'lucide-react';

interface EnhancedTokenUsageProps {
  used: number;
  total: number;
  percentage: number;
  dailyAverage?: number;
  projectedUsage?: number;
}

const EnhancedTokenUsage: React.FC<EnhancedTokenUsageProps> = ({ 
  used, 
  total, 
  percentage, 
  dailyAverage = 2500, 
  projectedUsage = 85 
}) => {
  // Calculate days remaining in the month
  const today = new Date();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const daysRemaining = lastDayOfMonth - today.getDate();
  
  // Calculate projected usage
  const projectedTotal = used + (dailyAverage * daysRemaining);
  const projectedPercentage = Math.min(Math.round((projectedTotal / total) * 100), 100);
  
  // Determine status color based on projected usage
  const getStatusColor = () => {
    if (projectedPercentage >= 90) return 'text-red-500';
    if (projectedPercentage >= 70) return 'text-orange-400';
    return 'text-green-500';
  };

  // Determine progress bar color based on current usage
  const getProgressColor = () => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-orange-400';
    return 'bg-primary';
  };

  // Format large numbers with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow bg-white border border-neutral-light/30 rounded-xl overflow-hidden">
      <CardHeader className="border-b border-neutral-light/40 pb-4 bg-gradient-to-r from-primary/10 to-transparent">
        <CardTitle className="text-xl font-bold font-heading text-secondary flex items-center">
          <Coins className="h-5 w-5 mr-2 text-primary" />
          Resource Usage
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-secondary">Monthly Tokens</h3>
            <p className="text-sm text-neutral-medium">Resets in {daysRemaining} days</p>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold">{formatNumber(used)}</span>
            <span className="text-neutral-medium"> / {formatNumber(total)}</span>
          </div>
        </div>
        
        {/* Current Usage Progress Bar */}
        <div className="w-full bg-neutral-light/50 rounded-full h-3 mb-2 shadow-inner overflow-hidden">
          <div
            className={`${getProgressColor()} h-3 rounded-full transition-all duration-500 ease-in-out relative`}
            style={{ width: `${percentage}%` }}
          >
            <div className="absolute inset-0 bg-white/20 w-full h-full bg-[length:10px_10px] bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)]"></div>
          </div>
        </div>
        <div className="flex justify-between text-xs text-neutral-medium mb-6">
          <span>Current: {percentage}%</span>
          <span>Total: 100%</span>
        </div>
        
        {/* Projected Usage */}
        <div className="bg-gradient-to-br from-white to-neutral-light/10 rounded-xl p-4 border border-neutral-light/30 mb-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 z-0"></div>
          <div className="flex items-start relative z-10">
            <div className="p-2 rounded-full bg-white shadow-sm border border-neutral-light/30 mr-3 flex-shrink-0">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-secondary">Projected Usage</h4>
              <p className="text-sm text-neutral-medium mb-2">
                At your current rate, you'll use approximately {formatNumber(projectedTotal)} tokens ({projectedPercentage}%) this month.
              </p>
              
              {/* Projected Usage Progress Bar */}
              <div className="w-full bg-neutral-light/30 rounded-full h-2 mb-1 overflow-hidden">
                <div
                  className="bg-neutral-light/80 h-2 rounded-full"
                  style={{ width: `${projectedPercentage}%` }}
                ></div>
              </div>
              
              {/* Warning message if projected to exceed */}
              {projectedPercentage > 90 && (
                <div className="mt-2 flex items-center">
                  <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                  <p className="text-xs text-red-500">
                    You're projected to exceed your monthly limit.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Daily Average */}
        <div className="flex justify-between items-center text-sm mb-4 p-2 bg-neutral-light/10 rounded-lg border border-neutral-light/20">
          <div className="flex items-center">
            <div className="p-1 rounded-full bg-white shadow-sm border border-neutral-light/30 mr-2">
              <Info className="h-3 w-3 text-primary" />
            </div>
            <span className="text-neutral-medium">Daily average:</span>
          </div>
          <span className="font-medium">{formatNumber(dailyAverage)} tokens</span>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button 
            variant="primary" 
            size="sm" 
            fullWidth={true}
            className="flex-1 bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary shadow-md hover:shadow-lg transition-all"
          >
            Top Up Tokens
          </Button>
          <Link to="/tokens" className="flex-1">
            <Button 
              variant="outline" 
              size="sm" 
              fullWidth={true}
              className="border border-neutral-light/30 hover:bg-primary/5"
            >
              Usage History
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedTokenUsage;
