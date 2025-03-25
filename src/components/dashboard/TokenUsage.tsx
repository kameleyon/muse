import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

interface TokenUsageProps {
  used: number;
  total: number;
  percentage: number;
}

const TokenUsage: React.FC<TokenUsageProps> = ({ used, total, percentage }) => {
  return (
    <div className="py-2 px-6">
      
      <div className="mb-2 flex justify-between items-center">
        <span className="text-sm text-neutral-medium">Monthly tokens</span>
        <span className="text-sm font-medium">{used} / {total}</span>
      </div>
      
      <div className="w-full bg-neutral-light/80 rounded-full h-2 mb-4">
        <div
          className="bg-primary h-2 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      <p className="text-xs text-neutral-medium">
        Your token usage resets on the 1st of each month. Need more tokens?{' '}
        <Link to="/tokens" className="text-primary hover:underline">
          Upgrade your plan
        </Link>
      </p>
    </div>
  );
};

export default TokenUsage;
