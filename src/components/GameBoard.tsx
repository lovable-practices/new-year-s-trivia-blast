import { Category } from "@/types/game";
import QuestionCell from "./QuestionCell";

interface GameBoardProps {
  categories: Category[];
  onQuestionClick: (categoryId: string, questionId: string) => void;
}

const GameBoard = ({ categories, onQuestionClick }: GameBoardProps) => {
  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-6 gap-2 md:gap-3">
        {/* Category Headers */}
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-gradient-to-b from-primary/90 to-secondary rounded-lg p-2 md:p-4 text-center min-h-[60px] md:min-h-[80px] flex items-center justify-center border-2 border-accent/30 shadow-lg"
          >
            <h2 className="text-xs md:text-sm lg:text-base font-bold text-primary-foreground leading-tight drop-shadow">
              {category.name}
            </h2>
          </div>
        ))}

        {/* Question Grid */}
        {[10, 20, 30, 40, 50].map((points) => (
          categories.map((category) => {
            const question = category.questions.find((q) => q.points === points);
            return question ? (
              <QuestionCell
                key={question.id}
                question={question}
                onClick={() => onQuestionClick(category.id, question.id)}
              />
            ) : null;
          })
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
