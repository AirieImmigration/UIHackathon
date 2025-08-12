import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { EligibilityIcon, type EligibilityAssessment } from "./AIEligibilityAssessor";
import type { Visa } from "@/lib/queries/pathway";

interface EnhancedVisaCardProps {
  visa: Visa & { 
    eligibility_criteria?: string[]; 
    type?: string;
    stage?: string;
  };
  assessments: EligibilityAssessment[];
  successScore: number;
  index: number;
}

export function EnhancedVisaCard({ visa, assessments, successScore, index }: EnhancedVisaCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-50 border-emerald-200";
    if (score >= 60) return "bg-amber-50 border-amber-200";
    return "bg-red-50 border-red-200";
  };

  const getVisaTypeBadge = () => {
    if (visa.type === "Permanent") return "Permanent";
    return "Temporary";
  };

  const formatStage = (stage: string) => {
    const stageMap: Record<string, string> = {
      temporary: "Temporary Visa",
      residence: "Residence Visa", 
      current: "Current Status",
      citizenship: "Citizenship"
    };
    return stageMap[stage] || stage;
  };

  const hasHardBlocker = assessments.some(a => a.met === 'no');

  return (
    <Card 
      className={`w-full transition-all duration-300 hover:shadow-lg ${getScoreBg(successScore)}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">{visa.name}</h3>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">
                  {getVisaTypeBadge()}
                </Badge>
                {visa.stage && (
                  <Badge variant="secondary">
                    {formatStage(visa.stage)}
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Success Score */}
            <div className="text-right">
              <div className={`text-2xl font-bold ${getScoreColor(successScore)}`}>
                {successScore}%
              </div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>

          {/* Description */}
          {visa.short_description && (
            <p className="text-sm text-muted-foreground">
              {visa.short_description}
            </p>
          )}

          {/* Hard blocker warning */}
          {hasHardBlocker && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700 font-medium">
                ⚠️ Hard requirement not met - eligibility unlikely
              </p>
            </div>
          )}

          {/* Expandable Eligibility Details */}
          {assessments.length > 0 && (
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full justify-between p-0 h-auto font-normal"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-1">
                    <span className="flex items-center gap-2 text-left">
                      View Eligibility Details
                      {isExpanded ? 
                        <ChevronUp className="h-4 w-4 flex-shrink-0" /> : 
                        <ChevronDown className="h-4 w-4 flex-shrink-0" />
                      }
                    </span>
                    <span className="text-muted-foreground text-xs sm:text-sm">
                      ({assessments.filter(a => a.met === 'yes').length}/{assessments.length} requirements met)
                    </span>
                  </div>
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="mt-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Eligibility Requirements:</h4>
                  {assessments.map((assessment, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-background rounded-lg border">
                      <EligibilityIcon status={assessment.met} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">
                          {assessment.criterion}
                        </p>
                        {assessment.reasoning && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {assessment.reasoning}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </CardContent>
    </Card>
  );
}