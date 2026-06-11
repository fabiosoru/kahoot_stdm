#!/bin/bash

set -e

echo "🚀 Initializing production database..."

# Create data directory if it doesn't exist
mkdir -p ./data

# Check if database exists
if [ ! -f ./data/prod.db ]; then
  echo "📦 Creating new database..."

  # Create tables
  sqlite3 ./data/prod.db << 'SQL'
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

  echo "✅ Database created"
  echo ""
  echo "📝 Admin credentials:"
  echo "   Username: admin"
  echo "   Password: admin123"
  echo ""
  echo "⚠️  IMPORTANT: Change the admin password in production!"

else
  echo "✅ Database already exists at ./data/prod.db"
fi

echo "🎉 Production database ready"
