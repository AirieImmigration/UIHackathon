import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { usePageSEO } from "@/hooks/usePageSEO";
import { planStore } from "@/lib/planStore";
import { getVisas } from "@/lib/queries/pathway";
import { requirements } from "@/config/requirements";
import { calculateVisaScore, applyChainRule, type VisaScore } from "@/lib/scoring";
import { ScoredVisaCard } from "@/components/scoring/ScoredVisaCard";
import type { Visa } from "@/lib/queries/pathway";

export default function Step4() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visas, setVisas] = useState<Visa[]>([]);
  const [scores, setScores] = useState<VisaScore[]>([]);

  usePageSEO({
    title: "Airie | Step 4 — Success Scoring",
    description: "Detailed analysis of your likelihood of success for each visa in your pathway.",
    canonical: "/plan/step-4",
  });

  useEffect(() => {
    calculateScores();
  }, []);

  const calculateScores = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const persona = planStore.getPersona();
      const pathway = planStore.getPathway();

      if (!persona) {
        setError("Please complete Steps 1 and 2 first");
        return;
      }

      if (!pathway || pathway.length === 0) {
        setError("Please complete Step 3 first");
        return;
      }

      // Fetch visa data
      const allVisas = await getVisas();
      setVisas(allVisas);

      const visaMap = new Map(allVisas.map(v => [v.slug, v]));
      
      // Calculate scores for each visa in pathway
      const visaScores: VisaScore[] = [];

      for (const step of pathway) {
        const visa = visaMap.get(step.visaSlug);
        if (!visa) continue;

        const visaRequirements = requirements[visa.slug] || [];
        
        if (visaRequirements.length === 0) {
          // No requirements defined - assume 95% success
          visaScores.push({
            visaSlug: visa.slug,
            score: 95,
            requirements: [],
            hasHardBlocker: false
          });
        } else {
          const score = calculateVisaScore(persona, visaRequirements);
          score.visaSlug = visa.slug;
          visaScores.push(score);
        }
      }

      // Apply chain rule to ensure realistic progression
      const chainedScores = applyChainRule(visaScores);
      setScores(chainedScores);

    } catch (err) {
      console.error("Error calculating scores:", err);
      setError("Failed to calculate success scores. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImprovePlan = () => {
    navigate("/plan/step-5");
  };

  if (isLoading) {
    return (
      <main className="min-h-screen px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="rounded-2xl shadow-[var(--shadow-soft)] mb-6">
            <CardHeader>
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
            </CardHeader>
          </Card>
          
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
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
              <h1 className="text-2xl font-semibold mb-2">Scoring Error</h1>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button onClick={calculateScores}>Try Again</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const visaMap = new Map(visas.map(v => [v.slug, v]));

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="rounded-2xl shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">Step 4 — Success Scoring</CardTitle>
            <p className="text-muted-foreground">
              Here's your detailed success analysis for each visa in your pathway. 
              Scores are calculated based on your current profile and visa requirements.
            </p>
          </CardHeader>
        </Card>

        <ol className="space-y-6">
          {scores.map((score, index) => {
            const visa = visaMap.get(score.visaSlug);
            if (!visa) return null;

            return (
              <li key={score.visaSlug}>
                <ScoredVisaCard 
                  visa={visa}
                  score={score}
                  index={index}
                />
              </li>
            );
          })}
        </ol>

        <div className="flex justify-center">
          <Button 
            onClick={handleImprovePlan}
            size="lg"
            variant="hero"
            className="px-8"
          >
            Improve My Chances
          </Button>
        </div>
      </div>
    </main>
  );
}
