import type { Persona } from "./personas";

export type Task = {
  id: string;
  label: string;
  description?: string;
  category: string;
  estimatedTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  appliesToVisas?: string[];
  apply: (p: Persona) => Persona; // pure update
};

export const tasks: Task[] = [
  {
    id: "improve-english-advanced",
    label: "Improve English to Advanced level",
    description: "Take IELTS prep course to reach band 6.5-7.0.",
    category: "English",
    estimatedTime: "3-6 months", 
    difficulty: "medium",
    appliesToVisas: ["skilled-migrant", "work-to-residence", "student-visa"],
    apply: (p) => ({ ...p, englishLevel: "advanced" as const }),
  },
  {
    id: "improve-english-fluent",
    label: "Achieve fluent English proficiency",
    description: "Reach IELTS band 7.5+ for maximum visa options.",
    category: "English",
    estimatedTime: "6-12 months",
    difficulty: "hard", 
    appliesToVisas: ["skilled-migrant", "work-to-residence"],
    apply: (p) => ({ ...p, englishLevel: "fluent" as const }),
  },
  {
    id: "negotiate-salary-10",
    label: "Negotiate 10% salary increase",
    description: "Raises points and eligibility for salary-based visas.",
    category: "Employment",
    estimatedTime: "1-3 months",
    difficulty: "medium",
    appliesToVisas: ["skilled-migrant", "work-to-residence"],
    apply: (p) => ({ ...p, yearlySalaryNZD: Math.round((p.yearlySalaryNZD ?? 0) * 1.1) }),
  },
  {
    id: "negotiate-salary-25",
    label: "Negotiate 25% salary increase", 
    description: "Significant salary boost for higher visa scores.",
    category: "Employment",
    estimatedTime: "3-6 months",
    difficulty: "hard",
    appliesToVisas: ["skilled-migrant", "work-to-residence"],
    apply: (p) => ({ ...p, yearlySalaryNZD: Math.round((p.yearlySalaryNZD ?? 0) * 1.25) }),
  },
  {
    id: "gain-experience-1yr",
    label: "Gain 1 year relevant experience",
    description: "Build experience in your field for better visa eligibility.",
    category: "Experience",
    estimatedTime: "12 months",
    difficulty: "medium",
    appliesToVisas: ["skilled-migrant", "work-to-residence"],
    apply: (p) => ({ ...p, yearsExperience: p.yearsExperience + 1 }),
  },
  {
    id: "gain-experience-2yr",
    label: "Gain 2 years relevant experience",
    description: "Build substantial experience for senior roles.",
    category: "Experience", 
    estimatedTime: "24 months",
    difficulty: "hard",
    appliesToVisas: ["skilled-migrant", "work-to-residence"],
    apply: (p) => ({ ...p, yearsExperience: p.yearsExperience + 2 }),
  },
  {
    id: "complete-bachelor",
    label: "Complete Bachelor's degree",
    description: "Essential qualification for most skilled visas.",
    category: "Education",
    estimatedTime: "3-4 years",
    difficulty: "hard",
    appliesToVisas: ["skilled-migrant", "student-visa"],
    apply: (p) => ({ ...p, educationLevel: "bachelor" as const }),
  },
  {
    id: "complete-master",
    label: "Complete Master's degree",
    description: "Advanced qualification for higher visa points.",
    category: "Education",
    estimatedTime: "1-2 years", 
    difficulty: "hard",
    appliesToVisas: ["skilled-migrant"],
    apply: (p) => ({ ...p, educationLevel: "master" as const }),
  },
  {
    id: "nz-registration",
    label: "Obtain NZ professional registration",
    description: "Required for many professional roles in NZ.",
    category: "Registration",
    estimatedTime: "3-12 months",
    difficulty: "medium",
    appliesToVisas: ["work-to-residence"],
    apply: (p) => ({ ...p, attributes: { ...p.attributes, nzRegistration: true } }),
  },
  {
    id: "secure-job-offer",
    label: "Secure NZ job offer",
    description: "Essential for most work-based visa pathways.",
    category: "Employment",
    estimatedTime: "2-6 months",
    difficulty: "medium", 
    appliesToVisas: ["work-to-residence"],
    apply: (p) => ({ ...p, currentJobTitle: p.currentJobTitle || "Professional" }),
  },
];
