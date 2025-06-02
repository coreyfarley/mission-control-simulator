const express = require('express');
const path = require('path');
const app = express();
const PORT = 8080;

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../../frontend')));

// Route for the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/landing.html'));
});

// Route for the dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Main server running at http://localhost:${PORT}`);
  console.log(`Access the application at http://localhost:${PORT}`);
});
