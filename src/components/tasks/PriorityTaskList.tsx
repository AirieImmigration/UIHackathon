import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PrioritizedTask } from "@/lib/taskPrioritizer";
import { PriorityTaskCard } from "./PriorityTaskCard";

interface PriorityTaskListProps {
  tasks: PrioritizedTask[];
  groupedTasks: Record<string, PrioritizedTask[]>;
  completedTasks: string[];
  onTaskToggle: (taskId: string) => void;
}

const categoryOrder = [
  "English",
  "Employment", 
  "Experience",
  "Education",
  "Registration"
];

export function PriorityTaskList({ 
  tasks, 
  groupedTasks, 
  completedTasks, 
  onTaskToggle 
}: PriorityTaskListProps) {
  const [openCategories, setOpenCategories] = useState<Set<string>>(
    new Set(Object.keys(groupedTasks)) // Start with all categories open
  );

  const toggleCategory = (category: string) => {
    const newOpen = new Set(openCategories);
    if (newOpen.has(category)) {
      newOpen.delete(category);
    } else {
      newOpen.add(category);
    }
    setOpenCategories(newOpen);
  };

  if (tasks.length === 0) {
    return (
      <Card className="rounded-2xl shadow-[var(--shadow-soft)]">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-semibold mb-2">Excellent work! 🎉</h3>
          <p className="text-muted-foreground">
            You're already meeting all the requirements for your immigration pathway. 
            Your scores look great!
          </p>
        </CardContent>
      </Card>
    );
  }

  // Sort categories by the predefined order
  const sortedCategories = Object.keys(groupedTasks).sort((a, b) => {
    const aIndex = categoryOrder.indexOf(a);
    const bIndex = categoryOrder.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  return (
    <div className="space-y-6">
      {sortedCategories.map((category) => {
        const categoryTasks = groupedTasks[category];
        const completedCount = categoryTasks.filter(task => 
          completedTasks.includes(task.id)
        ).length;
        const totalCount = categoryTasks.length;
        const isOpen = openCategories.has(category);

        // Get highest priority task in category for display
        const highestPriorityTask = categoryTasks[0]; // Already sorted by priority
        const avgPriorityScore = Math.round(
          categoryTasks.reduce((sum, task) => sum + task.priorityScore, 0) / categoryTasks.length
        );

        return (
          <Card key={category} className="rounded-2xl shadow-[var(--shadow-soft)]">
            <Collapsible
              open={isOpen}
              onOpenChange={() => toggleCategory(category)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {isOpen ? (
                          <ChevronDown className="h-5 w-5" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                        <span className="text-lg">{category}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          highestPriorityTask?.importance === 'critical' && "bg-red-100 text-red-800",
                          highestPriorityTask?.importance === 'important' && "bg-orange-100 text-orange-800", 
                          highestPriorityTask?.importance === 'beneficial' && "bg-green-100 text-green-800"
                        )}>
                          Avg Priority: {avgPriorityScore}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{completedCount}/{totalCount} completed</span>
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-300"
                          style={{ 
                            width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` 
                          }}
                        />
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <CardContent className="pt-0 space-y-4">
                  {categoryTasks.map((task, index) => (
                    <PriorityTaskCard
                      key={task.id}
                      task={task}
                      isCompleted={completedTasks.includes(task.id)}
                      onToggle={onTaskToggle}
                      index={index}
                    />
                  ))}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        );
      })}
    </div>
  );
}