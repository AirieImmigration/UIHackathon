import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PersonaSelectionCard } from "@/components/persona/PersonaSelectionCard";
import { PersonaCard } from "@/components/persona/PersonaCard";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { ChatInput } from "@/components/chat/ChatInput";
import { useChatFlow } from "@/hooks/useChatFlow";
import { usePageSEO } from "@/hooks/usePageSEO";
import { planStore } from "@/lib/planStore";
import { personas } from "@/config/personas";
import type { Persona } from "@/config/personas";
import CallingAI from "@/tools/CallingAI";

type Step =
  | "selection"
  | "persona-chat"
  | "persona-complete"
  | "goal-chat"
  | "complete";

type PersonDetails = "employmenttype" | "age" | "origin";

export default function Step1() {
  usePageSEO({
    title: "Airie | Step 1 — Persona & Goal",
    description: "Capture your current situation and goal.",
    canonical: "/plan/step-1",
  });

  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("selection");
  const [selectedPersona, setSelectedPersona] = useState<Persona | undefined>();
  const [goal, setGoal] = useState<string>("");
  const [isGoalComplete, setIsGoalComplete] = useState(false);
  const [chatCount, setChatCount] = useState<number>(0);
  const [hasAge, setAge] = useState(false);

  const {
    messages: personaMessages,
    persona: chatPersona,
    isComplete: isPersonaComplete,
    completionPercentage,
    processUserResponse: processPersonaResponse,
    startFlow: startPersonaFlow,
  } = useChatFlow(selectedPersona);

  const [goalMessages, setGoalMessages] = useState<
    Array<{ id: string; content: string; isBot: boolean }>
  >([]);

  useEffect(() => {
    const existingState = planStore.getState();
    if (existingState.persona) {
      setSelectedPersona(existingState.persona);
      setStep("persona-complete");
    }
    if (existingState.goal) {
      setGoal(existingState.goal.summary);
      setIsGoalComplete(true);
      setStep("complete");
    }
  }, []);

  useEffect(() => {
    if (isPersonaComplete && chatPersona.name) {
      const fullPersona: Persona = {
        slug: "custom",
        name: chatPersona.name,
        age: chatPersona.age || 25,
        country: chatPersona.country || "",
        englishLevel: chatPersona.englishLevel || "intermediate",
        educationLevel: chatPersona.educationLevel || "bachelor",
        yearsExperience: chatPersona.yearsExperience || 0,
        currentJobTitle: chatPersona.currentJobTitle || "",
        currentVisaSlug: chatPersona.currentVisaSlug || "visitor",
        goal: { summary: "To be determined" },
      };

      planStore.setPersona(fullPersona);
      setSelectedPersona(fullPersona);
      setTimeout(() => setStep("persona-complete"), 1000);
    }
  }, [isPersonaComplete, chatPersona]);

  const handlePersonaSelection = (persona?: Persona) => {
    if (persona) {
      setSelectedPersona(persona);
      planStore.setPersona(persona);
      setStep("persona-complete");
    } else {
      setStep("persona-chat");
      setTimeout(() => startPersonaFlow(), 500);
    }
  };

  const handleEditPersona = () => {
    setStep("selection");
    setSelectedPersona(undefined);
    setGoal("");
    setIsGoalComplete(false);
    // Clear any saved data but keep it for reference
  };

  const handleStartGoalCapture = () => {
    setStep("goal-chat");
    setGoalMessages([
      {
        id: "goal-welcome",
        content:
          "Great! Now let's talk about your goal. What do you want to achieve in New Zealand?",
        isBot: true,
      },
    ]);
  };

  const handleGoalResponse = async (response: string) => {
    setGoalMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), content: response, isBot: false },
    ]);

    setGoal(response);

    // Call the AI service to process the goal
    const reply = await CallingAI(
      response,
      "Check that this question is only related to seeking employment in New Zealand from someone overseas. " +
        "If not please return a response to say you can only respond to employment related questions with a view to migrating to New Zealand. " +
        "If the response is relevant then return the best ANSCO match and check for the following information: age and country of origin." +
        "If any of those fields are missing then ask for them in the response."
    );
    const newInterval = chatCount + 1;
    setChatCount(newInterval);
    console.log(newInterval);
    // const checkResponse = reply;
    // const checkReplyAge = await CallingAI(
    //   response,
    //   "Check this message for age.  If there is an age return the number, it not return the number 0."
    // );
    // const checkReplyEmployment = await CallingAI(
    //   response,
    //   "Check this message for area of skills or employment.  If there is an area of skills or employment return the value and ANSCO code, it not return the string 'NULL'."
    // );

    planStore.setGoal({
      summary: "Go to New Zealand and find employment as a software engineer.",
    });

    // This is where the reply happens
    setTimeout(() => {
      setGoalMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: reply,
          isBot: true,
        },
      ]);
      if (newInterval > 1) {
        setIsGoalComplete(true);
        setTimeout(() => {
          setStep("complete");
        }, 1500);
      }
      //setIsGoalComplete(true);

      // When the step is set to complete, then the journey view comes in and end the chat
      // setTimeout(() => setStep("complete"), 1000);
    }, 500);
  };

  const handleViewJourney = () => {
    console.log("moving");

    navigate("/plan/step-2");
  };

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card className="rounded-2xl shadow-[var(--shadow-soft)]">
          <CardContent className="p-8">
            <h1 className="text-2xl md:text-3xl font-semibold mb-6">
              Step 1 — Persona & Goal
            </h1>

            {step === "selection" && (
              <div className="space-y-6">
                <p className="text-muted-foreground">
                  Choose a persona to get started, or create your own profile.
                </p>

                <div className="grid gap-4">
                  {[
                    // Jack(s) first
                    ...Object.values(personas).filter(p => p.name === "Jack"),
                    // then everyone else, preserving order
                    ...Object.values(personas).filter(p => p.name !== "Jack"),
                  ].map((persona) => (
                    <PersonaSelectionCard
                      key={persona.slug}
                      persona={persona}
                      title={persona.name}
                      description=""
                      onSelect={() => handlePersonaSelection(persona)}
                    />
                  ))}

                  <PersonaSelectionCard
                    title="Start from scratch"
                    description="Tell us about your unique situation"
                    onSelect={() => handlePersonaSelection()}
                    isStartFromScratch
                  />
                </div>

              </div>
            )}

            {step === "persona-chat" && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <Progress value={completionPercentage} className="flex-1" />
                  <span className="text-sm text-muted-foreground">
                    {completionPercentage}%
                  </span>
                </div>

                <div className="max-h-96 overflow-y-auto space-y-4 mb-4">
                  {personaMessages.map((message) => (
                    <ChatBubble
                      key={message.id}
                      message={message.content}
                      isBot={message.isBot}
                    />
                  ))}
                </div>

                <ChatInput
                  onSend={processPersonaResponse}
                  placeholder="Type your answer..."
                  disabled={isPersonaComplete}
                />
              </div>
            )}

            {step === "persona-complete" && selectedPersona && (
              <div className="space-y-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-semibold">Your Profile</h2>
                  <Button
                    onClick={handleEditPersona}
                    variant="outline"
                    size="sm"
                  >
                    Edit
                  </Button>
                </div>
                <PersonaCard
                  persona={selectedPersona}
                  title="The Now"
                  className="animate-fade-in"
                />
                <Button
                  onClick={handleStartGoalCapture}
                  className="w-full"
                  variant="hero"
                >
                  Continue to Goal Setting
                </Button>
              </div>
            )}

            {step === "goal-chat" && (
              <div className="space-y-4">
                <div className="max-h-96 overflow-y-auto space-y-4 mb-4">
                  {goalMessages.map((message) => (
                    <ChatBubble
                      key={message.id}
                      message={message.content}
                      isBot={message.isBot}
                    />
                  ))}
                </div>

                <ChatInput
                  onSend={handleGoalResponse}
                  placeholder="Describe your goal..."
                  disabled={isGoalComplete}
                />
              </div>
            )}

            {step === "complete" && selectedPersona && (
              <div className="space-y-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-semibold">Your Profile</h2>
                  <Button
                    onClick={handleEditPersona}
                    variant="outline"
                    size="sm"
                  >
                    Edit
                  </Button>
                </div>
                <PersonaCard
                  persona={selectedPersona}
                  title="The Now"
                  className="animate-fade-in"
                />

                <Card className="rounded-2xl bg-accent animate-fade-in">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold mb-2">The Goal</h3>
                        <p className="text-sm text-muted-foreground">{goal}</p>
                      </div>
                      <Button
                        onClick={() => setStep("goal-chat")}
                        variant="outline"
                        size="sm"
                      >
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  onClick={handleViewJourney}
                  className="w-full"
                  variant="hero"
                >
                  View Your Journey
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
