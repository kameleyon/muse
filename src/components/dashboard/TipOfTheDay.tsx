import React from 'react';

const TipOfTheDay: React.FC = () => {
  // This could be fetched from an API in a real app
  const tip = {
    title: "Tip of the Day",
    content: "Use the '@mentions' feature in your content to link to team members and collaborate more effectively."
  };

  return (
    <div className="px-6 py-2">
      
      <p className="text-neutral-medium text-sm">{tip.content}</p>
    </div>
  );
};

export default TipOfTheDay;
