import type { Persona } from "./personas";

export type Task = {
  id: string;
  label: string;
  description?: string;
  apply: (p: Persona) => Persona; // pure update
};

export const tasks: Task[] = [
  {
    id: "improve-english",
    label: "Take IELTS prep to boost English",
    description: "Target band 7.0+ to unlock more pathways.",
    apply: (p) => ({ ...p, englishLevel: p.englishLevel === "fluent" ? p.englishLevel : "advanced" }),
  },
  {
    id: "negotiate-salary",
    label: "Negotiate salary by 10%",
    description: "Raises points and eligibility for some visas.",
    apply: (p) => ({ ...p, yearlySalaryNZD: Math.round((p.yearlySalaryNZD ?? 0) * 1.1) }),
  },
  {
    id: "gain-experience",
    label: "Gain 1 year relevant experience",
    description: "Experience matters for Skilled Migrant.",
    apply: (p) => ({ ...p, yearsExperience: p.yearsExperience + 1 }),
  },
];
