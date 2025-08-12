export type PersonaSlug = "susan" | "michael" | "jack";

export type Persona = {
  slug: PersonaSlug | "custom";
  name: string;
  age: number;
  country: string;
  englishLevel: "basic" | "intermediate" | "advanced" | "fluent";
  educationLevel: "high_school" | "bachelor" | "master" | "phd";
  yearsExperience: number;
  currentJobTitle?: string;
  jobDescription?: string;
  currentVisaSlug?: string;
  hourlyRateNZD?: number;
  yearlySalaryNZD?: number;
  attributes?: Record<string, number | string | boolean>;
  goal: {
    summary: string;
    targetVisaSlug?: string;
  };
};

export const personas: Record<PersonaSlug, Persona> = {
  susan: {
    slug: "susan",
    name: "Susan",
    age: 29,
    country: "France",
    englishLevel: "fluent",
    educationLevel: "bachelor",
    yearsExperience: 6,
    currentJobTitle: "Software Engineer",
    currentVisaSlug: "France Working Holiday Visa",
    hourlyRateNZD: 45,
    yearlySalaryNZD: 0,
    attributes: { leadership: 2 },
    goal: {
      summary: "Secure a Skilled Migrant Category visa within 12 months",
      targetVisaSlug: "skilled-migrant",
    },
  },
  michael: {
    slug: "michael",
    name: "Michael",
    age: 34,
    country: "USA",
    englishLevel: "advanced",
    educationLevel: "master",
    yearsExperience: 10,
    currentJobTitle: "Registered Nurse",
    currentVisaSlug: "Partner of a New Zealander Work Visa",
    hourlyRateNZD: 38,
    yearlySalaryNZD: 0,
    attributes: { nzRegistration: true },
    goal: {
      summary: "Pathway to Work to Residence in healthcare",
      targetVisaSlug: "work-to-residence",
    },
  },
  jack: {
    slug: "jack",
    name: "Jack",
    age: 23,
    country: "Vietnam",
    englishLevel: "intermediate",
    educationLevel: "bachelor",
    yearsExperience: 2,
    currentJobTitle: "Business Analyst",
    currentVisaSlug: "Visitor Visa",
    hourlyRateNZD: 30,
    yearlySalaryNZD: 0,
    attributes: { nzQualification: false },
    goal: {
      summary: "Study and transition to Post-Study Work",
      targetVisaSlug: "student-visa",
    },
  },
};
