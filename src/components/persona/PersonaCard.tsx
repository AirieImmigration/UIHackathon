import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Persona } from "@/config/personas";

interface PersonaCardProps {
  persona: Persona;
  title: string;
  className?: string;
}

export function PersonaCard({ persona, title, className }: PersonaCardProps) {
  return (
    <Card className={`rounded-2xl shadow-[var(--shadow-soft)] ${className || ""}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl">
            👤
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <p className="text-sm text-muted-foreground">{persona.name}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Age: {persona.age}</Badge>
          <Badge variant="secondary">Country: {persona.country}</Badge>
          <Badge variant="secondary">English Level: {persona.englishLevel}</Badge>
        </div>
        <div>
          <p className="text-sm font-medium">Current Role</p>
          <p className="text-sm text-muted-foreground">{persona.currentJobTitle}</p>
        </div>
        {persona.jobDescription && (
          <div>
            <p className="text-sm font-medium">Job Description</p>
            <p className="text-sm text-muted-foreground">{persona.jobDescription}</p>
          </div>
        )}
        <div>
          <p className="text-sm font-medium">Experience</p>
          <p className="text-sm text-muted-foreground">{persona.yearsExperience} years</p>
        </div>
        <div>
          <p className="text-sm font-medium">Education</p>
          <p className="text-sm text-muted-foreground">{persona.educationLevel}</p>
        </div>
        {persona.currentVisaSlug && (
          <div>
            <p className="text-sm font-medium">Current Visa</p>
            <p className="text-sm text-muted-foreground">
              {persona.currentVisaSlug === "outside-nz" ? "Outside New Zealand" : persona.currentVisaSlug.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}