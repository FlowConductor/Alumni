const express = require('express');
const generalRoutes = require('./src/routes/general');
const alumniRoutes = require('./src/routes/alumni');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/', generalRoutes);
app.use('/alumni', alumniRoutes);

app.listen(PORT, () => {
  console.log(`MIS Alumni Portal server running at http://localhost:${PORT}`);
});
