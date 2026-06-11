const { PrismaClient } = require('@prisma/client')
const path = require('path')

const prisma = new PrismaClient()

async function main() {
  console.log('🗂️ Initializing database...')

  // Seed admin
  const admin = await prisma.adminUser.upsert({
    where: { id: 'admin-default' },
    update: {},
    create: {
      id: 'admin-default',
      password: '$2a$10$gI96OcrAiJC5RlnMO0Aq0O0NbkGObZyo.pO2iD4K2Ta7q3ytTOfxq', // admin123
    },
  })
  console.log('✅ Admin user created')

  // Seed quiz
  const quiz = await prisma.quiz.upsert({
    where: { accessCode: 'SANTE2026' },
    update: {},
    create: {
      title: 'Journée Santé & Sécurité 2026',
      description: 'Quiz de la 2ème édition - 17 juin 2026',
      accessCode: 'SANTE2026',
      isActive: true,
      questions: {
        create: [
          {
            text: 'Quelle est la première cause d\'accidents du travail ?',
            timeLimit: 30,
            points: 100,
            order: 1,
            choices: {
              create: [
                { text: 'Chutes de hauteur', isCorrect: false },
                { text: 'Manutention manuelle', isCorrect: true },
                { text: 'Exposition à des produits chimiques', isCorrect: false },
                { text: 'Électrocution', isCorrect: false },
              ],
            },
          },
          {
            text: 'Combien de pauses faut-il faire par heure quand on travaille sur ordinateur ?',
            timeLimit: 25,
            points: 100,
            order: 2,
            choices: {
              create: [
                { text: 'Aucune', isCorrect: false },
                { text: 'Une pause de 5 minutes chaque heure', isCorrect: true },
                { text: 'Une pause de 30 minutes', isCorrect: false },
                { text: 'Autant que possible', isCorrect: false },
              ],
            },
          },
          {
            text: 'Quel est le bon geste pour soulever une charge ?',
            timeLimit: 35,
            points: 100,
            order: 3,
            choices: {
              create: [
                { text: 'Fléchir le dos et les jambes', isCorrect: false },
                { text: 'Fléchir les jambes et garder le dos droit', isCorrect: true },
                { text: 'Soulever avec les bras uniquement', isCorrect: false },
                { text: 'Utiliser une seule main', isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  })
  console.log('✅ Quiz created')

  console.log('\n🎉 Database initialized successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
