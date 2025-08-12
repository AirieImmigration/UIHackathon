import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImmigrationTimeline } from "@/components/timeline/ImmigrationTimeline";
import { usePageSEO } from "@/hooks/usePageSEO";
import { planStore } from "@/lib/planStore";
import type { Persona } from "@/config/personas";

export default function Step2() {
  usePageSEO({
    title: "Airie | Step 2 — Timeline Stocktake",
    description: "Animated pins on immigration timeline.",
    canonical: "/plan/step-2",
  });

  const navigate = useNavigate();
  const [persona, setPersona] = useState<Persona | undefined>();
  const [goal, setGoal] = useState<{ summary: string; targetVisaSlug?: string } | undefined>();

  useEffect(() => {
    const state = planStore.getState();
    
    if (!state.persona || !state.goal) {
      // Redirect back to Step 1 if data is missing
      navigate("/plan/step-1");
      return;
    }

    setPersona(state.persona);
    setGoal(state.goal);
  }, [navigate]);

  const handleContinue = () => {
    navigate("/plan/step-3");
  };

  const handleBack = () => {
    navigate("/plan/step-1");
  };

  if (!persona || !goal) {
    return (
      <main className="min-h-screen px-4 py-8 flex items-center justify-center">
        <Card className="rounded-2xl shadow-[var(--shadow-soft)]">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-semibold mb-4">Loading your journey...</h1>
            <p className="text-muted-foreground">Please wait while we prepare your timeline.</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="rounded-2xl shadow-[var(--shadow-soft)] mb-8">
          <CardContent className="p-8">
            <h1 className="text-2xl md:text-3xl font-semibold mb-2 text-center">Step 2 — Timeline Stocktake</h1>
            <p className="text-muted-foreground text-center mb-8">
              See where you are now and where you want to be on your immigration journey.
            </p>
            
            <ImmigrationTimeline persona={persona} goal={goal} />
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={handleBack}>
            Back to Step 1
          </Button>
          <Button variant="hero" onClick={handleContinue}>
            Continue to Pathway Generation
          </Button>
        </div>
      </div>
    </main>
  );
}
