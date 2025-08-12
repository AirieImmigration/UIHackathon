import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";

interface PathwayStepData {
  visa_name: string;
  step_name: string;
  step_order: number;
  duration?: string;
  timeframe_until_next?: string;
  eligibility?: string;
}

interface SimplePathwayCardProps {
  step: PathwayStepData;
  isCurrent: boolean;
  isGoal: boolean;
  index: number;
}

export function SimplePathwayCard({ step, isCurrent, isGoal, index }: SimplePathwayCardProps) {
  const getStepType = () => {
    if (isCurrent) return "Current";
    if (isGoal) return "Goal";
    if (step.duration === "Permanent" || step.duration === "Lifetime") return "Permanent";
    return "Temporary";
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Current": return "bg-primary/10 text-primary border-primary/20";
      case "Goal": return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
      case "Permanent": return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
      default: return "bg-amber-500/10 text-amber-700 border-amber-500/20";
    }
  };

  const stepType = getStepType();

  return (
    <Card className={`w-full max-w-2xl mx-auto transition-all duration-300 ${
      isCurrent ? 'ring-2 ring-primary/20 shadow-lg' : 
      isGoal ? 'ring-2 ring-emerald-500/20 shadow-lg' : 
      'shadow-sm hover:shadow-md'
    }`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header with step number and type */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                isCurrent ? 'bg-primary text-primary-foreground' :
                isGoal ? 'bg-emerald-500 text-white' :
                'bg-muted text-muted-foreground'
              }`}>
                {step.step_order}
              </div>
              <Badge variant="outline" className={getTypeColor(stepType)}>
                {stepType}
              </Badge>
            </div>
          </div>

          {/* Visa name */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {step.step_name}
            </h3>
          </div>

          {/* Duration and timeframe info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Duration</p>
                <p className="text-sm text-muted-foreground">{step.duration || 'Not specified'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Next Step</p>
                <p className="text-sm text-muted-foreground">{step.timeframe_until_next || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Basic eligibility */}
          <div>
            <p className="text-sm font-medium mb-2">Key Requirements</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {step.eligibility || 'Requirements not specified'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}