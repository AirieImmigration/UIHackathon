import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Target, ChevronDown, CheckCircle, XCircle, Percent } from "lucide-react";
import { planStore } from "@/lib/planStore";

interface EnhancedVisa {
  id: string | number;
  slug: string;
  name: string;
  type?: string;
  stage?: string;
  short_description?: string | null;
  shortDescription?: string | null;
  iconName?: string | null;
  eligibility_criteria?: string[];
  successScore?: number;
}

interface VisaPathwayCardProps {
  visa: EnhancedVisa;
  isCurrent?: boolean;
  isGoal?: boolean;
  index: number;
}

export function VisaPathwayCard({ visa, isCurrent = false, isGoal = false, index }: VisaPathwayCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const persona = planStore.getPersona();

  // AI-powered eligibility assessment
  const assessEligibility = (criteria: string): boolean => {
    if (!persona) return false;
    
    const criteriaLower = criteria.toLowerCase();
    
    // Age assessment
    if (criteriaLower.includes('aged between') || criteriaLower.includes('age')) {
      const ageMatch = criteriaLower.match(/aged?\s+between\s+(\d+)\s+and\s+(\d+)/);
      if (ageMatch && persona.age) {
        const minAge = parseInt(ageMatch[1]);
        const maxAge = parseInt(ageMatch[2]);
        return persona.age >= minAge && persona.age <= maxAge;
      }
    }
    
    // Nationality assessment
    if (criteriaLower.includes('citizen of')) {
      const nationalityMatch = criteriaLower.match(/citizen of ([^,]+)/);
      if (nationalityMatch && persona.currentVisaSlug) {
        const requiredNationality = nationalityMatch[1].trim().toLowerCase();
        // For now, assume France Working Holiday means French nationality
        return persona.currentVisaSlug.toLowerCase().includes('france') && requiredNationality.includes('france');
      }
    }
    
    // English proficiency assessment
    if (criteriaLower.includes('english')) {
      return persona.englishLevel === 'advanced' || persona.englishLevel === 'fluent';
    }
    
    // Experience assessment
    if (criteriaLower.includes('experience') || criteriaLower.includes('skilled')) {
      return (persona.yearsExperience || 0) >= 2;
    }
    
    // Education assessment
    if (criteriaLower.includes('qualification') || criteriaLower.includes('education')) {
      return ['bachelor', 'master', 'doctorate'].includes(persona.educationLevel || '');
    }
    
    // Financial assessment
    if (criteriaLower.includes('money') || criteriaLower.includes('funds')) {
      return (persona.yearlySalaryNZD || 0) > 30000; // Use salary as proxy for financial capability
    }
    
    // Default to likely met for generic requirements
    return true;
  };

  const getSuccessScore = (): number => {
    if (!visa.eligibility_criteria || visa.eligibility_criteria.length === 0) {
      return visa.successScore || 85;
    }
    
    const metCriteria = visa.eligibility_criteria.filter(assessEligibility);
    return Math.round((metCriteria.length / visa.eligibility_criteria.length) * 100);
  };

  const successScore = getSuccessScore();

  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getVisaTypeBadge = () => {
    if (visa.type) {
      return visa.type === "Permanent" ? "Permanent" : "Temporary";
    }
    return isGoal ? "Permanent" : "Temporary";
  };

  return (
    <Card 
      className={`
        w-full max-w-2xl mx-auto rounded-2xl shadow-[var(--shadow-soft)] transition-all duration-300
        ${isCurrent ? 'border-2 border-primary bg-primary/5' : 'border-2 border-dashed border-muted-foreground/30'}
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
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-lg leading-tight">{visa.name}</h3>
                {isGoal && (
                  <Target className="h-5 w-5 text-primary flex-shrink-0" />
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                <Badge 
                  variant={getVisaTypeBadge() === "Permanent" ? "default" : "secondary"} 
                  className="text-xs"
                >
                  {getVisaTypeBadge()}
                </Badge>
                <Badge variant="outline" className={`text-xs ${getScoreColor(successScore)}`}>
                  <Percent className="h-3 w-3 mr-1" />
                  {successScore}% Success
                </Badge>
              </div>
            </div>
          </div>
          
          {(visa.short_description || visa.shortDescription) && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {visa.short_description || visa.shortDescription}
            </p>
          )}

          {visa.eligibility_criteria && visa.eligibility_criteria.length > 0 && (
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full justify-between p-2 h-auto text-sm"
                >
                  <span>View Eligibility</span>
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2">
                <div className="border-t border-border/50 pt-4">
                  <h4 className="text-sm font-medium mb-3">Eligibility Requirements</h4>
                  <ul className="space-y-2">
                    {visa.eligibility_criteria.map((criteria, idx) => {
                      const isMet = assessEligibility(criteria);
                      return (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          {isMet ? (
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                          )}
                          <span className={isMet ? "text-foreground" : "text-muted-foreground"}>
                            {criteria}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </CollapsibleContent>
            </Collapsible>
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