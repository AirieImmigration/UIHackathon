import { TimelinePin } from "./TimelinePin";
import type { Persona } from "@/config/personas";

interface ImmigrationTimelineProps {
  persona?: Persona;
  goal?: { summary: string; targetVisaSlug?: string };
}

const timelineStages = [
  "Not in NZ",
  "On initial visas in NZ", 
  "On a pathway",
  "First residence visa in NZ",
  "Permanent Residence"
];

function getPersonaPosition(persona?: Persona): number {
  if (!persona) return 0;
  // Simple logic for prototype - can be enhanced
  if (persona.country === "New Zealand") return 4;
  if (persona.attributes?.nzRegistration) return 2;
  return 0;
}

function getGoalPosition(goal?: { targetVisaSlug?: string }): number {
  if (!goal?.targetVisaSlug) return 4;
  
  switch (goal.targetVisaSlug) {
    case "student-visa": return 1;
    case "work-to-residence": return 2;
    case "skilled-migrant": return 3;
    default: return 4;
  }
}

export function ImmigrationTimeline({ persona, goal }: ImmigrationTimelineProps) {
  const personaPos = getPersonaPosition(persona);
  const goalPos = getGoalPosition(goal);

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-12 text-center">Your Immigration Journey</h2>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="h-1 bg-border rounded-full relative overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-accent w-full rounded-full"></div>
        </div>
        
        {/* Stage markers */}
        <div className="flex justify-between mt-6">
          {timelineStages.map((stage, index) => (
            <div key={index} className="flex flex-col items-center max-w-24">
              <div className="w-4 h-4 bg-primary rounded-full mb-2 relative -top-8"></div>
              <span className="text-xs text-center text-muted-foreground">{stage}</span>
            </div>
          ))}
        </div>
        
        {/* Animated pins */}
        <div className="relative h-20">
          {persona && (
            <TimelinePin 
              name={persona.name} 
              type="persona" 
              position={personaPos}
              delay={500}
            />
          )}
          {goal && (
            <TimelinePin 
              name="Goal" 
              type="goal" 
              position={goalPos}
              delay={1000}
            />
          )}
        </div>
      </div>
    </div>
  );
}