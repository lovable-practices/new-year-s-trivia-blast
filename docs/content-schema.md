# Content Schema for Trivia Quiz

## Database Schema

### Table: categories

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| id | UUID | auto | Primary key |
| name | TEXT | yes | Category name with emoji (e.g., "🛠️ Вайб-кодинг") |
| sort_order | INTEGER | no | Display order (0 = first) |
| created_at | TIMESTAMPTZ | auto | Creation timestamp |

### Table: questions

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| id | UUID | auto | Primary key |
| category_id | UUID | yes | Foreign key to categories |
| points | INTEGER | yes | Point value: 100, 200, 300, 400, or 500 |
| question | TEXT | yes | Question text |
| answer | TEXT | yes | Correct answer |
| author | TEXT | no | Content author name |
| author_channel | TEXT | no | Telegram channel handle (@channel) |
| full_post | TEXT | no | Full original post text |
| post_link | TEXT | no | Link to original Telegram post |
| created_at | TIMESTAMPTZ | auto | Creation timestamp |

## JSON Import Format

For bulk importing content, use this JSON structure:

```json
{
  "categories": [
    {
      "name": "🛠️ Вайб-кодинг и Инструменты",
      "sort_order": 1
    },
    {
      "name": "💰 Стартапы и Деньги",
      "sort_order": 2
    }
  ],
  "questions": [
    {
      "category_name": "🛠️ Вайб-кодинг и Инструменты",
      "points": 100,
      "question": "Текст вопроса...",
      "answer": "Правильный ответ",
      "author": "Глеб Кудрявцев",
      "author_channel": "@shotgun_dev",
      "full_post": "Полный текст поста...",
      "post_link": "https://t.me/shotgun_dev/123"
    }
  ]
}
```

## Planned Categories (5 topics)

### 1. 🛠️ Вайб-кодинг и Инструменты
AI coding tools, utilities, IDE, development approaches.

Authors:
- Глеб Кудрявцев (Shotgun, «вайб-кодинг»)
- Тимур Хахалев (Plan & Act, Cursor rules)
- Константин Доронин (MCP-серверы, Figma MCP)
- AI и грабли / Николай Шейко (parsing, scripts)
- ElKornacio (agents, IDE, qYp)

### 2. 💰 Стартапы и Деньги (Продукты)
Revenue, metrics, product launches, investments.

Authors:
- BOGDANISSSIMO (Vibe app, MRR, LifeOps)
- Пресидский залив / Надя Зуева (Fashion Tech, Aesty, O1 visa)
- Refat Talks (digests, startup packs)
- Константин Антоневич (AI in enterprise, HR-tech)
- Max: AI, Engineering and Startups (surveys, stats)

### 3. 🧠 Хардкор и Наука (RAG & Models)
Technical questions, model architecture, benchmarks.

Authors:
- Dealer.AI (papers, «Дядя», AIJ)
- Neural Kovalskii (SGR Agent Core, RTX 4090, RAG)
- Этихлид (SDLC, agent architecture)
- Поляков считает (CI/CD, telegram bots)

### 4. 🎓 Промпты и Обучение (AI для людей)
AI for non-technical users, management, education.

Authors:
- Бунак и Цифра (employee training, presentations)
- Багин Варит! (AI for non-techies)
- NGI / Влад Корнышев (Product management, NotebookLM)

### 5. 🎨 Креатив и Лайфстайл (Дизайн и Мнения)
Visuals, design, personal stories, experiments.

Authors:
- Лёха ведет дневник (design systems, UI generation)
- Free slots for memes and fails from various channels

## SQL Examples

### Insert a category
```sql
INSERT INTO categories (name, sort_order)
VALUES ('🛠️ Вайб-кодинг и Инструменты', 1);
```

### Insert a question
```sql
INSERT INTO questions (category_id, points, question, answer, author, author_channel, full_post, post_link)
VALUES (
  'category-uuid-here',
  100,
  'Этот автор назвал свой подход к разработке с AI...',
  'Вайб-кодинг',
  'Глеб Кудрявцев',
  '@shotgun_dev',
  'Полный текст поста...',
  'https://t.me/shotgun_dev/123'
);
```

### Query all game data
```sql
SELECT
  c.id as category_id,
  c.name as category_name,
  c.sort_order,
  q.*
FROM categories c
LEFT JOIN questions q ON q.category_id = c.id
ORDER BY c.sort_order, q.points;
```
