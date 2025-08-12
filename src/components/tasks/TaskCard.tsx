import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Clock, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GeneratedTask } from "@/lib/taskGenerator";

interface TaskCardProps {
  task: GeneratedTask;
  isCompleted: boolean;
  onToggle: (taskId: string) => void;
  index: number;
}

export function TaskCard({ task, isCompleted, onToggle, index }: TaskCardProps) {
  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'easy': return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case 'medium': return "bg-amber-100 text-amber-800 border-amber-200";
      case 'hard': return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'English': return "bg-blue-100 text-blue-800 border-blue-200";
      case 'Employment': return "bg-purple-100 text-purple-800 border-purple-200";
      case 'Experience': return "bg-orange-100 text-orange-800 border-orange-200";
      case 'Education': return "bg-teal-100 text-teal-800 border-teal-200";
      case 'Registration': return "bg-pink-100 text-pink-800 border-pink-200";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card 
      className={cn(
        "transition-all duration-300 hover:shadow-[var(--shadow-soft)] animate-fade-in",
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
            <div className="space-y-2">
              <h3 className={cn(
                "font-medium leading-tight",
                isCompleted && "line-through text-muted-foreground"
              )}>
                {task.label}
              </h3>
              
              {task.description && (
                <p className={cn(
                  "text-sm text-muted-foreground leading-relaxed",
                  isCompleted && "line-through"
                )}>
                  {task.description}
                </p>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className={getCategoryColor(task.category)}>
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
            
            {task.relevantToVisas && task.relevantToVisas.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Target className="h-3 w-3" />
                  <span>Applies to:</span>
                </div>
                {task.relevantToVisas.slice(0, 2).map((visaSlug) => (
                  <Badge key={visaSlug} variant="secondary" className="text-xs">
                    {visaSlug.replace('-', ' ')}
                  </Badge>
                ))}
                {task.relevantToVisas.length > 2 && (
                  <span className="text-xs text-muted-foreground">
                    +{task.relevantToVisas.length - 2} more
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