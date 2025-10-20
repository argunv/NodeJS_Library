# 📚 Library Catalog API

REST API для каталога книг, построенный на Node.js, Express и PostgreSQL с современным стеком технологий.

## 🚀 Технологии

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **PostgreSQL** - База данных
- **Prisma** - ORM для работы с базой данных
- **JWT** - Аутентификация
- **bcryptjs** - Хеширование паролей
- **Zod** - Валидация данных
- **Jest & Supertest** - Тестирование
- **Swagger UI** - Документация API
- **Docker** - Контейнеризация

## 📋 Возможности

### 🔐 Аутентификация и безопасность
- ✅ JWT-аутентификация с безопасным хранением паролей
- ✅ bcryptjs для хеширования паролей
- ✅ Валидация данных с помощью Zod
- ✅ CORS и Helmet для безопасности

### 📚 Управление книгами
- ✅ CRUD операции для книг (создание, чтение, обновление, удаление)
- ✅ Пагинация и поиск по книгам
- ✅ Фильтрация по автору
- ✅ Валидация ISBN (только цифры и дефисы)

### 🧪 Тестирование и качество
- ✅ Покрытие тестами (unit и integration)
- ✅ Автоматизированное тестирование API
- ✅ Детекция утечек в тестах
- ✅ Автоматический аудит безопасности
- ✅ CI/CD с GitHub Actions

### 🐳 Docker и развертывание
- ✅ Современная Docker архитектура (best practices)
- ✅ Отдельные сервисы для миграций и приложения
- ✅ Автоматическая инициализация с init-скриптом
- ✅ Production и Development окружения
- ✅ Health checks и graceful shutdown

### 📖 Документация
- ✅ Полная документация API с Swagger UI
- ✅ Подробная Docker документация
- ✅ Примеры запросов и ответов
- ✅ Руководство по развертыванию

## 🛠 Установка

### Предварительные требования

- Node.js (версия 18 или выше)
- PostgreSQL (версия 12 или выше)
- Docker и Docker Compose (опционально)

### Локальная установка

1. **Клонирование репозитория**
   ```bash
   git clone <repository-url>
   cd NodeJS_Library
   ```

2. **Установка зависимостей**
   ```bash
   npm install
   ```

3. **Настройка переменных окружения**
   ```bash
   cp .env.example .env
   ```
   
   Отредактируйте `.env` файл с вашими настройками:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/library_catalog?schema=public"
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=3000
   NODE_ENV=development
   ```

4. **Настройка базы данных**
   ```bash
   # Генерация Prisma клиента
   npx prisma generate
   
   # Применение миграций
   npx prisma migrate dev
   ```

5. **Запуск приложения**
   ```bash
   # Режим разработки
   npm run dev
   
   # Продакшн режим
   npm start
   ```

### Docker установка

Проект использует современную Docker архитектуру с отдельными сервисами для миграций и приложения.

#### 🚀 Быстрый старт (рекомендуется)

```bash
# Production режим
npm run docker:init

# Development режим  
npm run docker:init:dev
```

#### 📋 Ручной запуск

**Production режим:**
```bash
# Сборка и запуск
npm run docker:build && npm run docker:up

# Или по отдельности
docker-compose build
docker-compose up -d
```

**Development режим:**
```bash
# Сборка и запуск
docker-compose -f docker-compose.dev.yml build
docker-compose -f docker-compose.dev.yml up -d
```

#### 🔧 Управление сервисами

```bash
# Остановка
npm run docker:down                    # Production
docker-compose -f docker-compose.dev.yml down  # Development

# Просмотр логов
npm run docker:logs                    # Production
docker-compose -f docker-compose.dev.yml logs -f  # Development

