import { useState } from "react";
import { Question } from "@/types/game";
import { Button } from "@/components/ui/button";
import { X, ExternalLink, Sparkles } from "lucide-react";
import Confetti from "./Confetti";

interface QuestionModalProps {
  question: Question;
  categoryName: string;
  onClose: () => void;
  onAnswered: () => void;
  onShowAnswer?: () => void;
}

const QuestionModal = ({ question, categoryName, onClose, onAnswered, onShowAnswer }: QuestionModalProps) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleShowAnswer = () => {
    setShowAnswer(true);
    setShowConfetti(true);
    onShowAnswer?.();
    onAnswered();
  };

  const handleClose = () => {
    setShowConfetti(false);
    onClose();
  };

  return (
    <>
      <Confetti isActive={showConfetti} />
      
      <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-40 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-primary/30 shadow-2xl shadow-primary/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-scale-in">
          {/* Header */}
          <div className="bg-primary/60 backdrop-blur-sm p-4 md:p-6 rounded-t-2xl flex items-center justify-between border-b border-primary/20">
            <div>
              <span className="text-accent text-sm md:text-base font-medium drop-shadow">{categoryName}</span>
              <h2 className="text-primary-foreground text-2xl md:text-3xl font-bold drop-shadow-md">
                {question.points} очков
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-primary-foreground hover:bg-primary-foreground/20 backdrop-blur-sm"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Question */}
          <div className="p-6 md:p-8">
            <div className="text-xl md:text-2xl lg:text-3xl font-medium text-foreground text-center mb-8 leading-relaxed">
              {question.question}
            </div>

            {!showAnswer ? (
              <div className="flex justify-center">
                <Button
                  onClick={handleShowAnswer}
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Показать ответ
                </Button>
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in">
                {/* Answer */}
                <div className="bg-accent/15 backdrop-blur-sm border border-accent/40 rounded-xl p-6">
                  <h3 className="text-accent font-bold text-lg mb-2 drop-shadow">Ответ:</h3>
                  <p className="text-foreground text-xl md:text-2xl font-medium">
                    {question.answer}
                  </p>
                </div>

                {/* Author */}
                <div className="bg-primary/15 backdrop-blur-sm border border-primary/30 rounded-xl p-6">
                  <h3 className="text-primary font-bold text-lg mb-2">Автор:</h3>
                  <p className="text-foreground text-xl font-medium">
                    {question.author} <span className="text-muted-foreground">({question.authorChannel})</span>
                  </p>
                </div>

                {/* Full Post */}
                <div className="bg-muted/30 backdrop-blur-sm border border-muted/40 rounded-xl p-6">
                  <h3 className="text-foreground font-bold text-lg mb-3">Полный пост:</h3>
                  <p className="text-foreground/90 text-base md:text-lg leading-relaxed italic">
                    "{question.fullPost}"
                  </p>
                </div>

                {/* Link */}
                <div className="flex justify-center">
                  <a
                    href={question.postLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Открыть в Telegram
                  </a>
                </div>

                {/* Close Button */}
                <div className="flex justify-center pt-4">
                  <Button
                    onClick={handleClose}
                    variant="outline"
                    size="lg"
                    className="text-lg px-8"
                  >
                    Вернуться к игре
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionModal;
