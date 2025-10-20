#!/usr/bin/env node

/**
 * Автоматизированный тест API для Library Catalog
 * Запуск: node scripts/test-api.js
 */

const https = require('https');
const http = require('http');

// const BASE_URL = 'http://localhost:3000';

// Цвета для консоли
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// Функция для HTTP запросов
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const protocol = options.protocol === 'https:' ? https : http;

    const req = protocol.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Функция для вывода результатов
function logResult(testName, success, message = '') {
  const status = success ? '✅' : '❌';
  const color = success ? colors.green : colors.red;
  console.log(`${color}${status} ${testName}${colors.reset} ${message}`);
}

// Основная функция тестирования
async function runTests() {
  console.log(`${colors.blue}🚀 Запуск автоматизированного тестирования Library Catalog API${colors.reset}`);
  console.log('='.repeat(60));
  console.log('');

  let token = '';
  let bookId = '';
  let testResults = { passed: 0, failed: 0 };

  try {
    // Тест 1: Health Check
    console.log(`${colors.yellow}1. Проверка Health Endpoint${colors.reset}`);
    const healthResponse = await makeRequest({
      method: 'GET',
      hostname: 'localhost',
      port: 3000,
      path: '/api/health',
      headers: { 'Content-Type': 'application/json' }
    });

    const healthSuccess = healthResponse.statusCode === 200;
    logResult('Health Check', healthSuccess, `Status: ${healthResponse.statusCode}`);
    if (healthSuccess) testResults.passed++; else testResults.failed++;

    // Тест 2: Попытка входа, если не удается - регистрация
    console.log(`${colors.yellow}2. Аутентификация пользователя${colors.reset}`);
    
    // Сначала пытаемся войти в систему
    const loginResponse = await makeRequest({
      method: 'POST',
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      headers: { 'Content-Type': 'application/json' }
    }, {
      email: 'test@example.com',
      password: 'password123'
    });

    let authSuccess = false;
    
    if (loginResponse.statusCode === 200) {
      // Пользователь существует, используем токен из входа
      const loginData = JSON.parse(loginResponse.body);
      token = loginData.token;
      console.log(`   Вход в систему успешен, токен получен: ${token.substring(0, 20)}...`);
      authSuccess = true;
      logResult('Вход в систему', true, `Status: ${loginResponse.statusCode}`);
    } else {
      // Пользователь не существует, регистрируемся
      console.log(`   Пользователь не найден, выполняем регистрацию...`);
      const registerResponse = await makeRequest({
        method: 'POST',
        hostname: 'localhost',
        port: 3000,
        path: '/api/auth/register',
        headers: { 'Content-Type': 'application/json' }
      }, {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      });

      if (registerResponse.statusCode === 201) {
        const registerData = JSON.parse(registerResponse.body);
        token = registerData.token;
        console.log(`   Регистрация успешна, токен получен: ${token.substring(0, 20)}...`);
        authSuccess = true;
        logResult('Регистрация пользователя', true, `Status: ${registerResponse.statusCode}`);
      } else {
        logResult('Аутентификация', false, `Status: ${registerResponse.statusCode}`);
      }
    }

    if (authSuccess) {
      testResults.passed++;
    } else {
      testResults.failed++;
    }

    // Тест 3: Получение профиля
    console.log(`${colors.yellow}3. Получение профиля${colors.reset}`);
    const profileResponse = await makeRequest({
      method: 'GET',
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/profile',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const profileSuccess = profileResponse.statusCode === 200;
    logResult('Получение профиля', profileSuccess, `Status: ${profileResponse.statusCode}`);
    if (profileSuccess) testResults.passed++; else testResults.failed++;

    // Тест 4: Создание книги
    console.log(`${colors.yellow}4. Создание книги${colors.reset}`);
    const createBookResponse = await makeRequest({
      method: 'POST',
      hostname: 'localhost',
      port: 3000,
      path: '/api/books',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }, {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '978-0-7432-7356-5',
      description: 'A classic American novel about the Jazz Age',
      publishedAt: '1925-04-10T00:00:00.000Z'
    });

    const createBookSuccess = createBookResponse.statusCode === 201;
    logResult('Создание книги', createBookSuccess, `Status: ${createBookResponse.statusCode}`);

    if (createBookSuccess) {
      const bookData = JSON.parse(createBookResponse.body);
      bookId = bookData.data.id;
      console.log(`   ID книги: ${bookId}`);
      testResults.passed++;
    } else {
      testResults.failed++;
    }

    // Тест 5: Получение списка книг
    console.log(`${colors.yellow}5. Получение списка книг${colors.reset}`);
    const getBooksResponse = await makeRequest({
      method: 'GET',
      hostname: 'localhost',
      port: 3000,
      path: '/api/books',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const getBooksSuccess = getBooksResponse.statusCode === 200;
    logResult('Получение списка книг', getBooksSuccess, `Status: ${getBooksResponse.statusCode}`);
    if (getBooksSuccess) testResults.passed++; else testResults.failed++;

    // Тест 6: Получение книги по ID
    console.log(`${colors.yellow}6. Получение книги по ID${colors.reset}`);
    const getBookResponse = await makeRequest({
      method: 'GET',
      hostname: 'localhost',
      port: 3000,
      path: `/api/books/${bookId}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const getBookSuccess = getBookResponse.statusCode === 200;
    logResult('Получение книги по ID', getBookSuccess, `Status: ${getBookResponse.statusCode}`);
    if (getBookSuccess) testResults.passed++; else testResults.failed++;

    // Тест 7: Обновление книги
    console.log(`${colors.yellow}7. Обновление книги${colors.reset}`);
    const updateBookResponse = await makeRequest({
      method: 'PUT',
      hostname: 'localhost',
      port: 3000,
      path: `/api/books/${bookId}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }, {
      title: 'The Great Gatsby (Updated)',
      description: 'An updated description of this classic novel'
    });

    const updateBookSuccess = updateBookResponse.statusCode === 200;
    logResult('Обновление книги', updateBookSuccess, `Status: ${updateBookResponse.statusCode}`);
    if (updateBookSuccess) testResults.passed++; else testResults.failed++;

    // Тест 8: Поиск книг
    console.log(`${colors.yellow}8. Поиск книг${colors.reset}`);
    const searchBooksResponse = await makeRequest({
      method: 'GET',
      hostname: 'localhost',
      port: 3000,
      path: '/api/books?search=gatsby&limit=5',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const searchBooksSuccess = searchBooksResponse.statusCode === 200;
    logResult('Поиск книг', searchBooksSuccess, `Status: ${searchBooksResponse.statusCode}`);
    if (searchBooksSuccess) testResults.passed++; else testResults.failed++;

    // Тест 9: Тест без аутентификации
    console.log(`${colors.yellow}9. Тест без аутентификации${colors.reset}`);
    const unauthResponse = await makeRequest({
      method: 'GET',
      hostname: 'localhost',
      port: 3000,
      path: '/api/books',
      headers: { 'Content-Type': 'application/json' }
    });

    const unauthSuccess = unauthResponse.statusCode === 401;
    logResult('Тест без аутентификации', unauthSuccess, `Status: ${unauthResponse.statusCode}`);
    if (unauthSuccess) testResults.passed++; else testResults.failed++;

    // Тест 10: Тест с неверным токеном
    console.log(`${colors.yellow}10. Тест с неверным токеном${colors.reset}`);
    const invalidTokenResponse = await makeRequest({
      method: 'GET',
      hostname: 'localhost',
      port: 3000,
      path: '/api/books',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer invalid-token'
      }
    });

    const invalidTokenSuccess = invalidTokenResponse.statusCode === 401;
    logResult('Тест с неверным токеном', invalidTokenSuccess, `Status: ${invalidTokenResponse.statusCode}`);
    if (invalidTokenSuccess) testResults.passed++; else testResults.failed++;

    // Тест 11: Тест валидации
    console.log(`${colors.yellow}11. Тест валидации данных${colors.reset}`);
    const validationResponse = await makeRequest({
      method: 'POST',
      hostname: 'localhost',
      port: 3000,
      path: '/api/books',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }, {
      title: '', // Пустое название должно вызвать ошибку валидации
      author: 'Test Author'
    });

    const validationSuccess = validationResponse.statusCode === 400;
    logResult('Тест валидации данных', validationSuccess, `Status: ${validationResponse.statusCode}`);
    if (validationSuccess) testResults.passed++; else testResults.failed++;

    // Тест 12: Удаление книги
    console.log(`${colors.yellow}12. Удаление книги${colors.reset}`);
    const deleteBookResponse = await makeRequest({
      method: 'DELETE',
      hostname: 'localhost',
      port: 3000,
      path: `/api/books/${bookId}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const deleteBookSuccess = deleteBookResponse.statusCode === 200;
    logResult('Удаление книги', deleteBookSuccess, `Status: ${deleteBookResponse.statusCode}`);
    if (deleteBookSuccess) testResults.passed++; else testResults.failed++;

    // Тест 13: Проверка удаления
    console.log(`${colors.yellow}13. Проверка удаления книги${colors.reset}`);
    const checkDeletedResponse = await makeRequest({
      method: 'GET',
      hostname: 'localhost',
      port: 3000,
      path: `/api/books/${bookId}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const checkDeletedSuccess = checkDeletedResponse.statusCode === 404;
    logResult('Проверка удаления книги', checkDeletedSuccess, `Status: ${checkDeletedResponse.statusCode}`);
    if (checkDeletedSuccess) testResults.passed++; else testResults.failed++;

  } catch (error) {
    console.error(`${colors.red}❌ Ошибка при выполнении тестов: ${error.message}${colors.reset}`);
    testResults.failed++;
  }

  // Итоговая статистика
  console.log('');
  console.log('='.repeat(60));
  console.log(`${colors.blue}📊 Итоговая статистика:${colors.reset}`);
  console.log(`${colors.green}✅ Пройдено: ${testResults.passed}${colors.reset}`);
  console.log(`${colors.red}❌ Провалено: ${testResults.failed}${colors.reset}`);
  console.log(`📈 Общий процент успеха: ${Math.round((testResults.passed / (testResults.passed + testResults.failed)) * 100)}%`);
  console.log('');

  if (testResults.failed === 0) {
    console.log(`${colors.green}🎉 Все тесты прошли успешно!${colors.reset}`);
  } else {
    console.log(`${colors.yellow}⚠️  Некоторые тесты не прошли. Проверьте настройки сервера.${colors.reset}`);
  }

  console.log('');
  console.log(`${colors.blue}💡 Для просмотра документации API откройте: http://localhost:3000/api-docs${colors.reset}`);
}

// Запуск тестов
runTests().catch(console.error);
