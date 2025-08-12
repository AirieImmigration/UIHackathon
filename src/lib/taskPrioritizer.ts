import type { Persona } from "@/config/personas";
import { tasks, type Task } from "@/config/tasks";

export type TaskUrgency = 'high' | 'medium' | 'low';
export type TaskImportance = 'critical' | 'important' | 'beneficial';

export interface PrioritizedTask extends Task {
  urgency: TaskUrgency;
  importance: TaskImportance;
  priorityScore: number;
  applicableSteps: string[];
  impactDescription: string;
}

// Map criteria to task IDs with context
const CRITERIA_TO_TASKS: Record<string, { taskIds: string[], importance: TaskImportance, urgency: TaskUrgency }> = {
  "Has advanced English proficiency": {
    taskIds: ["improve-english-advanced"],
    importance: "critical",
    urgency: "high"
  },
  "Meets English language requirements": {
    taskIds: ["improve-english-intermediate", "improve-english-advanced"],
    importance: "critical", 
    urgency: "high"
  },
  "Is under 55 years old": {
    taskIds: [],
    importance: "critical",
    urgency: "high"
  },
  "Is under 65 years old": {
    taskIds: [],
    importance: "critical",
    urgency: "high"
  },
  "Has 4+ years relevant work experience": {
    taskIds: ["gain-experience"],
    importance: "important",
    urgency: "medium"
  },
  "Meets minimum salary threshold": {
    taskIds: ["negotiate-salary", "get-job-offer"],
    importance: "important",
    urgency: "medium"
  },
  "Meets salary threshold requirements": {
    taskIds: ["negotiate-salary", "get-job-offer"],
    importance: "important", 
    urgency: "medium"
  },
  "Has bachelor's degree or higher qualification": {
    taskIds: ["complete-degree"],
    importance: "important",
    urgency: "low"
  },
  "Holds relevant professional registration if required": {
    taskIds: ["get-nz-registration"],
    importance: "critical",
    urgency: "medium"
  },
  "Has a job offer from an accredited employer": {
    taskIds: ["get-job-offer"],
    importance: "critical",
    urgency: "medium"
  },
  "Has worked on AEWV for 24+ months": {
    taskIds: ["gain-experience"],
    importance: "critical",
    urgency: "low"
  },
  "Has sufficient funds for tuition and living costs": {
    taskIds: [],
    importance: "critical",
    urgency: "medium"
  },
  "Has been resident for 5+ years": {
    taskIds: [],
    importance: "critical",
    urgency: "low"
  }
};

export function prioritizeTasksFromCriteria(
  unmetCriteria: string[],
  persona: Persona,
  pathwaySteps: Array<{ visaSlug: string }>
): PrioritizedTask[] {
  const taskMap = new Map<string, PrioritizedTask>();

  // Process each unmet criterion
  unmetCriteria.forEach(criterion => {
    const mapping = CRITERIA_TO_TASKS[criterion];
    if (!mapping || mapping.taskIds.length === 0) return;

    mapping.taskIds.forEach(taskId => {
      const baseTask = tasks.find(t => t.id === taskId);
      if (!baseTask) return;

      // Find which steps this criterion applies to
      const applicableSteps = pathwaySteps
        .filter(step => {
          // This is a simplified check - in a real system you'd have more sophisticated mapping
          return criterion.toLowerCase().includes('english') || 
                 criterion.toLowerCase().includes('experience') ||
                 criterion.toLowerCase().includes('salary') ||
                 criterion.toLowerCase().includes('registration') ||
                 criterion.toLowerCase().includes('job offer') ||
                 criterion.toLowerCase().includes('degree');
        })
        .map(step => step.visaSlug);

      if (taskMap.has(taskId)) {
        // Task already exists, merge applicable steps
        const existing = taskMap.get(taskId)!;
        existing.applicableSteps = [...new Set([...existing.applicableSteps, ...applicableSteps])];
      } else {
        // Create new prioritized task
        const priorityScore = calculatePriorityScore(mapping.importance, mapping.urgency, applicableSteps.length);
        
        const prioritizedTask: PrioritizedTask = {
          ...baseTask,
          urgency: mapping.urgency,
          importance: mapping.importance,
          priorityScore,
          applicableSteps,
          impactDescription: generateImpactDescription(baseTask, applicableSteps, mapping.importance)
        };

        taskMap.set(taskId, prioritizedTask);
      }
    });
  });

  // Convert to array and sort by priority score (highest first)
  return Array.from(taskMap.values()).sort((a, b) => b.priorityScore - a.priorityScore);
}

function calculatePriorityScore(
  importance: TaskImportance, 
  urgency: TaskUrgency, 
  stepCount: number
): number {
  let score = 0;
  
  // Importance weight (40% of total score)
  switch (importance) {
    case 'critical': score += 40; break;
    case 'important': score += 25; break;
    case 'beneficial': score += 10; break;
  }
  
  // Urgency weight (35% of total score)
  switch (urgency) {
    case 'high': score += 35; break;
    case 'medium': score += 20; break;
    case 'low': score += 5; break;
  }
  
  // Multi-step impact (25% of total score)
  score += Math.min(stepCount * 8, 25);
  
  return score;
}

function generateImpactDescription(
  task: Task, 
  applicableSteps: string[], 
  importance: TaskImportance
): string {
  const stepCount = applicableSteps.length;
  const impactLevel = importance === 'critical' ? 'significantly' : 
                     importance === 'important' ? 'noticeably' : 'potentially';
  
  if (stepCount === 0) {
    return `Will ${impactLevel} improve your overall profile`;
  } else if (stepCount === 1) {
    return `Will ${impactLevel} improve your chances for ${applicableSteps[0]}`;
  } else {
    return `Will ${impactLevel} improve your chances across ${stepCount} visa steps`;
  }
}

export function groupTasksByCategory(tasks: PrioritizedTask[]): Record<string, PrioritizedTask[]> {
  return tasks.reduce((groups, task) => {
    const category = task.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(task);
    return groups;
  }, {} as Record<string, PrioritizedTask[]>);
}