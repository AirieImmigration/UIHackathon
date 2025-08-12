import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Step1 from "./pages/plan/Step1";
import Step2 from "./pages/plan/Step2";
import Step3 from "./pages/plan/Step3";
import Step4 from "./pages/plan/Step4";
import Step5 from "./pages/plan/Step5";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/plan/step-1" element={<Step1 />} />
          <Route path="/plan/step-2" element={<Step2 />} />
          <Route path="/plan/step-3" element={<Step3 />} />
          <Route path="/plan/step-4" element={<Step4 />} />
          <Route path="/plan/step-5" element={<Step5 />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
