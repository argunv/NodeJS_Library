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

- ✅ JWT-аутентификация с безопасным хранением паролей
- ✅ CRUD операции для книг (создание, чтение, обновление, удаление)
- ✅ Валидация данных с помощью Zod
- ✅ Пагинация и поиск по книгам
- ✅ Полная документация API с Swagger UI
- ✅ Покрытие тестами (unit и integration)
- ✅ Docker контейнеризация
- ✅ Graceful shutdown и обработка ошибок

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

1. **Запуск с Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Применение миграций в контейнере**
   ```bash
   docker-compose exec app npx prisma migrate deploy
   ```

## 🧪 Тестирование

### Запуск тестов

```bash
# Все тесты
npm test

# Тесты в режиме наблюдения
npm run test:watch

# Тесты с покрытием
npm run test:coverage
```

### Структура тестов

- `tests/unit/` - Unit тесты
- `tests/integration/` - Integration тесты

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

### Dockerfile

Приложение включает оптимизированный Dockerfile для продакшн развертывания.

### Docker Compose

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/library_catalog
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=library_catalog
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 🔧 Разработка

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

```bash
npm start          # Запуск в продакшн режиме
npm run dev        # Запуск в режиме разработки
npm test           # Запуск тестов
npm run test:watch # Тесты в режиме наблюдения
npm run test:coverage # Тесты с покрытием
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
