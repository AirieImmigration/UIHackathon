import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { usePageSEO } from "@/hooks/usePageSEO";
import { planStore } from "@/lib/planStore";
import { getPathwayData } from "@/lib/queries/pathway";
import { SimplePathwayCard } from "@/components/pathway/SimplePathwayCard";
import { TimelineDisplay } from "@/components/pathway/TimelineCalculator";
import { ChevronDown } from "lucide-react";
import type { PathwayStep } from "@/lib/queries/pathway";
import { supabase } from "@/integrations/supabase/client";
export default function Step3() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pathwaySteps, setPathwaySteps] = useState<any[]>([]);
  usePageSEO({
    title: "Airie | Step 3 — Pathway Generation",
    description: "Optimal visa pathway generation using AI-powered pathfinding.",
    canonical: "/plan/step-3"
  });
  useEffect(() => {
    generatePathway();
  }, []);
  const generatePathway = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const persona = planStore.getPersona();
      const goal = planStore.getGoal();
      console.log("🔍 Debug - Persona:", persona);
      console.log("🔍 Debug - Goal:", goal);
      if (!persona || !goal) {
        setError("Please complete Steps 1 and 2 first");
        return;
      }

      // Fetch pathway steps from Supabase
      const {
        data: steps,
        error
      } = await supabase.from("visa_residence_pathway").select("visa_name, step_name, step_order, duration, timeframe_until_next, eligibility").order("visa_name", {
        ascending: true
      }).order("step_order", {
        ascending: true
      });
      if (error) throw error;
      console.log("🔍 Debug - Retrieved steps:", steps?.length);
      console.log("🔍 Debug - All steps:", steps);
      if (!steps || steps.length === 0) {
        setError("No pathway data available");
        return;
      }

      // Find pathway based on current visa
      const currentVisaName = persona.currentVisaSlug;
      console.log("🔍 Debug - Looking for visa name:", currentVisaName);
      if (!currentVisaName) {
        setError("No current visa specified");
        return;
      }

      // Find the pathway that starts with the current visa
      const relevantSteps = steps.filter(step => {
        console.log(`🔍 Debug - Comparing "${step.visa_name}" === "${currentVisaName}"`);
        return step.visa_name === currentVisaName;
      });
      console.log("🔍 Debug - Relevant steps found:", relevantSteps.length);
      console.log("🔍 Debug - Relevant steps:", relevantSteps);
      if (relevantSteps.length === 0) {
        // Enhanced error message with available visa names
        const availableVisaNames = [...new Set(steps.map(step => step.visa_name))];
        console.log("🔍 Debug - Available visa names:", availableVisaNames);
        setError(`No pathway found for "${currentVisaName}". Available pathways: ${availableVisaNames.join(', ')}`);
        return;
      }

      // Sort by step order
      const sortedSteps = relevantSteps.sort((a, b) => a.step_order - b.step_order);
      setPathwaySteps(sortedSteps);
      console.log("🔍 Debug - Final pathway steps:", sortedSteps);

      // Save step names to store for Step 4 - these will be mapped to visa names
      const stepNames = sortedSteps.map(step => step.step_name);
      planStore.setPathwayFromSlugs(stepNames); // Store step names directly
    } catch (err) {
      console.error("❌ Error generating pathway:", err);
      setError(`Failed to generate pathway: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };
  const handleBuildPlan = () => {
    navigate("/plan/step-4");
  };
  if (isLoading) {
    return <main className="min-h-screen px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <Card className="rounded-2xl shadow-[var(--shadow-soft)] mb-6">
            <CardHeader>
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
            </CardHeader>
          </Card>
          
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="min-w-[280px] h-48 rounded-2xl" />)}
          </div>
        </div>
      </main>;
  }
  if (error) {
    return <main className="min-h-screen px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="rounded-2xl shadow-[var(--shadow-soft)]">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h1 className="text-2xl font-semibold mb-2">Pathway Generation Error</h1>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button onClick={generatePathway}>Try Again</Button>
            </CardContent>
          </Card>
        </div>
      </main>;
  }
  return <main className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="rounded-2xl shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">Step 3 — Your Pathway</CardTitle>
            <p className="text-muted-foreground">
              We've found the optimal visa pathway to reach your goal. Each step builds towards your ultimate objective.
            </p>
          </CardHeader>
        </Card>

        {/* Timeline Overview */}
        <TimelineDisplay steps={pathwaySteps} />

        {/* Pathway Steps */}
        <Card className="rounded-2xl shadow-[var(--shadow-soft)]">
          <CardContent className="p-6">
            <div className="space-y-6">
              {pathwaySteps.map((step, index) => {
              const isCurrent = index === 0;
              const isGoal = index === pathwaySteps.length - 1;
              return <div key={step.step_name} className="flex flex-col items-center gap-4 text-center">
                    <SimplePathwayCard step={step} isCurrent={isCurrent} isGoal={isGoal} index={index} />
                    
                    {index < pathwaySteps.length - 1 && <ChevronDown className="h-6 w-6 text-muted-foreground flex-shrink-0" />}
                  </div>;
            })}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button onClick={handleBuildPlan} size="lg" variant="hero" className="px-8">
            Build My Plan
          </Button>
        </div>
      </div>
    </main>;
}