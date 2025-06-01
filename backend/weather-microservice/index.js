const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3002;

app.use(cors());

// Dummy weather data for different launch sites
const weatherData = {
  "cape canaveral": { temperature: "82°F", skies: "Partly Cloudy", humidity: "65%" },
  "vandenberg": { temperature: "68°F", skies: "Clear", humidity: "58%" },
  "baikonur": { temperature: "75°F", skies: "Sunny", humidity: "42%" },
  "tanegashima": { temperature: "79°F", skies: "Overcast", humidity: "72%" }
};

app.get('/', (req, res) => {
  res.send('Weather API is up and running.');
});

// GET /weather?site=cape%20canaveral
app.get('/weather', (req, res) => {
  const rawSite = req.query.site;

  // Check for missing parameter
  if (!rawSite || typeof rawSite !== 'string') {
    return res.status(400).json({ error: "Invalid or missing 'site' parameter" });
  }

  const site = rawSite.trim().toLowerCase();

  // Map full site names to keys
  const siteMap = {
    "cape canaveral, usa": "cape canaveral",
    "vandenberg space force base, usa": "vandenberg",
    "baikonur cosmodrome, russia": "baikonur",
    "tanegashima space center, japan": "tanegashima"
  };

  const siteKey = siteMap[site] || site;

  // Check if the site exists in the data
  if (!weatherData[siteKey]) {
    return res.status(400).json({ error: "Invalid Launch Site" });
  }

  // Valid input, return the data
  console.log(siteKey, weatherData[siteKey]);
  res.json(weatherData[siteKey]);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Weather API running at http://localhost:${PORT}`);
});
