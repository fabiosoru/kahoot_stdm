const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Seed admin user
  const hashedPassword = bcrypt.hashSync('admin123', 10);

  const admin = await prisma.adminUser.upsert({
    where: { id: 'admin-default' },
    update: {},
    create: {
      id: 'admin-default',
      password: hashedPassword,
    },
  });

  console.log('Admin user seeded:', admin);

  // Create example quiz
  const quiz = await prisma.quiz.create({
    data: {
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
  });

  console.log('Example quiz created:', quiz);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
