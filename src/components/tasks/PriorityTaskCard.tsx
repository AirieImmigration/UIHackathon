import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PrioritizedTask } from "@/lib/taskPrioritizer";
import { PriorityBadge } from "./PriorityBadge";

interface PriorityTaskCardProps {
  task: PrioritizedTask;
  isCompleted: boolean;
  onToggle: (taskId: string) => void;
  index: number;
  scoreImpact?: number;
}

export function PriorityTaskCard({ 
  task, 
  isCompleted, 
  onToggle, 
  index,
  scoreImpact = 0 
}: PriorityTaskCardProps) {
  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'easy': return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case 'medium': return "bg-amber-100 text-amber-800 border-amber-200";
      case 'hard': return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityBorderColor = () => {
    if (task.importance === 'critical') return "border-l-red-500";
    if (task.importance === 'important') return "border-l-orange-500";
    return "border-l-green-500";
  };

  return (
    <Card 
      className={cn(
        "transition-all duration-300 hover:shadow-[var(--shadow-soft)] animate-fade-in border-l-4",
        getPriorityBorderColor(),
        isCompleted && "bg-muted/30 border-muted"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <Checkbox 
            checked={isCompleted}
            onCheckedChange={() => onToggle(task.id)}
            className="mt-1 flex-shrink-0"
            aria-label={`Mark "${task.label}" as ${isCompleted ? 'incomplete' : 'complete'}`}
          />
          
          <div className="flex-1 space-y-3">
            {/* Priority indicators */}
            <div className="flex items-start justify-between gap-2">
              <h3 className={cn(
                "font-medium leading-tight flex-1",
                isCompleted && "line-through text-muted-foreground"
              )}>
                {task.label}
              </h3>
              
              <div className="flex items-center gap-1 text-xs">
                <span className="font-semibold text-primary">#{task.priorityScore}</span>
                {scoreImpact > 0 && (
                  <div className="flex items-center gap-1 text-green-600">
                    <ArrowUp className="h-3 w-3" />
                    <span>+{scoreImpact}</span>
                  </div>
                )}
              </div>
            </div>
            
            {task.description && (
              <p className={cn(
                "text-sm text-muted-foreground leading-relaxed",
                isCompleted && "line-through"
              )}>
                {task.description}
              </p>
            )}

            {/* Impact description */}
            <p className="text-xs text-primary/80 italic">
              {task.impactDescription}
            </p>
            
            {/* Tags and metadata */}
            <div className="space-y-2">
              <PriorityBadge 
                urgency={task.urgency}
                importance={task.importance}
              />
              
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {task.category}
                </Badge>
                
                <Badge variant="outline" className={getDifficultyColor(task.difficulty)}>
                  {task.difficulty}
                </Badge>
                
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{task.estimatedTime}</span>
                </div>
              </div>
            </div>
            
            {/* Applicable visa steps */}
            {task.applicableSteps && task.applicableSteps.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground">Applies to:</span>
                {task.applicableSteps.slice(0, 2).map((stepName) => (
                  <Badge key={stepName} variant="secondary" className="text-xs">
                    {stepName.replace('Visa', '').trim()}
                  </Badge>
                ))}
                {task.applicableSteps.length > 2 && (
                  <span className="text-xs text-muted-foreground">
                    +{task.applicableSteps.length - 2} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}