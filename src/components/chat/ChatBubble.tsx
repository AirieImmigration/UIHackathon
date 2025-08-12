import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  message: string;
  isBot?: boolean;
  isTyping?: boolean;
}

export function ChatBubble({ message, isBot = false, isTyping = false }: ChatBubbleProps) {
  return (
    <div className={cn(
      "flex gap-3 mb-4 animate-fade-in",
      isBot ? "justify-start" : "justify-end"
    )}>
      {isBot && (
        <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      )}
      <div className={cn(
        "max-w-[80%] rounded-2xl px-4 py-3",
        isBot 
          ? "bg-accent text-accent-foreground" 
          : "bg-primary text-primary-foreground"
      )}>
        {isTyping ? (
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
        ) : (
          <p className="text-sm">{message}</p>
        )}
      </div>
      {!isBot && (
        <Avatar className="h-8 w-8 bg-secondary text-secondary-foreground">
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}