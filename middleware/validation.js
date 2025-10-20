const { z } = require('zod');

// Схемы валидации для аутентификации
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

// Схемы валидации для книг
const bookSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  author: z.string().min(1, 'Author is required').max(255, 'Author name too long'),
  isbn: z.string().optional().refine(
    (val) => !val || /^[\d-]+$/.test(val),
    'ISBN must contain only digits and hyphens'
  ),
  description: z.string().optional(),
  publishedAt: z.string().datetime().optional().transform((val) => val ? new Date(val) : undefined)
});

const bookUpdateSchema = bookSchema.partial();

// Middleware для валидации
const validate = (schema) => {
  return (req, res, next) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid input data',
          details: errors
        });
      }
      
      console.error('Validation error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Validation failed'
      });
    }
  };
};

module.exports = {
  registerSchema,
  loginSchema,
  bookSchema,
  bookUpdateSchema,
  validate
};
