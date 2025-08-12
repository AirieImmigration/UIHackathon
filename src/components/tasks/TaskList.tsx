import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { TaskCard } from "./TaskCard";
import { cn } from "@/lib/utils";
import type { GeneratedTask } from "@/lib/taskGenerator";

interface TaskListProps {
  tasks: GeneratedTask[];
  groupedTasks: Record<string, GeneratedTask[]>;
  completedTasks: string[];
  onTaskToggle: (taskId: string) => void;
}

export function TaskList({ tasks, groupedTasks, completedTasks, onTaskToggle }: TaskListProps) {
  const [openCategories, setOpenCategories] = useState<Set<string>>(
    new Set(Object.keys(groupedTasks))
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
      <Card className="shadow-[var(--shadow-soft)]">
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-medium mb-2">All Requirements Met!</h3>
          <p className="text-muted-foreground">
            Your current profile meets all the requirements for your selected pathway.
          </p>
        </CardContent>
      </Card>
    );
  }

  const categoryOrder = ['English', 'Education', 'Experience', 'Employment', 'Registration'];
  const sortedCategories = Object.keys(groupedTasks).sort((a, b) => {
    const aIndex = categoryOrder.indexOf(a);
    const bIndex = categoryOrder.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-1">Action Plan</h2>
        <p className="text-sm text-muted-foreground">
          Complete these tasks to improve your visa success scores
        </p>
      </div>

      {sortedCategories.map((category, categoryIndex) => {
        const categoryTasks = groupedTasks[category];
        const completedCount = categoryTasks.filter(task => 
          completedTasks.includes(task.id)
        ).length;
        const isOpen = openCategories.has(category);

        return (
          <Card key={category} className="shadow-[var(--shadow-soft)]">
            <Collapsible open={isOpen} onOpenChange={() => toggleCategory(category)}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-base">{category}</span>
                      <span className="text-sm text-muted-foreground">
                        ({completedCount}/{categoryTasks.length} completed)
                      </span>
                    </div>
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <CardContent className="pt-0 space-y-3">
                  {categoryTasks.map((task, taskIndex) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      isCompleted={completedTasks.includes(task.id)}
                      onToggle={onTaskToggle}
                      index={categoryIndex * 10 + taskIndex}
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