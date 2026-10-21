const path = require('path');
require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const generalRoutes = require('./src/routes/general');
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
const openapiSpec = require('./src/docs/openapi');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', generalRoutes);
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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.listen(PORT, () => {
  console.log(`MIS Alumni Portal server running at http://localhost:${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});
