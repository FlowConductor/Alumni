const express = require('express');
const swaggerUi = require('swagger-ui-express');
const generalRoutes = require('./src/routes/general');
const alumniRoutes = require('./src/routes/alumni');
const usersRoutes = require('./src/routes/users');
const openapiSpec = require('./src/docs/openapi');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/', generalRoutes);
app.use('/alumni', alumniRoutes);
app.use('/api/users', usersRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.listen(PORT, () => {
  console.log(`MIS Alumni Portal server running at http://localhost:${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});
