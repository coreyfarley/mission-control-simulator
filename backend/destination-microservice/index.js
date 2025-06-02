const express = require('express');
const app = express();
const PORT = 3000;

const cors = require('cors');
app.use(cors());

// Dummy trip data 
const tripData = {
  moon: { distance: 238900, duration: "3 days", fuel: 5000 },
  mars: { distance: 140000000, duration: "7 months", fuel: 800000 },
  venus: { distance: 26000000, duration: "5 months", fuel: 600000 },
  jupiter: { distance: 484000000, duration: "2 years", fuel: 1200000 }
};

app.get('/', (req, res) => {
  res.send('Trip Info API is up and running.');
});

// GET /trip-info?planet=moon
app.get('/trip-info', (req, res) => {
  const rawPlanet = req.query.planet;

  // Check for missing parameter
  if (!rawPlanet || typeof rawPlanet !== 'string') {
    return res.status(400).json({ error: "Invalid or missing 'planet' parameter" });
  }

  const planet = rawPlanet.trim().toLowerCase();

  // Check if the planet exists in the data
  if (!tripData[planet]) {
    return res.status(400).json({ error: "Invalid Destination" });
  }

  // Valid input, return the data
  console.log(planet, tripData[planet]);
  res.json(tripData[planet]);
});


// Start the server
app.listen(PORT, () => {
  console.log(`Trip Info API running at http://localhost:${PORT}`);
});
