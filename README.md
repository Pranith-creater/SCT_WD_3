# Neon Quiz Arena

A premium futuristic quiz game with glassmorphism UI, neon gradients, animated particles, and a full **Node.js + MongoDB** backend.

![Stack](https://img.shields.io/badge/Node.js-Express-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Database-green) ![UI](https://img.shields.io/badge/UI-Glassmorphism-cyan)

## Features

- 5 categories: Technology, Sports, General Knowledge, Movies, Science
- 3 difficulty modes: Easy, Medium, Hard (with different timers & question counts)
- Per-question countdown timer with animated ring
- Real-time score + time bonus
- Sound effects (correct, wrong, tick, victory)
- Animated progress bar & question transitions
- Results screen with performance rating
- MongoDB-powered leaderboard
- Fully responsive design

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [MongoDB](https://www.mongodb.com/) running locally or MongoDB Atlas connection string

## Quick Start

1. **Install dependencies**

```bash
npm install
```

2. **Configure environment**

Copy `.env.example` to `.env` and set your MongoDB URI:

```bash
cp .env.example .env
```

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/neon-quiz-arena
```

3. **Seed the database** (75 questions across all categories & difficulties)

```bash
npm run seed
```

4. **Start the server**

```bash
npm start
```

5. Open **http://localhost:3000** in your browser.

For development with auto-restart:

```bash
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/questions?category=&difficulty=` | Fetch random quiz questions |
| POST | `/api/questions/check` | Verify an answer |
| GET | `/api/leaderboard` | Top scores |
| POST | `/api/leaderboard` | Save a score |
| GET | `/api/health` | Health check |

## Project Structure

```
Quiz/
├── public/           # Frontend (HTML, CSS, JS)
│   ├── index.html
│   ├── css/styles.css
│   └── js/
├── server/
│   ├── index.js      # Express server
│   ├── config/db.js
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API routes
│   └── seed/         # Database seeder
├── package.json
└── .env.example
```

## Scoring

- **Easy**: 100 base points, 20s timer, 10 questions
- **Medium**: 150 base points, 15s timer, 12 questions
- **Hard**: 200 base points, 12s timer, 15 questions
- **Time bonus**: +5 points per second remaining

## License

MIT
