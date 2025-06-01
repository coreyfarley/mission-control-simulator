const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());

// Dummy ISS location data
const issLocations = [
  { latitude: -15.6, longitude: -137.8, region: "South Pacific Ocean" },
  { latitude: 28.4, longitude: 74.3, region: "Northern India" },
  { latitude: 45.2, longitude: -102.7, region: "North America" },
  { latitude: -32.1, longitude: 18.5, region: "South Atlantic Ocean" },
  { latitude: 51.8, longitude: 96.2, region: "Siberia, Russia" },
  { latitude: 8.7, longitude: -42.3, region: "Atlantic Ocean" },
  { latitude: -25.3, longitude: 153.1, region: "Australia" }
];

app.get('/', (req, res) => {
  res.send('ISS Tracker API is up and running.');
});

// GET /iss-location
app.get('/iss-location', (req, res) => {
  // Get a random location or cycle through them
  const randomIndex = Math.floor(Math.random() * issLocations.length);
  const location = issLocations[randomIndex];
  
  // Log and return the data
  console.log(`ISS Location: ${location.region} (${location.latitude}, ${location.longitude})`);
  res.json(location);
});

// Start the server
app.listen(PORT, () => {
  console.log(`ISS Tracker API running at http://localhost:${PORT}`);
});
