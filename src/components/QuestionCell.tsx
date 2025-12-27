import { Question } from "@/types/game";
import { cn } from "@/lib/utils";

interface QuestionCellProps {
  question: Question;
  onClick: () => void;
}

const QuestionCell = ({ question, onClick }: QuestionCellProps) => {
  return (
    <button
      onClick={onClick}
      disabled={question.isAnswered}
      className={cn(
        "relative rounded-lg p-4 md:p-6 min-h-[60px] md:min-h-[80px] flex items-center justify-center transition-all duration-300 border-2",
        "hover:scale-105 hover:shadow-xl active:scale-95",
        question.isAnswered
          ? "bg-muted/30 border-muted cursor-not-allowed opacity-40"
          : "bg-gradient-to-br from-primary to-secondary border-primary/50 hover:border-accent shadow-lg cursor-pointer animate-pulse-glow"
      )}
    >
      <span
        className={cn(
          "text-2xl md:text-3xl lg:text-4xl font-bold drop-shadow-lg",
          question.isAnswered ? "text-muted-foreground" : "text-accent"
        )}
      >
        {question.points}
      </span>
      
      {/* Sparkle effect for unanswered */}
      {!question.isAnswered && (
        <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
          <div className="sparkle-overlay" />
        </div>
      )}
    </button>
  );
};

export default QuestionCell;
