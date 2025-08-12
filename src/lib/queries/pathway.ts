import { supabase } from "@/integrations/supabase/client";

export type Visa = {
  id: string | number;
  slug: string;
  name: string;
  short_description?: string | null;
  stage?: string;
  shortDescription?: string | null;
  iconName?: string | null;
  type?: string;
  eligibility_criteria?: string[];
};

export type PathwayEdge = {
  id: string | number;
  from_visa_slug: string;
  to_visa_slug: string;
  weight: number;
  rationale?: string | null;
};

export async function getVisas(): Promise<Visa[]> {
  const { data, error } = await supabase
    .from("visas")
    .select("id, slug, name, short_description, stage, shortDescription, iconName, type, eligibility_criteria");
  if (error) throw error;
  return (data ?? []) as unknown as Visa[];
}

export type PathwayStep = {
  id: string | number;
  visa_name: string;
  step_name: string;
  step_order: number;
  duration?: string | null;
  eligibility?: string | null;
  timeframe_until_next?: string | null;
};

export async function getPathwaySteps(): Promise<PathwayStep[]> {
  const { data, error } = await supabase
    .from("visa_residence_pathway")
    .select("step_id, visa_name, step_name, step_order, duration, eligibility, timeframe_until_next")
    .order('step_order');
  if (error) throw error;
  
  return (data ?? []).map((step: any) => ({
    id: step.step_id,
    visa_name: step.visa_name,
    step_name: step.step_name,
    step_order: step.step_order,
    duration: step.duration,
    eligibility: step.eligibility,
    timeframe_until_next: step.timeframe_until_next
  })) as PathwayStep[];
}

export async function getPathwayEdges(): Promise<PathwayEdge[]> {
  // Build edges from the pathway steps based on step_order
  const steps = await getPathwaySteps();
  const edges: PathwayEdge[] = [];
  
  // Group steps by visa_name to create pathways
  const pathwayGroups = steps.reduce((acc, step) => {
    if (!acc[step.visa_name]) acc[step.visa_name] = [];
    acc[step.visa_name].push(step);
    return acc;
  }, {} as Record<string, PathwayStep[]>);
  
  // Create edges between consecutive steps in each pathway
  Object.values(pathwayGroups).forEach(pathway => {
    pathway.sort((a, b) => a.step_order - b.step_order);
    for (let i = 0; i < pathway.length - 1; i++) {
      edges.push({
        id: `${pathway[i].step_name}-${pathway[i + 1].step_name}`,
        from_visa_slug: pathway[i].step_name,
        to_visa_slug: pathway[i + 1].step_name,
        weight: 1,
        rationale: `Natural progression from ${pathway[i].step_name} to ${pathway[i + 1].step_name}`
      });
    }
  });
  
  return edges;
}

export async function getPathwayData() {
  const [visas, edges, steps] = await Promise.all([getVisas(), getPathwayEdges(), getPathwaySteps()]);
  return { visas, edges, steps };
}
