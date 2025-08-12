import { ArrowRight } from "lucide-react";
import { MiniVisaCard } from "./MiniVisaCard";
import type { VisaScore } from "@/lib/scoreCalculator";

interface MiniPathwayHeaderProps {
  pathway: Array<{ visaSlug: string }>;
  visaData: Array<{ slug: string; name: string; type: string }>;
  scores: VisaScore[];
  pulsingVisas: Set<string>;
}

export function MiniPathwayHeader({ pathway, visaData, scores, pulsingVisas }: MiniPathwayHeaderProps) {
  if (!pathway || pathway.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No pathway selected</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-1">Your Immigration Pathway</h2>
        <p className="text-sm text-muted-foreground">
          Complete tasks below to improve your success scores
        </p>
      </div>
      
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {pathway.map((step, index) => {
          const visa = visaData.find(v => v.slug === step.visaSlug);
          const score = scores.find(s => s.visaSlug === step.visaSlug);
          
          if (!visa) return null;
          
          return (
            <div key={step.visaSlug} className="flex items-center gap-3 flex-shrink-0">
              <MiniVisaCard
                visa={visa}
                score={score?.score || 0}
                isPulsing={pulsingVisas.has(step.visaSlug)}
                index={index}
              />
              {index < pathway.length - 1 && (
                <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}