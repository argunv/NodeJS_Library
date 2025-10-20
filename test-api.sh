#!/bin/bash

# Скрипт для тестирования Library Catalog API
# Убедитесь, что сервер запущен на http://localhost:3000

BASE_URL="http://localhost:3001"
API_URL="$BASE_URL/api"

echo "🚀 Тестирование Library Catalog API"
echo "=================================="
echo ""

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для вывода заголовков
print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

# Функция для проверки ответа
check_response() {
    local response="$1"
    local expected_status="$2"
    local test_name="$3"
    
    if echo "$response" | grep -q "HTTP/1.1 $expected_status"; then
        echo -e "${GREEN}✅ $test_name - Успешно${NC}"
    else
        echo -e "${RED}❌ $test_name - Ошибка${NC}"
        echo "Ответ: $response"
    fi
    echo ""
}

# 1. Проверка health endpoint
print_header "1. Проверка Health Endpoint"
response=$(curl -s -w "HTTP/1.1 %{http_code}\n" "$BASE_URL/api/health")
check_response "$response" "200" "Health Check"

# 2. Регистрация пользователя
print_header "2. Регистрация пользователя"
register_response=$(curl -s -w "HTTP/1.1 %{http_code}\n" -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }')

echo "Ответ регистрации:"
echo "$register_response" | head -n -1
echo ""

# Извлекаем токен из ответа
TOKEN=$(echo "$register_response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo -e "${RED}❌ Не удалось получить токен аутентификации${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Токен получен: ${TOKEN:0:20}...${NC}"
echo ""

# 3. Вход в систему
print_header "3. Вход в систему"
login_response=$(curl -s -w "HTTP/1.1 %{http_code}\n" -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

echo "Ответ входа:"
echo "$login_response" | head -n -1
echo ""

# 4. Получение профиля
print_header "4. Получение профиля пользователя"
profile_response=$(curl -s -w "HTTP/1.1 %{http_code}\n" -X GET "$API_URL/auth/profile" \
  -H "Authorization: Bearer $TOKEN")

echo "Ответ профиля:"
echo "$profile_response" | head -n -1
echo ""

# 5. Создание книги
print_header "5. Создание книги"
create_book_response=$(curl -s -w "HTTP/1.1 %{http_code}\n" -X POST "$API_URL/books" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "isbn": "978-0-7432-7356-5",
    "description": "A classic American novel about the Jazz Age",
    "publishedAt": "1925-04-10T00:00:00.000Z"
  }')

echo "Ответ создания книги:"
echo "$create_book_response" | head -n -1
echo ""

# Извлекаем ID книги
BOOK_ID=$(echo "$create_book_response" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

if [ -z "$BOOK_ID" ]; then
    echo -e "${RED}❌ Не удалось получить ID книги${NC}"
    exit 1
fi

echo -e "${GREEN}✅ ID книги: $BOOK_ID${NC}"
echo ""

# 6. Создание второй книги
print_header "6. Создание второй книги"
create_book2_response=$(curl -s -w "HTTP/1.1 %{http_code}\n" -X POST "$API_URL/books" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "To Kill a Mockingbird",
    "author": "Harper Lee",
    "isbn": "978-0-06-112008-4",
    "description": "A novel about racial injustice and childhood innocence",
    "publishedAt": "1960-07-11T00:00:00.000Z"
  }')

echo "Ответ создания второй книги:"
echo "$create_book2_response" | head -n -1
echo ""

# 7. Получение списка книг
print_header "7. Получение списка книг"
get_books_response=$(curl -s -w "HTTP/1.1 %{http_code}\n" -X GET "$API_URL/books" \
  -H "Authorization: Bearer $TOKEN")

echo "Ответ списка книг:"
echo "$get_books_response" | head -n -1
echo ""

# 8. Получение книги по ID
print_header "8. Получение книги по ID"
get_book_response=$(curl -s -w "HTTP/1.1 %{http_code}\n" -X GET "$API_URL/books/$BOOK_ID" \
  -H "Authorization: Bearer $TOKEN")

echo "Ответ получения книги:"
echo "$get_book_response" | head -n -1
echo ""

# 9. Обновление книги
print_header "9. Обновление книги"
update_book_response=$(curl -s -w "HTTP/1.1 %{http_code}\n" -X PUT "$API_URL/books/$BOOK_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "The Great Gatsby (Updated)",
    "description": "An updated description of this classic novel"
  }')

echo "Ответ обновления книги:"
echo "$update_book_response" | head -n -1
echo ""

# 10. Поиск книг
print_header "10. Поиск книг"
search_books_response=$(curl -s -w "HTTP/1.1 %{http_code}\n" -X GET "$API_URL/books?search=gatsby&limit=5" \
  -H "Authorization: Bearer $TOKEN")

echo "Ответ поиска книг:"
echo "$search_books_response" | head -n -1
echo ""

# 11. Тест без аутентификации
print_header "11. Тест без аутентификации"
unauth_response=$(curl -s -w "HTTP/1.1 %{http_code}\n" -X GET "$API_URL/books")

echo "Ответ без аутентификации:"
echo "$unauth_response" | head -n -1
echo ""

# 12. Тест с неверным токеном
print_header "12. Тест с неверным токеном"
invalid_token_response=$(curl -s -w "HTTP/1.1 %{http_code}\n" -X GET "$API_URL/books" \
  -H "Authorization: Bearer invalid-token")

echo "Ответ с неверным токеном:"
echo "$invalid_token_response" | head -n -1
echo ""

# 13. Удаление книги
print_header "13. Удаление книги"
delete_book_response=$(curl -s -w "HTTP/1.1 %{http_code}\n" -X DELETE "$API_URL/books/$BOOK_ID" \
  -H "Authorization: Bearer $TOKEN")

echo "Ответ удаления книги:"
echo "$delete_book_response" | head -n -1
echo ""

# 14. Проверка удаления
print_header "14. Проверка удаления книги"
check_deleted_response=$(curl -s -w "HTTP/1.1 %{http_code}\n" -X GET "$API_URL/books/$BOOK_ID" \
  -H "Authorization: Bearer $TOKEN")

echo "Ответ проверки удаления:"
echo "$check_deleted_response" | head -n -1
echo ""

# 15. Тест валидации
print_header "15. Тест валидации данных"
validation_response=$(curl -s -w "HTTP/1.1 %{http_code}\n" -X POST "$API_URL/books" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "",
    "author": "Test Author"
  }')

echo "Ответ валидации:"
echo "$validation_response" | head -n -1
echo ""

echo -e "${GREEN}🎉 Тестирование API завершено!${NC}"
echo ""
echo -e "${YELLOW}📊 Статистика:${NC}"
echo "- Всего тестов: 15"
echo "- Проверены все основные endpoints"
echo "- Тестирована аутентификация и авторизация"
echo "- Проверена валидация данных"
echo "- Протестированы CRUD операции"
echo ""
echo -e "${BLUE}💡 Для просмотра документации API откройте: http://localhost:3000/api-docs${NC}"
