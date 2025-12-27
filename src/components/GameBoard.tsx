import { useState, useEffect } from "react";
import { Category } from "@/types/game";
import QuestionCell from "./QuestionCell";

interface GameBoardProps {
  categories: Category[];
  onQuestionClick: (categoryId: string, questionId: string) => void;
}

const GameBoard = ({ categories, onQuestionClick }: GameBoardProps) => {
  const [sparklingCellId, setSparklingCellId] = useState<string | null>(null);
  const [sparkleDirection, setSparkleDirection] = useState<number>(0); // 0-7 for 8 directions
  // Get all unanswered question IDs
  const unansweredIds = categories
    .flatMap(cat => cat.questions)
    .filter(q => !q.isAnswered)
    .map(q => q.id);

  useEffect(() => {
    if (unansweredIds.length === 0) return;

    const triggerRandomSparkle = () => {
      const randomId = unansweredIds[Math.floor(Math.random() * unansweredIds.length)];
      const randomDirection = Math.floor(Math.random() * 8); // 8 possible directions
      setSparklingCellId(randomId);
      setSparkleDirection(randomDirection);
      
      // Remove sparkle after animation completes
      setTimeout(() => setSparklingCellId(null), 1200);
    };

    // Initial sparkle after a delay
    const initialDelay = setTimeout(triggerRandomSparkle, 1000);

    // Random interval between 2-4 seconds
    const scheduleNext = () => {
      return setTimeout(() => {
        triggerRandomSparkle();
        timeoutRef = scheduleNext();
      }, 2000 + Math.random() * 2000);
    };

    let timeoutRef = scheduleNext();

    return () => {
      clearTimeout(initialDelay);
      clearTimeout(timeoutRef);
    };
  }, [unansweredIds.join(',')]);

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-6 gap-2 md:gap-3 shadow-deep rounded-2xl p-3 md:p-4 bg-background/30 backdrop-blur-sm">
        {/* Category Headers */}
        {categories.map((category, colIndex) => (
          <div
            key={category.id}
            className="bg-primary/50 backdrop-blur-md rounded-xl p-2 md:p-4 text-center min-h-[60px] md:min-h-[80px] flex items-center justify-center border border-primary/30 shadow-lg shadow-primary/20 animate-fade-in opacity-0"
            style={{ 
              animationDelay: `${colIndex * 50}ms`,
              animationFillMode: 'forwards'
            }}
          >
            <h2 className="text-xs md:text-sm lg:text-base font-bold text-primary-foreground leading-tight drop-shadow-md">
              {category.name}
            </h2>
          </div>
        ))}

        {/* Question Grid */}
        {[10, 20, 30, 40, 50].map((points, rowIndex) => (
          categories.map((category, colIndex) => {
            const question = category.questions.find((q) => q.points === points);
            return question ? (
              <QuestionCell
                key={question.id}
                question={question}
                onClick={() => onQuestionClick(category.id, question.id)}
                animationDelay={(rowIndex + 1) * 100 + colIndex * 50}
                isSparkle={sparklingCellId === question.id}
                sparkleDirection={sparkleDirection}
              />
            ) : null;
          })
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
