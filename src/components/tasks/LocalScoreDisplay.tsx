import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LocalVisaScore } from "@/lib/localScoreCalculator";

interface LocalScoreDisplayProps {
  pathway: Array<{ visaSlug: string }>;
  scores: LocalVisaScore[];
  pulsingSteps: Set<string>;
}

export function LocalScoreDisplay({ pathway, scores, pulsingSteps }: LocalScoreDisplayProps) {
  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number): string => {
    if (score >= 80) return "bg-green-100 border-green-200";
    if (score >= 60) return "bg-amber-100 border-amber-200";
    return "bg-red-100 border-red-200";
  };

  if (!pathway || pathway.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No pathway selected</p>
      </div>
    );
  }

  return (
    <Card className="rounded-2xl shadow-[var(--shadow-soft)]">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-1">Your Immigration Pathway</h2>
            <p className="text-sm text-muted-foreground">
              Complete tasks below to improve your success scores
            </p>
          </div>
          
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {pathway.map((step, index) => {
              const score = scores.find(s => s.stepName === step.visaSlug);
              const isPulsing = pulsingSteps.has(step.visaSlug);
              
              return (
                <div key={step.visaSlug} className="flex items-center gap-3 flex-shrink-0">
                  <Card 
                    className={cn(
                      "transition-all duration-300 min-w-[200px]",
                      isPulsing && "animate-pulse ring-2 ring-primary",
                      score && getScoreBg(score.score)
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h3 className="font-medium text-sm leading-tight">
                          {step.visaSlug.replace(' Visa', '')}
                        </h3>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "text-2xl font-bold",
                              score ? getScoreColor(score.score) : "text-muted-foreground"
                            )}>
                              {score?.score || 0}%
                            </span>
                            
                            {score?.improved && (
                              <div className="flex items-center gap-1 text-green-600">
                                <ArrowUp className="h-4 w-4" />
                                <span className="text-xs font-medium">
                                  +{score.score - (score.previousScore || 0)}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-xs",
                              score && getScoreBg(score.score)
                            )}
                          >
                            Step {index + 1}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {index < pathway.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}