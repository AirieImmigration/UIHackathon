import type { Persona, PersonaSlug } from "@/config/personas";

const STORAGE_KEY = "airie_plan_state_v1" as const;

type Goal = {
  summary: string;
  temporaryOrPermanent?: 'temporary' | 'permanent';
  mainPurpose?: string;
  specificVisa?: string | null;
  aiMatchedVisa?: string | null;
  targetVisaSlug?: string;
};

type PathwayStep = { visaSlug: string };

export type PlanState = {
  personaSlug?: PersonaSlug | "custom";
  persona?: Persona;
  goal?: Goal;
  pathway?: PathwayStep[];
  completedTasks?: string[];
  modifiedPersona?: Persona;
  step4Assessments?: any[];
};

function load(): PlanState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as PlanState;
  } catch {
    return {};
  }
}

function save(state: PlanState) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export const planStore = {
  getState(): PlanState {
    return load();
  },
  setPersona(persona: Persona) {
    const state = load();
    const next: PlanState = { ...state, personaSlug: persona.slug as PersonaSlug | "custom", persona };
    save(next);
    return next;
  },
  getPersona(): Persona | undefined {
    return load().persona;
  },
  setGoal(goal: Goal) {
    const state = load();
    const next: PlanState = { ...state, goal };
    save(next);
    return next;
  },
  getGoal(): Goal | undefined {
    return load().goal;
  },
  setPathway(pathway: PathwayStep[]) {
    const state = load();
    const next: PlanState = { ...state, pathway };
    save(next);
    return next;
  },
  getPathway(): PathwayStep[] | undefined {
    return load().pathway;
  },
  setPathwayFromSlugs(visaSlugs: string[]) {
    const pathway = visaSlugs.map(slug => ({ visaSlug: slug }));
    return this.setPathway(pathway);
  },
  getCompletedTasks(): string[] {
    return load().completedTasks || [];
  },
  toggleTask(taskId: string) {
    const state = load();
    const completed = state.completedTasks || [];
    const isCompleted = completed.includes(taskId);
    
    const nextCompleted = isCompleted 
      ? completed.filter(id => id !== taskId)
      : [...completed, taskId];
    
    const next: PlanState = { ...state, completedTasks: nextCompleted };
    save(next);
    return next;
  },
  getModifiedPersona(): Persona | undefined {
    return load().modifiedPersona;
  },
  setModifiedPersona(persona: Persona) {
    const state = load();
    const next: PlanState = { ...state, modifiedPersona: persona };
    save(next);
    return next;
  },
  reset() {
    save({});
  },
  setStep4Assessments(assessments: any[]) {
    const state = load();
    const next: PlanState = { ...state, step4Assessments: assessments };
    save(next);
    return next;
  },
  getStep4Assessments(): any[] | undefined {
    return load().step4Assessments;
  },
};
