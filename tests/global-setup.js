// Глобальная настройка для тестов
const { PrismaClient } = require('@prisma/client');

module.exports = async() => {
  // Устанавливаем переменные окружения
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-jwt-secret-key';

  // Используем DATABASE_URL из переменных окружения или дефолтное значение
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = 'postgresql://postgres:password@localhost:5432/library_catalog_test?schema=public';
  }

  // Создаем глобальный экземпляр Prisma
  global.prisma = new PrismaClient({
    log: ['error']
  });

  // Обработка сигналов для корректного завершения
  process.on('SIGINT', async() => {
    if (global.prisma) {
      await global.prisma.$disconnect();
    }
    process.exit(0);
  });

  process.on('SIGTERM', async() => {
    if (global.prisma) {
      await global.prisma.$disconnect();
    }
    process.exit(0);
  });

  // Обработка необработанных исключений
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    if (global.prisma) {
      global.prisma.$disconnect();
    }
    process.exit(1);
  });
};
