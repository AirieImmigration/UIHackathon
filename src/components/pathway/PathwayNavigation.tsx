import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { VisaPathwayCard } from "./VisaPathwayCard";
import { supabase } from "@/integrations/supabase/client";
import type { Visa } from "@/lib/queries/pathway";

interface PathwayNavigationProps {
  pathway: string[];
  visas: Visa[];
}

interface EnhancedVisa extends Visa {
  type?: string;
  eligibility_criteria?: string[];
  successScore?: number;
}

export function PathwayNavigation({ pathway, visas }: PathwayNavigationProps) {
  const [enhancedVisas, setEnhancedVisas] = useState<EnhancedVisa[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEnhancedVisaData();
  }, [pathway]);

  const fetchEnhancedVisaData = async () => {
    try {
      // Fetch detailed visa data from database
      const { data: visaData, error } = await supabase
        .from("visas")
        .select("name, type, stage, eligibility_criteria, short_description")
        .in("name", pathway);
      
      if (error) throw error;

      const enhancedVisaList = pathway.map((stepName, index) => {
        const dbVisa = visaData?.find(v => v.name === stepName);
        const isCurrent = index === 0;
        const isGoal = index === pathway.length - 1;
        
        return {
          id: stepName,
          slug: stepName.toLowerCase().replace(/\s+/g, '-'),
          name: stepName,
          type: dbVisa?.type || (isGoal ? "Permanent" : "Temporary"),
          stage: dbVisa?.stage || (isCurrent ? "current" : isGoal ? "residence" : "temporary"),
          short_description: dbVisa?.short_description || (isCurrent ? "Your current status" : isGoal ? "Permanent residence achieved" : "Next step in your journey"),
          eligibility_criteria: Array.isArray(dbVisa?.eligibility_criteria) ? dbVisa.eligibility_criteria as string[] : [],
          successScore: Math.floor(Math.random() * 20) + 80, // Placeholder - will be replaced with real scoring
        };
      });

      setEnhancedVisas(enhancedVisaList);
    } catch (error) {
      console.error("Error fetching visa data:", error);
      // Fallback to mock data
      const fallbackVisas = pathway.map((stepName, index) => {
        const isCurrent = index === 0;
        const isGoal = index === pathway.length - 1;
        
        return {
          id: stepName,
          slug: stepName.toLowerCase().replace(/\s+/g, '-'),
          name: stepName,
          type: isGoal ? "Permanent" : "Temporary",
          stage: isCurrent ? "current" : isGoal ? "residence" : "temporary",
          short_description: isCurrent ? "Your current status" : isGoal ? "Permanent residence achieved" : "Next step in your journey",
          eligibility_criteria: [],
          successScore: Math.floor(Math.random() * 20) + 80,
        };
      });
      setEnhancedVisas(fallbackVisas);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex flex-col gap-6">
          {pathway.map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-48 bg-muted rounded-2xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6">
        {enhancedVisas.map((visa, index) => {
          const isCurrent = index === 0;
          const isGoal = index === enhancedVisas.length - 1;
          
          return (
            <div key={visa.name} className="flex flex-col items-center gap-4">
              <VisaPathwayCard 
                visa={visa}
                isCurrent={isCurrent}
                isGoal={isGoal}
                index={index}
              />
              
              {index < enhancedVisas.length - 1 && (
                <ChevronDown className="h-6 w-6 text-muted-foreground flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}