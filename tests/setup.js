// Используем глобальный экземпляр Prisma из global-setup.js
const prisma = global.prisma;

// Очистка базы данных перед каждым тестом
beforeEach(async() => {
  try {
    // Очищаем в правильном порядке (сначала зависимые таблицы)
    await prisma.book.deleteMany();
    await prisma.user.deleteMany();
  } catch (error) {
    console.log('Database cleanup error:', error.message);
  }
});

// Закрытие соединения после всех тестов
afterAll(async() => {
  try {
    // Не закрываем соединение здесь, так как это делается в global-setup
    // await prisma.$disconnect();
  } catch (error) {
    console.log('Database disconnect error:', error.message);
  }
});

module.exports = { prisma };
