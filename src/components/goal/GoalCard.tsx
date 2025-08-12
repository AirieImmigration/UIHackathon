import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GoalCardProps {
  goalData: {
    temporaryOrPermanent?: 'temporary' | 'permanent';
    mainPurpose?: string;
    specificVisa?: string | null;
    aiMatchedVisa?: string | null;
  };
  title: string;
  className?: string;
}

export function GoalCard({ goalData, title, className }: GoalCardProps) {
  return (
    <Card className={`rounded-2xl shadow-[var(--shadow-soft)] ${className || ""}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xl">
            🚀
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <p className="text-sm text-muted-foreground">Your immigration goal</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {goalData.temporaryOrPermanent && (
            <Badge variant="secondary">
              {goalData.temporaryOrPermanent === 'temporary' ? 'Temporary' : 'Permanent'} Stay
            </Badge>
          )}
          {goalData.mainPurpose && (
            <Badge variant="secondary">{goalData.mainPurpose}</Badge>
          )}
        </div>
        
        {goalData.specificVisa && (
          <div>
            <p className="text-sm font-medium">Target Visa</p>
            <p className="text-sm text-muted-foreground">{goalData.specificVisa}</p>
          </div>
        )}
        
        {goalData.aiMatchedVisa && (
          <div>
            <p className="text-sm font-medium">Suggested Visa</p>
            <p className="text-sm text-muted-foreground">{goalData.aiMatchedVisa}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}