import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";
import type { Visa } from "@/lib/queries/pathway";

interface VisaPathwayCardProps {
  visa: Visa;
  isCurrent?: boolean;
  isGoal?: boolean;
  index: number;
}

export function VisaPathwayCard({ visa, isCurrent = false, isGoal = false, index }: VisaPathwayCardProps) {
  return (
    <Card 
      className={`
        min-w-[280px] rounded-2xl shadow-[var(--shadow-soft)] transition-all duration-300
        ${isCurrent ? 'border-2 border-primary' : 'border-2 border-dashed border-muted-foreground/30'}
        ${!isCurrent ? 'bg-muted/20' : ''}
        animate-fade-in
      `}
      style={{
        animationDelay: `${index * 150}ms`,
        animationFillMode: 'both'
      }}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{visa.name}</h3>
                {isGoal && (
                  <Target className="h-5 w-5 text-primary" />
                )}
              </div>
              {visa.stage && (
                <Badge variant="secondary" className="text-xs">
                  {formatStage(visa.stage)}
                </Badge>
              )}
            </div>
          </div>
          
          {visa.shortDescription && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {visa.shortDescription}
            </p>
          )}
          
          <div className="pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              {isCurrent ? "Current status" : "Future pathway step"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function formatStage(stage: string): string {
  const stageLabels: Record<string, string> = {
    "NotInNZ": "Not in NZ",
    "Work": "Work Visa",
    "Student": "Student Visa", 
    "Visitor": "Visitor Visa",
    "FirstResidence": "First Residence",
    "Permanent": "Permanent Residence"
  };
  
  return stageLabels[stage] || stage;
}