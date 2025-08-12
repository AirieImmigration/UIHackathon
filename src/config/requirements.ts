export type Requirement = {
  key: string;
  label: string;
  weight: number; // contribution to score
  threshold?: number; // min value to pass
  hardBlocker?: boolean; // if true, failing blocks eligibility
};

export type VisaRequirements = Record<string, Requirement[]>; // keyed by visa slug

export const requirements: VisaRequirements = {
  "skilled-migrant": [
    { key: "age", label: "Age under 55", weight: 0.15, threshold: 55, hardBlocker: true },
    { key: "englishLevel", label: "English: Advanced/Fluent", weight: 0.2, hardBlocker: true },
    { key: "yearsExperience", label: "4+ years experience", weight: 0.25, threshold: 4 },
    { key: "yearlySalaryNZD", label: "Salary meets threshold", weight: 0.2, threshold: 59211 },
    { key: "educationLevel", label: "Bachelor or higher", weight: 0.2 },
  ],
  "work-to-residence": [
    { key: "yearsExperience", label: "2+ years in listed occupation", weight: 0.3, threshold: 2 },
    { key: "englishLevel", label: "English: Advanced/Fluent", weight: 0.2 },
    { key: "yearlySalaryNZD", label: "Meets sector salary band", weight: 0.25, threshold: 55000 },
    { key: "attributes.nzRegistration", label: "NZ professional registration", weight: 0.25, hardBlocker: true },
  ],
  "student-visa": [
    { key: "educationLevel", label: "Eligible qualification offer", weight: 0.35, hardBlocker: true },
    { key: "englishLevel", label: "English: Intermediate+", weight: 0.3 },
    { key: "funds", label: "Sufficient funds evidence", weight: 0.35, hardBlocker: true },
  ],
};
