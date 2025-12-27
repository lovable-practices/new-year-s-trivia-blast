import { useState, useEffect } from "react";
import { Category, Question } from "@/types/game";
import { useGameData } from "@/hooks/useGameData";
import GameBoard from "@/components/GameBoard";
import QuestionModal from "@/components/QuestionModal";
import Snowfall from "@/components/Snowfall";
import { useSound } from "@/hooks/useSound";
import { Button } from "@/components/ui/button";
import { RotateCcw, Loader2 } from "lucide-react";

const STORAGE_KEY = "answered-questions";

const getAnsweredIds = (): Set<string> => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
};

const saveAnsweredIds = (ids: Set<string>) => {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
};

const Index = () => {
  const { data: initialCategories, isLoading, error } = useGameData();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<{
    question: Question;
    categoryName: string;
  } | null>(null);
  const { playClick, playFanfare } = useSound();

  // Sync categories when data loads, restore answered state from session
  useEffect(() => {
    if (initialCategories) {
      const answeredIds = getAnsweredIds();
      setCategories(
        initialCategories.map((cat) => ({
          ...cat,
          questions: cat.questions.map((q) => ({
            ...q,
            isAnswered: answeredIds.has(q.id),
          })),
        }))
      );
    }
  }, [initialCategories]);

  const handleResetGame = () => {
    playClick();
    sessionStorage.removeItem(STORAGE_KEY);
    if (initialCategories) {
      setCategories(
        initialCategories.map((cat) => ({
          ...cat,
          questions: cat.questions.map((q) => ({
            ...q,
            isAnswered: false,
          })),
        }))
      );
    }
  };

  const handleAnswered = () => {
    if (!selectedQuestion) return;

    // Save to session
    const answeredIds = getAnsweredIds();
    answeredIds.add(selectedQuestion.question.id);
    saveAnsweredIds(answeredIds);

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
      setSelectedQuestion({
        question,
        categoryName: category.name,
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/20 flex items-center justify-center">
        <Snowfall />
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Загрузка вопросов...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/20 flex items-center justify-center">
        <Snowfall />
        <div className="text-center max-w-md mx-auto p-6">
          <p className="text-destructive text-xl mb-4">Ошибка загрузки данных</p>
          <p className="text-muted-foreground mb-4">{error.message}</p>
          <Button onClick={() => window.location.reload()}>
            Попробовать снова
          </Button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!categories.length) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/20 flex items-center justify-center">
        <Snowfall />
        <div className="text-center max-w-md mx-auto p-6">
          <p className="text-muted-foreground text-xl">
            Нет данных для отображения
          </p>
          <p className="text-muted-foreground/70 mt-2">
            Добавьте категории и вопросы в базу данных
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/20 relative overflow-hidden">
      <Snowfall />

      {/* Reset Button */}
      <div className="fixed top-4 right-4 z-20">
        <Button
          variant="outline"
          size="sm"
          onClick={handleResetGame}
          className="bg-primary/50 hover:bg-primary/70 text-primary-foreground border-primary/30"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Сброс
        </Button>
      </div>

      {/* Header */}
      <header className="relative z-10 py-2 md:py-3">
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-1 tracking-tight">
            <span className="animate-gradient-text">AI-блоггер</span>{" "}
            <span className="text-primary-foreground drop-shadow-lg">ИИгра</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl drop-shadow">
            Новогодний выпуск 2025
          </p>
        </div>
      </header>

      {/* Game Board */}
      <main className="relative z-10 pb-2">
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
    </div>
  );
};

export default Index;
