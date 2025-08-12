import type { Persona } from "@/config/personas";
import { tasks } from "@/config/tasks";
import { assessEligibility, calculateSuccessScore, type EligibilityAssessment } from "@/components/scoring/AIEligibilityAssessor";
import { planStore } from "./planStore";

export interface VisaScore {
  visaSlug: string;
  score: number;
  assessments: EligibilityAssessment[];
}

export function calculateUpdatedScores(
  originalPersona: Persona,
  completedTaskIds: string[],
  visaData: Array<{ slug: string; eligibility_criteria: string[] }>
): VisaScore[] {
  // Apply all completed tasks to get modified persona
  let modifiedPersona = { ...originalPersona };
  
  completedTaskIds.forEach(taskId => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      modifiedPersona = task.apply(modifiedPersona);
    }
  });

  // Store the modified persona for persistence
  planStore.setModifiedPersona(modifiedPersona);

  // Calculate scores for each visa with the modified persona
  return visaData.map(visa => {
    const assessments = assessEligibility(modifiedPersona, visa.eligibility_criteria || []);
    const score = calculateSuccessScore(assessments);
    
    return {
      visaSlug: visa.slug,
      score,
      assessments
    };
  });
}

export function getPersonaForScoring(): Persona {
  // Get the modified persona if it exists, otherwise use the original
  const modifiedPersona = planStore.getModifiedPersona();
  const originalPersona = planStore.getPersona();
  
  return modifiedPersona || originalPersona!;
}

export function resetPersonaModifications() {
  const state = planStore.getState();
  if (state.modifiedPersona) {
    const next = { ...state };
    delete next.modifiedPersona;
    planStore.setModifiedPersona(state.persona!);
  }
}