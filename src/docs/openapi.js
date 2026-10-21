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
    { name: 'Users (Web)', description: 'HTML pages and form endpoints for users' },
    { name: 'Announcements', description: 'Announcement CRUD endpoints (persisted to data/announcements.json)' },
    { name: 'Announcements (Web)', description: 'HTML pages and form endpoints for announcements' },
    { name: 'Donations', description: 'Donation CRUD endpoints (donate table, joined to users)' },
    { name: 'Job Postings', description: 'Job posting CRUD endpoints (job_postings table, optionally joined to users)' },
    { name: 'Job Applications', description: 'Job application CRUD endpoints (job_applications table, joined to users and job_postings)' },
    { name: 'Job Postings (Web)', description: 'HTML pages and form endpoints for job postings and applications' },
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
    '/api/announcements': {
      get: {
        tags: ['Announcements'],
        summary: 'List all saved announcements',
        responses: {
          200: {
            description: 'Announcement records',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Announcement' } },
              },
            },
          },
        },
      },
      post: {
        tags: ['Announcements'],
        summary: 'Create an announcement (persisted to data/announcements.json)',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/AnnouncementInput' } },
          },
        },
        responses: {
          201: {
            description: 'Created announcement',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Announcement' } },
            },
          },
          400: { description: 'Validation error' },
        },
      },
    },
    '/api/announcements/{id}': {
      get: {
        tags: ['Announcements'],
        summary: 'Get a single announcement by id',
        parameters: [{ $ref: '#/components/parameters/Id' }],
        responses: {
          200: {
            description: 'The announcement record',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Announcement' } },
            },
          },
          404: { description: 'Announcement not found' },
        },
      },
      put: {
        tags: ['Announcements'],
        summary: 'Update an announcement by id (partial updates allowed)',
        parameters: [{ $ref: '#/components/parameters/Id' }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/AnnouncementInput' } },
          },
        },
        responses: {
          200: {
            description: 'Updated announcement',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Announcement' } },
            },
          },
          404: { description: 'Announcement not found' },
        },
      },
      patch: {
        tags: ['Announcements'],
        summary: 'Partially update an announcement by id',
        parameters: [{ $ref: '#/components/parameters/Id' }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/AnnouncementInput' } },
          },
        },
        responses: {
          200: {
            description: 'Updated announcement',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Announcement' } },
            },
          },
          404: { description: 'Announcement not found' },
        },
      },
      delete: {
        tags: ['Announcements'],
        summary: 'Delete an announcement by id',
        parameters: [{ $ref: '#/components/parameters/Id' }],
        responses: {
          200: {
            description: 'The removed announcement record',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Announcement' } },
            },
          },
          404: { description: 'Announcement not found' },
        },
      },
    },
    '/announcements': {
      get: {
        tags: ['Announcements (Web)'],
        summary: 'Web page listing all announcements (HTML)',
        responses: { 200: { description: 'HTML page with a table of all announcements' } },
      },
      post: {
        tags: ['Announcements (Web)'],
        summary: 'Create an announcement from an HTML form',
        requestBody: {
          required: true,
          content: {
            'application/x-www-form-urlencoded': {
              schema: { $ref: '#/components/schemas/AnnouncementInput' },
            },
          },
        },
        responses: {
          302: { description: 'Redirects to /announcements' },
          400: { description: 'Missing title or content (HTML error page)' },
        },
      },
    },
    '/announcements/new': {
      get: {
        tags: ['Announcements (Web)'],
        summary: 'Form page for creating an announcement (HTML)',
        responses: { 200: { description: 'HTML create form' } },
      },
    },
    '/announcements/{id}': {
      get: {
        tags: ['Announcements (Web)'],
        summary: 'Web page for a single announcement (HTML)',
        parameters: [{ $ref: '#/components/parameters/Id' }],
        responses: {
          200: { description: 'HTML page for the announcement' },
          404: { description: 'Announcement not found (HTML error page)' },
        },
      },
      post: {
        tags: ['Announcements (Web)'],
        summary: 'Update an announcement from an HTML form',
        parameters: [{ $ref: '#/components/parameters/Id' }],
        requestBody: {
          required: true,
          content: {
            'application/x-www-form-urlencoded': {
              schema: { $ref: '#/components/schemas/AnnouncementInput' },
            },
          },
        },
        responses: {
          302: { description: 'Redirects to /announcements/{id}' },
          400: { description: 'Invalid input (HTML error page)' },
          404: { description: 'Announcement not found (HTML error page)' },
        },
      },
    },
    '/announcements/{id}/edit': {
      get: {
        tags: ['Announcements (Web)'],
        summary: 'Form page for editing an announcement (HTML)',
        parameters: [{ $ref: '#/components/parameters/Id' }],
        responses: {
          200: { description: 'HTML edit form prefilled with the announcement' },
          404: { description: 'Announcement not found (HTML error page)' },
        },
      },
    },
    '/announcements/{id}/delete': {
      post: {
        tags: ['Announcements (Web)'],
        summary: 'Delete an announcement from an HTML form',
        parameters: [{ $ref: '#/components/parameters/Id' }],
        responses: {
          302: { description: 'Redirects to /announcements' },
          404: { description: 'Announcement not found (HTML error page)' },
        },
      },
    },
    '/api/donations': {
      get: {
        tags: ['Donations'],
        summary: 'List all donations (joined with donor usernames)',
        responses: {
          200: {
            description: 'Donation records',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Donation' } } } },
          },
        },
      },
      post: {
        tags: ['Donations'],
        summary: 'Create a donation',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/DonationInput' } } },
        },
        responses: {
          201: { description: 'Created donation', content: { 'application/json': { schema: { $ref: '#/components/schemas/Donation' } } } },
          400: { description: 'Validation error' },
          404: { description: 'Referenced user does not exist' },
        },
      },
    },
    '/api/donations/{id}': {
      get: {
        tags: ['Donations'],
        summary: 'Get a single donation by id',
        parameters: [{ $ref: '#/components/parameters/Id' }],
        responses: {
          200: { description: 'The donation record', content: { 'application/json': { schema: { $ref: '#/components/schemas/Donation' } } } },
          404: { description: 'Donation not found' },
        },
      },
      put: {
        tags: ['Donations'],
        summary: 'Update a donation by id (partial updates allowed)',
        parameters: [{ $ref: '#/components/parameters/Id' }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/DonationUpdate' } } },
        },
        responses: {
          200: { description: 'Updated donation', content: { 'application/json': { schema: { $ref: '#/components/schemas/Donation' } } } },
          404: { description: 'Donation not found' },
        },
      },
      patch: {
        tags: ['Donations'],
        summary: 'Partially update a donation by id',
        parameters: [{ $ref: '#/components/parameters/Id' }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/DonationUpdate' } } },
        },
        responses: {
          200: { description: 'Updated donation', content: { 'application/json': { schema: { $ref: '#/components/schemas/Donation' } } } },
          404: { description: 'Donation not found' },
        },
      },
      delete: {
        tags: ['Donations'],
        summary: 'Delete a donation by id',
        parameters: [{ $ref: '#/components/parameters/Id' }],
        responses: {
          200: { description: 'The removed donation record', content: { 'application/json': { schema: { $ref: '#/components/schemas/Donation' } } } },
          404: { description: 'Donation not found' },
        },
      },
    },
    '/api/job-postings': {
      get: {
        tags: ['Job Postings'],
        summary: 'List all job postings (with poster usernames when set)',
        responses: {
          200: {
            description: 'Job posting records',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/JobPosting' } } } },
          },
        },
      },
      post: {
        tags: ['Job Postings'],
        summary: 'Create a job posting',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/JobPostingInput' } } },
        },
        responses: {
          201: { description: 'Created job posting', content: { 'application/json': { schema: { $ref: '#/components/schemas/JobPosting' } } } },
          400: { description: 'Validation error' },
          404: { description: 'Referenced user (posted_by) does not exist' },
        },
      },
    },
    '/api/job-postings/{id}': {
      get: {
        tags: ['Job Postings'],
        summary: 'Get a single job posting by id',
        parameters: [{ $ref: '#/components/parameters/Id' }],
        responses: {
          200: { description: 'The job posting record', content: { 'application/json': { schema: { $ref: '#/components/schemas/JobPosting' } } } },
          404: { description: 'Job posting not found' },
        },
      },
      put: {
        tags: ['Job Postings'],
        summary: 'Update a job posting by id (partial updates allowed)',
        parameters: [{ $ref: '#/components/parameters/Id' }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/JobPostingInput' } } },
        },
        responses: {
          200: { description: 'Updated job posting', content: { 'application/json': { schema: { $ref: '#/components/schemas/JobPosting' } } } },
          404: { description: 'Job posting not found' },
        },
      },
      patch: {
        tags: ['Job Postings'],
        summary: 'Partially update a job posting by id',
        parameters: [{ $ref: '#/components/parameters/Id' }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/JobPostingInput' } } },
        },
        responses: {
          200: { description: 'Updated job posting', content: { 'application/json': { schema: { $ref: '#/components/schemas/JobPosting' } } } },
          404: { description: 'Job posting not found' },
        },
      },
      delete: {
        tags: ['Job Postings'],
        summary: 'Delete a job posting by id',
        parameters: [{ $ref: '#/components/parameters/Id' }],
        responses: {
          200: { description: 'The removed job posting record', content: { 'application/json': { schema: { $ref: '#/components/schemas/JobPosting' } } } },
          404: { description: 'Job posting not found' },
        },
      },
    },
    '/api/users/{userId}/donations': {
      get: {
        tags: ['Donations'],
        summary: 'Nested route: list donations made by one user',
        parameters: [{ $ref: '#/components/parameters/UserId' }],
        responses: {
          200: { description: 'The user\u0027s donations', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Donation' } } } } },
          404: { description: 'User not found' },
        },
      },
    },
    '/api/users/{userId}/job-postings': {
      get: {
        tags: ['Job Postings'],
        summary: 'Nested route: list job postings published by one user',
        parameters: [{ $ref: '#/components/parameters/UserId' }],
        responses: {
          200: { description: 'The user\u0027s job postings', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/JobPosting' } } } } },
          404: { description: 'User not found' },
        },
      },
    },
    '/api/applications': {
      get: {
        tags: ['Job Applications'],
        summary: 'List all job applications (joined with applicant and posting)',
        responses: {
          200: {
            description: 'Application records',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/JobApplication' } } } },
          },
        },
      },
      post: {
        tags: ['Job Applications'],
        summary: 'Apply to a job posting (one application per user per posting)',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/JobApplicationInput' } } },
        },
        responses: {
          201: { description: 'Created application', content: { 'application/json': { schema: { $ref: '#/components/schemas/JobApplication' } } } },
          400: { description: 'Validation error' },
          404: { description: 'Referenced job posting or user does not exist' },
          409: { description: 'User already applied to this posting' },
        },
      },
    },
    '/api/applications/{id}': {
      get: {
        tags: ['Job Applications'],
        summary: 'Get a single application by id',
        parameters: [{ $ref: '#/components/parameters/Id' }],
        responses: {
          200: { description: 'The application record', content: { 'application/json': { schema: { $ref: '#/components/schemas/JobApplication' } } } },
          404: { description: 'Application not found' },
        },
      },
      put: {
        tags: ['Job Applications'],
        summary: 'Update an application by id (e.g. status or cover letter)',
        parameters: [{ $ref: '#/components/parameters/Id' }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/JobApplicationUpdate' } } },
        },
        responses: {
          200: { description: 'Updated application', content: { 'application/json': { schema: { $ref: '#/components/schemas/JobApplication' } } } },
          404: { description: 'Application not found' },
        },
      },
      patch: {
        tags: ['Job Applications'],
        summary: 'Partially update an application by id',
        parameters: [{ $ref: '#/components/parameters/Id' }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/JobApplicationUpdate' } } },
        },
        responses: {
          200: { description: 'Updated application', content: { 'application/json': { schema: { $ref: '#/components/schemas/JobApplication' } } } },
          404: { description: 'Application not found' },
        },
      },
      delete: {
        tags: ['Job Applications'],
        summary: 'Delete an application by id',
        parameters: [{ $ref: '#/components/parameters/Id' }],
        responses: {
          200: { description: 'The removed application record', content: { 'application/json': { schema: { $ref: '#/components/schemas/JobApplication' } } } },
          404: { description: 'Application not found' },
        },
      },
    },
    '/api/users/{userId}/applications': {
      get: {
        tags: ['Job Applications'],
        summary: 'Nested route: applications made by one user',
        parameters: [{ $ref: '#/components/parameters/UserId' }],
        responses: {
          200: { description: 'The user\u0027s applications', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/JobApplication' } } } } },
          404: { description: 'User not found' },
        },
      },
    },
    '/api/job-postings/{id}/applications': {
      get: {
        tags: ['Job Applications'],
        summary: 'Nested route: applications received by one job posting',
        parameters: [{ $ref: '#/components/parameters/Id' }],
        responses: {
          200: { description: 'The posting\u0027s applications', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/JobApplication' } } } } },
          404: { description: 'Job posting not found' },
        },
      },
    },
    '/job-postings': {
      get: {
        tags: ['Job Postings (Web)'],
        summary: 'Web page listing all job postings (HTML)',
        responses: { 200: { description: 'HTML page with a table of all postings' } },
      },
      post: {
        tags: ['Job Postings (Web)'],
        summary: 'Create a job posting from an HTML form',
        requestBody: {
          required: true,
          content: { 'application/x-www-form-urlencoded': { schema: { $ref: '#/components/schemas/JobPostingInput' } } },
        },
        responses: {
          302: { description: 'Redirects to /job-postings' },
          400: { description: 'Invalid input (HTML error page)' },
          404: { description: 'posted_by user not found (HTML error page)' },
        },
      },
    },
    '/job-postings/new': {
      get: {
        tags: ['Job Postings (Web)'],
        summary: 'Form page for creating a job posting (HTML)',
        responses: { 200: { description: 'HTML create form' } },
      },
    },
    '/job-postings/{id}': {
      get: {
        tags: ['Job Postings (Web)'],
        summary: 'Web page for one posting with its applications and an apply form (HTML)',
        parameters: [{ $ref: '#/components/parameters/Id' }],
        responses: {
          200: { description: 'HTML posting detail page' },
          404: { description: 'Job posting not found (HTML error page)' },
        },
      },
      post: {
        tags: ['Job Postings (Web)'],
        summary: 'Update a job posting from an HTML form',
        parameters: [{ $ref: '#/components/parameters/Id' }],
        requestBody: {
          required: true,
          content: { 'application/x-www-form-urlencoded': { schema: { $ref: '#/components/schemas/JobPostingInput' } } },
        },
        responses: {
          302: { description: 'Redirects to /job-postings/{id}' },
          400: { description: 'Invalid input (HTML error page)' },
          404: { description: 'Posting or posted_by user not found (HTML error page)' },
        },
      },
    },
    '/job-postings/{id}/edit': {
      get: {
        tags: ['Job Postings (Web)'],
        summary: 'Form page for editing a job posting (HTML)',
        parameters: [{ $ref: '#/components/parameters/Id' }],
        responses: {
          200: { description: 'HTML edit form prefilled with the posting' },
          404: { description: 'Job posting not found (HTML error page)' },
        },
      },
    },
    '/job-postings/{id}/delete': {
      post: {
        tags: ['Job Postings (Web)'],
        summary: 'Delete a job posting from an HTML form',
        parameters: [{ $ref: '#/components/parameters/Id' }],
        responses: {
          302: { description: 'Redirects to /job-postings' },
          404: { description: 'Job posting not found (HTML error page)' },
          409: { description: 'Posting still has applications (HTML error page)' },
        },
      },
    },
    '/job-postings/{id}/apply': {
      post: {
        tags: ['Job Postings (Web)'],
        summary: 'Apply to a job posting from the HTML form on the details page',
        parameters: [{ $ref: '#/components/parameters/Id' }],
        requestBody: {
          required: true,
          content: {
            'application/x-www-form-urlencoded': {
              schema: {
                type: 'object',
                required: ['user_id'],
                properties: {
                  user_id: { type: 'integer', description: 'Applicant user id' },
                  cover_letter: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          302: { description: 'Redirects to /job-postings/{id}' },
          400: { description: 'Invalid input (HTML error page)' },
          404: { description: 'Posting or user not found (HTML error page)' },
          409: { description: 'User already applied (HTML error page)' },
        },
      },
    },
    '/users': {
      get: {
        tags: ['Users (Web)'],
        summary: 'Web page listing all users (HTML)',
        responses: { 200: { description: 'HTML page with a table of all users' } },
      },
      post: {
        tags: ['Users (Web)'],
        summary: 'Create a user from an HTML form',
        requestBody: {
          required: true,
          content: {
            'application/x-www-form-urlencoded': {
              schema: { $ref: '#/components/schemas/UserInput' },
            },
          },
        },
        responses: {
          302: { description: 'Redirects to /users' },
          400: { description: 'Missing username or email (HTML error page)' },
        },
      },
    },
    '/users/new': {
      get: {
        tags: ['Users (Web)'],
        summary: 'Form page for creating a user (HTML)',
        responses: { 200: { description: 'HTML create form' } },
      },
    },
    '/users/{id}': {
      get: {
        tags: ['Users (Web)'],
        summary: 'Web page for a single user (HTML)',
        parameters: [{ $ref: '#/components/parameters/UserId' }],
        responses: {
          200: { description: 'HTML page for the user' },
          404: { description: 'User not found (HTML error page)' },
        },
      },
      post: {
        tags: ['Users (Web)'],
        summary: 'Update a user from an HTML form',
        parameters: [{ $ref: '#/components/parameters/UserId' }],
        requestBody: {
          required: true,
          content: {
            'application/x-www-form-urlencoded': {
              schema: { $ref: '#/components/schemas/UserInput' },
            },
          },
        },
        responses: {
          302: { description: 'Redirects to /users/{id}' },
          400: { description: 'Invalid input (HTML error page)' },
          404: { description: 'User not found (HTML error page)' },
        },
      },
    },
    '/users/{id}/edit': {
      get: {
        tags: ['Users (Web)'],
        summary: 'Form page for editing a user (HTML)',
        parameters: [{ $ref: '#/components/parameters/UserId' }],
        responses: {
          200: { description: 'HTML edit form prefilled with the user' },
          404: { description: 'User not found (HTML error page)' },
        },
      },
    },
    '/users/{id}/delete': {
      post: {
        tags: ['Users (Web)'],
        summary: 'Delete a user from an HTML form',
        parameters: [{ $ref: '#/components/parameters/UserId' }],
        responses: {
          302: { description: 'Redirects to /users' },
          404: { description: 'User not found (HTML error page)' },
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
      Id: {
        name: 'id',
        in: 'path',
        required: true,
        description: 'Numeric record id',
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
      Donation: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          userId: { type: 'integer' },
          donorUsername: { type: 'string', description: 'Joined from users' },
          amount: { type: 'number', example: 250 },
          currency: { type: 'string', example: 'TRY' },
          campaign: { type: 'string', nullable: true, example: 'Scholarship Fund' },
          status: { type: 'string', enum: ['pending', 'completed', 'failed'] },
          donatedAt: { type: 'string', format: 'date-time' },
        },
      },
      DonationInput: {
        type: 'object',
        required: ['user_id', 'amount'],
        properties: {
          user_id: { type: 'integer', description: 'Donor user id' },
          amount: { type: 'number', example: 250 },
          currency: { type: 'string', example: 'TRY' },
          campaign: { type: 'string', nullable: true, example: 'Scholarship Fund' },
          status: { type: 'string', enum: ['pending', 'completed', 'failed'] },
        },
      },
      DonationUpdate: {
        type: 'object',
        properties: {
          amount: { type: 'number', example: 250 },
          currency: { type: 'string', example: 'TRY' },
          campaign: { type: 'string', nullable: true },
          status: { type: 'string', enum: ['pending', 'completed', 'failed'] },
        },
      },
      JobPosting: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          postedBy: { type: 'integer', nullable: true },
          postedByUsername: { type: 'string', nullable: true, description: 'Joined from users' },
          title: { type: 'string', example: 'Data Analyst' },
          company: { type: 'string', example: 'Acme' },
          description: { type: 'string', nullable: true },
          location: { type: 'string', nullable: true, example: 'Istanbul' },
          status: { type: 'string', enum: ['open', 'closed'] },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      JobPostingInput: {
        type: 'object',
        required: ['title', 'company'],
        properties: {
          posted_by: { type: 'integer', nullable: true, description: 'Posting user id (optional)' },
          title: { type: 'string', example: 'Data Analyst' },
          company: { type: 'string', example: 'Acme' },
          description: { type: 'string', nullable: true },
          location: { type: 'string', nullable: true, example: 'Istanbul' },
          status: { type: 'string', enum: ['open', 'closed'] },
        },
      },
      JobApplication: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          jobPostingId: { type: 'integer' },
          jobTitle: { type: 'string', description: 'Joined from job_postings' },
          jobCompany: { type: 'string', description: 'Joined from job_postings' },
          userId: { type: 'integer' },
          applicantUsername: { type: 'string', description: 'Joined from users' },
          status: { type: 'string', enum: ['pending', 'reviewed', 'accepted', 'rejected'] },
          coverLetter: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      JobApplicationInput: {
        type: 'object',
        required: ['job_posting_id', 'user_id'],
        properties: {
          job_posting_id: { type: 'integer' },
          user_id: { type: 'integer' },
          cover_letter: { type: 'string', nullable: true },
          status: { type: 'string', enum: ['pending', 'reviewed', 'accepted', 'rejected'] },
        },
      },
      JobApplicationUpdate: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['pending', 'reviewed', 'accepted', 'rejected'] },
          cover_letter: { type: 'string', nullable: true },
        },
      },
      Announcement: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          title: { type: 'string', example: 'Alumni Meetup 2026' },
          content: { type: 'string', example: 'Join us for the annual alumni meetup in Istanbul.' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      AnnouncementInput: {
        type: 'object',
        required: ['title', 'content'],
        properties: {
          title: { type: 'string', example: 'Alumni Meetup 2026' },
          content: { type: 'string', example: 'Join us for the annual alumni meetup in Istanbul.' },
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
