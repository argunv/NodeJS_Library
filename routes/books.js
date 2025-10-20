const express = require('express');
const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');
const { authenticateToken } = require('../middleware/auth');
const { validate, bookSchema, bookUpdateSchema } = require('../middleware/validation');

const router = express.Router();

// Все маршруты требуют аутентификации
router.use(authenticateToken);

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Получить список всех книг
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Номер страницы
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Количество книг на странице
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Поиск по названию, автору или описанию
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Фильтр по автору
 *     responses:
 *       200:
 *         description: Список книг получен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       401:
 *         description: Не авторизован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getAllBooks);

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Получить книгу по ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID книги
 *     responses:
 *       200:
 *         description: Книга найдена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Book'
 *       404:
 *         description: Книга не найдена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Не авторизован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', getBookById);

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Создать новую книгу
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 255
 *                 description: Название книги
 *               author:
 *                 type: string
 *                 maxLength: 255
 *                 description: Автор книги
 *               isbn:
 *                 type: string
 *                 pattern: '^[\d-]+$'
 *                 description: ISBN книги (только цифры и дефисы)
 *               description:
 *                 type: string
 *                 description: Описание книги
 *               publishedAt:
 *                 type: string
 *                 format: date-time
 *                 description: Дата публикации
 *     responses:
 *       201:
 *         description: Книга создана
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Book'
 *       400:
 *         description: Ошибка валидации или книга с таким ISBN уже существует
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Не авторизован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', validate(bookSchema), createBook);

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Обновить книгу
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID книги
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 255
 *                 description: Название книги
 *               author:
 *                 type: string
 *                 maxLength: 255
 *                 description: Автор книги
 *               isbn:
 *                 type: string
 *                 pattern: '^[\d-]+$'
 *                 description: ISBN книги (только цифры и дефисы)
 *               description:
 *                 type: string
 *                 description: Описание книги
 *               publishedAt:
 *                 type: string
 *                 format: date-time
 *                 description: Дата публикации
 *     responses:
 *       200:
 *         description: Книга обновлена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Book'
 *       404:
 *         description: Книга не найдена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Ошибка валидации или книга с таким ISBN уже существует
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Не авторизован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', validate(bookUpdateSchema), updateBook);

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Удалить книгу
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID книги
 *     responses:
 *       200:
 *         description: Книга удалена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Книга не найдена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Не авторизован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', deleteBook);

module.exports = router;
