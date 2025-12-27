import { useState } from "react";
import { mockGameData } from "@/data/mockData";
import { Category, Question } from "@/types/game";
import GameBoard from "@/components/GameBoard";
import QuestionModal from "@/components/QuestionModal";
import Snowfall from "@/components/Snowfall";
import { useSound } from "@/hooks/useSound";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
const Index = () => {
  const [categories, setCategories] = useState<Category[]>(mockGameData.categories);
  const [selectedQuestion, setSelectedQuestion] = useState<{
    question: Question;
    categoryName: string;
  } | null>(null);
  const {
    playClick,
    playFanfare
  } = useSound();
  const handleResetGame = () => {
    playClick();
    setCategories(mockGameData.categories.map(cat => ({
      ...cat,
      questions: cat.questions.map(q => ({
        ...q,
        isAnswered: false
      }))
    })));
  };
  const handleAnswered = () => {
    if (!selectedQuestion) return;
    setCategories(prev => prev.map(category => ({
      ...category,
      questions: category.questions.map(q => q.id === selectedQuestion.question.id ? {
        ...q,
        isAnswered: true
      } : q)
    })));
  };
  const handleCloseModal = () => {
    playClick();
    setSelectedQuestion(null);
  };
  const handleOpenModal = (categoryId: string, questionId: string) => {
    const category = categories.find(c => c.id === categoryId);
    const question = category?.questions.find(q => q.id === questionId);
    if (category && question && !question.isAnswered) {
      playClick();
      setSelectedQuestion({
        question,
        categoryName: category.name
      });
    }
  };
  return <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/20 relative overflow-hidden">
      <Snowfall />
      
      {/* Reset Button */}
      <div className="fixed top-4 right-4 z-20">
        <Button variant="outline" size="sm" onClick={handleResetGame} className="bg-primary/50 hover:bg-primary/70 text-primary-foreground border-primary/30">
          <RotateCcw className="w-4 h-4 mr-2" />
          Сброс
        </Button>
      </div>

      {/* Header */}
      <header className="relative z-10 py-6 md:py-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-2 tracking-tight">
            <span className="animate-gradient-text">AI-блоггер</span>{" "}
            <span className="text-primary-foreground drop-shadow-lg">ИИгра</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl drop-shadow">
            🎄 Новогодний выпуск 2025 🎅
          </p>
        </div>
      </header>


      {/* Game Board */}
      <main className="relative z-10 pb-8">
        <GameBoard categories={categories} onQuestionClick={handleOpenModal} />
      </main>

      {/* Question Modal */}
      {selectedQuestion && <QuestionModal question={selectedQuestion.question} categoryName={selectedQuestion.categoryName} onClose={handleCloseModal} onAnswered={handleAnswered} onShowAnswer={playFanfare} />}

    </div>;
};
export default Index;