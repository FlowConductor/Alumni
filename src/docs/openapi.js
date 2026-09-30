// OpenAPI 3.0 specification for the MIS Alumni Portal API.
// Served by Swagger UI at /api-docs (see server.js).

module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'MIS Alumni Portal API',
    version: '0.1.0',
    description:
      'Alumni tracking system and portal for graduates of the Istanbul University, ' +
      'Faculty of Economics, Department of Management Information Systems (MIS). ' +
      'Starter routes; data is file-backed (no database yet).',
  },
  servers: [{ url: 'http://localhost:3000' }],
  tags: [
    { name: 'General', description: 'Temporary and health-check routes' },
    { name: 'Alumni', description: 'Alumni directory starter endpoints' },
    { name: 'Users', description: 'User CRUD endpoints (persisted to data/users.json)' },
  ],
  paths: {
    '/': {
      get: {
        tags: ['General'],
        summary: 'Landing check',
        description: 'Returns the text "ok"; will serve as the temporary main page.',
        responses: { 200: { description: 'Server is up' } },
      },
    },
    '/about': {
      get: {
        tags: ['General'],
        summary: 'Temporary about page (HTML)',
        responses: { 200: { description: 'HTML about page' } },
      },
    },
    '/hello': {
      get: {
        tags: ['General'],
        summary: 'Generic greeting',
        responses: { 200: { description: 'Returns "Hello, World!"' } },
      },
    },
    '/hello/{name}': {
      get: {
        tags: ['General'],
        summary: 'Personalized greeting',
        parameters: [
          { name: 'name', in: 'path', required: true, schema: { type: 'string' }, example: 'senol' },
        ],
        responses: { 200: { description: 'Returns "Hello, {name}!"' } },
      },
    },
    '/sum/{number1}/{number2}': {
      get: {
        tags: ['General'],
        summary: 'Sum two numbers',
        parameters: [
          { name: 'number1', in: 'path', required: true, schema: { type: 'number' }, example: 2 },
          { name: 'number2', in: 'path', required: true, schema: { type: 'number' }, example: 3 },
        ],
        responses: {
          200: {
            description: 'Sum of the two numbers',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    number1: { type: 'number' },
                    number2: { type: 'number' },
                    sum: { type: 'number' },
                  },
                },
              },
            },
          },
          400: { description: 'Route parameters are not numbers' },
        },
      },
    },
    '/api/health': {
      get: {
        tags: ['General'],
        summary: 'Health check',
        responses: {
          200: {
            description: 'Server health information',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    uptime: { type: 'number', description: 'Seconds since server start' },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/alumni': {
      get: {
        tags: ['Alumni'],
        summary: 'List alumni (in-memory seed data)',
        responses: {
          200: {
            description: 'Alumni records',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Alumnus' } },
              },
            },
          },
        },
      },
      post: {
        tags: ['Alumni'],
        summary: 'Create an alumnus (in-memory)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AlumnusInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Created alumnus',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Alumnus' } },
            },
          },
          400: { description: 'Validation error' },
        },
      },
    },
    '/api/users': {
      get: {
        tags: ['Users'],
        summary: 'List all saved users',
        responses: {
          200: {
            description: 'User records from data/users.json',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/User' } },
              },
            },
          },
        },
      },
      post: {
        tags: ['Users'],
        summary: 'Create a user (persisted to data/users.json)',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/UserInput' } },
          },
        },
        responses: {
          201: {
            description: 'Created user (username and email)',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/UserCreated' } },
            },
          },
          400: { description: 'Validation error' },
        },
      },
    },
    '/api/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Get a single user by id',
        parameters: [{ $ref: '#/components/parameters/UserId' }],
        responses: {
          200: {
            description: 'The user record',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/User' } },
            },
          },
          404: { description: 'User not found' },
        },
      },
      put: {
        tags: ['Users'],
        summary: 'Update a user by id (partial updates allowed)',
        parameters: [{ $ref: '#/components/parameters/UserId' }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/UserInput' } },
          },
        },
        responses: {
          200: {
            description: 'Updated user',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/User' } },
            },
          },
          404: { description: 'User not found' },
        },
      },
      patch: {
        tags: ['Users'],
        summary: 'Partially update a user by id',
        parameters: [{ $ref: '#/components/parameters/UserId' }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/UserInput' } },
          },
        },
        responses: {
          200: {
            description: 'Updated user',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/User' } },
            },
          },
          404: { description: 'User not found' },
        },
      },
      delete: {
        tags: ['Users'],
        summary: 'Delete a user by id',
        parameters: [{ $ref: '#/components/parameters/UserId' }],
        responses: {
          200: {
            description: 'The removed user record',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/User' } },
            },
          },
          404: { description: 'User not found' },
        },
      },
    },
  },
  components: {
    parameters: {
      UserId: {
        name: 'id',
        in: 'path',
        required: true,
        description: 'Numeric user id',
        schema: { type: 'integer', minimum: 1 },
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          username: { type: 'string', example: 'senol' },
          email: { type: 'string', format: 'email', example: 'senol@example.com' },
        },
      },
      UserCreated: {
        type: 'object',
        properties: {
          username: { type: 'string', example: 'senol' },
          email: { type: 'string', format: 'email', example: 'senol@example.com' },
        },
      },
      UserInput: {
        type: 'object',
        required: ['username', 'email'],
        properties: {
          username: { type: 'string', example: 'senol' },
          email: { type: 'string', format: 'email', example: 'senol@example.com' },
        },
      },
      Alumnus: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string', example: 'Ahmet Yilmaz' },
          graduationYear: { type: 'integer', example: 2015 },
          email: { type: 'string', format: 'email', example: 'ahmet.yilmaz@example.com' },
        },
      },
      AlumnusInput: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', example: 'Ahmet Yilmaz' },
          graduationYear: { type: 'integer', example: 2015 },
          email: { type: 'string', format: 'email', example: 'ahmet.yilmaz@example.com' },
        },
      },
    },
  },
};
