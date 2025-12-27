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
        "relative rounded-xl p-4 md:p-6 min-h-[60px] md:min-h-[80px] flex items-center justify-center transition-all duration-300 border",
        "hover:scale-105 hover:shadow-2xl active:scale-95",
        question.isAnswered
          ? "bg-muted/20 backdrop-blur-sm border-muted/30 cursor-not-allowed opacity-40"
          : "bg-primary/40 backdrop-blur-md border-primary/30 hover:border-accent/50 hover:bg-primary/50 shadow-lg shadow-primary/20 cursor-pointer"
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
