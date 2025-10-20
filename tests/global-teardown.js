// Глобальная очистка после всех тестов
module.exports = async() => {
  try {
    if (global.prisma) {
      await global.prisma.$disconnect();
      console.log('Database connection closed successfully');
    }
  } catch (error) {
    console.error('Error during global teardown:', error);
  }
};
