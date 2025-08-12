import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MiniVisaCardProps {
  visa: {
    slug: string;
    name: string;
    type: string;
  };
  score: number;
  isPulsing?: boolean;
  index: number;
}

export function MiniVisaCard({ visa, score, isPulsing = false, index }: MiniVisaCardProps) {
  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-600"; 
    return "text-red-600";
  };

  const getScoreBg = (score: number): string => {
    if (score >= 80) return "bg-emerald-50 border-emerald-200";
    if (score >= 60) return "bg-amber-50 border-amber-200";
    return "bg-red-50 border-red-200";
  };

  const getVisaTypeBadge = (type: string): string => {
    switch (type?.toLowerCase()) {
      case 'temporary': return "bg-blue-100 text-blue-800 border-blue-200";
      case 'residence': return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case 'work': return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card 
      className={cn(
        "min-w-[280px] transition-all duration-300 shadow-[var(--shadow-soft)]",
        isPulsing && "animate-pulse scale-105 shadow-[var(--shadow-glow)]",
        "animate-fade-in"
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="space-y-1">
            <h3 className="font-medium text-sm leading-tight">{visa.name}</h3>
            <Badge variant="outline" className={cn("text-xs", getVisaTypeBadge(visa.type))}>
              {visa.type}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Success Score</span>
            <div className={cn(
              "px-2 py-1 rounded-md text-sm font-medium border",
              getScoreBg(score)
            )}>
              <span className={getScoreColor(score)}>{score}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}