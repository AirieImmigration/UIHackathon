import type { Persona } from "@/config/personas";
import type { Requirement } from "@/config/requirements";
import { roundToNearest5 } from "./utils";

export interface RequirementResult {
  requirement: Requirement;
  met: boolean;
  reason: string;
}

export interface VisaScore {
  visaSlug: string;
  score: number;
  requirements: RequirementResult[];
  hasHardBlocker: boolean;
}

export function evaluateRequirement(
  requirement: Requirement,
  persona: Persona
): RequirementResult {
  const { key, label, threshold, hardBlocker } = requirement;
  
  // Handle nested attributes
  const value = getPersonaValue(persona, key);
  
  let met = false;
  let reason = "";
  
  switch (key) {
    case "age":
      if (typeof value === "number" && threshold) {
        met = value < threshold;
        reason = met ? `Age ${value} under ${threshold}` : `Age ${value} ≥ ${threshold}`;
      } else {
        reason = "Age not provided";
      }
      break;
      
    case "englishLevel":
      const englishLevels = ["basic", "intermediate", "advanced", "fluent"];
      const personaLevel = englishLevels.indexOf(persona.englishLevel);
      
      if (label.includes("Advanced/Fluent")) {
        met = personaLevel >= 2; // advanced or fluent
        reason = met ? `English: ${persona.englishLevel}` : `English: ${persona.englishLevel} (need advanced+)`;
      } else if (label.includes("Intermediate+")) {
        met = personaLevel >= 1; // intermediate or better
        reason = met ? `English: ${persona.englishLevel}` : `English: ${persona.englishLevel} (need intermediate+)`;
      }
      break;
      
    case "yearsExperience":
      if (typeof value === "number" && threshold) {
        met = value >= threshold;
        reason = met ? `${value} years experience` : `${value} years < ${threshold} required`;
      } else {
        reason = "Experience not provided";
      }
      break;
      
    case "yearlySalaryNZD":
      const salary = persona.yearlySalaryNZD || (persona.hourlyRateNZD ? persona.hourlyRateNZD * 40 * 52 : 0);
      if (salary > 0 && threshold) {
        met = salary >= threshold;
        reason = met ? `Salary: $${salary.toLocaleString()}` : `Salary: $${salary.toLocaleString()} < $${threshold.toLocaleString()}`;
      } else {
        reason = "Salary not provided";
      }
      break;
      
    case "educationLevel":
      const educationLevels = ["high_school", "bachelor", "master", "phd"];
      const personaEducation = educationLevels.indexOf(persona.educationLevel);
      
      if (label.includes("Bachelor or higher")) {
        met = personaEducation >= 1; // bachelor or higher
        reason = met ? `Education: ${formatEducationLevel(persona.educationLevel)}` : `Education: ${formatEducationLevel(persona.educationLevel)} (need bachelor+)`;
      } else if (label.includes("qualification offer")) {
        // For student visa, check if they have appropriate education for study
        met = personaEducation >= 0; // any education level can potentially study
        reason = met ? "Education suitable for study" : "Education not provided";
      }
      break;
      
    case "funds":
      // For prototype, assume funds are available if persona has salary data
      met = (persona.yearlySalaryNZD || persona.hourlyRateNZD) ? true : false;
      reason = met ? "Sufficient funds evidence" : "No financial information provided";
      break;
      
    default:
      // Handle nested attributes like "attributes.nzRegistration"
      if (key.startsWith("attributes.")) {
        const attrKey = key.split(".")[1];
        const attrValue = persona.attributes?.[attrKey];
        
        if (attrKey === "nzRegistration") {
          met = attrValue === true;
          reason = met ? "NZ professional registration" : "No NZ professional registration";
        } else {
          met = Boolean(attrValue);
          reason = met ? `Has ${attrKey}` : `Missing ${attrKey}`;
        }
      } else {
        met = Boolean(value);
        reason = met ? label : `Missing: ${label}`;
      }
  }
  
  return {
    requirement,
    met,
    reason
  };
}

function getPersonaValue(persona: Persona, key: string): any {
  if (key.includes(".")) {
    const [parent, child] = key.split(".");
    return (persona as any)[parent]?.[child];
  }
  return (persona as any)[key];
}

function formatEducationLevel(level: string): string {
  const mapping: Record<string, string> = {
    "high_school": "High School",
    "bachelor": "Bachelor's",
    "master": "Master's", 
    "phd": "PhD"
  };
  return mapping[level] || level;
}

export function calculateVisaScore(
  persona: Persona,
  requirements: Requirement[]
): VisaScore {
  const results = requirements.map(req => evaluateRequirement(req, persona));
  
  // Check for hard blockers
  const hardBlockerFailures = results.filter(r => r.requirement.hardBlocker && !r.met);
  const hasHardBlocker = hardBlockerFailures.length > 0;
  
  if (hasHardBlocker) {
    return {
      visaSlug: "", // Will be set by caller
      score: 0,
      requirements: results,
      hasHardBlocker: true
    };
  }
  
  // Calculate weighted score
  const totalWeight = requirements.reduce((sum, req) => sum + req.weight, 0);
  const metWeight = results
    .filter(r => r.met)
    .reduce((sum, r) => sum + r.requirement.weight, 0);
  
  const rawScore = totalWeight > 0 ? (metWeight / totalWeight) * 100 : 0;
  const score = roundToNearest5(rawScore);
  
  return {
    visaSlug: "", // Will be set by caller
    score,
    requirements: results,
    hasHardBlocker: false
  };
}

export function applyChainRule(scores: VisaScore[]): VisaScore[] {
  if (scores.length === 0) return scores;
  
  const chainedScores = [...scores];
  
  // First visa keeps its score
  for (let i = 1; i < chainedScores.length; i++) {
    const previousScore = chainedScores[i - 1].score;
    const currentScore = chainedScores[i].score;
    
    // If previous visa is 0, all subsequent visas are 0
    if (previousScore === 0) {
      chainedScores[i] = { ...chainedScores[i], score: 0 };
    } else {
      // Current score can't exceed previous score - 1 (min 0)
      const maxAllowedScore = Math.max(0, previousScore - 1);
      chainedScores[i] = { 
        ...chainedScores[i], 
        score: Math.min(currentScore, maxAllowedScore)
      };
    }
  }
  
  return chainedScores;
}
