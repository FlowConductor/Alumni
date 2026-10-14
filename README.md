# MIS Alumni Portal

A centralized alumni tracking system and community portal for graduates of the Istanbul University, Faculty of Economics, Department of Management Information Systems (MIS).

## Table of Contents

- [About the Project](#about-the-project)
- [Key Features](#key-features)
  - [Alumni Directory & Profile Management (The Core Tracking System)](#alumni-directory--profile-management-the-core-tracking-system)
  - [Career Services & Mentorship Hub](#career-services--mentorship-hub)
  - [Events & Reunions Management](#events--reunions-management)
  - [Fundraising, Giving & Campaigns](#fundraising-giving--campaigns)
  - [Community & Communication](#community--communication)
  - [University Perks & Services](#university-perks--services)
  - [Administrative CRM & Accreditation Analytics (For University Staff)](#administrative-crm--accreditation-analytics-for-university-staff)
- [Tech Stack](#tech-stack)
- [Project Structure (MVC)](#project-structure-mvc)
- [Getting Started](#getting-started)
- [Current Routes](#current-routes)
- [Roadmap](#roadmap)
- [Development Process: Detailed Prompts Used](#development-process-detailed-prompts-used)
- [Contributing](#contributing)
- [License](#license)

## About the Project

The MIS Alumni Portal is a digital platform designed to serve two closely related purposes in a single product:

1. **An alumni tracking system** — a structured, institutional record of MIS graduates: who they are, where they work, how their careers have progressed, and how they stay connected to the department. This gives the Department of Management Information Systems accurate, up-to-date data about its graduate community, which is essential for accreditation reports, curriculum planning, and demonstrating the real-world outcomes of the program.
2. **An alumni portal** — a community hub where graduates can find and reconnect with classmates, access career resources, join mentorship relationships, attend events and reunions, support fundraising campaigns, and take advantage of university services reserved for alumni.

Most alumni platforms cover only one of these two needs. The institutional side (accurate graduate data for the university) and the community side (an engaging space alumni actually want to use) are designed here as one integrated system: the richer and more engaged the community, the better the data; the better the data, the more the department can offer back to its graduates.

## Key Features

The platform is planned around seven core modules. Together they cover the full lifecycle of the relationship between the department and its graduates — from the day a student graduates to decades-long engagement as a mentor, donor, and community member.

### Alumni Directory & Profile Management (The Core Tracking System)

The foundation of the platform: a verified, searchable directory of every MIS graduate.

- Rich alumni profiles: graduation year, student ID linkage, current photo, contact details, and privacy controls.
- Career history tracking: employers, job titles, industries, and career progression over time.
- Academic record: degree information, thesis titles, double majors, and minors.
- Verified membership: alumni accounts are validated against department graduation records before full access is granted.
- Search and filter: find alumni by graduation year, industry, company, city, or name.
- Privacy-first design: alumni control which parts of their profile are public, visible to the community, or visible only to department staff.

### Career Services & Mentorship Hub

Connecting current students and recent graduates with experienced alumni.

- Job board: alumni and partner companies can post opportunities targeted at the MIS community.
- Structured mentorship program: match mentors and mentees by industry, career stage, and interest area.
- CV and interview support: alumni volunteers can review CVs and conduct mock interviews.
- Career path guides: "how I got here" stories and role breakdowns contributed by alumni working in relevant fields.
- Internship connections: a channel for companies employing alumni to reach current MIS students.

### Events & Reunions Management

Organizing, promoting, and running alumni gatherings.

- Event calendar: reunions, networking nights, department seminars, and guest lectures.
- Online registration and QR-code check-in.
- Class reunion tools: dedicated pages for graduation-year cohorts to organize their own reunions.
- Hybrid and online events: streaming support for alumni who live abroad or outside Istanbul.
- Post-event galleries, attendee lists, and feedback collection.

### Fundraising, Giving & Campaigns

Supporting the department through donations and targeted campaigns.

- Donation processing with support for one-time and recurring giving.
- Campaign pages: fundraising for scholarships, lab equipment, student clubs, and department projects.
- Giving history: alumni can view and manage their own donation records.
- Recognition and acknowledgments: donor walls, campaign progress bars, and annual giving reports.
- Transparency: clear reporting on how each campaign's funds are used.

### Community & Communication

Keeping the alumni community connected between events.

- Class and city-based community groups (e.g., "MIS Class of 2015", "MIS Alumni in Berlin").
- News feed: department news, alumni achievements, job changes, and community announcements.
- Direct messaging between alumni (subject to privacy settings).
- Newsletter: a curated periodic digest of news, events, and opportunities.
- Interest groups: specialized sub-communities for topics such as data science, ERP, cybersecurity, and entrepreneurship.

### University Perks & Services

Benefits and services that make alumni membership valuable.

- University library access and online database privileges.
- Discounts on university facilities, continuing education programs, and certificate courses.
- Official alumni verification documents and digital membership cards.
- Lifetime university email forwarding.
- Invitations to university-wide events, conferences, and seminars.

### Administrative CRM & Accreditation Analytics (For University Staff)

The staff-facing side of the tracking system.

- Alumni CRM: staff can view, update, and manage alumni records.
- Interaction logging: a history of every touchpoint with an alumnus (event attendance, donations, mentorship activity).
- Segmentation tools: build target audiences for campaigns (e.g., alumni in a specific industry, donors who gave in the last five years, mentors in a city).
- Graduation and employment statistics: dashboards for reporting and for program improvement.
- **Accreditation reporting** — the department regularly needs data on graduate outcomes for national and international accreditation applications; this module produces those reports directly from live data instead of manual surveys.

## Tech Stack

| Layer     | Technology         | Notes                                             |
|-----------|--------------------|---------------------------------------------------|
| Frontend  | HTML, EJS          | Server-rendered pages (views in `src/views/`)     |
| Backend   | JavaScript, Node.js| Server-side logic and APIs (Express)            |
| Database  | MySQL              | Relational data storage for alumni records        |

> Note: the backend uses Express for HTTP routing, EJS for the view layer, and mysql2 for the MySQL data layer (migrations and factories in `src/db/`). Only the `/alumni` endpoints still use an in-memory store with seed records.

## Project Structure (MVC)

The application follows the MVC (Model–View–Controller) pattern, adapted for an API-first Node.js/Express backend:

- **Model** — the data and all persistence logic (`src/models/`). Models are the only code that reads and writes storage.
- **View** — the presentation layer: EJS templates in `src/views/`, rendered by the User controller for the web pages (`/users`), and the JSON responses produced by the ApiUser controller for the API surface. Swagger UI (`/api-docs`) documents the response contracts.
- **Controller** — request handling: input validation, calling the model, choosing status codes and response shape (`src/controllers/`). Route files (`src/routes/`) are thin mappings from URLs to controller functions.

### Directory layout

```
MIS/
├── server.js               Entry point: Express app, JSON middleware,
│                           mounts controllers and Swagger UI, starts listening
├── package.json            Dependencies and npm scripts (start, dev)
├── README.md               This document
├── .gitignore              Ignores node_modules/, .env, data/
├── data/                   Legacy JSON data from the pre-MySQL phase (gitignored, unused)
└── src/
    ├── controllers/        Controllers
    │   ├── user.controller.js      User controller: web CRUD (HTML pages + forms) for /users
    │   ├── apiUser.controller.js   ApiUser controller: JSON CRUD for /api/users
    │   ├── announcement.controller.js    Announcement controller: web CRUD (HTML pages + forms) for /announcements
    │   └── apiAnnouncement.controller.js  ApiAnnouncement controller: JSON CRUD for /api/announcements
    ├── routes/             Route definitions (mapped to controllers)
    │   ├── general.js      / , /about , /hello , /hello/:name , /sum/... , /api/health
    │   ├── alumni.js       GET/POST /alumni (in-memory alumni model + seed data)
    │   ├── apiUsers.js     /api/users routes -> ApiUser controller
    │   ├── users.js        /users routes -> User controller
    │   ├── apiAnnouncements.js    /api/announcements routes -> ApiAnnouncement controller
    │   └── announcements.js      /announcements routes -> Announcement controller
    ├── models/             Models
    │   ├── user.model.js      User model: create, findAll, findById, update, remove (CRUD) on the MySQL users table
    │   └── announcement.model.js  Announcement model: same CRUD on the MySQL announcements table
    ├── views/             View layer (EJS templates)
    │   ├── error.ejs              Error page (400/404)
    │   └── users/
    │       ├── index.ejs          User list page (GET /users)
    │       ├── create.ejs         Create form page (GET /users/new)
    │       ├── details.ejs        User detail page (GET /users/:id)
    │       ├── edit.ejs           Edit form page (GET /users/:id/edit)
    │   └── announcements/
    │       ├── index.ejs          Announcement list page (GET /announcements)
    │       ├── create.ejs         Create form page (GET /announcements/new)
    │       ├── details.ejs        Announcement detail page (GET /announcements/:id)
    │       └── edit.ejs           Edit form page (GET /announcements/:id/edit)
    └── docs/               API documentation
        └── openapi.js      OpenAPI 3.0 spec served by Swagger UI at /api-docs
```

### MVC mapping

| MVC role | Location | Responsibility |
|----------|----------|----------------|
| Model | `src/models/user.model.js` | The User model: `create`, `findAll`, `findById`, `update`, `remove` (full CRUD) — backed by the MySQL `users` table |
| Model (pending extraction) | inside `src/routes/alumni.js` | The alumni model is still an in-memory array inside its controller; it moves to `src/models/` when the MySQL layer is implemented |
| View | `src/views/*.ejs` (web) and JSON responses (API) | EJS templates: `users/index.ejs` (list), `users/create.ejs` (create form), `users/details.ejs` (detail), `users/edit.ejs` (edit form), `error.ejs` (error pages); the ApiUser controller's JSON output is the API's view |
| Controller | `src/controllers/user.controller.js` (web) and `src/controllers/apiUser.controller.js` (API) | Full CRUD functions: validate input, call the model, produce the response — HTML pages and redirects for the web, JSON + status codes for the API |
| Routes | `src/routes/*.js` | Map URLs and HTTP methods to controller functions: `apiUsers.js` → ApiUser controller (`/api/users`), `users.js` → User controller (`/users`), `alumni.js` and `general.js` → inline handlers |
| Wiring | `server.js` | Creates the Express app, mounts the route files (which map to controllers) at their base paths, serves Swagger UI |

### Request flow

```
Client request
   → server.js (express.json, route mounting)
   → Controller (src/routes/) — validates input, e.g. username/email
   → Model (src/models/) — query the MySQL database
   ← Controller responds with the view: JSON record + status code
```

A POST to `/api/users`, for example: `server.js` parses the JSON body, the controller in `src/routes/users.js` validates `username` and `email`, the model in `src/models/user.model.js` inserts the record into the MySQL `users` table and returns it, and the controller sends back `201` with the created user.

## Getting Started

> **Important:** The routes in [Current Routes](#current-routes) are implemented and running against MySQL (see [Database Setup](#database-setup)). Only the `/alumni` endpoints still use an in-memory store with seed data. Items marked **TBD** have not been decided yet.

### Prerequisites

- **Node.js 18 or later** — download from [nodejs.org](https://nodejs.org) or use your system package manager.
- **MySQL 8 or later** — runs as a Docker service (see [Database Setup](#database-setup) below).
- A code editor (recommended: VS Code).

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd MIS
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the application:

   ```bash
   npm start
   ```

   The server starts at `http://localhost:3000` (override with the `PORT` environment variable). For development with automatic restart on file changes, use `npm run dev`.

### Database Setup

MySQL runs as a Docker service (see `docker-compose.yml`), with the schema managed by SQL migrations and sample data provided by the factories:

1. Copy `.env.example` to `.env` in the project root and adjust the values:

   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=mis_alumni
   ```

2. Run the migrations (creates the `users`, `donate`, and `migrations` tables):

   ```bash
   npm run migrate
   ```

3. Seed fake data (truncates and inserts 20 users and 40 donations; configurable via `SEED_USERS` / `SEED_DONATIONS`):

   ```bash
   npm run seed
   ```

With `docker compose up -d`, migrations run automatically before the app starts. To seed inside the Docker network, use `docker compose run --rm seed`.

The User and Announcement models use this MySQL database; only the `/alumni` endpoints still use an in-memory store.

### Usage

The intended end-state workflow is:

1. **Department staff** registers and verifies alumni against graduation records.
2. **Alumni** sign up, complete their profiles, and get verified.
3. Verified alumni can join the directory, sign up for events, apply as mentors, and donate to campaigns.
4. **Staff** use the administrative CRM to track engagement and generate accreditation reports.

## Current Routes

The backend's development server (Express) exposes the following starter routes (base URL: `http://localhost:3000`):

| Method | Route | Description |
|--------|-------|-------------|
| GET    | `/`   | Returns `"ok"`; will serve as the temporary main page |
| GET    | `/api/health` | Health check; returns JSON with `status`, `uptime` (seconds), and `timestamp` |
| GET    | `/api-docs` | Swagger UI — interactive API documentation for all endpoints, both JSON API and web pages (spec in `src/docs/openapi.js`) |
| GET    | `/users` | Web page listing all users (EJS view: `users/index.ejs`) with view/edit/delete actions |
| GET    | `/users/new` | Create form page (EJS view: `users/create.ejs`); submits to `POST /users` |
| GET    | `/users/{id}` | Web page for one user (EJS view: `users/details.ejs`); `404` error view if not found |
| GET    | `/users/{id}/edit` | Edit form page prefilled with the user (EJS view: `users/edit.ejs`); submits to `POST /users/{id}` |
| POST   | `/users` | Create a user from an HTML form (fields: `username`, `email`); redirects to `/users` |
| POST   | `/users/{id}` | Update a user from an HTML form; redirects to `/users/{id}` |
| POST   | `/users/{id}/delete` | Delete a user from an HTML form; redirects to `/users` |
| GET    | `/api/announcements` | Returns the list of saved announcements (JSON; stored in the MySQL `announcements` table) |
| POST   | `/api/announcements` | Creates an announcement. Request body: `title` and `content` (both required). Returns `201` with the created record |
| GET    | `/api/announcements/{id}` | Returns a single announcement by id, or `404` |
| PUT / PATCH | `/api/announcements/{id}` | Updates an announcement by id (partial updates allowed) |
| DELETE | `/api/announcements/{id}` | Deletes an announcement by id and returns the removed record |
| GET    | `/announcements` | Web page listing all announcements (EJS view: `announcements/index.ejs`) with view/edit/delete actions |
| GET    | `/announcements/new` | Create form page (EJS view: `announcements/create.ejs`); submits to `POST /announcements` |
| GET    | `/announcements/{id}` | Web page for one announcement (EJS view: `announcements/details.ejs`); `404` error view if not found |
| GET    | `/announcements/{id}/edit` | Edit form page prefilled with the announcement (EJS view: `announcements/edit.ejs`) |
| POST   | `/announcements` | Create an announcement from an HTML form; redirects to `/announcements` |
| POST   | `/announcements/{id}` | Update an announcement from an HTML form; redirects to `/announcements/{id}` |
| POST   | `/announcements/{id}/delete` | Delete an announcement from an HTML form; redirects to `/announcements` |
| GET    | `/api/users` | Returns the list of saved users (JSON) |
| GET    | `/api/users/{id}` | Returns a single user by id, or `404` if not found |
| DELETE | `/api/users/{id}` | Deletes the user with the given id and returns the removed record, or `404` if not found |
| PUT / PATCH | `/api/users/{id}` | Updates a user by id. Request body: `username` and/or `email` (partial updates allowed). Returns the updated record, or `404` if the id does not exist |
| POST   | `/api/users` | Creates a user. Request body: `username` and `email` (both required). Returns `201` with `{"username": "...", "email": "..."}`; duplicate username/email returns `409`. Users are stored in the MySQL `users` table |
| GET    | `/about` | Temporary about page (HTML) |
| GET    | `/alumni` | Returns the list of alumni records (JSON; in-memory store with seed data) |
| POST   | `/alumni` | Creates an alumni record. Request body: `name` (required), `graduationYear` (integer, optional), `email` (optional). Returns `201` with the created record |
| GET    | `/hello` | Returns `"Hello, World!"` |
| GET    | `/hello/{name}` | Returns a personalized greeting — e.g. `GET /hello/senol` returns `"Hello, senol!"` |
| GET    | `/sum/{number1}/{number2}` | Returns the sum as JSON — e.g. `GET /sum/2/3` returns `{"number1":2,"number2":3,"sum":5}` |

Run the server with `npm start`. Interactive API documentation for all endpoints is available via Swagger UI at [http://localhost:3000/api-docs](http://localhost:3000/api-docs); the OpenAPI spec itself lives in `src/docs/openapi.js`. The `/alumni` endpoints are the first endpoints of the Alumni Directory & Profile Management module; the remaining routes are temporary and used to verify the server is running. They will be extended and reorganized as the modules described in [Key Features](#key-features) are implemented.

## Roadmap

Scoping, documentation, and the first starter routes are complete; module implementation is pending.

- [x] Project definition and scope (this document)
- [ ] Alumni Directory & Profile Management
- [ ] Career Services & Mentorship Hub
- [ ] Events & Reunions Management
- [ ] Fundraising, Giving & Campaigns
- [ ] Community & Communication
- [ ] University Perks & Services
- [ ] Administrative CRM & Accreditation Analytics
- [ ] Deployment and launch

## Development Process: Detailed Prompts Used

This project was scoped through a structured, prompt-driven development process. Four key prompts, given in sequence, shaped the final document above. Each is documented here so the reasoning behind the project's scope and structure is transparent and reproducible.

### Prompt 1: Project Definition

- **Purpose:** Establish what the platform is and who it serves.
- **Content:** "Act as a software documentation expert and create a complete README for an alumni tracking and alumni portal website for graduates of Istanbul University, Faculty of Economics, Department of Management Information Systems."
- **Logic:** A precise definition up front (tracking system **and** portal, for a specific department) prevents scope drift and anchors every later decision to a real institution with real needs — accreditation reporting, community engagement, and department-level administration.
- **How it guided the output:** It produced the "About the Project" section framing the platform as two products in one, and set the documentation-expert tone for the whole document.

### Prompt 2: Feature Module Scoping

- **Purpose:** Define exactly what the platform does.
- **Content:** A request for seven named modules — alumni directory/profile management, career services and mentorship, events and reunions, fundraising and campaigns, community and communication, university perks and services, and administrative CRM with accreditation analytics.
- **Logic:** Named modules convert a vague "alumni portal" idea into a finite, buildable feature set. Ordering them by role (core data first, staff analytics last) reflects a natural build order: the directory is the data foundation everything else depends on.
- **How it guided the output:** It became the "Key Features" section, with each module as a subsection and its capabilities broken into bullet points.

### Prompt 3: Technology Constraints

- **Purpose:** Fix the technology stack before any code is written.
- **Content:** The stack is constrained to HTML, JavaScript/Node.js, and MySQL.
- **Logic:** Stating constraints in the documentation phase keeps the README honest and gives contributors clear boundaries. Since framework/ORM choices were left open, they are marked as undecided rather than invented.
- **How it guided the output:** It produced the "Tech Stack" table, the prerequisites in "Getting Started" (Node.js 18+, MySQL 8+), and the explicit note that tooling within the stack is not final.

### Prompt 4: Handling Open Items

- **Purpose:** Decide what to do about details that are not yet known.
- **Content:** A request to include setup and usage instructions even though the project is in the planning phase, covering prerequisites, installation, configuration, database setup, and running the application.
- **Logic:** A README for a greenfield project faces a choice: omit instructions (unhelpful) or invent them (dishonest). The resolution is to document the intended workflow and explicitly mark undecided items — migration tooling, seed scripts, exact npm commands, hosting, and license — as **TBD**.
- **How it guided the output:** It shaped the "Getting Started" section, including the planning-phase notice, and the **TBD** markers throughout the document.

## Contributing

Contributions are welcome. Since the project has no code yet, the most valuable current contributions are feedback on scope and structure, and code contributions once implementation begins.

### Workflow

1. Fork the repository.
2. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make your changes with clear, focused commits.
4. Push the branch and open a pull request describing what changed and why.

### Style Guidelines

- Keep code readable and consistent; follow conventions established in the codebase as it grows.
- Write commit messages in the imperative mood (e.g., "Add event registration endpoint").
- Update this README when a change affects setup, usage, or the roadmap.
- No emoji in documentation or commit messages.

> A fuller `CONTRIBUTING.md` with detailed coding standards and PR review guidelines will be added once implementation begins.

## License

**TBD** — the license for this project has not been chosen yet. Until a license is decided and a `LICENSE` file is added, all rights are reserved.


## update rule

- Check the ddd.md for Database Design Documentation
- if you change database design change ddd.md
- update docker-compose.yml when you change the system


