import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle } from "lucide-react";
import type { VisaScore } from "@/lib/scoring";
import type { Visa } from "@/lib/queries/pathway";

interface ScoredVisaCardProps {
  visa: Visa;
  score: VisaScore;
  index: number;
}

export function ScoredVisaCard({ visa, score, index }: ScoredVisaCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-50 border-green-200";
    if (score >= 60) return "bg-yellow-50 border-yellow-200";
    if (score >= 40) return "bg-orange-50 border-orange-200";
    return "bg-red-50 border-red-200";
  };

  return (
    <Card 
      className="rounded-2xl shadow-[var(--shadow-soft)] animate-fade-in"
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'both'
      }}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <CardTitle className="text-xl">{visa.name}</CardTitle>
              {visa.stage && (
                <Badge variant="secondary">
                  {formatStage(visa.stage)}
                </Badge>
              )}
            </div>
            {visa.shortDescription && (
              <p className="text-sm text-muted-foreground">
                {visa.shortDescription}
              </p>
            )}
          </div>
          
          <div className={`rounded-2xl p-4 border-2 ${getScoreBg(score.score)}`}>
            <div className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(score.score)}`}>
                {score.score}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Success likelihood
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {score.hasHardBlocker && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <p className="text-sm text-destructive font-medium">
              Hard requirement not met - visa not available
            </p>
          </div>
        )}
        
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Requirements</h4>
          <div className="space-y-2">
            {score.requirements.map((result, reqIndex) => (
              <div key={reqIndex} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                <div className="flex-shrink-0 mt-0.5">
                  {result.met ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{result.requirement.label}</p>
                    <Badge 
                      variant={result.met ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {Math.round(result.requirement.weight * 100)}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {result.reason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-2">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Overall Score</span>
            <span className={`font-medium ${getScoreColor(score.score)}`}>
              {score.score}%
            </span>
          </div>
          <Progress value={score.score} className="h-2" />
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