import { useState, useCallback } from "react";
import type { Persona } from "@/config/personas";

export interface ChatMessage {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

export interface Question {
  id: string;
  field: keyof Persona | "goal";
  question: string;
  type: "text" | "number" | "select";
  options?: string[];
  validation?: (value: string) => boolean;
}

const requiredFields: Array<keyof Persona> = [
  "name", "age", "country", "englishLevel", "educationLevel", 
  "yearsExperience", "currentJobTitle", "jobDescription", "currentVisaSlug"
];

const questions: Question[] = [
  {
    id: "name",
    field: "name",
    question: "What's your name?",
    type: "text"
  },
  {
    id: "age", 
    field: "age",
    question: "How old are you?",
    type: "number",
    validation: (value) => !isNaN(Number(value)) && Number(value) > 0 && Number(value) < 100
  },
  {
    id: "country",
    field: "country", 
    question: "Which country are you currently in?",
    type: "text"
  },
  {
    id: "englishLevel",
    field: "englishLevel",
    question: "What's your English level?",
    type: "select",
    options: ["basic", "intermediate", "advanced", "fluent"]
  },
  {
    id: "educationLevel",
    field: "educationLevel",
    question: "What's your highest education level?",
    type: "select", 
    options: ["high_school", "bachelor", "master", "phd"]
  },
  {
    id: "yearsExperience",
    field: "yearsExperience",
    question: "How many years of work experience do you have?",
    type: "number",
    validation: (value) => !isNaN(Number(value)) && Number(value) >= 0
  },
  {
    id: "currentJobTitle",
    field: "currentJobTitle",
    question: "What's your current job title?", 
    type: "text"
  },
  {
    id: "jobDescription",
    field: "jobDescription",
    question: "Provide a short description of your job (2-3 sentences)",
    type: "text"
  },
  {
    id: "currentVisaSlug",
    field: "currentVisaSlug",
    question: "What type of visa are you currently on? (If you're in New Zealand, let me know your current visa. If you're outside NZ, say 'outside NZ')",
    type: "select",
    options: ["outside-nz", "visitor", "working-holiday", "student", "work", "partner-work", "skilled-migrant", "other"]
  }
];

export function useChatFlow(initialPersona?: Partial<Persona>) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      content: initialPersona 
        ? `Hi ${initialPersona.name || "there"}! I have some details about you, but let me confirm and fill in any gaps.`
        : "Hi! I'm here to help plan your New Zealand immigration journey. Let's start by learning about your current situation.",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [persona, setPersona] = useState<Partial<Persona>>(initialPersona || {});
  const [isComplete, setIsComplete] = useState(false);

  const getMissingFields = useCallback(() => {
    return requiredFields.filter(field => !persona[field]);
  }, [persona]);

  const getCompletionPercentage = useCallback(() => {
    const completed = requiredFields.filter(field => persona[field]).length;
    return Math.round((completed / requiredFields.length) * 100);
  }, [persona]);

  const getCurrentQuestion = useCallback(() => {
    const missingFields = getMissingFields();
    if (missingFields.length === 0) return null;
    
    return questions.find(q => q.field === missingFields[0]);
  }, [getMissingFields]);

  const addMessage = useCallback((content: string, isBot: boolean) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      isBot,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const processUserResponse = useCallback((response: string) => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return;

    addMessage(response, false);

    // Simple validation
    if (currentQuestion.validation && !currentQuestion.validation(response)) {
      setTimeout(() => {
        addMessage("I didn't quite understand that. Could you please try again?", true);
      }, 500);
      return;
    }

    // Update persona data
    let value: any = response;
    if (currentQuestion.type === "number") {
      value = Number(response);
    }

    setPersona(prev => ({
      ...prev,
      [currentQuestion.field]: value
    }));

    // Handle conditional questions after country
    if (currentQuestion.field === "country") {
      if (response.toLowerCase().includes("new zealand")) {
        // Ask about NZ visa
        setTimeout(() => {
          addMessage("What type of visa are you currently on in New Zealand?", true);
        }, 500);
        return; // Skip the normal flow
      } else {
        // Set as outside NZ automatically
        setPersona(prev => ({
          ...prev,
          currentVisaSlug: "outside-nz"
        }));
      }
    }

    // Check if we're done
    const newMissingFields = getMissingFields().filter(field => field !== currentQuestion.field);
    
    if (newMissingFields.length === 0) {
      setTimeout(() => {
        addMessage("Perfect! I have all the information I need about your current situation.", true);
        setIsComplete(true);
      }, 500);
    } else {
      // Ask next question
      setTimeout(() => {
        const nextQuestion = questions.find(q => q.field === newMissingFields[0]);
        if (nextQuestion) {
          addMessage(nextQuestion.question, true);
        }
      }, 500);
    }
  }, [getCurrentQuestion, addMessage, getMissingFields]);

  // Start the flow
  const startFlow = useCallback(() => {
    const firstQuestion = getCurrentQuestion();
    if (firstQuestion) {
      setTimeout(() => {
        addMessage(firstQuestion.question, true);
      }, 1000);
    } else {
      setIsComplete(true);
    }
  }, [getCurrentQuestion, addMessage]);

  return {
    messages,
    persona,
    isComplete,
    completionPercentage: getCompletionPercentage(),
    currentQuestion: getCurrentQuestion(),
    processUserResponse,
    startFlow,
    addMessage
  };
}