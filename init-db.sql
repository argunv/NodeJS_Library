-- Инициализация базы данных для Library Catalog API
-- Этот файл выполняется при первом запуске PostgreSQL контейнера

-- Создание расширений
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Создание индексов для оптимизации производительности
-- (Prisma создаст таблицы автоматически, но мы можем добавить дополнительные индексы)

-- Настройка кодировки
SET client_encoding = 'UTF8';

-- Создание пользователя для приложения (опционально)
-- CREATE USER library_user WITH PASSWORD 'library_password';
-- GRANT ALL PRIVILEGES ON DATABASE library_catalog TO library_user;
