import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import GoogleTranslate from "@/tools/GoogleTranslate";

const Index = () => {
  useEffect(() => {
    document.title = "Airie | Immigration Planner Prototype";
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-2xl rounded-2xl shadow-[var(--shadow-soft)]">
        <CardContent className="p-8">
          <h1 className="text-3xl md:text-4xl font-semibold mb-3">Airie Immigration Planner</h1>
          <p className="text-muted-foreground mb-6">Map your journey from the Now to the Goal in New Zealand immigration.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild variant="hero">
              <Link to="/plan/step-1" aria-label="Start planning with Airie">
                Start planning
              </Link>
            </Button>
            {/* <Button asChild variant="outline">
              <Link to="/plan/step-2">View timeline</Link>
            </Button> */}
          </div>

          <div className="mt-4">
            <GoogleTranslate />
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default Index;
