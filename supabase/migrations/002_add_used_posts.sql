-- Migration: Add used_posts table for tracking which posts were used
-- Run this in Supabase SQL Editor AFTER 001_create_game_tables.sql

-- Tracking used posts to avoid duplicates
CREATE TABLE used_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_handle TEXT NOT NULL,
  message_id TEXT NOT NULL,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(channel_handle, message_id)
);

-- Index for quick lookups
CREATE INDEX idx_used_posts_channel ON used_posts(channel_handle);

-- Enable Row Level Security
ALTER TABLE used_posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read used_posts" ON used_posts
  FOR SELECT USING (true);

-- Allow insert (for the agent scripts)
CREATE POLICY "Allow insert used_posts" ON used_posts
  FOR INSERT WITH CHECK (true);

-- Comment for documentation
COMMENT ON TABLE used_posts IS 'Tracks which Telegram posts have been used to create quiz questions';
