import { Card, CardContent } from "@/components/ui/card";
import { usePageSEO } from "@/hooks/usePageSEO";

export default function Step5() {
  usePageSEO({
    title: "Airie | Step 5 — Action Plan",
    description: "Interactive tasks to improve scores.",
    canonical: "/plan/step-5",
  });
  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card className="rounded-2xl shadow-[var(--shadow-soft)]">
          <CardContent className="p-8">
            <h1 className="text-2xl md:text-3xl font-semibold mb-2">Step 5 — Action Plan</h1>
            <p className="text-muted-foreground">Task list and dynamic updates coming soon.</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
