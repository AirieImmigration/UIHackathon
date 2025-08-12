import type { Persona } from "@/config/personas";
import type { PrioritizedTask } from "./taskPrioritizer";
import { tasks } from "@/config/tasks";
import { analyzeCriteriaForPathway, type CriteriaAnalysis } from "./criteriaAnalyzer";

export interface LocalVisaScore {
  stepName: string;
  score: number;
  previousScore?: number;
  improved: boolean;
}

export function calculateLocalScores(
  persona: Persona,
  pathwaySteps: Array<{ visaSlug: string }>,
  completedTaskIds: string[] = []
): LocalVisaScore[] {
  // Apply completed tasks to create modified persona
  let modifiedPersona = { ...persona };
  
  completedTaskIds.forEach(taskId => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      modifiedPersona = task.apply(modifiedPersona);
    }
  });

  // Analyze criteria with modified persona
  const analyses = analyzeCriteriaForPathway(modifiedPersona, pathwaySteps);
  
  return analyses.map(analysis => ({
    stepName: analysis.stepName,
    score: analysis.score,
    improved: false // Will be set when comparing with previous scores
  }));
}

export function compareScores(
  currentScores: LocalVisaScore[],
  previousScores: LocalVisaScore[]
): LocalVisaScore[] {
  return currentScores.map(current => {
    const previous = previousScores.find(p => p.stepName === current.stepName);
    const previousScore = previous?.score || 0;
    
    return {
      ...current,
      previousScore,
      improved: current.score > previousScore
    };
  });
}

export function getScoreChangeForTask(
  persona: Persona,
  pathwaySteps: Array<{ visaSlug: string }>,
  taskId: string,
  currentCompletedTasks: string[] = []
): { before: LocalVisaScore[], after: LocalVisaScore[] } {
  // Calculate scores before task completion
  const before = calculateLocalScores(persona, pathwaySteps, currentCompletedTasks);
  
  // Calculate scores after task completion
  const after = calculateLocalScores(persona, pathwaySteps, [...currentCompletedTasks, taskId]);
  
  return { before, after };
}