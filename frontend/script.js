const statusFlags = {
    crew: false,
    destination: false,
    weather: false,
    iss: false,
  };
  
  function updateChecklist(serviceId) {
    document.getElementById(`${serviceId}-status`).textContent = "✅";
    statusFlags[serviceId] = true;
  
    // Enable launch button if all services are complete
    const allReady = Object.values(statusFlags).every(v => v === true);
    document.getElementById("launch-btn").disabled = !allReady;
  }
  
  // Crew Selection
  document.getElementById("crew-btn").addEventListener("click", () => {
    const mission = document.getElementById("crew-select").value;
  
    const crewOutput = `
      <h3>Crew Selected: ${mission}</h3>
      <ul>
        <li>Commander: Reid Wiseman</li>
        <li>Pilot: Victor Glover</li>
        <li>Engineer: Christina Koch</li>
        <li>Mission Specialist: Jeremy Hansen</li>
      </ul>
    `;
    document.getElementById("crew-output").innerHTML = crewOutput;
    updateChecklist("crew");
  });
  
  // Destination Selection
  document.getElementById("destination-btn").addEventListener("click", () => {
    const destination = document.getElementById("destination-select").value;
  
    const destOutput = `
      <h3>Destination Selected: ${destination}</h3>
      <p>Distance: 500 million km</p>
      <p>Estimated Flight Time: 6 months</p>
      <p>Fuel Requirement: 700 tons</p>
    `;
    document.getElementById("destination-output").innerHTML = destOutput;
    updateChecklist("destination");
  });
  
  // Weather Selection
  document.getElementById("weather-btn").addEventListener("click", () => {
    const site = document.getElementById("weather-select").value;
  
    const weather = "72°F, Overcast, 62% Humidity"; // Static placeholder
    const weatherOutput = `
      <h3>Weather at ${site}</h3>
      <p>${weather}</p>
    `;
    document.getElementById("weather-output").innerHTML = weatherOutput;
    updateChecklist("weather");
  });
  
  // ISS Tracking
  document.getElementById("iss-btn").addEventListener("click", () => {
    const iss = "ISS currently over: South Pacific Ocean (Lat: -15.6, Lon: -137.8)";
    document.getElementById("iss-output").innerHTML = `<h3>ISS Location</h3><p>${iss}</p>`;
    updateChecklist("iss");
  });
  
  // Launch Confirmation
  document.getElementById("launch-btn").addEventListener("click", () => {
    alert("🚀 Launch Sequence Confirmed. GO FOR LAUNCH!");
  });
  