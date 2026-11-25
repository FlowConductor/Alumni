# MIS Alumni Portal

A centralized alumni tracking system and community portal for graduates of the Istanbul University, Faculty of Economics, Department of Management Information Systems (MIS).

Companion documents: [brand.md](brand.md) (brand guidelines) · [DESIGN.md](DESIGN.md) (design system) · [ddd.md](ddd.md) (domain design).

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
- [Authentication](#authentication)
- [Access Control (Route Guards)](#access-control-route-guards)
- [Admin Panel](#admin-panel)
- [Web Interface](#web-interface)
- [Validation Rules](#validation-rules)
- [Middleware & Error Handling](#middleware--error-handling)
- [Testing Invalid Requests (Postman)](#testing-invalid-requests-postman)
- [Brand](#brand)
  - [Brand Guidelines (brand.md)](brand.md)
  - [Design System (DESIGN.md)](DESIGN.md)
- [Roadmap](#roadmap)
- [Development Process: Detailed Prompts Used](#development-process-detailed-prompts-used)
- [Contributing](#contributing)
- [License](#license)
- [Changelog](#changelog)

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
├── server.js               Entry point: Express app, request logger, JSON middleware,
│                           mounts controllers and Swagger UI, 404 + 5xx guardians
├── package.json            Dependencies and npm scripts (start, dev, migrate, seed)
├── README.md               This document
├── brand.md                Brand guidelines: name, tagline, voice, visual identity
├── DESIGN.md               Design system: tokens, components, responsive rules
├── ddd.md                  Domain design: entities, invariants, tables, relationships
├── Dockerfile              App image (node:20-alpine)
├── docker-compose.yml      app + migrate + seed + mysql services
├── .env.example            Environment variable template
├── .gitignore              Ignores node_modules/, .env, data/, logs/
├── data/                   Legacy JSON data from the pre-MySQL phase (gitignored, unused)
├── logs/                   Runtime logs (gitignored, created on first error)
│   └── error.logs          One entry per error handled by the 5xx Guardian
├── postman/                Postman collection for manual and automated API checks
│   └── MIS-Alumni-Portal.postman_collection.json   Authenticated regression suite (27 requests)
├── public/                 Static assets served by express.static
│   └── css/
│       └── app.css         The design system: tokens and components from DESIGN.md
└── src/
    ├── middleware/         Cross-cutting request handling
    │   ├── logger.js       Request logger: prints "10:20:30 POST /api/users 201 18ms"
    │   ├── notFound.js     404 Guardian: unmatched routes -> JSON or the 404 page
    │   ├── errorHandler.js 5xx Guardian: terminal error handler, JSON or error page
    │   ├── errorLog.js     Appends error entries to logs/error.logs
    │   └── auth.js         Auth guards: requireAuth, requireRole(...roles), currentUser
    ├── lib/                Small shared helpers with no domain knowledge
    │   ├── password.js     scrypt hashing and verification (Node stdlib, no dependency)
    │   ├── session.js      Cookie name, secret, and flags for express-session
    │   ├── http.js         wantsJson() (HTML or JSON answer) and safeNext() (no open redirect)
    │   └── navigation.js   Role-driven menu model: which items a visitor sees
    ├── controllers/        Controllers
    │   ├── auth.controller.js     Auth controller: register, sign in, sign out
    │   ├── me.controller.js       Me controller: the member's own pages (/me)
    │   ├── user.controller.js      User controller: web CRUD (HTML pages + forms) for /users
    │   ├── apiUser.controller.js   ApiUser controller: JSON CRUD for /api/users
    │   ├── announcement.controller.js    Announcement controller: web CRUD (HTML pages + forms) for /announcements
    │   ├── apiAnnouncement.controller.js  ApiAnnouncement controller: JSON CRUD for /api/announcements
    │   ├── apiDonation.controller.js   ApiDonation controller: JSON CRUD for /api/donations (direct + nested)
    │   ├── apiJobPosting.controller.js  ApiJobPosting controller: JSON CRUD for /api/job-postings (direct + nested)
    │   └── apiApplication.controller.js  ApiApplication controller: JSON CRUD for /api/applications (direct + nested under users and job-postings)
    │   ├── jobPosting.controller.js  JobPosting controller: web CRUD + apply form for /job-postings
    │   └── admin.controller.js      Admin controller: /admin panel (roles, applications, donations)
    ├── routes/             Route definitions (mapped to controllers)
    │   ├── auth.js         /register, /login, /logout routes -> Auth controller
    │   ├── general.js      / , /about , /hello , /hello/:name , /sum/... , /api/health
    │   ├── alumni.js       GET/POST /alumni (in-memory alumni model + seed data)
    │   ├── apiUsers.js     /api/users routes -> ApiUser controller
    │   ├── users.js        /users routes -> User controller
    │   ├── apiAnnouncements.js    /api/announcements routes -> ApiAnnouncement controller
    │   ├── apiDonations.js        /api/donations routes -> ApiDonation controller (direct)
    │   ├── apiJobPostings.js     /api/job-postings routes -> ApiJobPosting controller (direct)
    │   ├── apiUserResources.js    Nested routes under /api/users (donations, job-postings, applications by user)
    │   ├── apiApplications.js     /api/applications routes -> ApiApplication controller (direct)
    │   ├── apiJobPostingResources.js   Nested routes under /api/job-postings (applications per posting)
    │   ├── jobPostings.js       /job-postings routes -> JobPosting controller (web UI)
    │   ├── admin.js             /admin routes -> Admin controller, behind requireRole('admin')
    │   └── me.js                /me routes -> Me controller, behind requireAuth
    │   ├── announcements.js      /announcements routes -> Announcement controller
    ├── models/             Models
    │   ├── user.model.js      User model: create, findAll, findById, update, remove (CRUD) on the MySQL users table
    │   ├── announcement.model.js  Announcement model: same CRUD on the MySQL announcements table
    │   ├── donation.model.js    Donation model: CRUD on the donate table, joined to users (donor relationship)
    │   ├── jobPosting.model.js  Job Posting model: CRUD on job_postings, optionally joined to users (poster relationship)
    │   └── application.model.js Application model: CRUD on job_applications, joined to users and job_postings
    ├── views/             View layer (EJS templates)
    │   ├── home.ejs               Home page (GET /)
    │   ├── about.ejs              About page (GET /about)
    │   ├── error.ejs              Error page (400/404/409/500)
    │   ├── 404.ejs                Generic 404 page rendered by the 404 Guardian
    │   ├── auth/
    │   │   ├── login.ejs          Sign-in form (GET /login)
    │   │   └── register.ejs       Registration form (GET /register)
    │   ├── partials/              Shared layout fragments included by every page
    │   │   ├── head.ejs           <head>: title, viewport, stylesheet
    │   │   ├── nav.ejs            Skip link, top navigation, opens <main>
    │   │   └── footer.ejs         Closes <main>, site footer
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
    │   └── jobPostings/
    │       ├── index.ejs          Job posting list page (GET /job-postings)
    │       ├── create.ejs         Create form page (GET /job-postings/new)
    │       ├── details.ejs        Posting detail page with applications + apply form (GET /job-postings/:id)
    │       └── edit.ejs           Edit form page (GET /job-postings/:id/edit)
    │   ├── me/
    │       ├── profile.ejs       The member's own page: record, applications, donations (GET /me)
    │       └── edit.ejs          Edit form for own username and email (GET /me/edit)
    │   └── admin/
    │       ├── _tabs.ejs         Panel navigation shared by the four admin pages
    │       ├── overview.ejs      Dashboard: counts, accounts by role, latest rows (GET /admin)
    │       ├── users.ejs         Accounts with a role selector (GET /admin/users)
    │       ├── applications.ejs  Application triage (GET /admin/applications)
    │       └── donations.ejs     Donation ledger and record form (GET /admin/donations)
    ├── db/                 Data layer tooling
    │   ├── database.js     Shared mysql2 connection pool (reads .env)
    │   ├── migrate.js      Migration runner (tracks applied files in `migrations`)
    │   ├── seed.js         Seeder: bootstrap administrator + 20 users, 40 donations, 15 postings, 20 applications
    │   ├── migrations/     Hand-written SQL migrations 001-006
    │   └── factories/      Record factories used by the seeder
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
| Middleware | `src/middleware/*.js` | Cross-cutting concerns outside MVC: request logging (`logger.js`), access guards (`auth.js`), unmatched-route handling (`notFound.js`), terminal error handling and error logging (`errorHandler.js`, `errorLog.js`) |
| Wiring | `server.js` | Creates the Express app, mounts the request logger, the route files (which map to controllers) at their base paths, serves Swagger UI, and closes the chain with the 404 and 5xx guardians |

### Request flow

```
Client request
   → server.js (request logger, express.json, route mounting)
   → Controller (src/routes/) — validates input, e.g. username/email
   → Model (src/models/) — query the MySQL database
   ← Controller responds with the view: JSON record + status code
   → 404 Guardian (no route matched) or 5xx Guardian (an error was thrown)
   → Logger prints one line per request to the terminal
```

A POST to `/api/users`, for example: `server.js` parses the JSON body, the controller in `src/routes/users.js` validates `username` and `email`, the model in `src/models/user.model.js` inserts the record into the MySQL `users` table and returns it, and the controller sends back `201` with the created user. The logger then prints `10:20:30 POST /api/users 201 18ms`.

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

3. Configure the environment:

   ```bash
   cp .env.example .env
   ```

   Set the database credentials and `SESSION_SECRET`. Outside local development the secret must be a long random string — the session cookie is signed with it:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. Run the application:

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

3. Seed fake data (truncates and inserts 20 users, 40 donations, 15 job postings, 20 applications; the counts are configurable through `SEED_USERS` / `SEED_DONATIONS`):

   ```bash
   npm run seed
   ```

   The seeder also creates one bootstrap administrator so the guarded routes can be reached: `admin@mis-alumni.local` with the password `mis-alumni-admin` (both overridable via `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`, `SEED_ADMIN_USERNAME`). The password is hashed with scrypt like any other; these credentials are for local development only and must be changed before anything is deployed.

With `docker compose up -d`, migrations run automatically before the app starts. To seed inside the Docker network, use `docker compose run --rm seed`.

The User, Announcement, Donation, Job Posting, and Application models use this MySQL database; only the `/alumni` endpoints still use an in-memory store.

### Usage

The intended end-state workflow is:

1. **Department staff** registers and verifies alumni against graduation records.
2. **Alumni** sign up, complete their profiles, and get verified.
3. Verified alumni can join the directory, sign up for events, apply as mentors, and donate to campaigns.
4. **Staff** use the administrative CRM to track engagement and generate accreditation reports.

Which pages a visitor may reach is decided by the [auth guards](#access-control-route-guards): the directory and the JSON API for users need a session, writes need staff or administrator rights, and deleting a user needs the administrator role. Sign in as the seeded administrator (`admin@mis-alumni.local` / `mis-alumni-admin`) to see the actions a regular alumnus does not get.

## Current Routes

The backend's development server (Express) exposes the following starter routes (base URL: `http://localhost:3000`). The **Access** column names the guard mounted on the route (see [Access Control](#access-control-route-guards)):

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET    | `/`   | Public | Home page (EJS view: `home.ejs`) — hero, module cards, and links into the app |
| GET | `/api/health` | Public | Health check; returns JSON with `status`, `uptime` (seconds), and `timestamp` |
| GET | `/api-docs` | Public | Swagger UI — interactive API documentation for all endpoints, both JSON API and web pages (spec in `src/docs/openapi.js`) |
| GET | `/users` | Signed in | Web page listing all users (EJS view: `users/index.ejs`) with view/edit/delete actions |
| GET | `/users/new` | Staff or admin | Create form page (EJS view: `users/create.ejs`); submits to `POST /users` |
| GET | `/users/{id}` | Signed in | Web page for one user (EJS view: `users/details.ejs`); `404` error view if not found |
| GET | `/users/{id}/edit` | Staff or admin | Edit form page prefilled with the user (EJS view: `users/edit.ejs`); submits to `POST /users/{id}` |
| POST | `/users` | Staff or admin | Create a user from an HTML form (fields: `username`, `email`); redirects to `/users` |
| POST | `/users/{id}` | Staff or admin | Update a user from an HTML form; redirects to `/users/{id}` |
| POST | `/users/{id}/delete` | Admin | Delete a user from an HTML form; redirects to `/users` |
| GET | `/api/announcements` | Public | Returns the list of saved announcements (JSON; stored in the MySQL `announcements` table) |
| POST | `/api/announcements` | Staff or admin | Creates an announcement. Request body: `title` and `content` (both required). Returns `201` with the created record |
| GET | `/api/announcements/{id}` | Public | Returns a single announcement by id, or `404` |
| PUT / PATCH | `/api/announcements/{id}` | Staff or admin | Updates an announcement by id (partial updates allowed) |
| DELETE | `/api/announcements/{id}` | Staff or admin | Deletes an announcement by id and returns the removed record |
| GET | `/announcements` | Public | Web page listing all announcements (EJS view: `announcements/index.ejs`) with view/edit/delete actions |
| GET | `/announcements/new` | Staff or admin | Create form page (EJS view: `announcements/create.ejs`); submits to `POST /announcements` |
| GET | `/announcements/{id}` | Public | Web page for one announcement (EJS view: `announcements/details.ejs`); `404` error view if not found |
| GET | `/announcements/{id}/edit` | Staff or admin | Edit form page prefilled with the announcement (EJS view: `announcements/edit.ejs`) |
| POST | `/announcements` | Staff or admin | Create an announcement from an HTML form; redirects to `/announcements` |
| POST | `/announcements/{id}` | Staff or admin | Update an announcement from an HTML form; redirects to `/announcements/{id}` |
| POST | `/announcements/{id}/delete` | Staff or admin | Delete an announcement from an HTML form; redirects to `/announcements` |
| GET | `/api/donations` | Staff or admin | Returns all donations (JSON), each joined with the donor's username |
| POST | `/api/donations` | Staff or admin | Creates a donation. Request body: `user_id` and `amount` (required), `currency`, `campaign`, `status` optional. Returns `201`; `404` if the user does not exist |
| GET | `/api/donations/{id}` | Staff or admin | Returns a single donation by id, or `404` |
| PUT / PATCH | `/api/donations/{id}` | Staff or admin | Updates a donation by id (partial updates allowed) |
| DELETE | `/api/donations/{id}` | Staff or admin | Deletes a donation by id and returns the removed record |
| GET | `/api/users/{userId}/donations` | Staff or admin | **Nested route:** donations made by one user |
| GET | `/api/job-postings` | Public | Returns all job postings (JSON), with the poster's username when set |
| POST | `/api/job-postings` | Staff or admin | Creates a job posting. Request body: `title` and `company` (required), `posted_by`, `description`, `location`, `status` optional. Returns `201`; `404` if `posted_by` does not exist |
| GET | `/api/job-postings/{id}` | Public | Returns a single job posting by id, or `404` |
| PUT / PATCH | `/api/job-postings/{id}` | Staff or admin | Updates a job posting by id (partial updates allowed) |
| DELETE | `/api/job-postings/{id}` | Staff or admin | Deletes a job posting by id and returns the removed record |
| GET | `/api/users/{userId}/job-postings` | Staff or admin | **Nested route:** job postings published by one user |
| GET | `/api/applications` | Staff or admin | Returns all job applications (JSON), each joined with the applicant's username and the posting's title/company |
| POST | `/api/applications` | Alumni | Applies to a job posting. Request body: `job_posting_id` and `user_id` (required), `cover_letter`, `status` optional. Returns `201`; `404` if the posting/user does not exist; `409` if the user already applied |
| GET | `/api/applications/{id}` | Staff or admin | Returns a single application by id, or `404` |
| PUT / PATCH | `/api/applications/{id}` | Staff or admin | Updates an application by id (`status`, `cover_letter`) |
| DELETE | `/api/applications/{id}` | Staff or admin | Deletes an application by id and returns the removed record |
| GET | `/api/users/{userId}/applications` | Staff or admin | **Nested route:** applications made by one user |
| GET | `/api/job-postings/{id}/applications` | Staff or admin | **Nested route:** applications received by one job posting |
| GET | `/job-postings` | Public | Web page listing all job postings (EJS view: `jobPostings/index.ejs`) with view/edit/delete actions |
| GET | `/job-postings/new` | Staff or admin | Create form page (EJS view: `jobPostings/create.ejs`) |
| GET | `/job-postings/{id}` | Public | Posting detail page with its applications and an apply form (EJS view: `jobPostings/details.ejs`) |
| GET | `/job-postings/{id}/edit` | Staff or admin | Edit form page prefilled with the posting (EJS view: `jobPostings/edit.ejs`) |
| POST | `/job-postings` | Staff or admin | Create a posting from an HTML form; redirects to `/job-postings` |
| POST | `/job-postings/{id}` | Staff or admin | Update a posting from an HTML form; redirects to `/job-postings/{id}` |
| POST | `/job-postings/{id}/delete` | Staff or admin | Delete a posting from an HTML form; `409` if it still has applications |
| POST | `/job-postings/{id}/apply` | Alumni | Apply to a posting from the HTML form (fields: `user_id`, optional `cover_letter`); `409` if already applied |
| GET | `/admin` | Admin | Control panel dashboard (EJS view: `admin/overview.ejs`) — counts, accounts by role, latest applications and donations |
| GET | `/admin/users` | Admin | Accounts with a role selector (EJS view: `admin/users.ejs`); links to view, edit, and delete |
| POST | `/admin/users/{id}/role` | Admin | Assigns a role (`alumni`, `employer`, `staff`, `admin`). Refused for your own account, for an unknown role, and for demoting the last administrator |
| POST | `/admin/users/{id}/delete` | Admin | Deletes an account from the panel; `409` message when donations or applications still reference it |
| GET | `/admin/applications` | Admin | Application triage table (EJS view: `admin/applications.ejs`), newest first |
| POST | `/admin/applications/{id}/status` | Admin | Moves an application to `pending`, `reviewed`, `accepted`, or `rejected` |
| POST | `/admin/applications/{id}/delete` | Admin | Removes an application record |
| GET | `/admin/donations` | Admin | Donation ledger with the record form (EJS view: `admin/donations.ejs`) |
| POST | `/admin/donations` | Admin | Records a donation for an existing member: `user_id`, `amount`, `currency`, `campaign`, `status` |
| POST | `/admin/donations/{id}/status` | Admin | Moves a donation to `pending`, `completed`, or `failed` |
| POST | `/admin/donations/{id}/delete` | Admin | Removes a donation; `completed` rows are accounting history and are refused |
| GET | `/api/users` | Signed in | Returns the list of saved users (JSON) |
| GET | `/api/users/{id}` | Signed in | Returns a single user by id, or `404` if not found |
| DELETE | `/api/users/{id}` | Admin | Deletes the user with the given id and returns the removed record, or `404` if not found |
| PUT / PATCH | `/api/users/{id}` | Staff or admin | Updates a user by id. Request body: `username` and/or `email` (partial updates allowed). Returns the updated record, or `404` if the id does not exist |
| POST | `/api/users` | Staff or admin | Creates a user. Request body: `username` and `email` (both required). Returns `201` with the created record — `{"id": 21, "username": "...", "email": "...", "role": "alumni"}` — so a client can follow up with `/api/users/{id}`; duplicate username/email returns `409`. Users are stored in the MySQL `users` table |
| GET | `/login` | Public | Sign-in form (EJS view: `auth/login.ejs`). A signed-in visitor is redirected to `/users` |
| POST | `/login` | Public | Verifies the password against the stored scrypt hash, starts a session, then redirects to `next` (the page the guard turned away) or to `/users`. `400` for missing fields, `401` for an unknown email or a wrong password (same message for both) |
| POST | `/logout` | Public | Destroys the session and clears the cookie, then redirects to `/`. POST only, so a link cannot end a session by accident |
| GET | `/me` | Signed in | The member's own page (EJS view: `me/profile.ejs`) — record, applications, donations, postings published; session-only, no id in the URL |
| GET | `/me/edit` | Signed in | Edit form for the member's own username and email (EJS view: `me/edit.ejs`) |
| POST | `/me` | Signed in | Saves those two fields, refreshes the session, redirects to `/me?notice=...`; `400` on invalid input, `409` on a duplicate |
| GET | `/register` | Public | Registration form (EJS view: `auth/register.ejs`) — username, email, password, confirmation |
| POST | `/register` | Public | Creates an account: validates the input, hashes the password with scrypt, stores the role `alumni`, then redirects to `/users?registered=<username>`. `400` with every failing rule on the form, `409` if the username or email is taken |
| GET | `/about` | Public | About page (EJS view: `about.ejs`) — what the portal is, what is implemented, what is not |
| GET | `/alumni` | Public | Returns the list of alumni records (JSON; in-memory store with seed data) |
| POST | `/alumni` | Public | Creates an alumni record. Request body: `name` (required), `graduationYear` (integer, optional), `email` (optional). Returns `201` with the created record |
| GET | `/hello` | Public | Returns `"Hello, World!"` |
| GET | `/hello/{name}` | Public | Returns a personalized greeting — e.g. `GET /hello/senol` returns `"Hello, senol!"` |
| GET | `/sum/{number1}/{number2}` | Public | Returns the sum as JSON — e.g. `GET /sum/2/3` returns `{"number1":2,"number2":3,"sum":5}` |

Run the server with `npm start`. Interactive API documentation for all endpoints is available via Swagger UI at [http://localhost:3000/api-docs](http://localhost:3000/api-docs); the OpenAPI spec itself lives in `src/docs/openapi.js`. The `/alumni` endpoints are the first endpoints of the Alumni Directory & Profile Management module; the remaining routes are temporary and used to verify the server is running. They will be extended and reorganized as the modules described in [Key Features](#key-features) are implemented.

Any request that matches none of the routes above is answered by the [404 Guardian](#2-404-guardian-notfoundjs) with a `404` and a reason.

## Authentication

The portal authenticates with a server-side session and a scrypt password hash. There is no JWT, no OAuth provider, and no third-party identity service: one account per graduate or staff member, one password, one cookie.

| Route | Method | Access | Behaviour |
|-------|--------|--------|-----------|
| `/register` | GET | Public | Registration form: username, email, password, confirmation; a signed-in visitor is sent to `/users` |
| `/register` | POST | Public | Creates the account with role `alumni`, hashes the password, starts a session, redirects to `/users?registered=<username>`. `400` lists every failing rule; `409` when the username or email is taken |
| `/login` | GET | Public | Sign-in form; a signed-in visitor is sent to `/users` |
| `/login` | POST | Public | Verifies the hash, regenerates the session id, stores `{id, username, role}`, redirects to `?next=` (validated) or `/users`. `400` for a missing field, `401` for an unknown email or a wrong password — one message for both |
| `/logout` | POST | Anyone | Destroys the session and clears the cookie, then redirects to `/`. POST only, so a link cannot end a session by accident |
| `/me` | GET | Signed in | The member's own record, applications, donations, and any postings they published |
| `/me/edit` | GET | Signed in | Edit form for the member's own username and email |
| `/me` | POST | Signed in | Saves those two fields, refreshes the session copy, and redirects with a notice. `400` for an invalid username or email, `409` for a duplicate |

**What the session holds.** Only `{id, username, role}` — never the password hash, never the email. The cookie is `mis.sid`, `HttpOnly`, `SameSite=Lax`, `Secure` outside development, and lasts eight hours. Because the role travels in the session, a role change takes effect at the next sign-in; that is deliberate, so a demotion cannot half-apply in the middle of a request.

**How passwords are stored.** `src/lib/password.js` hashes with scrypt from the Node standard library — no bcrypt dependency. The hash lives in `users.password_hash` and is read by exactly one query, `UserModel.findCredentials`, used by sign-in. Every other read selects `id, username, email, role`, so a hash cannot reach a view, a JSON response, or a log line. A failed sign-in is verified against a dummy hash, so an unknown email and a wrong password take the same time and answer the same way.

**Where the code lives.** `src/controllers/auth.controller.js` (register, sign in, sign out), `src/controllers/me.controller.js` (the member's own pages), `src/lib/password.js` (hash and verify), `src/lib/session.js` (cookie name, secret, flags), `src/lib/http.js` (`safeNext`, which keeps `?next=` from becoming an open redirect), and `src/middleware/auth.js` (the guards described in [Access Control](#access-control-route-guards)).

**Not implemented yet, and deliberately absent from the UI:** password change and reset, email verification, "remember me", rate limiting or account lockout, and multi-device session listing. Sessions live in the process memory (`MemoryStore`), so signing in again is required after a restart and a second app instance would need a shared store. The `register` and `me` forms also do not collect profile data beyond username and email: graduation year, employer, and the rest belong to the Alumni Directory module, which is still a plan.

## Access Control (Route Guards)

Route guards live in `src/middleware/auth.js` and implement the role matrix in [ddd.md](ddd.md) section 8. The menu is derived from the same matrix by `src/lib/navigation.js`, so a link is shown exactly when its target is allowed — see [Navigation by role](#navigation-by-role). Two guards are exported:

| Guard | Behaviour |
|-------|-----------|
| `requireAuth` | Any signed-in user, whatever the role |
| `requireRole(...roles)` | A signed-in user whose `role` is in the list; passing `requireRole('staff', 'admin')` accepts both staff and administrators |

Roles are stored in `users.role` and copied into the session at sign-in, so a role change takes effect on the next sign-in. The guard matrix as mounted today:

| Area | Public | Signed in | Alumni | Staff or admin | Admin |
|------|--------|-----------|--------|----------------|-------|
| Home, about, health, `/api-docs`, `/hello`, `/sum`, `/alumni` | yes | — | — | — | — |
| Announcement reads (`/announcements`, `/announcements/{id}`, `GET /api/announcements*`) | yes | — | — | — | — |
| Job posting reads (`/job-postings`, `/job-postings/{id}`, `GET /api/job-postings*`) | yes | — | — | — | — |
| Alumni directory (`/users`, `/users/{id}`, `GET /api/users`, `GET /api/users/{id}`) | — | yes | — | yes | yes |
| Own pages (`/me`, `/me/edit`, `POST /me`) | — | yes | yes | yes | yes |
| Announcement writes | — | — | — | yes | yes |
| Job posting writes | — | — | — | yes | yes |
| User writes (`POST`/`PUT`/`PATCH /api/users*`, `/users/new`, `/users/{id}/edit`) | — | — | — | yes | yes |
| Donations (all of `/api/donations*`, including the nested per-user route) | — | — | — | yes | yes |
| Applications: read and status changes | — | — | — | yes | yes |
| Applying to a posting (`POST /job-postings/{id}/apply`, `POST /api/applications`) | — | — | yes | — | — |
| Deleting a user (`DELETE /api/users/{id}`, `POST /users/{id}/delete`) | — | — | — | — | yes |
| Changing a role (`POST /admin/users/{id}/role`, `PATCH /api/users/{id}` with `role`) | — | — | — | — | yes |
| The admin panel (`/admin`, `/admin/users`, `/admin/applications`, `/admin/donations`) | — | — | — | — | yes |

Two known gaps, documented rather than hidden: job postings have no company owner column yet, so employers cannot create or edit a posting (only staff and administrators can); and `POST /api/applications` does not check that `user_id` matches the caller — an alumnus can currently apply on someone else's behalf.

How a refusal looks depends on the surface:

| Request | Answer |
|---------|--------|
| HTML `GET` without a session | `302` to `/login?next=<original path>`, and the sign-in form returns the visitor there. Open redirects are blocked: `//host` and absolute URLs fall back to `/users` |
| HTML `POST` without a session | `302` to `/login` — a form body cannot be replayed after a redirect, so the target is dropped rather than half-preserved |
| HTML with a session but the wrong role | `403` error page ("Not permitted") carrying the reason, e.g. `This action is limited to administrator.` |
| JSON API without a session | `401` `{"error": "Authentication required", "reason": "...", "method": "POST", "path": "/api/users"}` |
| JSON API with the wrong role | `403` `{"error": "Not permitted", "reason": "limited to department staff or administrator", "method": "DELETE", "path": "/api/users/1"}` |

The guards answer API requests as JSON and page requests as HTML/redirects by inspecting the request path: anything under `/api/` (checked on `req.originalUrl`, so the check also works inside a mounted router) is treated as an API call. Views read `currentUser`, `canManage` (staff or admin), `canDelete` (admin) and `canApply` (alumni) from `res.locals`, so a page never renders an action the caller cannot perform.

## Admin Panel

`/admin` is the administrator workspace: four pages behind `requireRole('admin')`, built from the same design system as the public pages. The link appears in the navigation only for an administrator, and an anonymous visitor is redirected to sign in while anyone else gets the `403` page.

| Page | What it does | Rules it enforces |
|------|--------------|-------------------|
| `/admin` | Dashboard: user, donation, posting, and application counts, accounts per role, the latest applications and donations | none beyond the admin gate |
| `/admin/users` | Every account with a role selector | No self-changes (an administrator cannot demote itself out of the panel), no unknown role, and the last administrator can be neither demoted nor deleted |
| `/admin/applications` | Triage table: change status, open the posting, delete a record | Status must be one of `pending`, `reviewed`, `accepted`, `rejected` |
| `/admin/donations` | Ledger plus a form to record a transfer that arrived outside the portal | Amount must be greater than zero, the donor must exist, currency is upper-cased, and a `completed` donation can no longer be deleted because it is accounting history |

Every panel action answers with a redirect carrying the outcome (`?notice=` or `?error=`), rendered as an alert at the top of the page, so a form submission never leaves a stale screen behind and the browser's back button cannot re-post.

The same role change is available over JSON: `PATCH /api/users/{id}` with `{"role": "staff"}`. The route gate requires staff or admin (so an alumnus gets `403` from the guard), and the controller requires `admin` on top of that (so a staff member gets `403 Only an administrator may change a role.`). Validation answers `400` for an unknown role and `409` for demoting the last administrator.

To reach the panel on a fresh database, seed it (`npm run seed`) and sign in with the bootstrap administrator: `admin@mis-alumni.local` / `mis-alumni-admin`. Change those values with `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` before seeding anything that is not a local development database.

## Web Interface

Every page is server-rendered with EJS and styled by one stylesheet, `public/css/app.css`, which implements the tokens and component rules in [DESIGN.md](DESIGN.md). The shared layout lives in `src/views/partials/` (`head.ejs`, `nav.ejs`, `footer.ejs`), so each page file contains only its own content.

### Navigation by role

The menu is data, not markup: `src/lib/navigation.js` holds three groups of items — `primary` (the read surface), `manage` (write actions), and `utility` (API docs) — and each item lists the roles that may see it. `navigationFor(user)` filters them for the current visitor, `server.js` puts the result in `res.locals.nav`, and `partials/nav.ejs` renders whatever it receives. A page therefore cannot advertise an action the guards would refuse.

| Item | Group | Guest | `alumni` | `employer` | `staff` | `admin` |
|------|-------|-------|----------|------------|---------|---------|
| Home, Announcements, Job postings, About | primary | yes | yes | yes | yes | yes |
| My profile | primary | — | yes | yes | yes | yes |
| Users (directory) | primary | — | yes | yes | yes | yes |
| API | utility | yes | yes | yes | yes | yes |
| New announcement | manage | — | — | — | yes | yes |
| New posting | manage | — | — | — | yes | yes |
| New user | manage | — | — | — | yes | yes |
| Admin | manage | — | — | — | — | yes |

Guests also get Register and Sign in; a signed-in visitor gets their name, role, and Sign out instead. The `manage` links are set in the gold accent so the write actions read as a separate group from the reading menu.

| Page | Route | Layout |
|------|-------|--------|
| Home | `/` | Hero with the tagline, three module cards, developer links |
| Sign in | `/login` | Single card form (email, password) with an inline error and a link to register |
| Register | `/register` | Two fieldsets (Your record, Password) with hinted fields and an inline error list on failure |
| About | `/about` | Long-form prose: two products in one, what is implemented, what is not |
| Alumni directory | `/users` | Page header with count badge and one primary action, dense table, empty state |
| User record | `/users/{id}` | Profile header with an initials avatar, definition list, action sidebar |
| New / edit user | `/users/new`, `/users/{id}/edit` | Single-column form card, labels above inputs, cancel plus primary |
| Announcements | `/announcements` | Card list, newest first, excerpt clamped to 240 characters |
| Announcement | `/announcements/{id}` | Article layout with a metadata line and an action row |
| New / edit announcement | `/announcements/new`, `/announcements/{id}/edit` | Form card with a textarea |
| Job postings | `/job-postings` | Dense table with status pills |
| Job posting | `/job-postings/{id}` | Two columns: description, applications table, apply form; sidebar with details and actions |
| New / edit posting | `/job-postings/new`, `/job-postings/{id}/edit` | Form card, one field per row |
| 404 | any unmatched route | Centred error page with the request and the reason |
| Error | 400 / 404 / 409 / 500 | Centred error page with the message |
| My profile | `/me` | Profile header with an initials avatar, identity list, my applications and donations tables, action sidebar with the JSON equivalents |
| Edit my record | `/me/edit` | Single form card with hints under each field, an error list on failure, and a note that deletion is an administrator action |
| Admin overview | `/admin` | Panel tabs, four stat tiles, accounts-by-role table, two latest-rows tables |
| Admin users | `/admin/users` | Dense table with a role pill, an inline role selector per row, and the panel tabs |
| Admin applications | `/admin/applications` | Triage table with a status pill and an inline status selector |
| Admin donations | `/admin/donations` | Record form card above the ledger table, completed rows locked |

Structural pieces shared by every page: an institutional utility bar above the navy navigation, an eyebrow above each page title, page headers and section heads closed by a hairline rule, breadcrumbs on every record page, a sticky sidebar on detail pages, fieldsets with legends on forms, a danger zone below edit forms, and a three-column footer.

Design rules applied across the pages: one filled primary button per screen, hairline borders instead of shadows, status pills for state, tabular figures for ids and dates, destructive actions behind a confirmation prompt, and a skip link plus visible focus rings for keyboard users. Long-form text (article bodies, the about page, the hero lead) is set in the system serif, everything else in the sans stack. The layout collapses to a single column below 1024px and to full-bleed cards below 768px, and `prefers-reduced-motion` disables every transition.

## Validation Rules

Input is validated in the controllers before it reaches the model, so an invalid request never touches the database. The JSON API answers `400` with `{"error": "..."}`; the web UI re-renders the error page with the same message.

### Job Posting

| Field | Required | Rule | On violation |
|-------|----------|------|--------------|
| `title` | Yes | Non-empty string, at most **120 characters** | `400` — `Field "title" is required.` or `Field "title" must be at most 120 characters.` |
| `company` | Yes | Non-empty string | `400` — `Field "company" is required.` |
| `location` (city) | No | Free text; may be omitted or `null` | — |
| `description` | No | Free text; may be omitted or `null` | — |
| `posted_by` | No | Positive integer referencing an existing user | `400` if not a positive integer, `404` if the user does not exist |
| `status` | No | One of `open`, `closed` (defaults to `open`) | `400` — `Field "status" must be one of: open, closed.` |

The 120-character limit is enforced in three places: the API controller (`apiJobPosting.controller.js`), the web controller (`jobPosting.controller.js`), and the `job_postings.title` column (`VARCHAR(120)`, migration `006_alter_job_postings_title_length.sql`). The HTML forms also carry `maxlength="120"`.

### User

| Field | Required | Rule | On violation |
|-------|----------|------|--------------|
| `username` | Yes | Non-empty string, unique | `400` if missing, `409` if taken |
| `email` | Yes | Valid address, unique | `400` if missing or malformed, `409` if taken |

### Sign in

| Field | Required | Rule | On violation |
|-------|----------|------|--------------|
| `email` | Yes | Must match an account that has a password | `400` if missing, `401` — `Email or password is incorrect.` |
| `password` | Yes | Verified against the stored scrypt hash | `400` if missing, `401` — same message |

An unknown email and a wrong password produce the same message and take comparable time (the password is checked against a dummy hash when no account matches), so the form cannot be used to discover which addresses are registered.

### Registration

| Field | Required | Rule | On violation |
|-------|----------|------|--------------|
| `username` | Yes | 3–100 characters: letters, digits, dot, underscore, hyphen. Unique | `400` with the rule listed, `409` if taken |
| `email` | Yes | Valid address, at most 255 characters. Unique | `400` with the rule listed, `409` if taken |
| `password` | Yes | At least 8 characters, at least one letter and one digit, at most 200 characters | `400` with the rule listed |
| `password_confirm` | Yes | Must match `password` | `400` — `Field "password_confirm" must match the password.` |

Every failing rule is reported at once, the form echoes back the username and email, and the password is never echoed. The password is stored only as an scrypt hash (`scrypt$<salt>$<hash>`, see `src/lib/password.js`); the hash is never selected by a model read, never returned by the API, and never written to a log.

### Job Application

| Field | Required | Rule | On violation |
|-------|----------|------|--------------|
| `job_posting_id` | Yes | Positive integer referencing an existing posting | `400` if invalid, `404` if the posting does not exist |
| `user_id` | Yes | Positive integer referencing an existing user | `400` if invalid, `404` if the user does not exist |
| `cover_letter` | No | Free text | — |
| (posting, user) | — | One application per user per posting | `409` — `This user has already applied to this job posting.` |

## Middleware & Error Handling

Three middlewares wrap every request, and a fourth guards the protected routes. They live in `src/middleware/` and are mounted in `server.js`: the logger first, then the routes (each carrying its own guard), then the two guardians.

### 1. Request logger (`logger.js`)

Prints one line per request to the terminal once the response has finished:

```
10:20:30 POST /api/users 201 18ms
```

The line is `time method route status duration`. The duration is measured with `process.hrtime.bigint()` from the moment the request enters the app until the response is finished, so it includes controller and database time.

### 2. 404 Guardian (`notFound.js`)

Mounted after every route, so any request that reaches it matched nothing. It answers `404` with an explicit reason instead of Express's default page:

- JSON clients (any path under `/api`, or an explicit `Accept: application/json`):

  ```json
  {
    "error": "Not Found",
    "reason": "No route matches GET /api/does-not-exist.",
    "method": "GET",
    "path": "/api/does-not-exist"
  }
  ```

- Browsers: the generic page `src/views/404.ejs`, rendered with status `404`. The request is answered by the 404 page rather than redirected, so the status code stays truthful and no redirect loop is possible.

### 3. 5xx Guardian (`errorHandler.js`)

The terminal Express error handler. Express 5 forwards rejected promises from async controllers automatically, so a failing query lands here. It:

- writes the error to `logs/error.logs` through `errorLog.js` — one entry per error with timestamp, status, method, route, duration, message and stack;
- answers with the error's status (`500` by default) as JSON for API clients and as the error page for browsers;
- includes the stack only outside production, and hides internal messages (raw SQL errors) when `NODE_ENV=production`;
- also handles malformed JSON bodies (`400` — `Request body is not valid JSON.`).

Example entry in `logs/error.logs`:

```
2026-11-11T12:02:18.512Z 500 GET /api/users 18946ms read ECONNRESET
Error: read ECONNRESET
    at Object.findAll (.../src/models/user.model.js:20:27)
```

`logs/` is gitignored and created on the first error, so a fresh clone needs no setup.

### 4. Auth guards (`auth.js`)

`requireAuth` and `requireRole(...roles)` sit in front of the routes that need a session; the matrix is in [Access Control](#access-control-route-guards). Both read the signed-in user from `req.session.user` and refuse with `302 /login?next=…` or `403` for pages and `401`/`403` JSON for the API. The path test that decides between HTML and JSON lives in `src/lib/http.js` together with `safeNext()`, the helper that keeps `?next=` from turning into an open redirect.

## Testing Invalid Requests (Postman)

`postman/MIS-Alumni-Portal.postman_collection.json` is an authenticated regression suite: 27 requests in five folders — **Setup**, **Users**, **Job postings**, **Applications**, **Guards**. It signs in as an administrator, then exercises validation, CRUD edge cases, the guards, and one full alumni flow. Every request asserts its expected status, and the setup requests store ids in collection variables so the later requests can reuse them.

```bash
npx --yes newman@6 run postman/MIS-Alumni-Portal.postman_collection.json \
  --env-var baseUrl=http://localhost:3001
```

In the Postman desktop app: **Import** the collection file, set `baseUrl`, then **Run collection**. The suite needs a seeded database and these collection variables, which default to the seeded administrator: `adminEmail` (`admin@mis-alumni.local`) and `adminPassword` (`mis-alumni-admin`). Change both before running against anything that is not a local development database.

Confirmed results on `node server.js` with `PORT=3001`: **27 requests, 30 assertions, 0 failures**.

| Folder | What it covers |
|--------|----------------|
| Setup | `POST /login` as the administrator, asserting `200` and a session cookie |
| Users | Create a baseline user, then `{}` (400), invalid email (400), duplicate username (409), malformed JSON (400), non-numeric id (400), unknown id (404) on get/update/delete, `DELETE /api/users/1` blocked by the foreign key (409), and a list read that must never return `password_hash` |
| Job postings | Create a baseline posting, then missing `title` (400), 121-character `title` (400), missing `company` (400), unknown `posted_by` (404), invalid `status` (400), non-numeric id (400) |
| Applications | Register a throwaway alumnus (which signs them in), apply once (201), apply again (409), omit `user_id` (400) |
| Guards | `GET /api/donations` as an alumnus (403), `POST /api/users` as an alumnus (403), an unknown API path (404 JSON), an unknown page (404 HTML) |

A `title` of exactly 120 characters is accepted (`201`), so the boundary is inclusive.

## Brand

The product name, tagline, voice, terminology, and visual identity are documented in [brand.md](brand.md). The design system itself — colour, typography, radius and spacing tokens, component rules, responsive behaviour — lives in [DESIGN.md](DESIGN.md), written in the [DESIGN.md format](https://github.com/VoltAgent/awesome-design-md) that design-aware agents read to generate consistent UI. Neither is applied yet: the current templates are unstyled HTML, so the tokens are the target, not the current state.

In short: the name is always **MIS Alumni Portal**, the tagline is *Where MIS graduates stay connected.*, the voice is plain and warm, and no emoji appears anywhere in the product or its documentation.

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

## Changelog

### 2026-11-25 — Member pages and the auth documentation

- `/me` is the signed-in member's own page: identity, applications, donations, and any postings they published, plus links to the JSON equivalents.
- `/me/edit` and `POST /me` let a member change their own username and email; the session is refreshed on save so the navigation shows the new name immediately. Role and password are not writable here.
- Both pages work from `req.session.user.id`, never from a URL parameter, so there is no id to tamper with; a session whose account was deleted is destroyed and sent to sign-in.
- The navigation model gained a `My profile` item for every signed-in role.
- The README describes the whole authentication surface in one place: the eight auth routes, what the session holds, how passwords are hashed and kept out of reads, where the code lives, and what is deliberately missing.

### 2026-11-25 — Role-driven navigation

- `src/lib/navigation.js` becomes the single definition of the menu: primary, manage, and utility groups, each item carrying the roles that may see it.
- `server.js` exposes the filtered menu as `res.locals.nav`, and `partials/nav.ejs` renders it instead of hardcoding links, so adding an item is a one-line change in the model.
- Staff and administrators now get direct write actions (new announcement, new posting, new user) in the nav; guests no longer see the directory link, which the guard already refused.
- Verified against all five audiences: every offered link answers below 400 for its role, and the alumni, employer, staff, and admin menus differ exactly as the matrix says.

### 2026-11-25 — Administrator control panel

- `/admin` adds four administrator pages: a dashboard, accounts with a role selector, application triage, and a donation ledger with a record form.
- `src/routes/admin.js` mounts the whole panel behind `requireRole('admin')`, and `src/controllers/admin.controller.js` enforces the rules of ddd.md section 8: no self-role changes, no self-deletion, the last administrator is protected, and a completed donation cannot be deleted.
- The User model gained `role` in `update()` (whitelisted against the column's enum) and `countByRole()`; `PATCH`/`PUT /api/users/{id}` now accepts `role`, with the administrator check inside the controller on top of the route guard.
- The navigation shows an Admin link only for administrators, and the panel uses the design system: panel tabs, stat tiles, inline select forms.
- `.env.example` documents `SEED_ADMIN_USERNAME`, `SEED_ADMIN_EMAIL`, and `SEED_ADMIN_PASSWORD`, the bootstrap administrator the seeder creates.

### 2026-11-25 — Auth middleware and guarded routes

- `src/middleware/auth.js` adds `requireAuth` and `requireRole(...roles)`, enforcing the role matrix from `ddd.md` section 8 on all ten route files.
- Pages answer a missing session with `302 /login?next=<path>` and a missing role with a `403` error page; the JSON API answers `401` and `403` with `{error, reason, method, path}`.
- `src/lib/http.js` centralises the HTML-versus-JSON decision (`wantsJson`, tested on `req.originalUrl` so it also works inside a mounted router) and `safeNext()`; the 404 and 5xx guardians now use it too.
- Sign-in honours `?next=`, and `POST /register` signs the new alumnus in directly.
- Views are role-aware through `currentUser`, `canManage`, `canDelete`, and `canApply` from `res.locals`, so no page offers an action the caller cannot perform.
- The seeder creates a bootstrap administrator (`SEED_ADMIN_*`) so guarded routes are reachable on a fresh database.
- `POST /api/users` now returns the created record with its `id` and `role`, so a client can address it afterwards.
- The Postman collection became an authenticated suite: 27 requests in five folders, 30 assertions, 0 failures on a fresh run.

### 2026-11-11 — Sign in and sign out

- `GET /login` renders a sign-in card; `POST /login` verifies the password against the stored scrypt hash and starts a session, `POST /logout` destroys it.
- Sessions are cookie based (`express-session`, the project's only new dependency): signed cookie `mis.sid`, `HttpOnly`, `SameSite=Lax`, `Secure` in production, eight-hour lifetime, memory store. The secret comes from `SESSION_SECRET`.
- A fresh session id is issued on sign-in (fixation protection), and the session holds only `id`, `username`, and `role` — never the password hash.
- An unknown email and a wrong password answer with the same `401` message and comparable timing (the password is checked against a dummy hash when no account matches), so sign-in cannot enumerate accounts.
- The navigation now reflects the session: `Register` and `Sign in` for visitors, `username · role` plus a `Sign out` button (a POST form) for signed-in users.
- Fixed while testing: the credentials query built invalid SQL, and Express 5 leaves `req.body` undefined for a body-less POST, which crashed the handler; both are corrected.
- Still no enforcement: every page stays reachable without a session. Applying the role matrix from `ddd.md` section 8 is the next step.
- `SESSION_SECRET` added to `.env.example` and `docker-compose.yml`.

### 2026-11-11 — Registration

- New route and page `GET /register` with fieldsets for the record and the password, hinted inputs, and an inline list of every failing rule.
- `POST /register` validates username (3–100 characters), email, password (8+ characters, letter and digit), and confirmation; it reports all failures at once and echoes back the username and email without ever echoing the password.
- Passwords are hashed with scrypt from the Node standard library (`src/lib/password.js`), stored as `scrypt$<salt>$<hash>`; the hash is never selected by a model read or returned by the API.
- Migration `007_add_auth_fields_to_users.sql` adds `password_hash` (nullable) and `role` (`ENUM`, default `alumni`). Registration always writes `alumni`; a visitor can never choose a role.
- The User model now reads and returns `role`; the users table shows a role pill per record, the detail page shows it in the identity list, and Swagger documents it as read-only. The registration success message appears on `/users?registered=<username>`.
- No sign-in yet: `password_hash` is stored, but there is no login form, session, or role enforcement.

### 2026-11-11 — Subpages redesigned on the design system

- Every page reworked with page furniture: an institutional utility bar (faculty and department), an eyebrow above each title, page headers and section heads closed by hairline rules, and a three-column footer.
- Detail pages (user, announcement, job posting) now share one layout: profile or article header, a definition list of record fields, and a sticky sidebar with actions and related JSON records.
- Forms gained fieldsets with legends (`Identity`, `Contact`, `The role`, `Publishing`), helper text under each field, and a danger zone below edit forms so deletion is available while editing.
- Lists gained table captions, mailto links, and consistent empty states; the applications table clamps cover letters instead of stretching the row.
- Long-form text is set in the system serif (`--font-serif`), documented as the `body-editorial` role in [DESIGN.md](DESIGN.md); the rest stays in the sans stack.
- `prefers-reduced-motion` disables transitions for users who ask for it.

### 2026-11-11 — Web interface redesign

- Every page rebuilt on the design system: `public/css/app.css` implements the tokens and components from [DESIGN.md](DESIGN.md) (colour, type, radius, spacing, buttons, cards, tables, pills, forms, alerts, empty states).
- Shared layout extracted into `src/views/partials/` (`head.ejs`, `nav.ejs`, `footer.ejs`) with a skip link, active navigation state, and a site footer.
- New pages: `home.ejs` (`GET /` now renders a real home page instead of `"ok"`) and `about.ejs` (`GET /about`).
- All twelve CRUD views restyled: page headers with count badges, dense tables for users and postings, card lists for announcements, two-column detail pages, single-column form cards with required-field labels and cancel actions, and confirmation prompts on every delete.
- `404.ejs` and `error.ejs` rebuilt as centred error pages that show the request and the reason.
- View helpers `formatDate` and `initials` added to `app.locals`; `express.static` serves `public/`.

### 2026-11-11 — Validation rules, request logging, and error guardians

- **Job Posting validation rules** documented and enforced: `title` required and at most 120 characters, `company` required, `location` (city) and `description` optional. Enforced in the API controller, the web controller, the HTML forms (`maxlength="120"`), the OpenAPI schema (`maxLength: 120`) and the database (`VARCHAR(120)`, migration `006_alter_job_postings_title_length.sql`).
- **Request logger middleware** (`src/middleware/logger.js`) printing `time method route status duration` to the terminal for every request.
- **404 Guardian** (`src/middleware/notFound.js`) answering unmatched routes with a `404` and a reason — JSON for API clients, the new generic `src/views/404.ejs` page for browsers.
- **5xx Guardian** (`src/middleware/errorHandler.js`) as the terminal error handler, writing every error to `logs/error.logs` and answering with JSON or the error page.
- **Fixed:** deleting a user that still had donations or applications returned `500` with a raw SQL message; it now returns `409` with a readable reason (both API and web).
- **Postman invalid-request collection** (`postman/MIS-Alumni-Portal.postman_collection.json`, 19 requests) added and verified with newman: 19 requests, 19 assertions, 0 failures.
- `logs/` added to `.gitignore`.

## update rule

- Check the ddd.md for Database Design Documentation
- if you change database design change ddd.md
- update docker-compose.yml when you change the system


