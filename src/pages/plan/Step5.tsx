import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePageSEO } from "@/hooks/usePageSEO";
import { planStore } from "@/lib/planStore";
import { analyzeCriteriaForPathway, getAllUnmetCriteria } from "@/lib/criteriaAnalyzer";
import { prioritizeTasksFromCriteria, groupTasksByCategory, type PrioritizedTask } from "@/lib/taskPrioritizer";
import { calculateLocalScores, compareScores, type LocalVisaScore } from "@/lib/localScoreCalculator";
import { LocalScoreDisplay } from "@/components/tasks/LocalScoreDisplay";
import { PriorityTaskList } from "@/components/tasks/PriorityTaskList";
import { RefreshCw, RotateCcw } from "lucide-react";

export default function Step5() {
  usePageSEO({
    title: "Airie | Step 5: Your plan to success 🎉",
    description: "Interactive tasks to improve your visa success scores in real-time.",
    canonical: "/plan/step-5",
  });

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<PrioritizedTask[]>([]);
  const [groupedTasks, setGroupedTasks] = useState<Record<string, PrioritizedTask[]>>({});
  const [scores, setScores] = useState<LocalVisaScore[]>([]);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [pulsingSteps, setPulsingSteps] = useState<Set<string>>(new Set());

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const persona = planStore.getPersona();
      const pathway = planStore.getPathway();

      if (!persona || !pathway || pathway.length === 0) {
        setError("No persona or pathway found. Please complete the previous steps.");
        return;
      }

      // Get assessments from Step 4 stored data or recalculate
      const step4Data = planStore.getStep4Assessments();
      let allUnmetCriteria: string[] = [];
      
      if (step4Data && step4Data.length > 0) {
        // Extract unmet criteria from Step 4 assessments
        console.log("🔍 Using Step 4 assessment data");
        step4Data.forEach(scoredVisa => {
          if (scoredVisa.assessments) {
            scoredVisa.assessments.forEach(assessment => {
              if (assessment.met === 'no' || assessment.met === 'unknown') {
                allUnmetCriteria.push(assessment.criterion);
              }
            });
          }
        });
      } else {
        // Fallback: Analyze criteria for the pathway
        console.log("🔍 Fallback: Analyzing criteria directly");
        const criteriaAnalyses = analyzeCriteriaForPathway(persona, pathway);
        allUnmetCriteria = getAllUnmetCriteria(criteriaAnalyses);
      }

      // Remove duplicates
      const uniqueUnmetCriteria = [...new Set(allUnmetCriteria)];
      console.log("🔍 Debug Step 5 - Unique unmet criteria:", uniqueUnmetCriteria);
      
      // Generate prioritized tasks from unmet criteria
      const prioritizedTasks = prioritizeTasksFromCriteria(uniqueUnmetCriteria, persona, pathway);
      setTasks(prioritizedTasks);
      setGroupedTasks(groupTasksByCategory(prioritizedTasks));

      // Load completed tasks from store
      const completed = planStore.getCompletedTasks();
      setCompletedTasks(completed);

      // Calculate initial scores using local calculator
      const initialScores = calculateLocalScores(persona, pathway, completed);
      setScores(initialScores);

      console.log("🔍 Generated tasks:", prioritizedTasks.length);
      console.log("🔍 Initial scores:", initialScores);

    } catch (err) {
      console.error('Error loading Step 5 data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleTaskToggle = useCallback((taskId: string) => {
    const newCompleted = completedTasks.includes(taskId)
      ? completedTasks.filter(id => id !== taskId)
      : [...completedTasks, taskId];

    setCompletedTasks(newCompleted);
    planStore.toggleTask(taskId);

    // Recalculate scores with updated tasks
    const persona = planStore.getPersona();
    const pathway = planStore.getPathway();
    
    if (persona && pathway) {
      const previousScores = [...scores];
      const updatedScores = calculateLocalScores(persona, pathway, newCompleted);
      const comparedScores = compareScores(updatedScores, previousScores);
      
      // Find which steps had score changes for pulsing effect
      const changedSteps = new Set<string>();
      comparedScores.forEach(newScore => {
        if (newScore.improved) {
          changedSteps.add(newScore.stepName);
        }
      });

      setScores(comparedScores);
      
      // Trigger pulse animation for changed steps
      if (changedSteps.size > 0) {
        setPulsingSteps(changedSteps);
        setTimeout(() => setPulsingSteps(new Set()), 1000);
      }

      // Announce score changes for accessibility
      if (changedSteps.size > 0) {
        const announcement = `Score improved for ${Array.from(changedSteps).join(', ')}`;
        const ariaLive = document.getElementById('score-announcements');
        if (ariaLive) {
          ariaLive.textContent = announcement;
        }
      }
    }
  }, [completedTasks, scores]);

  const handleReset = useCallback(() => {
    planStore.reset();
    navigate('/plan/step-1');
  }, [navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (isLoading) {
    return (
      <main className="min-h-screen px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <Card className="rounded-2xl shadow-[var(--shadow-soft)]">
            <CardContent className="p-8 text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <h1 className="text-2xl md:text-3xl font-semibold mb-2">Step 5: Your plan to success 🎉</h1>
              <p className="text-muted-foreground">Generating your personalized action plan...</p>
            </CardContent>
          </Card>
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
              <h1 className="text-2xl md:text-3xl font-semibold mb-4">Step 5: Your plan to success 🎉</h1>
              <p className="text-red-600 mb-4">{error}</p>
              <div className="space-x-4">
                <Button onClick={loadData} variant="outline">
                  Try Again
                </Button>
                <Button onClick={() => navigate('/plan/step-4')}>
                  Back to Step 4
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const pathway = planStore.getPathway() || [];

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* ARIA live region for score announcements */}
        <div id="score-announcements" className="sr-only" aria-live="polite" aria-atomic="true" />
        
        <Card className="rounded-2xl shadow-[var(--shadow-soft)]">
          <CardContent className="p-8">
            <h1 className="text-2xl md:text-3xl font-semibold mb-2 text-center">
              Step 5: Your plan to success 🎉
            </h1>
            <p className="text-muted-foreground text-center mb-6">
              Complete tasks below to see your visa success scores improve in real-time
            </p>

            <LocalScoreDisplay
              pathway={pathway}
              scores={scores}
              pulsingSteps={pulsingSteps}
            />
          </CardContent>
        </Card>

        <PriorityTaskList
          tasks={tasks}
          groupedTasks={groupedTasks}
          completedTasks={completedTasks}
          onTaskToggle={handleTaskToggle}
        />

        <Card className="rounded-2xl shadow-[var(--shadow-soft)]">
          <CardContent className="p-6 text-center">
            <Button 
              onClick={handleReset}
              variant="outline"
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Start Over with New Goal
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
