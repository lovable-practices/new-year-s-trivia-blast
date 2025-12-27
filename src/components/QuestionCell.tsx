import { Question } from "@/types/game";
import { cn } from "@/lib/utils";

interface Sparkle {
  key: string;
  direction: number;
}

interface QuestionCellProps {
  question: Question;
  onClick: () => void;
  animationDelay?: number;
  sparkles?: Sparkle[];
}

const QuestionCell = ({ question, onClick, animationDelay = 0, sparkles = [] }: QuestionCellProps) => {
  return (
    <button
      onClick={onClick}
      disabled={question.isAnswered}
      className={cn(
        "relative rounded-xl p-4 md:p-6 min-h-[60px] md:min-h-[80px] flex items-center justify-center border",
        "transition-all duration-300 animate-fade-in",
        question.isAnswered
          ? "bg-muted/20 backdrop-blur-sm border-muted/30 cursor-not-allowed"
          : [
              "bg-primary/40 backdrop-blur-md border-primary/30 shadow-lg shadow-primary/20 cursor-pointer",
              "hover:scale-105 hover:border-accent/50 hover:bg-primary/50",
              "hover-glow",
              "active:scale-95"
            ]
      )}
      style={{ 
        animationDelay: `${animationDelay}ms`,
        animationFillMode: 'forwards',
        opacity: 0
      }}
    >
      <span
        className={cn(
          "text-2xl md:text-3xl lg:text-4xl font-bold drop-shadow-lg transition-all duration-300",
          question.isAnswered ? "text-muted-foreground" : "text-accent"
        )}
      >
        {question.points}
      </span>
      
      {/* Random sparkle effects - can have multiple */}
      {!question.isAnswered && sparkles.map(sparkle => (
        <div 
          key={sparkle.key}
          className={cn(
            "shimmer-container",
            `shimmer-dir-${sparkle.direction}`
          )}
        >
          <div className="shimmer-beam" />
        </div>
      ))}
    </button>
  );
};

export default QuestionCell;
