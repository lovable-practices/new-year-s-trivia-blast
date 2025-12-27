-- Migration: Create game tables for trivia quiz
-- Run this in Supabase SQL Editor

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Questions table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  points INTEGER NOT NULL CHECK (points IN (100, 200, 300, 400, 500)),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  author TEXT,
  author_channel TEXT,
  full_post TEXT,
  post_link TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_questions_category ON questions(category_id);
CREATE INDEX idx_questions_points ON questions(points);
CREATE INDEX idx_categories_sort_order ON categories(sort_order);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Allow public read categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Allow public read questions" ON questions
  FOR SELECT USING (true);

-- Comments for documentation
COMMENT ON TABLE categories IS 'Quiz categories (e.g., "Vibe-coding", "Startups")';
COMMENT ON TABLE questions IS 'Trivia questions with points 100-500';
COMMENT ON COLUMN questions.points IS 'Point value: 100, 200, 300, 400, or 500';
COMMENT ON COLUMN questions.author IS 'Content author name';
COMMENT ON COLUMN questions.author_channel IS 'Telegram channel handle (e.g., @channel)';
COMMENT ON COLUMN questions.full_post IS 'Full text of the original post';
COMMENT ON COLUMN questions.post_link IS 'Link to original Telegram post';
