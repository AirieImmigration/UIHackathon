import { CheckCircle, XCircle, HelpCircle } from "lucide-react";
import type { Persona } from "@/config/personas";

export interface EligibilityAssessment {
  criterion: string;
  met: 'yes' | 'no' | 'unknown';
  reasoning?: string;
}

export function assessEligibility(persona: Persona, eligibilityCriteria: string[]): EligibilityAssessment[] {
  return eligibilityCriteria.map(criterion => {
    const assessment = assessSingleCriterion(persona, criterion);
    return {
      criterion,
      met: assessment.met,
      reasoning: assessment.reasoning
    };
  });
}

function assessSingleCriterion(persona: Persona, criterion: string): { met: 'yes' | 'no' | 'unknown'; reasoning?: string } {
  const criterionLower = criterion.toLowerCase();
  
  // Age requirements - enhanced matching
  if (criterionLower.includes('18-30') || criterionLower.includes('under 31') || criterionLower.includes('18 to 30')) {
    return {
      met: persona.age >= 18 && persona.age <= 30 ? 'yes' : 'no',
      reasoning: `Age ${persona.age} ${persona.age >= 18 && persona.age <= 30 ? 'meets' : 'does not meet'} the 18-30 requirement`
    };
  }
  
  if (criterionLower.includes('≤ 55') || criterionLower.includes('under 56') || criterionLower.includes('55 years old or younger')) {
    return {
      met: persona.age <= 55 ? 'yes' : 'no',
      reasoning: `Age ${persona.age} ${persona.age <= 55 ? 'meets' : 'exceeds'} the under 55 requirement`
    };
  }
  
  // Nationality and citizenship requirements
  if (criterionLower.includes('nationality') || criterionLower.includes('citizen')) {
    if (criterionLower.includes('all nationalities') || criterionLower.includes('eligible')) {
      return {
        met: 'yes',
        reasoning: 'Nationality requirement generally met'
      };
    }
    if (criterionLower.includes('except citizens of australia')) {
      return {
        met: persona.country?.toLowerCase() === 'australia' ? 'no' : 'yes',
        reasoning: persona.country?.toLowerCase() === 'australia' ? 'Australian citizens not eligible' : 'Nationality eligible'
      };
    }
    // Specific country requirements (like France Working Holiday)
    if (criterionLower.includes('citizen of france')) {
      return {
        met: persona.country?.toLowerCase() === 'france' ? 'yes' : 'no',
        reasoning: `Must be French citizen. Current country: ${persona.country}`
      };
    }
  }

  // Financial requirements - enhanced
  if (criterionLower.includes('enough money') || criterionLower.includes('living costs')) {
    return {
      met: 'unknown',
      reasoning: 'Financial capacity assessment needed - verify funds for living costs'
    };
  }

  // Medical insurance requirement
  if (criterionLower.includes('medical insurance') || criterionLower.includes('full medical insurance')) {
    return {
      met: 'unknown',
      reasoning: 'Medical insurance requirement - ensure coverage for stay duration'
    };
  }

  // Work and employment requirements - enhanced
  if (criterionLower.includes('job offer') || criterionLower.includes('employment') || criterionLower.includes('accredited employer')) {
    const hasJob = persona.currentJobTitle && persona.currentJobTitle !== 'Unemployed';
    if (criterionLower.includes('accredited employer')) {
      return {
        met: hasJob ? 'unknown' : 'no',
        reasoning: hasJob ? 'Has employment - need to verify employer accreditation' : 'No current employment'
      };
    }
    return {
      met: hasJob ? 'yes' : 'unknown',
      reasoning: hasJob ? 'Currently employed' : 'Employment status unclear'
    };
  }

  // Points system requirements
  if (criterionLower.includes('points system') || criterionLower.includes('skilled residence points')) {
    return {
      met: 'unknown',
      reasoning: 'Points calculation required based on skills, qualifications and experience'
    };
  }

  // Wage requirements
  if (criterionLower.includes('median wage') || criterionLower.includes('1.5 times the median wage')) {
    const salary = persona.yearlySalaryNZD || (persona.hourlyRateNZD ? persona.hourlyRateNZD * 40 * 52 : 0);
    if (salary > 0) {
      // NZ median wage is approximately 70k NZD
      const medianWage = 70000;
      const requiredWage = criterionLower.includes('1.5 times') ? medianWage * 1.5 : medianWage;
      return {
        met: salary >= requiredWage ? 'yes' : 'no',
        reasoning: `Current salary $${salary.toLocaleString()} ${salary >= requiredWage ? 'meets' : 'below'} required $${requiredWage.toLocaleString()}`
      };
    }
    return {
      met: 'unknown',
      reasoning: 'Salary information needed to assess wage requirement'
    };
  }

  // English language requirements - enhanced
  if (criterionLower.includes('english') && !criterionLower.includes('no english requirement')) {
    const englishMap = {
      basic: 1,
      intermediate: 2, 
      advanced: 3,
      fluent: 4
    };
    const userLevel = englishMap[persona.englishLevel] || 0;
    
    if (criterionLower.includes('ielts 4') || criterionLower.includes('required english level')) {
      return {
        met: userLevel >= 2 ? 'yes' : 'no',
        reasoning: `English level: ${persona.englishLevel} ${userLevel >= 2 ? 'meets' : 'below'} IELTS 4 equivalent`
      };
    }
    
    return {
      met: userLevel >= 3 ? 'yes' : 'unknown',
      reasoning: `English level: ${persona.englishLevel} - may need testing for verification`
    };
  }

  // Qualifications - enhanced
  if (criterionLower.includes('qualifications') || criterionLower.includes('degree') || criterionLower.includes('skills and qualification requirements')) {
    const educationLevelMap = {
      high_school: 1,
      bachelor: 3,
      master: 4, 
      phd: 5
    };
    const userEducation = educationLevelMap[persona.educationLevel] || 0;
    
    const hasRelevantQualifications = userEducation >= 3; // Bachelor's or higher
    return {
      met: hasRelevantQualifications ? 'yes' : 'unknown',
      reasoning: hasRelevantQualifications ? `Education: ${persona.educationLevel} meets requirements` : `Education: ${persona.educationLevel} may need assessment`
    };
  }

  // Financial requirements
  if (criterionLower.includes('funds') || criterionLower.includes('financial') || criterionLower.includes('investment')) {
    if (criterionLower.includes('million')) {
      return {
        met: 'unknown',
        reasoning: 'Investment capacity not specified in profile'
      };
    }
    return {
      met: 'unknown',
      reasoning: 'Financial capacity assessment needed'
    };
  }

  // Experience requirements
  if (criterionLower.includes('experience') || criterionLower.includes('work')) {
    const hasExperience = persona.yearsExperience && persona.yearsExperience > 0;
    return {
      met: hasExperience ? 'yes' : 'unknown',
      reasoning: hasExperience ? `${persona.yearsExperience} years of experience` : 'Work experience not detailed'
    };
  }

  // Residency/visa history requirements
  if (criterionLower.includes('resident visa') || criterionLower.includes('held') || criterionLower.includes('present in nz')) {
    return {
      met: 'unknown',
      reasoning: 'Requires future visa status tracking'
    };
  }

  // Character and law requirements
  if (criterionLower.includes('character') || criterionLower.includes('no notable history of breaking the law')) {
    return {
      met: 'yes',
      reasoning: 'Assumed to meet standard character requirements'
    };
  }

  // Health requirements
  if (criterionLower.includes('health') || criterionLower.includes('no notable health issues')) {
    return {
      met: 'yes',
      reasoning: 'Assumed to meet standard health requirements'
    };
  }

  // Visa history restrictions
  if (criterionLower.includes('no specific past or future visa restrictions')) {
    return {
      met: 'yes',
      reasoning: 'No visa restrictions apply'
    };
  }

  // Working holiday specific requirements
  if (criterionLower.includes('working holiday') && criterionLower.includes('not had') || criterionLower.includes('have not had')) {
    return {
      met: 'unknown',
      reasoning: 'Working holiday history not specified in profile'
    };
  }

  // Travel/departure plans
  if (criterionLower.includes('plans to leave') || criterionLower.includes('leave new zealand')) {
    return {
      met: 'unknown',
      reasoning: 'Departure plans depend on visa purpose and future goals'
    };
  }

  // Resident visa holding requirements
  if (criterionLower.includes('already hold a resident visa') || criterionLower.includes('held it for at least 2 years')) {
    return {
      met: 'unknown',
      reasoning: 'Requires tracking of previous resident visa status'
    };
  }

  // Commitment to New Zealand requirements
  if (criterionLower.includes('commitment to new zealand') || criterionLower.includes('184 days') || criterionLower.includes('tax residence')) {
    return {
      met: 'unknown',
      reasoning: 'Commitment demonstration depends on previous residency history'
    };
  }

  // Business and investment requirements
  if (criterionLower.includes('established a business') || criterionLower.includes('owning property')) {
    return {
      met: 'unknown',
      reasoning: 'Business/property ownership status not specified in profile'
    };
  }

  // Default case - unknown
  return {
    met: 'unknown',
    reasoning: 'Insufficient information to assess this requirement'
  };
}

export function calculateSuccessScore(assessments: EligibilityAssessment[]): number {
  if (assessments.length === 0) return 0;
  
  const weights = {
    yes: 1,
    unknown: 0.5,
    no: 0
  };
  
  const totalScore = assessments.reduce((sum, assessment) => {
    return sum + weights[assessment.met];
  }, 0);
  
  return Math.round((totalScore / assessments.length) * 100);
}

interface EligibilityIconProps {
  status: 'yes' | 'no' | 'unknown';
}

export function EligibilityIcon({ status }: EligibilityIconProps) {
  switch (status) {
    case 'yes':
      return <CheckCircle className="h-4 w-4 text-emerald-600" />;
    case 'no':
      return <XCircle className="h-4 w-4 text-red-600" />;
    default:
      return <HelpCircle className="h-4 w-4 text-amber-600" />;
  }
}