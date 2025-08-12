import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { usePageSEO } from "@/hooks/usePageSEO";
import { planStore } from "@/lib/planStore";
import { EnhancedVisaCard } from "@/components/scoring/EnhancedVisaCard";
import { assessEligibility, calculateSuccessScore, type EligibilityAssessment } from "@/components/scoring/AIEligibilityAssessor";
import { supabase } from "@/integrations/supabase/client";
import type { Visa } from "@/lib/queries/pathway";
export default function Step4() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visas, setVisas] = useState<any[]>([]);
  const [scores, setScores] = useState<any[]>([]);
  usePageSEO({
    title: "Airie | Step 4 — Success Scoring",
    description: "Detailed analysis of your likelihood of success for each visa in your pathway.",
    canonical: "/plan/step-4"
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

      // Fetch pathway step names (these are actual step names from visa_residence_pathway)
      const stepNames = pathway.map(step => step.visaSlug); // These are actually step names now
      console.log("🔍 Debug - Step names:", stepNames);

      // Fetch detailed visa data with eligibility criteria by matching name to step_name
      const {
        data: visasData,
        error: visasError
      } = await supabase.from("visas").select("id, slug, name, type, stage, eligibility_criteria, short_description").in("name", stepNames);
      if (visasError) throw visasError;
      console.log("🔍 Debug - Retrieved visas for scoring:", visasData?.length);
      console.log("🔍 Debug - Step names searched:", stepNames);
      console.log("🔍 Debug - Found visa names:", visasData?.map(v => v.name));

      // Handle missing visas by creating placeholder entries for steps like "New Zealand Citizenship"
      const foundVisaNames = new Set(visasData?.map(v => v.name) || []);
      const missingSteps = stepNames.filter(name => !foundVisaNames.has(name));
      if (missingSteps.length > 0) {
        console.log("🔍 Debug - Creating placeholders for missing steps:", missingSteps);
        const placeholderVisas = missingSteps.map((name, index) => ({
          id: 9999 + index,
          // Use large numbers to avoid conflicts
          slug: name.toLowerCase().replace(/\s+/g, '-'),
          name: name,
          type: name.includes('Citizenship') ? 'Permanent' : 'Unknown',
          stage: name.includes('Citizenship') ? 'citizenship' : 'unknown',
          eligibility_criteria: [`You meet the requirements for ${name}`] as any,
          short_description: `${name} - detailed criteria available on Immigration New Zealand website`
        }));
        visasData?.push(...placeholderVisas);
      }
      if (!visasData || visasData.length === 0) {
        setError("No visa data available for scoring");
        return;
      }
      setVisas(visasData);

      // Calculate AI-powered scores for each visa
      const calculatedScores = pathway.map((pathwayStep, index) => {
        const visa = visasData.find(v => v.name === pathwayStep.visaSlug); // visaSlug is actually step name
        if (!visa) {
          console.warn(`🔍 Debug - Visa not found for step name: ${pathwayStep.visaSlug}`);
          return null;
        }
        console.log(`🔍 Debug - Calculating score for visa: ${visa.name}`);

        // Use AI-powered eligibility assessment
        const eligibilityCriteria = Array.isArray(visa.eligibility_criteria) ? visa.eligibility_criteria as string[] : [];
        const assessments = assessEligibility(persona, eligibilityCriteria);
        
        // First visa (current status) should always be 100%
        const successScore = index === 0 ? 100 : calculateSuccessScore(assessments);
        console.log(`🔍 Debug - AI score for ${visa.name}:`, successScore);
        return {
          visa,
          assessments,
          successScore
        };
      }).filter(Boolean);
      console.log("🔍 Debug - Final AI-powered scores:", calculatedScores);
      setScores(calculatedScores);
      
      // Store assessments for Step 5
      planStore.setStep4Assessments(calculatedScores);
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
    return <main className="min-h-screen px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="rounded-2xl shadow-[var(--shadow-soft)] mb-6">
            <CardHeader>
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
            </CardHeader>
          </Card>
          
          <div className="space-y-6">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 rounded-2xl" />)}
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
              <h1 className="text-2xl font-semibold mb-2">Scoring Error</h1>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button onClick={calculateScores}>Try Again</Button>
            </CardContent>
          </Card>
        </div>
      </main>;
  }
  const visaMap = new Map(visas.map(v => [v.slug, v]));
  return <main className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="rounded-2xl shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-center">Step 4: My likelihood of success ⚡️</CardTitle>
            <p className="text-muted-foreground">
              Here's your detailed success analysis for each visa in your pathway. 
              Scores are calculated based on your current profile and visa requirements.
            </p>
          </CardHeader>
        </Card>

        <div className="space-y-4">
          {scores.map((scoredVisa, index) => <EnhancedVisaCard key={scoredVisa.visa.id} visa={scoredVisa.visa} assessments={scoredVisa.assessments} successScore={scoredVisa.successScore} index={index} />)}
        </div>

        <div className="flex justify-center">
          <Button onClick={handleImprovePlan} size="lg" variant="hero" className="px-8">
            Improve My Chances
          </Button>
        </div>
      </div>
    </main>;
}