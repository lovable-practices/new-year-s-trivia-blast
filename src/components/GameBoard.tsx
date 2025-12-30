import { useState, useEffect, useRef } from "react";
import { Category } from "@/types/game";
import QuestionCell from "./QuestionCell";

interface ActiveSparkle {
  key: string;
  cellId: string;
  direction: number;
}

interface GameBoardProps {
  categories: Category[];
  onQuestionClick: (categoryId: string, questionId: string) => void;
}

const GameBoard = ({ categories, onQuestionClick }: GameBoardProps) => {
  const [activeSparkles, setActiveSparkles] = useState<ActiveSparkle[]>([]);
  const activeSparklesRef = useRef<ActiveSparkle[]>([]);
  
  // Keep ref in sync with state
  useEffect(() => {
    activeSparklesRef.current = activeSparkles;
  }, [activeSparkles]);

  // Get all unanswered question IDs
  const unansweredIds = categories
    .flatMap(cat => cat.questions)
    .filter(q => !q.isAnswered)
    .map(q => q.id);

  useEffect(() => {
    if (unansweredIds.length === 0) return;

    const triggerRandomSparkle = () => {
      // Get IDs of cells with active sparkles (use ref for current value)
      const activeCellIds = activeSparklesRef.current.map(s => s.cellId);
      
      // Filter: only cells without active sparkle
      const availableIds = unansweredIds.filter(id => !activeCellIds.includes(id));
      
      // If no available cells — do nothing
      if (availableIds.length === 0) return;

      const randomId = availableIds[Math.floor(Math.random() * availableIds.length)];
      const randomDirection = Math.floor(Math.random() * 8);
      const sparkleKey = `${Date.now()}-${Math.random()}`;
      
      // Add new sparkle without removing previous ones
      setActiveSparkles(prev => [...prev, { key: sparkleKey, cellId: randomId, direction: randomDirection }]);
      
      // Remove THIS specific sparkle after animation completes
      setTimeout(() => {
        setActiveSparkles(prev => prev.filter(s => s.key !== sparkleKey));
      }, 1200);
    };

    // Initial sparkle after a delay
    const initialDelay = setTimeout(triggerRandomSparkle, 1000);

    // Random interval between 0.5-3 seconds
    const scheduleNext = () => {
      return setTimeout(() => {
        triggerRandomSparkle();
        timeoutRef = scheduleNext();
      }, 500 + Math.random() * 2500);
    };

    let timeoutRef = scheduleNext();

    return () => {
      clearTimeout(initialDelay);
      clearTimeout(timeoutRef);
    };
  }, [unansweredIds.join(',')]);

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="overflow-x-auto pb-2 -mb-2">
        <div className="grid grid-cols-5 gap-2 md:gap-3 shadow-deep rounded-2xl p-3 md:p-4 bg-background/30 backdrop-blur-sm min-w-[600px] md:min-w-0">
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
        {[100, 200, 300, 400, 500].map((points, rowIndex) => (
          categories.map((category, colIndex) => {
            const question = category.questions.find((q) => q.points === points);
            return question ? (
              <QuestionCell
                key={question.id}
                question={question}
                onClick={() => onQuestionClick(category.id, question.id)}
                animationDelay={(rowIndex + 1) * 100 + colIndex * 50}
                sparkles={activeSparkles.filter(s => s.cellId === question.id)}
              />
            ) : (
              <div
                key={`empty-${category.id}-${points}`}
                className="rounded-xl bg-muted/20 min-h-[60px] md:min-h-[80px]"
              />
            );
          })
        ))}
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
