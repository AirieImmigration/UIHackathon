import { ChevronRight } from "lucide-react";
import { VisaPathwayCard } from "./VisaPathwayCard";
import type { Visa } from "@/lib/queries/pathway";

interface PathwayNavigationProps {
  pathway: string[];
  visas: Visa[];
}

export function PathwayNavigation({ pathway, visas }: PathwayNavigationProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-4 overflow-x-auto pb-4 md:justify-center">
        {pathway.map((stepName, index) => {
          const isCurrent = index === 0;
          const isGoal = index === pathway.length - 1;
          
          // Create a mock visa object for the step
          const mockVisa = {
            id: stepName,
            slug: stepName.toLowerCase().replace(/\s+/g, '-'),
            name: stepName,
            stage: isCurrent ? "current" : isGoal ? "residence" : "temporary",
            shortDescription: isCurrent ? "Your current status" : isGoal ? "Permanent residence achieved" : "Next step in your journey"
          };
          
          return (
            <div key={stepName} className="flex items-center gap-4 flex-shrink-0">
              <VisaPathwayCard 
                visa={mockVisa}
                isCurrent={isCurrent}
                isGoal={isGoal}
                index={index}
              />
              
              {index < pathway.length - 1 && (
                <ChevronRight className="h-6 w-6 text-muted-foreground flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}