const request = require('supertest');
const app = require('../../app');

describe('Books API', () => {
  let authToken;

  beforeEach(async () => {
    // Создаем пользователя и получаем токен для каждого теста
    const userData = {
      email: `books${Date.now()}@example.com`,
      password: 'password123',
      name: 'Books User'
    };

    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(userData);

    // Проверяем, что регистрация прошла успешно
    if (registerResponse.status === 201 && registerResponse.body.token) {
      authToken = registerResponse.body.token;
    } else {
      // Если регистрация не удалась, попробуем войти
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        });
      
      if (loginResponse.status === 200 && loginResponse.body.token) {
        authToken = loginResponse.body.token;
      } else {
        throw new Error('Failed to authenticate for tests');
      }
    }
  });

  describe('GET /api/books', () => {
    it('should get all books (empty list initially)', async () => {
      const response = await request(app)
        .get('/api/books')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Books retrieved successfully');
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/books')
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Access denied');
    });
  });

  describe('POST /api/books', () => {
    it('should create a new book successfully', async () => {
      const bookData = {
        title: 'Test Book',
        author: 'Test Author',
        isbn: '1234567890',
        description: 'A test book description',
        publishedAt: '2023-01-01T00:00:00.000Z'
      };

      const response = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${authToken}`)
        .send(bookData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Book created successfully');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.title).toBe(bookData.title);
      expect(response.body.data.author).toBe(bookData.author);
    });

    it('should return 400 for invalid book data', async () => {
      const invalidBookData = {
        title: '', // Empty title should fail validation
        author: 'Test Author'
      };

      const response = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidBookData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation Error');
    });

    it('should return 401 without authentication', async () => {
      const bookData = {
        title: 'Test Book',
        author: 'Test Author'
      };

      const response = await request(app)
        .post('/api/books')
        .send(bookData)
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Access denied');
    });
  });

  describe('GET /api/books/:id', () => {
    let bookId;

    beforeEach(async () => {
      // Создаем книгу для тестов
      const bookData = {
        title: 'Test Book for Get',
        author: 'Test Author',
        isbn: '9876543210'
      };

      const createResponse = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${authToken}`)
        .send(bookData);

      bookId = createResponse.body.data.id;
    });

    it('should get a book by ID', async () => {
      const response = await request(app)
        .get(`/api/books/${bookId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Book retrieved successfully');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.id).toBe(bookId);
    });

    it('should return 404 for non-existent book', async () => {
      const nonExistentId = 'non-existent-id';

      const response = await request(app)
        .get(`/api/books/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Not Found');
    });
  });

  describe('PUT /api/books/:id', () => {
    let bookId;

    beforeEach(async () => {
      // Создаем книгу для тестов
      const bookData = {
        title: 'Test Book for Update',
        author: 'Test Author',
        isbn: '1111111111'
      };

      const createResponse = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${authToken}`)
        .send(bookData);

      bookId = createResponse.body.data.id;
    });

    it('should update a book successfully', async () => {
      const updateData = {
        title: 'Updated Book Title',
        author: 'Updated Author'
      };

      const response = await request(app)
        .put(`/api/books/${bookId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Book updated successfully');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.author).toBe(updateData.author);
    });

    it('should return 404 for non-existent book', async () => {
      const nonExistentId = 'non-existent-id';
      const updateData = {
        title: 'Updated Title'
      };

      const response = await request(app)
        .put(`/api/books/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Not Found');
    });
  });

  describe('DELETE /api/books/:id', () => {
    let bookId;

    beforeEach(async () => {
      // Создаем книгу для тестов
      const bookData = {
        title: 'Test Book for Delete',
        author: 'Test Author',
        isbn: '2222222222'
      };

      const createResponse = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${authToken}`)
        .send(bookData);

      bookId = createResponse.body.data.id;
    });

    it('should delete a book successfully', async () => {
      const response = await request(app)
        .delete(`/api/books/${bookId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Book deleted successfully');
    });

    it('should return 404 for non-existent book', async () => {
      const nonExistentId = 'non-existent-id';

      const response = await request(app)
        .delete(`/api/books/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Not Found');
    });
  });
});
