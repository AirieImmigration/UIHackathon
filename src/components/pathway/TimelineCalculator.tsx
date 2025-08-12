interface PathwayStepData {
  duration?: string;
  step_order: number;
}

interface TimelineResult {
  minYears: number;
  maxYears: number;
  totalRange: string;
}

export function calculatePathwayTimeline(steps: PathwayStepData[]): TimelineResult {
  let minMonths = 0;
  let maxMonths = 0;

  steps.forEach(step => {
    if (!step.duration) return;
    const duration = step.duration.toLowerCase();
    
    if (duration.includes('month')) {
      const months = parseInt(duration.match(/\d+/)?.[0] || '0');
      minMonths += months;
      maxMonths += months;
    } else if (duration.includes('year')) {
      const yearMatch = duration.match(/(\d+)/g);
      if (yearMatch) {
        const years = parseInt(yearMatch[0]);
        minMonths += years * 12;
        maxMonths += years * 12;
      }
    } else if (duration.includes('up to')) {
      const yearMatch = duration.match(/up to (\d+)/);
      if (yearMatch) {
        const maxYears = parseInt(yearMatch[1]);
        minMonths += 12; // Minimum 1 year for "up to X years"
        maxMonths += maxYears * 12;
      }
    } else if (duration === 'indefinite' || duration === 'permanent' || duration === 'lifetime') {
      // These don't add to the timeline as they're permanent status
      return;
    }
  });

  const minYears = Math.floor(minMonths / 12);
  const maxYears = Math.ceil(maxMonths / 12);

  let totalRange: string;
  if (minYears === maxYears) {
    totalRange = `approximately ${minYears} year${minYears !== 1 ? 's' : ''}`;
  } else {
    totalRange = `between ${minYears}-${maxYears} years`;
  }

  return {
    minYears,
    maxYears,
    totalRange
  };
}

interface TimelineDisplayProps {
  steps: PathwayStepData[];
}

export function TimelineDisplay({ steps }: TimelineDisplayProps) {
  const timeline = calculatePathwayTimeline(steps);

  return (
    <div className="bg-gradient-to-r from-primary/5 to-emerald-500/5 rounded-xl p-6 border border-primary/10">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Timeline to Goal</h3>
        <p className="text-2xl font-bold text-primary mb-1">
          {timeline.totalRange}
        </p>
        <p className="text-sm text-muted-foreground">
          Achieving your goal will take {timeline.totalRange} based on minimum requirements
        </p>
      </div>
    </div>
  );
}