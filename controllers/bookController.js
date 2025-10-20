const prisma = require('../config/database');

// Получить все книги
const getAllBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, author } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (author) {
      where.author = { contains: author, mode: 'insensitive' };
    }

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.book.count({ where })
    ]);

    res.json({
      message: 'Books retrieved successfully',
      data: books,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get all books error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve books'
    });
  }
};

// Получить книгу по ID
const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await prisma.book.findUnique({
      where: { id }
    });

    if (!book) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Book not found'
      });
    }

    res.json({
      message: 'Book retrieved successfully',
      data: book
    });
  } catch (error) {
    console.error('Get book by ID error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve book'
    });
  }
};

// Создать новую книгу
const createBook = async (req, res) => {
  try {
    const bookData = req.body;

    // Проверяем уникальность ISBN, если он предоставлен
    if (bookData.isbn) {
      const existingBook = await prisma.book.findUnique({
        where: { isbn: bookData.isbn }
      });

      if (existingBook) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Book with this ISBN already exists'
        });
      }
    }

    const book = await prisma.book.create({
      data: bookData
    });

    res.status(201).json({
      message: 'Book created successfully',
      data: book
    });
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create book'
    });
  }
};

// Обновить книгу
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Проверяем, существует ли книга
    const existingBook = await prisma.book.findUnique({
      where: { id }
    });

    if (!existingBook) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Book not found'
      });
    }

    // Проверяем уникальность ISBN, если он изменяется
    if (updateData.isbn && updateData.isbn !== existingBook.isbn) {
      const bookWithSameISBN = await prisma.book.findUnique({
        where: { isbn: updateData.isbn }
      });

      if (bookWithSameISBN) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Book with this ISBN already exists'
        });
      }
    }

    const book = await prisma.book.update({
      where: { id },
      data: updateData
    });

    res.json({
      message: 'Book updated successfully',
      data: book
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update book'
    });
  }
};

// Удалить книгу
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    // Проверяем, существует ли книга
    const existingBook = await prisma.book.findUnique({
      where: { id }
    });

    if (!existingBook) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Book not found'
      });
    }

    await prisma.book.delete({
      where: { id }
    });

    res.json({
      message: 'Book deleted successfully'
    });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete book'
    });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};
