import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { usePageSEO } from "@/hooks/usePageSEO";
import { planStore } from "@/lib/planStore";
import { getPathwayData } from "@/lib/queries/pathway";
import { PathwayNavigation } from "@/components/pathway/PathwayNavigation";
import type { Visa, PathwayStep } from "@/lib/queries/pathway";

export default function Step3() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visas, setVisas] = useState<Visa[]>([]);
  const [pathway, setPathway] = useState<string[]>([]);

  usePageSEO({
    title: "Airie | Step 3 — Pathway Generation",
    description: "Optimal visa pathway generation using AI-powered pathfinding.",
    canonical: "/plan/step-3",
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

      if (!persona || !goal) {
        setError("Please complete Steps 1 and 2 first");
        return;
      }

      // Fetch pathway data from Supabase
      const { visas, steps } = await getPathwayData();
      setVisas(visas);

      if (visas.length === 0) {
        setError("No visa data available");
        return;
      }

      // Find pathway based on current visa
      const currentVisaName = persona.currentVisaSlug;
      
      if (!currentVisaName) {
        setError("No current visa specified");
        return;
      }

      // Find the pathway that starts with the current visa
      const relevantSteps = steps.filter(step => step.visa_name === currentVisaName);
      
      if (relevantSteps.length === 0) {
        setError(`No pathway found for ${currentVisaName}. Consider transitioning to a different visa first.`);
        return;
      }

      // Sort by step order and get the step names
      const sortedSteps = relevantSteps.sort((a, b) => a.step_order - b.step_order);
      const pathwaySteps = sortedSteps.map(step => step.step_name);

      setPathway(pathwaySteps);
      // Save to store for Step 4
      planStore.setPathwayFromSlugs(pathwaySteps);

    } catch (err) {
      console.error("Error generating pathway:", err);
      setError("Failed to generate pathway. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuildPlan = () => {
    navigate("/plan/step-4");
  };

  if (isLoading) {
    return (
      <main className="min-h-screen px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <Card className="rounded-2xl shadow-[var(--shadow-soft)] mb-6">
            <CardHeader>
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
            </CardHeader>
          </Card>
          
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="min-w-[280px] h-48 rounded-2xl" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen px-4 py-8">
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
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="rounded-2xl shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">Step 3 — Your Pathway</CardTitle>
            <p className="text-muted-foreground">
              We've found the optimal visa pathway to reach your goal. Each step builds towards your ultimate objective.
            </p>
          </CardHeader>
        </Card>

        <Card className="rounded-2xl shadow-[var(--shadow-soft)]">
          <CardContent className="p-6">
            <PathwayNavigation pathway={pathway} visas={visas} />
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button 
            onClick={handleBuildPlan}
            size="lg"
            variant="hero"
            className="px-8"
          >
            Build My Plan
          </Button>
        </div>
      </div>
    </main>
  );
}
