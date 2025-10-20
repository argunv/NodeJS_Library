const { PrismaClient } = require('@prisma/client');

// Устанавливаем тестовую базу данных
process.env.DATABASE_URL = 'postgresql://vladislavargun@localhost:5432/library_catalog_test?schema=public';
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key';

const prisma = new PrismaClient();

// Очистка базы данных перед каждым тестом
beforeEach(async () => {
  await prisma.book.deleteMany();
  await prisma.user.deleteMany();
});

// Закрытие соединения после всех тестов
afterAll(async () => {
  await prisma.$disconnect();
});

module.exports = { prisma };