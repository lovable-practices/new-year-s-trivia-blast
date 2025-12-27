export interface Question {
  id: string;
  points: number;
  question: string;
  answer: string;
  author: string;
  authorChannel: string;
  fullPost: string;
  postLink: string;
  isAnswered: boolean;
}

export interface Category {
  id: string;
  name: string;
  questions: Question[];
}

export interface GameData {
  categories: Category[];
}
