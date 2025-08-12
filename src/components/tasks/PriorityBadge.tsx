import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TaskUrgency, TaskImportance } from "@/lib/taskPrioritizer";

interface PriorityBadgeProps {
  urgency: TaskUrgency;
  importance: TaskImportance;
  className?: string;
}

export function PriorityBadge({ urgency, importance, className }: PriorityBadgeProps) {
  const getUrgencyIcon = () => {
    switch (urgency) {
      case 'high': return <AlertTriangle className="h-3 w-3" />;
      case 'medium': return <Clock className="h-3 w-3" />;
      case 'low': return <Target className="h-3 w-3" />;
    }
  };

  const getUrgencyColor = () => {
    switch (urgency) {
      case 'high': return "bg-red-100 text-red-800 border-red-200";
      case 'medium': return "bg-amber-100 text-amber-800 border-amber-200";
      case 'low': return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getImportanceColor = () => {
    switch (importance) {
      case 'critical': return "bg-red-50 text-red-900 border-red-300";
      case 'important': return "bg-orange-50 text-orange-900 border-orange-300";
      case 'beneficial': return "bg-green-50 text-green-900 border-green-300";
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Badge variant="outline" className={cn("text-xs flex items-center gap-1", getUrgencyColor())}>
        {getUrgencyIcon()}
        {urgency}
      </Badge>
      
      <Badge variant="outline" className={cn("text-xs", getImportanceColor())}>
        {importance}
      </Badge>
    </div>
  );
}