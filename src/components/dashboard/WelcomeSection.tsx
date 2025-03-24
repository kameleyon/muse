import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

interface WelcomeSectionProps {
  userName: string;
  draftCount: number;
  publishedCount: number;
}

interface DailyQuote {
  text: string;
  author: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ 
  userName, 
  draftCount, 
  publishedCount 
}) => {
  const [timeOfDay, setTimeOfDay] = useState<string>('');
  const [quote, setQuote] = useState<DailyQuote>({
    text: "The best way to predict the future is to create it.",
    author: "Abraham Lincoln"
  });
  
  // Get the greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setTimeOfDay('Morning');
    } else if (hour >= 12 && hour < 18) {
      setTimeOfDay('Afternoon');
    } else if (hour >= 18 && hour < 22) {
      setTimeOfDay('Evening');
    } else {
      setTimeOfDay('Night');
    }
  }, []);

  return (
    <div className="mb-8 bg-neutral-white rounded-2xl p-6 border border-neutral-light/40 shadow-md">
      <h1 className="text-2xl md:text-3xl font-bold font-heading text-secondary mb-2">
        Good {timeOfDay}, <span className="hidden md:inline">{userName}</span><span className="inline md:hidden">!</span>
      </h1>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <p className="text-neutral-medium max-w-xl">
          You have {draftCount} project{draftCount !== 1 ? 's' : ''} in progress and {publishedCount} completed project{publishedCount !== 1 ? 's' : ''}.
        </p>
        <div className="flex gap-2">
          <Button variant="primary" className="text-[#faf9f5]" leftIcon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          }>
            New Project
          </Button>
          <Button variant="outline" leftIcon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
              />
            </svg>
          }>
            View All
          </Button>
        </div>
      </div>
      
      {/* Quote of the Day */}
      <div className="mt-4 p-4 bg-neutral-light/30 rounded-xl border border-neutral-light">
        <p className="text-neutral-medium italic">"{quote.text}"</p>
        <p className="text-right text-sm text-neutral-medium mt-1">— {quote.author}</p>
      </div>
    </div>
  );
};

export default WelcomeSection;
