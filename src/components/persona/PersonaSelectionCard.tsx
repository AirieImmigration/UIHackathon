import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Persona } from "@/config/personas";

interface PersonaSelectionCardProps {
  persona?: Persona;
  title: string;
  description: string;
  onSelect: () => void;
  isStartFromScratch?: boolean;
}

export function PersonaSelectionCard({ 
  persona, 
  title, 
  description, 
  onSelect, 
  isStartFromScratch = false 
}: PersonaSelectionCardProps) {


  const isTan = title === "Tan";
  return (
    <Card className="rounded-2xl shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] transition-all cursor-pointer group">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">



          {/* <Avatar className="h-12 w-12 bg-primary text-primary-foreground">
            <AvatarFallback>
              {isStartFromScratch ? "+" : persona?.name[0]}
            </AvatarFallback>
          </Avatar> */}

          <Avatar className="h-12 w-12 bg-primary text-primary-foreground overflow-hidden">
             {isStartFromScratch ? (
              <AvatarFallback>+</AvatarFallback>
            ) : isTan ? (
              // Use an image inside AvatarFallback for the "Jack" card
              <AvatarFallback className="p-0">
                <img
                  src="/tan-avatar.jpg" // <-- replace with your actual image path
                  alt="Tan"
                  className="h-full w-full object-cover rounded-full"
                />
              </AvatarFallback>
            ) : (
              <AvatarFallback>{persona?.name?.[0]}</AvatarFallback>
            )}
          </Avatar>



          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {persona ? `${persona.age} • ${persona.country} • ${persona.currentJobTitle}` : description}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {persona && (
          <div className="space-y-2 mb-4">
            <p className="text-sm text-muted-foreground">
              Goal: {persona.goal.summary}
            </p>
            {persona.currentVisaSlug && (
              <p className="text-xs text-muted-foreground">
                First visa: {persona.currentVisaSlug === "outside-nz" ? "Outside New Zealand" : persona.currentVisaSlug.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
              </p>
            )}
          </div>
        )}
        <Button 
          onClick={onSelect}
          className="w-full group-hover:bg-primary/90"
        >
          {isStartFromScratch ? "Start Fresh" : "Choose This Persona"}
        </Button>
      </CardContent>
    </Card>
  );
}


// export function PersonaSelectionCard({ 
//   persona, 
//   title, 
//   description, 
//   onSelect, 
//   isStartFromScratch = false 
// }: PersonaSelectionCardProps) {
//   const isJack = title === "Jack";

//   // Display overrides for "Jack"
//   const displayTitle = isJack ? "Tan" : title;
//   const displayAge = isJack ? 23 : persona?.age;
//   const displayJob = isJack ? "Software Developer" : persona?.currentJobTitle;
//   const displayGoal = isJack ? "Settle in New Zealand" : persona?.goal.summary;


//   // Current visa: override for Jack, otherwise derive from slug
//   let displayCurrentVisa: string | undefined;
//   if (isJack) {
//     displayCurrentVisa = "Outside New Zealand";
//   } else if (persona?.currentVisaSlug) {
//     displayCurrentVisa =
//       persona.currentVisaSlug === "outside-nz"
//         ? "Outside New Zealand"
//         : persona.currentVisaSlug
//             .replace(/-/g, " ")
//             .replace(/\b\w/g, (l) => l.toUpperCase());
//   }

//   return (
//     <Card className="rounded-2xl shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] transition-all cursor-pointer group">
//       <CardHeader className="pb-4">
//         <div className="flex items-center gap-3">
//           <Avatar className="h-12 w-12 bg-primary text-primary-foreground overflow-hidden">
//             {isStartFromScratch ? (
//               <AvatarFallback>+</AvatarFallback>
//             ) : isJack ? (
//               // Use an image inside AvatarFallback for the "Jack" card
//               <AvatarFallback className="p-0">
//                 <img
//                   src="/tan-avatar.jpg" // <-- replace with your actual image path
//                   alt="Tan"
//                   className="h-full w-full object-cover rounded-full"
//                 />
//               </AvatarFallback>
//             ) : (
//               <AvatarFallback>{persona?.name?.[0]}</AvatarFallback>
//             )}
//           </Avatar>
//           <div>
//             <CardTitle className="text-lg">{displayTitle}</CardTitle>
//             <p className="text-sm text-muted-foreground">
//               {persona
//                 ? `${displayAge} • ${persona.country} • ${displayJob}`
//                 : description}
//             </p>
//           </div>
//         </div>
//       </CardHeader>

//       <CardContent className="pt-0">
//         {(persona || isJack) && (
//           <div className="space-y-2 mb-4">
//             <p className="text-sm text-muted-foreground">
//               Goal: {displayGoal}
//             </p>

//             {displayCurrentVisa && (
//               <p className="text-xs text-muted-foreground">
//                 Current visa: {displayCurrentVisa}
//               </p>
//             )}
//           </div>
//         )}

//         <Button onClick={onSelect} className="w-full group-hover:bg-primary/90">
//           {isStartFromScratch ? "Start Fresh" : "Choose This Persona"}
//         </Button>
//       </CardContent>
//     </Card>
//   );
// }
