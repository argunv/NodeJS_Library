const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Library Catalog API',
      version: '1.0.0',
      description: 'REST API для каталога книг с аутентификацией JWT',
      contact: {
        name: 'API Support',
        email: 'support@library.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Уникальный идентификатор пользователя'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email пользователя'
            },
            name: {
              type: 'string',
              description: 'Имя пользователя'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Дата создания'
            }
          }
        },
        Book: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Уникальный идентификатор книги'
            },
            title: {
              type: 'string',
              description: 'Название книги'
            },
            author: {
              type: 'string',
              description: 'Автор книги'
            },
            isbn: {
              type: 'string',
              description: 'ISBN книги'
            },
            description: {
              type: 'string',
              description: 'Описание книги'
            },
            publishedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Дата публикации'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Дата создания записи'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Дата последнего обновления'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Тип ошибки'
            },
            message: {
              type: 'string',
              description: 'Сообщение об ошибке'
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string'
                  },
                  message: {
                    type: 'string'
                  }
                }
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './controllers/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs;
