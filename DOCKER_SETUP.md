# 🐳 Docker Setup Guide

## 📋 Обзор

Проект использует правильную архитектуру Docker с отдельными сервисами для миграций и приложения.

## 🏗️ Архитектура

### Production (docker-compose.yml)
- **db**: PostgreSQL база данных
- **migrate**: Отдельный сервис для выполнения миграций (запускается один раз)
- **app**: Node.js приложение (запускается после успешного выполнения миграций)

### Development (docker-compose.dev.yml)
- **db**: PostgreSQL база данных для разработки
- **migrate**: Отдельный сервис для выполнения миграций в dev
- **app**: Node.js приложение с hot-reload

## 🚀 Быстрый старт

### Автоматическая инициализация (рекомендуется)

```bash
# Production режим
npm run docker:init

# Development режим
npm run docker:init:dev
```

### Ручной запуск

```bash
# Production
docker-compose up -d

# Development
docker-compose -f docker-compose.dev.yml up -d
```

## 🔧 Доступные команды

### Основные команды
```bash
# Инициализация (миграции + запуск)
npm run docker:init          # Production
npm run docker:init:dev      # Development

# Обычный запуск
npm run docker:up             # Production
npm run docker:dev           # Development

# Остановка
npm run docker:down           # Production
docker-compose -f docker-compose.dev.yml down  # Development

# Просмотр логов
npm run docker:logs           # Production
docker-compose -f docker-compose.dev.yml logs -f  # Development
```

### Миграции
```bash
# Выполнить миграции отдельно
npm run docker:migrate        # Production
npm run docker:migrate:dev    # Development
```

### Пересборка
```bash
# Пересборка и запуск
npm run docker:rebuild        # Production
npm run docker:dev:rebuild    # Development
```

## 🔄 Workflow

### Первый запуск
1. `npm run docker:init` - автоматически выполнит миграции и запустит приложение
2. Приложение будет доступно на http://localhost:3000

### Разработка
1. `npm run docker:init:dev` - запуск в режиме разработки
2. Изменения в коде автоматически перезагружаются
3. База данных доступна на порту 5433

### Обновление миграций
1. Создайте новую миграцию: `npx prisma migrate dev --name migration_name`
2. Запустите миграции: `npm run docker:migrate` (production) или `npm run docker:migrate:dev` (dev)

## 🏆 Преимущества нового подхода

### ✅ Best Practices
- **Разделение ответственности**: миграции и приложение - отдельные сервисы
- **Идемпотентность**: миграции выполняются только при необходимости
- **Надежность**: приложение запускается только после успешных миграций
- **Масштабируемость**: легко добавить новые сервисы

### ✅ Безопасность
- **Изоляция**: миграции выполняются в отдельном контейнере
- **Контроль**: можно запускать миграции независимо от приложения
- **Откат**: легко откатить изменения при необходимости

### ✅ DevOps
- **CI/CD**: миграции можно выполнять в pipeline
- **Мониторинг**: отдельные логи для миграций и приложения
- **Отладка**: легко диагностировать проблемы с миграциями

## 🔍 Troubleshooting

### Проблемы с миграциями
```bash
# Проверить статус миграций
docker-compose logs migrate

# Выполнить миграции вручную
npm run docker:migrate
```

### Проблемы с приложением
```bash
# Проверить логи приложения
docker-compose logs app

# Перезапустить только приложение
docker-compose restart app
```

### Очистка
```bash
# Полная очистка (включая volumes)
docker-compose down -v
docker system prune -f
```

## 📚 Дополнительные ресурсы

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Prisma Migrate Guide](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Node.js Docker Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
