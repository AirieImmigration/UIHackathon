import type { Persona } from "@/config/personas";
import { assessEligibility, type EligibilityAssessment } from "@/components/scoring/AIEligibilityAssessor";

// Map step names to known eligibility criteria
const STEP_ELIGIBILITY_MAPPING: Record<string, string[]> = {
  "Accredited Employer Work Visa": [
    "Has a job offer from an accredited employer",
    "Meets minimum skill level requirements", 
    "Has relevant qualifications and experience",
    "Meets English language requirements",
    "Meets health and character requirements",
    "Is under 65 years old"
  ],
  "Work to Residence Visa": [
    "Has worked on AEWV for 24+ months",
    "Has worked in a skilled occupation", 
    "Job is with an accredited employer",
    "Meets salary threshold requirements",
    "Has advanced English proficiency",
    "Holds relevant professional registration if required"
  ],
  "Skilled Migrant Category Resident Visa": [
    "Is under 55 years old",
    "Has advanced English proficiency", 
    "Has 4+ years relevant work experience",
    "Meets minimum salary threshold",
    "Has bachelor's degree or higher qualification",
    "Meets health and character requirements"
  ],
  "New Zealand Citizenship": [
    "Has been resident for 5+ years",
    "Has been physically present in NZ for specified periods",
    "Has no serious criminal convictions",
    "Demonstrates knowledge of English and NZ",
    "Intends to continue living in New Zealand"
  ],
  "Student Visa": [
    "Has offer of place from approved education provider",
    "Meets English language requirements for study",
    "Has sufficient funds for tuition and living costs",
    "Has genuine intention to study",
    "Meets health and character requirements"
  ],
  "Partner of a New Zealander Visitor Visa": [
    "Is in genuine and stable relationship",
    "Partner is NZ citizen or resident",
    "Meets health and character requirements",
    "Has sufficient funds for stay",
    "Has genuine intention to visit"
  ]
};

export interface CriteriaAnalysis {
  stepName: string;
  unmetCriteria: string[];
  assessments: EligibilityAssessment[];
  score: number;
}

export function analyzeCriteriaForPathway(
  persona: Persona,
  pathwaySteps: Array<{ visaSlug: string }>
): CriteriaAnalysis[] {
  return pathwaySteps.map(step => {
    const criteria = STEP_ELIGIBILITY_MAPPING[step.visaSlug] || [];
    const assessments = assessEligibility(persona, criteria);
    
    // Calculate simple score (percentage of criteria met)
    const metCount = assessments.filter(a => a.met === 'yes').length;
    const score = criteria.length > 0 ? Math.round((metCount / criteria.length) * 100) : 0;
    
    // Identify unmet criteria
    const unmetCriteria = assessments
      .filter(a => a.met === 'no')
      .map(a => a.criterion);
    
    return {
      stepName: step.visaSlug,
      unmetCriteria,
      assessments,
      score
    };
  });
}

export function getAllUnmetCriteria(analyses: CriteriaAnalysis[]): string[] {
  const allUnmet = new Set<string>();
  
  analyses.forEach(analysis => {
    analysis.unmetCriteria.forEach(criterion => {
      allUnmet.add(criterion);
    });
  });
  
  return Array.from(allUnmet);
}