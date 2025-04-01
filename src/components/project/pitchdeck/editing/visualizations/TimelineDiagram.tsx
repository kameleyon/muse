import React from 'react';

interface TimelineEvent {
  year: string;
  quarter?: string;
  title: string;
  isCurrentPhase?: boolean;
}

interface TimelineDiagramProps {
  title: string;
  events: TimelineEvent[];
  startYear: string;
  endYear: string;
  brandColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const TimelineDiagram: React.FC<TimelineDiagramProps> = ({
  title,
  events,
  startYear,
  endYear,
  brandColors
}) => {
  // Sort events by year and quarter
  const sortedEvents = [...events].sort((a, b) => {
    const yearA = parseInt(a.year);
    const yearB = parseInt(b.year);
    if (yearA !== yearB) return yearA - yearB;
    
    // If years are equal, sort by quarter if available
    if (a.quarter && b.quarter) {
      return parseInt(a.quarter) - parseInt(b.quarter);
    }
    return 0;
  });

  return (
    <div className="timeline-diagram w-full p-4 rounded-lg border" 
         style={{ borderColor: `${brandColors.primary}30`, background: `${brandColors.secondary}05` }}>
      <h3 className="text-center font-semibold mb-4" style={{ color: brandColors.primary }}>
        {title}
      </h3>
      
      {/* Timeline header showing years */}
      <div className="flex justify-between items-center mb-2 px-4">
        <span className="text-xs font-medium" style={{ color: brandColors.secondary }}>
          {startYear}
        </span>
        <div className="flex-grow mx-4 text-center text-xs text-gray-500">Timeline</div>
        <span className="text-xs font-medium" style={{ color: brandColors.secondary }}>
          {endYear}
        </span>
      </div>
      
      {/* Main timeline bar */}
      <div className="relative">
        {/* Timeline bar */}
        <div 
          className="h-2 rounded-full mx-8 mb-10" 
          style={{ 
            background: `linear-gradient(to right, ${brandColors.primary}, ${brandColors.secondary})`,
            boxShadow: `0 1px 3px ${brandColors.primary}30`
          }}
        ></div>
        
        {/* Timeline events */}
        <div className="absolute top-0 left-0 w-full">
          {sortedEvents.map((event, index) => {
            // Calculate position along timeline (simple linear interpolation)
            const startYearNum = parseInt(startYear);
            const endYearNum = parseInt(endYear);
            const eventYearNum = parseInt(event.year);
            const totalYears = endYearNum - startYearNum;
            
            // Adjust position for quarters (Q1=0, Q2=0.25, Q3=0.5, Q4=0.75)
            let quarterAdjustment = 0;
            if (event.quarter) {
              const quarterNum = parseInt(event.quarter);
              quarterAdjustment = (quarterNum - 1) * 0.25;
            }
            
            const position = ((eventYearNum - startYearNum) + quarterAdjustment) / totalYears * 100;
            
            // Ensure positions are within bounds (8% to 92% to account for margins)
            const adjustedPosition = 8 + (position * 0.84);
            
            return (
              <div 
                key={index} 
                className="absolute"
                style={{ 
                  left: `${adjustedPosition}%`, 
                  top: '-5px',
                  transform: 'translateX(-50%)'
                }}
              >
                {/* Event marker */}
                <div 
                  className={`w-3 h-3 rounded-full mx-auto mb-1 ${
                    event.isCurrentPhase ? `ring-2 ring-offset-2 ring-${brandColors.accent.replace('#', '')}` : ''
                  }`}
                  style={{
                    backgroundColor: event.isCurrentPhase ? brandColors.accent : brandColors.primary
                  }}
                ></div>
                
                {/* Label line */}
                <div 
                  className="h-8 w-px mx-auto" 
                  style={{ backgroundColor: `${brandColors.secondary}40` }}
                ></div>
                
                {/* Event label - alternate up/down for readability */}
                <div 
                  className={`absolute whitespace-nowrap text-xs px-2 py-1 rounded ${
                    index % 2 === 0 ? 'bottom-7' : 'top-10'
                  }`}
                  style={{ 
                    left: '50%', 
                    transform: 'translateX(-50%)',
                    backgroundColor: event.isCurrentPhase ? `${brandColors.accent}15` : 'transparent',
                    color: event.isCurrentPhase ? brandColors.accent : brandColors.secondary,
                    fontWeight: event.isCurrentPhase ? 600 : 400
                  }}
                >
                  <div className="font-medium">{`${event.year}${event.quarter ? ` Q${event.quarter}` : ''}`}</div>
                  <div className="text-[10px] max-w-[120px] truncate">{event.title}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex justify-end items-center mt-12 text-xs text-gray-500">
        <div className="flex items-center mr-4">
          <div 
            className="w-3 h-3 rounded-full mr-1"
            style={{ backgroundColor: brandColors.primary }}
          ></div>
          <span>Milestone</span>
        </div>
        <div className="flex items-center">
          <div
            className={`w-3 h-3 rounded-full ring-2 ring-offset-2 mr-1`}
            style={{
              backgroundColor: brandColors.accent,
              borderColor: brandColors.accent
            }}
          ></div>
          <span>Current Phase</span>
        </div>
      </div>
    </div>
  );
};

export default TimelineDiagram;