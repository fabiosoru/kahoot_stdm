# Multi-stage build for optimized production image
FROM node:20-slim AS base
WORKDIR /app

FROM base AS dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production

FROM base AS build
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS runtime
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Install Prisma runtime dependencies and sqlite3
RUN apt-get update && apt-get install -y --no-install-recommends libssl3 ca-certificates sqlite3 && rm -rf /var/lib/apt/lists/*

# Copy runtime dependencies
COPY --from=dependencies /app/node_modules ./node_modules

# Copy built application
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/prisma ./prisma

# Create data directory
RUN mkdir -p /app/data

# Initialize database during build
RUN sqlite3 /app/data/prod.db << 'SQL'
CREATE TABLE IF NOT EXISTS quizzes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    accessCode TEXT NOT NULL UNIQUE,
    isActive BOOLEAN NOT NULL DEFAULT 1,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
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

CREATE TABLE IF NOT EXISTS choices (
    id TEXT PRIMARY KEY,
    questionId TEXT NOT NULL,
    text TEXT NOT NULL,
    isCorrect BOOLEAN NOT NULL DEFAULT 0,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (questionId) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS participants (
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

CREATE TABLE IF NOT EXISTS answers (
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

CREATE TABLE IF NOT EXISTS admin_users (
    id TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_questions_quizId ON questions(quizId);
CREATE INDEX IF NOT EXISTS idx_choices_questionId ON choices(questionId);
CREATE INDEX IF NOT EXISTS idx_participants_quizId ON participants(quizId);
CREATE INDEX IF NOT EXISTS idx_participants_token ON participants(token);
CREATE INDEX IF NOT EXISTS idx_answers_participantId ON answers(participantId);
CREATE INDEX IF NOT EXISTS idx_answers_questionId ON answers(questionId);
SQL

# Regenerate Prisma client in runtime to ensure it's properly initialized
RUN npx prisma generate --skip-engine-check || npx prisma generate

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["npm", "start"]
