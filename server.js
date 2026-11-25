const path = require('path');
require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const generalRoutes = require('./src/routes/general');
const authRoutes = require('./src/routes/auth');
const alumniRoutes = require('./src/routes/alumni');
const apiUsersRoutes = require('./src/routes/apiUsers');
const usersRoutes = require('./src/routes/users');
const apiUserResourcesRoutes = require('./src/routes/apiUserResources');
const apiAnnouncementsRoutes = require('./src/routes/apiAnnouncements');
const announcementsRoutes = require('./src/routes/announcements');
const apiDonationsRoutes = require('./src/routes/apiDonations');
const apiJobPostingsRoutes = require('./src/routes/apiJobPostings');
const apiJobPostingResourcesRoutes = require('./src/routes/apiJobPostingResources');
const apiApplicationsRoutes = require('./src/routes/apiApplications');
const jobPostingsRoutes = require('./src/routes/jobPostings');
const adminRoutes = require('./src/routes/admin');
const meRoutes = require('./src/routes/me');
const openapiSpec = require('./src/docs/openapi');
const requestLogger = require('./src/middleware/logger');
const notFoundHandler = require('./src/middleware/notFound');
const errorHandler = require('./src/middleware/errorHandler');
const { sessionMiddleware } = require('./src/lib/session');
const { navigationFor } = require('./src/lib/navigation');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// View helpers available to every EJS template.
app.locals.formatDate = (value) => {
  if (!value) return '—';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toISOString().slice(0, 16).replace('T', ' ');
};

app.locals.initials = (name) =>
  String(name || '?')
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

app.use(requestLogger);
app.use(express.static(path.join(__dirname, 'public')));
app.use(sessionMiddleware());

// The signed-in user, available to every template as `currentUser`, plus the
// affordances used to hide actions a role cannot perform. These flags decide what
// a page *shows*; the guards in src/middleware/auth.js decide what is allowed, and
// they never trust a flag from the client.
app.use((req, res, next) => {
  const user = req.session.user || null;
  const role = user ? user.role : null;

  res.locals.currentUser = user;
  res.locals.canManage = role === 'staff' || role === 'admin';
  res.locals.canDelete = role === 'admin';
  res.locals.canApply = role === 'alumni';
  // The menu for this visitor, filtered by role (src/lib/navigation.js).
  res.locals.nav = navigationFor(user);

  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', generalRoutes);
app.use('/', authRoutes);
app.use('/alumni', alumniRoutes);
app.use('/api/users', apiUsersRoutes);
app.use('/api/users', apiUserResourcesRoutes);
app.use('/users', usersRoutes);
app.use('/api/announcements', apiAnnouncementsRoutes);
app.use('/announcements', announcementsRoutes);
app.use('/api/donations', apiDonationsRoutes);
app.use('/api/job-postings', apiJobPostingsRoutes);
app.use('/api/job-postings', apiJobPostingResourcesRoutes);
app.use('/api/applications', apiApplicationsRoutes);
app.use('/job-postings', jobPostingsRoutes);
app.use('/admin', adminRoutes);
app.use('/me', meRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

// 404 Guardian: nothing matched above. 5xx Guardian: terminal error handler.
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`MIS Alumni Portal server running at http://localhost:${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});
