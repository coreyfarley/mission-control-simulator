const statusFlags = {
    crew: false,
    destination: false,
    weather: false,
    iss: false,
  };
  
  function updateChecklist(serviceId) {
    document.getElementById(`${serviceId}-status`).textContent = "✅";
    statusFlags[serviceId] = true;
  
    // enable launch button if all services are complete
    const allReady = Object.values(statusFlags).every(v => v === true);
    document.getElementById("launch-btn").disabled = !allReady;
  }
  
  // crew selection
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
  
  // destination selection
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
  
  // weather selection
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
  
  // ISS tracking
  document.getElementById("iss-btn").addEventListener("click", () => {
    const iss = "ISS currently over: South Pacific Ocean (Lat: -15.6, Lon: -137.8)";
    document.getElementById("iss-output").innerHTML = `<h3>ISS Location</h3><p>${iss}</p>`;
    updateChecklist("iss");
  });
  
  // launch confirmation
  document.getElementById("launch-btn").addEventListener("click", () => {
    alert("🚀 Launch Sequence Confirmed. GO FOR LAUNCH!");
  });

  // reset button functionality
  // opens modal
document.getElementById("reset-btn").addEventListener("click", () => {
  document.getElementById("reset-confirm").classList.remove("hidden");
});

// cancel button hides modal
document.getElementById("cancel-reset").addEventListener("click", () => {
  document.getElementById("reset-confirm").classList.add("hidden");
});

// confirm reset
document.getElementById("confirm-reset").addEventListener("click", () => {
  // reset dropdowns to default
  document.getElementById("crew-select").selectedIndex = 0;
  document.getElementById("destination-select").selectedIndex = 0;
  document.getElementById("weather-select").selectedIndex = 0;

  // clear output areas
  document.getElementById("crew-output").innerHTML = "";
  document.getElementById("destination-output").innerHTML = "";
  document.getElementById("weather-output").innerHTML = "";
  document.getElementById("iss-output").innerHTML = "";

  // reset status indicators
  document.getElementById("crew-status").textContent = "❌";
  document.getElementById("destination-status").textContent = "❌";
  document.getElementById("weather-status").textContent = "❌";
  document.getElementById("iss-status").textContent = "❌";

  // reset internal flags
  for (let key in statusFlags) {
    statusFlags[key] = false;
  }

  // disable launch button
  document.getElementById("launch-btn").disabled = true;

  // hide modal
  document.getElementById("reset-confirm").classList.add("hidden");
});

  