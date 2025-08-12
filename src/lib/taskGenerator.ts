import type { Persona } from "@/config/personas";
import type { EligibilityAssessment } from "@/components/scoring/AIEligibilityAssessor";
import { tasks, type Task } from "@/config/tasks";
import { requirements } from "@/config/requirements";

export interface GeneratedTask extends Task {
  relevantToVisas: string[];
  priority: number; // 1-5, 5 being highest
}

export function generateTasksFromAssessments(
  visaAssessments: Array<{ visaSlug: string; assessments: EligibilityAssessment[] }>,
  persona: Persona
): GeneratedTask[] {
  const unmetRequirements = new Map<string, string[]>(); // task mapping to visa slugs
  
  // Analyze unmet requirements across all visas
  visaAssessments.forEach(({ visaSlug, assessments }) => {
    assessments.forEach((assessment) => {
      if (assessment.met === 'no' || assessment.met === 'unknown') {
        const mappedTasks = mapRequirementToTasks(assessment, persona);
        mappedTasks.forEach((taskId) => {
          if (!unmetRequirements.has(taskId)) {
            unmetRequirements.set(taskId, []);
          }
          unmetRequirements.get(taskId)!.push(visaSlug);
        });
      }
    });
  });

  // Generate tasks with priorities and deduplication
  const generatedTasks: GeneratedTask[] = [];
  const seenTasks = new Set<string>();

  unmetRequirements.forEach((visaSlugs, taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && !seenTasks.has(taskId)) {
      seenTasks.add(taskId);
      
      const priority = calculateTaskPriority(task, visaSlugs, persona);
      
      generatedTasks.push({
        ...task,
        relevantToVisas: visaSlugs,
        priority
      });
    }
  });

  // Sort by priority (high to low) and then by difficulty/time
  return generatedTasks.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    
    // Long-term tasks first for same priority
    const timeWeight = { 'hard': 3, 'medium': 2, 'easy': 1 };
    return timeWeight[b.difficulty] - timeWeight[a.difficulty];
  });
}

function mapRequirementToTasks(assessment: EligibilityAssessment, persona: Persona): string[] {
  const criterion = assessment.criterion.toLowerCase();
  const mappedTasks: string[] = [];

  // English requirements
  if (criterion.includes('english') && assessment.met !== 'yes') {
    if (persona.englishLevel === 'basic' || persona.englishLevel === 'intermediate') {
      mappedTasks.push('improve-english-advanced');
    }
    if (persona.englishLevel !== 'fluent') {
      mappedTasks.push('improve-english-fluent');
    }
  }

  // Age requirements (can't be improved, skip)
  if (criterion.includes('age')) {
    // Age cannot be changed
    return mappedTasks;
  }

  // Experience requirements
  if (criterion.includes('experience') || criterion.includes('years')) {
    if (criterion.includes('4+') || criterion.includes('4 years')) {
      const needed = 4 - persona.yearsExperience;
      if (needed <= 1) mappedTasks.push('gain-experience-1yr');
      if (needed > 1) mappedTasks.push('gain-experience-2yr');
    } else if (criterion.includes('2+') || criterion.includes('2 years')) {
      const needed = 2 - persona.yearsExperience;
      if (needed > 0) mappedTasks.push('gain-experience-1yr');
    } else {
      mappedTasks.push('gain-experience-1yr');
    }
  }

  // Salary requirements
  if (criterion.includes('salary') || criterion.includes('wage') || criterion.includes('threshold')) {
    const currentSalary = persona.yearlySalaryNZD || 0;
    // Try smaller increase first
    if (currentSalary > 0) {
      mappedTasks.push('negotiate-salary-10');
      // For higher thresholds, suggest bigger increase
      if (currentSalary < 60000) {
        mappedTasks.push('negotiate-salary-25');
      }
    }
  }

  // Education requirements
  if (criterion.includes('bachelor') || criterion.includes('qualification') || criterion.includes('degree')) {
    if (persona.educationLevel === 'high_school') {
      mappedTasks.push('complete-bachelor');
    }
    // Always suggest master's for additional points
    if (persona.educationLevel === 'bachelor') {
      mappedTasks.push('complete-master');
    }
  }

  // Registration requirements
  if (criterion.includes('registration') || criterion.includes('professional')) {
    mappedTasks.push('nz-registration');
  }

  // Job offer requirements
  if (criterion.includes('job offer') || criterion.includes('employment') || criterion.includes('accredited employer')) {
    if (!persona.currentJobTitle || persona.currentJobTitle === 'Unemployed') {
      mappedTasks.push('secure-job-offer');
    }
  }

  // Funds requirements (not actionable in this system)
  if (criterion.includes('funds') || criterion.includes('money')) {
    // Skip - financial requirements are external
  }

  return mappedTasks;
}

function calculateTaskPriority(task: Task, visaSlugs: string[], persona: Persona): number {
  let priority = 1;

  // Higher priority for tasks that affect multiple visas
  priority += Math.min(visaSlugs.length - 1, 3);

  // Higher priority for tasks that fix hard blockers
  if (task.category === 'English' && persona.englishLevel === 'basic') {
    priority += 2;
  }

  // Higher priority for shorter tasks that can be completed quickly
  if (task.difficulty === 'easy') priority += 1;
  if (task.estimatedTime.includes('month') && !task.estimatedTime.includes('12')) {
    priority += 1;
  }

  // Higher priority for foundational requirements
  if (task.category === 'Education' && persona.educationLevel === 'high_school') {
    priority += 2;
  }

  return Math.min(priority, 5);
}

export function groupTasksByCategory(tasks: GeneratedTask[]): Record<string, GeneratedTask[]> {
  const grouped: Record<string, GeneratedTask[]> = {};
  
  tasks.forEach(task => {
    if (!grouped[task.category]) {
      grouped[task.category] = [];
    }
    grouped[task.category].push(task);
  });

  return grouped;
}