# Выполнение миграций отдельно
npm run docker:migrate                 # Production
npm run docker:migrate:dev             # Development
```

#### 🏗️ Архитектура Docker

**Production (docker-compose.yml):**
- **db**: PostgreSQL база данных
- **migrate**: Отдельный сервис для миграций (выполняется один раз)
- **app**: Node.js приложение (запускается после миграций)

**Development (docker-compose.dev.yml):**
- **db**: PostgreSQL для разработки (порт 5433)
- **migrate**: Миграции для dev окружения
- **app**: Node.js с hot-reload

#### 📊 Порты

**Production:**
- Приложение: http://localhost:3000
- База данных: localhost:5432
- Swagger UI: http://localhost:3000/api-docs

**Development:**
- Приложение: http://localhost:3000
- База данных: localhost:5433
- Swagger UI: http://localhost:3000/api-docs

#### ✅ Преимущества новой архитектуры

- **Разделение ответственности**: миграции и приложение - отдельные сервисы
- **Надежность**: приложение запускается только после успешных миграций
- **Идемпотентность**: миграции выполняются только при необходимости
- **Масштабируемость**: легко добавить новые сервисы
- **CI/CD готовность**: миграции можно выполнять в pipeline

> 📖 **Подробная документация**: См. [DOCKER_SETUP.md](./DOCKER_SETUP.md) для полного руководства по Docker

## 🧪 Тестирование

### Запуск тестов

```bash
# Все тесты
npm test

# Тесты в режиме наблюдения
npm run test:watch

# Тесты с покрытием
npm run test:coverage

# Тесты для CI/CD
npm run test:ci
```

### Структура тестов

- `tests/unit/` - Unit тесты
- `tests/integration/` - Integration тесты
- `tests/global-setup.js` - Глобальная настройка тестов
- `tests/global-teardown.js` - Глобальная очистка после тестов

### CI/CD

Проект включает настроенный GitHub Actions workflow с:
- ✅ Автоматическим тестированием
- ✅ Проверкой покрытия кода
- ✅ Аудит безопасности зависимостей
- ✅ Docker сборка и тестирование
- ✅ Детекция утечек в тестах

## 📖 API Документация

После запуска приложения документация API доступна по адресу:
- **Swagger UI**: http://localhost:3000/api-docs

## 🔗 API Endpoints

### Аутентификация

| Метод | Endpoint | Описание | Аутентификация |
|-------|----------|----------|----------------|
| POST | `/api/auth/register` | Регистрация пользователя | ❌ |
| POST | `/api/auth/login` | Вход пользователя | ❌ |
| GET | `/api/auth/profile` | Получить профиль | ✅ |

### Книги

| Метод | Endpoint | Описание | Аутентификация |
|-------|----------|----------|----------------|
| GET | `/api/books` | Получить список книг | ✅ |
| GET | `/api/books/:id` | Получить книгу по ID | ✅ |
| POST | `/api/books` | Создать новую книгу | ✅ |
| PUT | `/api/books/:id` | Обновить книгу | ✅ |
| DELETE | `/api/books/:id` | Удалить книгу | ✅ |

### Система

| Метод | Endpoint | Описание | Аутентификация |
|-------|----------|----------|----------------|
| GET | `/api/health` | Проверка состояния сервера | ❌ |

## 🔐 Аутентификация

API использует JWT токены для аутентификации. Для доступа к защищенным endpoints необходимо:

1. Зарегистрироваться или войти в систему
2. Получить JWT токен из ответа
3. Добавить токен в заголовок `Authorization: Bearer <token>`

## 📊 Примеры запросов

### Регистрация пользователя

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

### Вход в систему

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Создание книги

```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "isbn": "978-0-7432-7356-5",
    "description": "A classic American novel",
    "publishedAt": "1925-04-10T00:00:00.000Z"
  }'
```

### Получение списка книг

```bash
curl -X GET "http://localhost:3000/api/books?page=1&limit=10&search=gatsby" \
  -H "Authorization: Bearer <your-jwt-token>"
```

## 🐳 Docker

### Современная архитектура

Проект использует **Docker best practices** с отдельными сервисами для миграций и приложения.

#### 🏗️ Архитектура сервисов

**Production (docker-compose.yml):**
```yaml
services:
  db:           # PostgreSQL база данных
  migrate:      # Отдельный сервис для миграций
  app:          # Node.js приложение
```

**Development (docker-compose.dev.yml):**
```yaml
services:
  db:           # PostgreSQL для разработки (порт 5433)
  migrate:      # Миграции для dev окружения  
  app:          # Node.js с hot-reload
