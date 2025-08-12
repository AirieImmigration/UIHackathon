import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface TimelinePinProps {
  name: string;
  type: "persona" | "goal";
  position: number; // 0-4 for the 5 stages
  delay?: number; // animation delay in ms
}

export function TimelinePin({ name, type, position, delay = 0 }: TimelinePinProps) {
  return (
    <div 
      className="absolute top-0 transform -translate-x-1/2 -translate-y-full"
      style={{ 
        left: `${(position / 4) * 100}%`,
        animationDelay: `${delay}ms`
      }}
    >
      <div className="animate-pin-drop">
        <Avatar className={cn(
          "h-10 w-10 border-2 border-background shadow-lg",
          type === "persona" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
        )}>
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2">
          <div className={cn(
            "px-2 py-1 rounded text-xs whitespace-nowrap",
            type === "persona" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
          )}>
            {type === "persona" ? "The Now" : "The Goal"}
          </div>
        </div>
      </div>
    </div>
  );
}