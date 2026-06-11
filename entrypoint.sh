#!/bin/bash

set -e

echo "🚀 Kahoot STDM - Starting..."

# Ensure database directory exists
mkdir -p /app/data

# Check if database exists, if not create it
if [ ! -f /app/data/prod.db ]; then
  echo "📦 First run detected - Initializing database..."

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

INSERT INTO admin_users (id, password, createdAt) VALUES ('admin-default', '$2a$10$gI96OcrAiJC5RlnMO0Aq0O0NbkGObZyo.pO2iD4K2Ta7q3ytTOfxq', CURRENT_TIMESTAMP);

INSERT INTO quizzes (id, title, description, accessCode, isActive, createdAt, updatedAt) VALUES ('cmq9je9g40000qhggbu2jyvvs', 'Journée Santé & Sécurité 2026', 'Quiz de la 2ème édition - 17 juin 2026', 'SANTE2026', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO questions (id, quizId, text, timeLimit, points, "order", createdAt, updatedAt) VALUES ('q1', 'cmq9je9g40000qhggbu2jyvvs', 'Quelle est la première cause d''accidents du travail ?', 30, 100, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO questions (id, quizId, text, timeLimit, points, "order", createdAt, updatedAt) VALUES ('q2', 'cmq9je9g40000qhggbu2jyvvs', 'Combien de pauses faut-il faire par heure ?', 25, 100, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO questions (id, quizId, text, timeLimit, points, "order", createdAt, updatedAt) VALUES ('q3', 'cmq9je9g40000qhggbu2jyvvs', 'Quel est le bon geste pour soulever une charge ?', 35, 100, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO choices (id, questionId, text, isCorrect, createdAt) VALUES ('c1', 'q1', 'Chutes de hauteur', 0, CURRENT_TIMESTAMP);
INSERT INTO choices (id, questionId, text, isCorrect, createdAt) VALUES ('c2', 'q1', 'Manutention manuelle', 1, CURRENT_TIMESTAMP);
INSERT INTO choices (id, questionId, text, isCorrect, createdAt) VALUES ('c3', 'q1', 'Exposition à des produits chimiques', 0, CURRENT_TIMESTAMP);
INSERT INTO choices (id, questionId, text, isCorrect, createdAt) VALUES ('c4', 'q1', 'Électrocution', 0, CURRENT_TIMESTAMP);

INSERT INTO choices (id, questionId, text, isCorrect, createdAt) VALUES ('c5', 'q2', 'Aucune', 0, CURRENT_TIMESTAMP);
INSERT INTO choices (id, questionId, text, isCorrect, createdAt) VALUES ('c6', 'q2', 'Une pause de 5 minutes chaque heure', 1, CURRENT_TIMESTAMP);
INSERT INTO choices (id, questionId, text, isCorrect, createdAt) VALUES ('c7', 'q2', 'Une pause de 30 minutes', 0, CURRENT_TIMESTAMP);
INSERT INTO choices (id, questionId, text, isCorrect, createdAt) VALUES ('c8', 'q2', 'Autant que possible', 0, CURRENT_TIMESTAMP);

INSERT INTO choices (id, questionId, text, isCorrect, createdAt) VALUES ('c9', 'q3', 'Fléchir le dos et les jambes', 0, CURRENT_TIMESTAMP);
INSERT INTO choices (id, questionId, text, isCorrect, createdAt) VALUES ('c10', 'q3', 'Fléchir les jambes et garder le dos droit', 1, CURRENT_TIMESTAMP);
INSERT INTO choices (id, questionId, text, isCorrect, createdAt) VALUES ('c11', 'q3', 'Soulever avec les bras uniquement', 0, CURRENT_TIMESTAMP);
INSERT INTO choices (id, questionId, text, isCorrect, createdAt) VALUES ('c12', 'q3', 'Utiliser une seule main', 0, CURRENT_TIMESTAMP);
SQL

  echo "✅ Database initialized"
fi

# Start the application
echo "✅ Starting Next.js server..."
exec npm start
