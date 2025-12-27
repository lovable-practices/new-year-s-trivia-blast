import { Question } from "@/types/game";
import { cn } from "@/lib/utils";

interface QuestionCellProps {
  question: Question;
  onClick: () => void;
  animationDelay?: number;
  isSparkle?: boolean;
}

const QuestionCell = ({ question, onClick, animationDelay = 0, isSparkle = false }: QuestionCellProps) => {
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
      
      {/* Random sparkle effect */}
      {!question.isAnswered && isSparkle && (
        <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
          <div className="sparkle-overlay animate-shimmer-once" />
        </div>
      )}
    </button>
  );
};

export default QuestionCell;
