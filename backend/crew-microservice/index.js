const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3003;

app.use(cors());

// Dummy crew data for different missions
const crewData = {
  "artemis ii": {
    commander: "Reid Wiseman",
    pilot: "Victor Glover",
    engineer: "Christina Koch",
    specialist: "Jeremy Hansen"
  },
  "crew 4": {
    commander: "Kjell N. Lindgren",
    pilot: "Robert Hines",
    engineer: "Samantha Cristoforetti",
    specialist: "Jessica Watkins"
  },
  "expedition 73": {
    commander: "Takuya Onishi",
    pilot: "Anne McClain",
    engineer: "Nichole Ayers",
    specialist: "Jonny Kim"
  },
  "crew 8": {
    commander: "Matthew Dominick",
    pilot: "Michael Barratt",
    engineer: "Sunita Williams",
    specialist: "Donald Pettit"
  }
};

app.get('/', (req, res) => {
  res.send('Crew API is up and running.');
});

// GET /crew?mission=artemis%20ii
app.get('/crew', (req, res) => {
  const rawMission = req.query.mission;

  // Check for missing parameter
  if (!rawMission || typeof rawMission !== 'string') {
    return res.status(400).json({ error: "Invalid or missing 'mission' parameter" });
  }

  const mission = rawMission.trim().toLowerCase();

  // Check if the mission exists in the data
  if (!crewData[mission]) {
    return res.status(400).json({ error: "Invalid Mission" });
  }

  // Valid input, return the data
  console.log(mission, crewData[mission]);
  res.json(crewData[mission]);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Crew API running at http://localhost:${PORT}`);
});
