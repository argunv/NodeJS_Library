// Настройка тестовой среды
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.DATABASE_URL = 'postgresql://postgres:password@localhost:5432/library_catalog_test';

// Увеличиваем таймаут для тестов
jest.setTimeout(10000);
