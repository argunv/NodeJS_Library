// Статическая конфигурация Swagger без зависимостей от уязвимых пакетов
const specs = {
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
  ],
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Регистрация пользователя',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'name'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 6 },
                  name: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Пользователь успешно зарегистрирован',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    user: { $ref: '#/components/schemas/User' }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Ошибка валидации',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/api/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Вход пользователя',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Успешный вход',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: { type: 'string' },
                    user: { $ref: '#/components/schemas/User' }
                  }
                }
              }
            }
          },
          '401': {
            description: 'Неверные учетные данные',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/api/books': {
      get: {
        tags: ['Books'],
        summary: 'Получить список книг',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Список книг',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Book' }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Books'],
        summary: 'Создать новую книгу',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'author'],
                properties: {
                  title: { type: 'string' },
                  author: { type: 'string' },
                  isbn: { type: 'string' },
                  description: { type: 'string' },
                  publishedAt: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Книга успешно создана',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Book' }
              }
            }
          }
        }
      }
    },
    '/api/books/{id}': {
      get: {
        tags: ['Books'],
        summary: 'Получить книгу по ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Информация о книге',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Book' }
              }
            }
          },
          '404': {
            description: 'Книга не найдена',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      },
      put: {
        tags: ['Books'],
        summary: 'Обновить книгу',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  author: { type: 'string' },
                  isbn: { type: 'string' },
                  description: { type: 'string' },
                  publishedAt: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Книга успешно обновлена',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Book' }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Books'],
        summary: 'Удалить книгу',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '204': {
            description: 'Книга успешно удалена'
          }
        }
      }
    }
  }
};

module.exports = specs;
