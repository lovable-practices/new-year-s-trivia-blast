-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create questions table
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  points INTEGER NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  author TEXT,
  author_channel TEXT,
  full_post TEXT,
  post_link TEXT,
  is_answered BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_questions_category_id ON public.questions(category_id);
CREATE INDEX idx_questions_points ON public.questions(points);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Allow public read access for categories
CREATE POLICY "Allow public read categories" 
ON public.categories 
FOR SELECT 
USING (true);

-- Allow public read access for questions
CREATE POLICY "Allow public read questions" 
ON public.questions 
FOR SELECT 
USING (true);