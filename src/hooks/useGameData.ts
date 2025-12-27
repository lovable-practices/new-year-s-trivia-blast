import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Category, Question } from "@/types/game";
import type { Tables } from "@/integrations/supabase/types";

type DbCategory = Tables<"categories">;
type DbQuestion = Tables<"questions">;

interface CategoryWithQuestions extends DbCategory {
  questions: DbQuestion[];
}

const transformToGameData = (categories: CategoryWithQuestions[]): Category[] => {
  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    questions: cat.questions
      .sort((a, b) => a.points - b.points)
      .map((q) => ({
        id: q.id,
        points: q.points,
        question: q.question,
        answer: q.answer,
        author: q.author || "",
        authorChannel: q.author_channel || "",
        fullPost: q.full_post || "",
        postLink: q.post_link || "",
        isAnswered: false,
      })),
  }));
};

const fetchGameData = async (): Promise<Category[]> => {
  // Fetch categories ordered by sort_order
  const { data: categories, error: catError } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (catError) {
    throw new Error(`Failed to fetch categories: ${catError.message}`);
  }

  if (!categories || categories.length === 0) {
    return [];
  }

  // Fetch all questions
  const { data: questions, error: qError } = await supabase
    .from("questions")
    .select("*");

  if (qError) {
    throw new Error(`Failed to fetch questions: ${qError.message}`);
  }

  // Group questions by category
  const categoriesWithQuestions: CategoryWithQuestions[] = categories.map((cat) => ({
    ...cat,
    questions: (questions || []).filter((q) => q.category_id === cat.id),
  }));

  return transformToGameData(categoriesWithQuestions);
};

export const useGameData = () => {
  return useQuery({
    queryKey: ["gameData"],
    queryFn: fetchGameData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};
