import React from 'react';

const TipOfTheDay: React.FC = () => {
  // This could be fetched from an API in a real app
  const tip = {
    title: "Tip of the Day",
    content: "Use the '@mentions' feature in your content to link to team members and collaborate more effectively."
  };

  return (
    <div className="bg-white/10 rounded-xl p-6 border border-neutral-light/40 shadow-md mb-6">
      <h3 className="flex items-center text-primary font-medium mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {tip.title}
      </h3>
      <p className="text-neutral-medium text-sm">{tip.content}</p>
    </div>
  );
};

export default TipOfTheDay;
