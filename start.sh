#!/bin/sh
set -e

echo "🚀 Starting Kahoot STDM..."

# Create data directory
mkdir -p /app/data

# Check if database exists
if [ ! -f /app/data/prod.db ]; then
  echo "📦 Initializing database for first time..."

  sqlite3 /app/data/prod.db << 'SQL'
CREATE TABLE quizzes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    accessCode TEXT NOT NULL UNIQUE,
    isActive BOOLEAN NOT NULL DEFAULT 1,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE questions (
    id TEXT PRIMARY KEY,
    quizId TEXT NOT NULL,
    text TEXT NOT NULL,
    imageUrl TEXT,
    timeLimit INTEGER NOT NULL DEFAULT 30,
    points INTEGER NOT NULL DEFAULT 100,
    "order" INTEGER NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quizId) REFERENCES quizzes(id) ON DELETE CASCADE
);

CREATE TABLE choices (
    id TEXT PRIMARY KEY,
    questionId TEXT NOT NULL,
    text TEXT NOT NULL,
    isCorrect BOOLEAN NOT NULL DEFAULT 0,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (questionId) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE TABLE participants (
    id TEXT PRIMARY KEY,
    quizId TEXT NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    company TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    score INTEGER NOT NULL DEFAULT 0,
    startedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completedAt DATETIME,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quizId) REFERENCES quizzes(id) ON DELETE CASCADE,
    UNIQUE(quizId, firstName, lastName)
);

CREATE TABLE answers (
    id TEXT PRIMARY KEY,
    participantId TEXT NOT NULL,
    questionId TEXT NOT NULL,
    choiceId TEXT,
    answeredAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    timeSpent INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (participantId) REFERENCES participants(id) ON DELETE CASCADE,
    FOREIGN KEY (questionId) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY (choiceId) REFERENCES choices(id) ON DELETE SET NULL,
    UNIQUE(participantId, questionId)
);

CREATE TABLE admin_users (
    id TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_questions_quizId ON questions(quizId);
CREATE INDEX idx_choices_questionId ON choices(questionId);
CREATE INDEX idx_participants_quizId ON participants(quizId);
CREATE INDEX idx_participants_token ON participants(token);
CREATE INDEX idx_answers_participantId ON answers(participantId);
CREATE INDEX idx_answers_questionId ON answers(questionId);
SQL

  echo "✅ Database initialized"
else
  echo "✅ Using existing database"
fi

# Start Next.js
echo "✓ Starting Next.js server..."
exec npm run start:next
