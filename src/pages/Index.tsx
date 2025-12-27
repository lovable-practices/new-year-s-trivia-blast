import { useState } from "react";
import { mockGameData } from "@/data/mockData";
import { Category, Question } from "@/types/game";
import GameBoard from "@/components/GameBoard";
import QuestionModal from "@/components/QuestionModal";
import Snowfall from "@/components/Snowfall";
import { useSound } from "@/hooks/useSound";

const Index = () => {
  const [categories, setCategories] = useState<Category[]>(mockGameData.categories);
  const [selectedQuestion, setSelectedQuestion] = useState<{
    question: Question;
    categoryName: string;
  } | null>(null);
  const { playClick, playFanfare } = useSound();


  const handleAnswered = () => {
    if (!selectedQuestion) return;
    
    setCategories((prev) =>
      prev.map((category) => ({
        ...category,
        questions: category.questions.map((q) =>
          q.id === selectedQuestion.question.id
            ? { ...q, isAnswered: true }
            : q
        ),
      }))
    );
  };

  const handleCloseModal = () => {
    playClick();
    setSelectedQuestion(null);
  };

  const handleOpenModal = (categoryId: string, questionId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    const question = category?.questions.find((q) => q.id === questionId);
    if (category && question && !question.isAnswered) {
      playClick();
      setSelectedQuestion({ question, categoryName: category.name });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/20 relative overflow-hidden">
      <Snowfall />
      
      {/* Header */}
      <header className="relative z-10 py-6 md:py-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-2 tracking-tight">
            <span className="text-accent">СВОЯ</span> ИГРА
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl">
            🎄 Новогодний выпуск 2025 🎅
          </p>
        </div>
      </header>


      {/* Game Board */}
      <main className="relative z-10 pb-8">
        <GameBoard categories={categories} onQuestionClick={handleOpenModal} />
      </main>

      {/* Question Modal */}
      {selectedQuestion && (
        <QuestionModal
          question={selectedQuestion.question}
          categoryName={selectedQuestion.categoryName}
          onClose={handleCloseModal}
          onAnswered={handleAnswered}
          onShowAnswer={playFanfare}
        />
      )}

      {/* Decorative elements */}
      <div className="fixed bottom-4 left-4 text-6xl opacity-50 pointer-events-none">🎄</div>
      <div className="fixed bottom-4 right-4 text-6xl opacity-50 pointer-events-none">🎁</div>
      <div className="fixed top-20 left-8 text-4xl opacity-30 pointer-events-none">⭐</div>
      <div className="fixed top-32 right-12 text-4xl opacity-30 pointer-events-none">✨</div>
    </div>
  );
};

export default Index;
