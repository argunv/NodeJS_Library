#!/bin/bash

# Скрипт для инициализации проекта Library Catalog API
# Выполняет миграции и запускает приложение

set -e

echo "🚀 Инициализация Library Catalog API"
echo "====================================="

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для вывода сообщений
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Проверяем, что Docker запущен
if ! docker info > /dev/null 2>&1; then
    log_error "Docker не запущен. Пожалуйста, запустите Docker и попробуйте снова."
    exit 1
fi

# Проверяем, что docker-compose доступен
if ! command -v docker-compose > /dev/null 2>&1; then
    log_error "docker-compose не найден. Пожалуйста, установите docker-compose."
    exit 1
fi

# Определяем режим (production или development)
MODE=${1:-production}

if [ "$MODE" = "dev" ] || [ "$MODE" = "development" ]; then
    log_info "Запуск в режиме разработки"
    COMPOSE_FILE="docker-compose.dev.yml"
    COMPOSE_CMD="docker-compose -f docker-compose.dev.yml"
else
    log_info "Запуск в production режиме"
    COMPOSE_FILE="docker-compose.yml"
    COMPOSE_CMD="docker-compose"
fi

log_info "Используется файл: $COMPOSE_FILE"

# Останавливаем существующие контейнеры
log_info "Остановка существующих контейнеров..."
$COMPOSE_CMD down > /dev/null 2>&1 || true

# Собираем образы
log_info "Сборка Docker образов..."
$COMPOSE_CMD build

# Запускаем базу данных
log_info "Запуск базы данных..."
$COMPOSE_CMD up -d db

# Ждем, пока база данных будет готова
log_info "Ожидание готовности базы данных..."
$COMPOSE_CMD up migrate

if [ $? -eq 0 ]; then
    log_success "Миграции выполнены успешно"
else
    log_error "Ошибка при выполнении миграций"
    exit 1
fi

# Запускаем приложение
log_info "Запуск приложения..."
$COMPOSE_CMD up -d app

# Проверяем статус
log_info "Проверка статуса сервисов..."
$COMPOSE_CMD ps

log_success "Инициализация завершена!"
echo ""
log_info "🌐 API доступно по адресу: http://localhost:3000"
log_info "📚 Документация API: http://localhost:3000/api-docs"
log_info "🔍 Health Check: http://localhost:3000/api/health"
echo ""
log_info "Для просмотра логов используйте: $COMPOSE_CMD logs -f"
log_info "Для остановки используйте: $COMPOSE_CMD down"