```

#### ✅ Преимущества

- **Разделение ответственности**: миграции и приложение - отдельные сервисы
- **Надежность**: приложение запускается только после успешных миграций
- **Идемпотентность**: миграции выполняются только при необходимости
- **CI/CD готовность**: миграции можно выполнять в pipeline
- **Масштабируемость**: легко добавить новые сервисы

> 📖 **Подробная документация**: См. [DOCKER_SETUP.md](./DOCKER_SETUP.md) для полного руководства

## 🔧 Разработка

### Недавние исправления

#### 🐳 Docker архитектура (v1.1.0)
- ✅ **Рефакторинг Docker архитектуры** - убраны миграции из Dockerfile'ов
- ✅ **Отдельный сервис migrate** - создан в docker-compose файлах
- ✅ **Автоматическая инициализация** - добавлен init-скрипт для первого запуска
- ✅ **Новые npm скрипты** - удобное управление Docker сервисами
- ✅ **Документация Docker** - создан DOCKER_SETUP.md с полным руководством

#### 🧪 Тестирование (v1.0.1)
- ✅ **Исправлена проблема с повторным запуском тестов** - умная аутентификация
- ✅ **Убран дублирующийся тест** - оптимизирована структура тестов
- ✅ **Обновлена нумерация** - 13 тестов вместо 14
- ✅ **Исправлены проблемы с тестами в CI/CD** - устранены ошибки аутентификации базы данных
- ✅ **Добавлена детекция утечек** - настроен Jest с `detectOpenHandles` и `forceExit`
- ✅ **Улучшена конфигурация тестов** - добавлены `global-setup.js` и `global-teardown.js`
- ✅ **Исправлены ошибки линтера** - убраны лишние пробелы и исправлен формат функций
- ✅ **Обновлен GitHub Actions** - добавлено ожидание готовности БД и улучшена обработка ошибок

### Структура проекта

```
├── config/          # Конфигурационные файлы
├── controllers/     # Контроллеры
├── middleware/      # Middleware функции
├── models/         # Модели данных
├── routes/         # Маршруты API
├── tests/          # Тесты
├── prisma/         # Prisma схема и миграции
├── app.js          # Основное приложение
├── server.js       # Точка входа
└── package.json    # Зависимости и скрипты
```

### Скрипты

#### 🚀 Основные команды
```bash
npm start          # Запуск в продакшн режиме
npm run dev        # Запуск в режиме разработки
npm test           # Запуск тестов
npm run test:watch # Тесты в режиме наблюдения
npm run test:coverage # Тесты с покрытием
npm run test:ci    # Тесты для CI/CD с детекцией утечек
npm run lint       # Проверка кода линтером
npm run lint:fix   # Автоматическое исправление ошибок линтера
```

#### 🐳 Docker команды
```bash
# Инициализация (миграции + запуск)
npm run docker:init          # Production
npm run docker:init:dev      # Development

# Обычный запуск
npm run docker:up             # Production
npm run docker:dev            # Development

# Сборка
npm run docker:build          # Production
docker-compose -f docker-compose.dev.yml build  # Development

# Остановка
npm run docker:down           # Production
docker-compose -f docker-compose.dev.yml down  # Development

# Логи
npm run docker:logs           # Production
docker-compose -f docker-compose.dev.yml logs -f  # Development

# Миграции
npm run docker:migrate        # Production
npm run docker:migrate:dev    # Development

# Пересборка
npm run docker:rebuild        # Production
npm run docker:dev:rebuild    # Development
```

#### 🧪 Тестирование API
```bash
npm run test:api              # Shell скрипт тестирования
npm run test:api:js           # JavaScript тестирование
```

#### 🗄️ База данных
```bash
npm run db:migrate            # Применение миграций
npm run db:generate           # Генерация Prisma клиента
npm run db:studio             # Prisma Studio
```

## 🚀 Развертывание

### Продакшн переменные окружения

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your-production-secret-key
PORT=3000
```

### Рекомендации по безопасности

- Используйте сильные JWT секреты
- Настройте HTTPS в продакшн
- Ограничьте CORS настройки
- Используйте переменные окружения для секретов
- Регулярно обновляйте зависимости

## 📝 Лицензия

ISC

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'add: amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Создайте Pull Request

## 📞 Поддержка

Если у вас есть вопросы или проблемы, создайте issue в репозитории.
