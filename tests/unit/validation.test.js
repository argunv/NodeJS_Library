const { z } = require('zod');
const { registerSchema, loginSchema, bookSchema, bookUpdateSchema } = require('../../middleware/validation');

describe('Validation Schemas', () => {
  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };

      expect(() => registerSchema.parse(validData)).not.toThrow();
    });

    it('should validate registration data without optional name', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123'
      };

      expect(() => registerSchema.parse(validData)).not.toThrow();
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123'
      };

      expect(() => registerSchema.parse(invalidData)).toThrow();
    });

    it('should reject short password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '123'
      };

      expect(() => registerSchema.parse(invalidData)).toThrow();
    });
  });

  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123'
      };

      expect(() => loginSchema.parse(validData)).not.toThrow();
    });

    it('should reject empty password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: ''
      };

      expect(() => loginSchema.parse(invalidData)).toThrow();
    });
  });

  describe('bookSchema', () => {
    it('should validate correct book data', () => {
      const validData = {
        title: 'Test Book',
        author: 'Test Author',
        isbn: '1234567890',
        description: 'A test book',
        publishedAt: '2023-01-01T00:00:00.000Z'
      };

      expect(() => bookSchema.parse(validData)).not.toThrow();
    });

    it('should validate book data with minimal required fields', () => {
      const validData = {
        title: 'Test Book',
        author: 'Test Author'
      };

      expect(() => bookSchema.parse(validData)).not.toThrow();
    });

    it('should reject empty title', () => {
      const invalidData = {
        title: '',
        author: 'Test Author'
      };

      expect(() => bookSchema.parse(invalidData)).toThrow();
    });

    it('should reject empty author', () => {
      const invalidData = {
        title: 'Test Book',
        author: ''
      };

      expect(() => bookSchema.parse(invalidData)).toThrow();
    });

    it('should reject invalid ISBN format', () => {
      const invalidData = {
        title: 'Test Book',
        author: 'Test Author',
        isbn: 'invalid-isbn-format'
      };

      expect(() => bookSchema.parse(invalidData)).toThrow();
    });

    it('should accept valid ISBN format', () => {
      const validData = {
        title: 'Test Book',
        author: 'Test Author',
        isbn: '123-456-789-0'
      };

      expect(() => bookSchema.parse(validData)).not.toThrow();
    });
  });

  describe('bookUpdateSchema', () => {
    it('should validate partial book update data', () => {
      const validData = {
        title: 'Updated Title'
      };

      expect(() => bookUpdateSchema.parse(validData)).not.toThrow();
    });

    it('should validate empty update data', () => {
      const validData = {};

      expect(() => bookUpdateSchema.parse(validData)).not.toThrow();
    });

    it('should reject invalid data in partial update', () => {
      const invalidData = {
        title: '',
        author: 'Valid Author'
      };

      expect(() => bookUpdateSchema.parse(invalidData)).toThrow();
    });
  });
});
