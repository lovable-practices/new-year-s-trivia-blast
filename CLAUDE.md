# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install    # Install dependencies
npm run dev    # Start development server on port 8080
npm run build  # Production build
npm run lint   # Run ESLint
npm run preview # Preview production build
```

## Architecture

This is a New Year's themed trivia game (Jeopardy-style) built with React, TypeScript, Vite, and Tailwind CSS. Uses shadcn/ui components and Supabase for backend (client configured but currently uses mock data).

### Core Game Flow

1. **Index page** (`src/pages/Index.tsx`) - Main game controller managing:
   - Game state (categories with questions)
   - Question selection and modal display
   - Game reset functionality

2. **GameBoard** (`src/components/GameBoard.tsx`) - 6-column grid displaying categories and point values (100-500). Includes animated sparkle effects on unanswered cells.

3. **QuestionModal** (`src/components/QuestionModal.tsx`) - Displays question, handles answer reveal with confetti animation, shows author attribution and Telegram post link.

4. **Data structure** (`src/types/game.ts`):
   - `GameData` → `Category[]` → `Question[]`
   - Each question has: points, question text, answer, author info, full post, and `isAnswered` state

### Key Patterns

- **Path alias**: `@/` maps to `src/` directory
- **Sound effects**: `useSound` hook generates audio via Web Audio API (click, fanfare, background music)
- **Styling**: Tailwind with custom animations (gradient text, fade-in, scale-in), glassmorphism effects
- **Mock data**: `src/data/mockData.ts` contains all trivia content (Russian language)
- **Supabase**: Client configured in `src/integrations/supabase/` but game currently uses local state with mock data
