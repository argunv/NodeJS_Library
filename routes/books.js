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

// Маршруты для книг
router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.post('/', validate(bookSchema), createBook);
router.put('/:id', validate(bookUpdateSchema), updateBook);
router.delete('/:id', deleteBook);

module.exports = router;
