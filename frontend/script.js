// Import configuration
import { CONFIG, getServiceUrl } from './config.js';

// === Track the status of each service selection ===
const statusFlags = {
  crew: false,
  destination: false,
  weather: false,
  iss: false,
};

let launchCode = "";
let missionAborted = false;

// === Update checklist and check launch code readiness ===
function updateChecklist(serviceId) {
  document.getElementById(`${serviceId}-status`).classList.add("ready");
  statusFlags[serviceId] = true;

  const allReady = Object.values(statusFlags).every(v => v === true);
  if (allReady) {
    generateAndDisplayLaunchCode();
  }
}

// === Crew selection handler ===
document.getElementById("crew-btn").addEventListener("click", async () => {
  const mission = document.getElementById("crew-select").value;
  
  try {
    const url = `${getServiceUrl('CREW')}${CONFIG.ENDPOINTS.CREW}?mission=${encodeURIComponent(mission.toLowerCase())}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    const crewOutput = `
    <div class="output-box">
    <div class="crew-grid">
      <div class="role-header">Commander</div>
      <div class="role-header">Pilot</div>
      <div class="role-header">Engineer</div>
      <div class="role-header">Specialist</div>
      
      <div>${data.commander}</div>
      <div>${data.pilot}</div>
      <div>${data.engineer}</div>
      <div>${data.specialist}</div>
    </div>
    </div>
  `;
    
    document.getElementById("crew-output").innerHTML = crewOutput;
    updateChecklist("crew");
  } catch (error) {
    console.error("Error fetching crew data:", error);
    document.getElementById("crew-output").innerHTML = `
      <div class="output-box error">
        <p>Error loading crew data. Please try again.</p>
      </div>
    `;
  }
});

// === Destination selection handler ===
document.getElementById("destination-btn").addEventListener("click", async () => {
  const destination = document.getElementById("destination-select").value;
  
  // Check if a destination is selected
  if (!destination) {
    document.getElementById("destination-output").innerHTML = `
      <div class="output-box error">
        <p>Error loading destination data. Please try again.</p>
      </div>
    `;
    return;
  }
  
    // Map the destination to the planet parameter expected by the API
    const destinationMap = {
      "Maxwell Montes, Venus": "venus",
      "Sea of Tranquility, Moon": "moon",
      "Olympus Mons, Mars": "mars",
      "Great Red Spot, Jupiter": "jupiter" // Maps to jupiter.png
    };
  
  const planet = destinationMap[destination] || "moon";
  
  try {
    const url = `${getServiceUrl('DESTINATION')}${CONFIG.ENDPOINTS.DESTINATION}?planet=${planet}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    const destOutput = `
    <div class="output-box">
    <div class="destination-grid">
      <div class="dest-header">Distance</div>
      <div class="dest-header">Flight Time</div>
      <div class="dest-header">Fuel</div>

      <div>${data.distance.toLocaleString()} km</div>
      <div>${data.duration}</div>
      <div>${data.fuel.toLocaleString()} tons</div>
    </div>
    </div>
  `;

    document.getElementById("destination-output").innerHTML = destOutput;
    updateChecklist("destination");
  } catch (error) {
    console.error("Error fetching destination data:", error);
    document.getElementById("destination-output").innerHTML = `
      <div class="output-box error">
        <p>Error loading destination data. Please try again.</p>
      </div>
    `;
  }
});

// === Weather selection handler ===
document.getElementById("weather-btn").addEventListener("click", async () => {
  const site = document.getElementById("weather-select").value;
  
  try {
    const url = `${getServiceUrl('WEATHER')}${CONFIG.ENDPOINTS.WEATHER}?site=${encodeURIComponent(site)}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    const weatherOutput = `
      <div class="output-box">
        <div class="weather-grid">
          <div class="weather-header">Temperature</div>
          <div class="weather-header">Skies</div>
          <div class="weather-header">Humidity</div>

          <div>${data.temperature}</div>
          <div>${data.skies}</div>
          <div>${data.humidity}</div>
        </div>
      </div>
    `;

    document.getElementById("weather-output").innerHTML = weatherOutput;
    updateChecklist("weather");
  } catch (error) {
    console.error("Error fetching weather data:", error);
    document.getElementById("weather-output").innerHTML = `
      <div class="output-box error">
        <p>Error loading weather data. Please try again.</p>
      </div>
    `;
  }
});


// === ISS tracking handler ===
document.getElementById("iss-btn").addEventListener("click", async () => {
  try {
    const url = `${getServiceUrl('ISS')}${CONFIG.ENDPOINTS.ISS}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    const iss = `${data.region} (Lat: ${data.latitude}, Lon: ${data.longitude})`;
    document.getElementById("iss-output").innerHTML = `<div class="output-box"><h3>ISS Location</h3><p>${iss}</p></div>`;
    updateChecklist("iss");
  } catch (error) {
    console.error("Error fetching ISS data:", error);
    document.getElementById("iss-output").innerHTML = `
      <div class="output-box error">
        <p>Error tracking ISS. Please try again.</p>
      </div>
    `;
  }
});

// === Launch button ===
document.getElementById("launch-btn").addEventListener("click", () => {
  if (missionAborted) {
    alert("LAUNCH ABORTED. Mission compromised due to code mismatch.");
    resetMission(); // Only reset if mission is aborted
  } else {
    // Get the selected destination and its data
    const destination = document.getElementById("destination-select").value;
    
    // Map the destination to the planet parameter expected by the API
    const destinationMap = {
      "Maxwell Montes, Venus": "venus",
      "Sea of Tranquility, Moon": "moon",
      "Olympus Mons, Mars": "mars",
      "Great Red Spot, Jupiter": "jupiter"
    };
    
    const planet = destinationMap[destination] || "moon";
    
    // Get the destination data from the output that was received from the microservice
    const destinationOutput = document.getElementById("destination-output");
    
    // Store mission data in localStorage
    localStorage.setItem("selectedDestination", destination);
    localStorage.setItem("selectedPlanet", planet);
    
    // If we have destination output data, store it too
    if (destinationOutput) {
      const distanceElement = destinationOutput.querySelector(".destination-grid div:nth-child(4)");
      const durationElement = destinationOutput.querySelector(".destination-grid div:nth-child(5)");
      const fuelElement = destinationOutput.querySelector(".destination-grid div:nth-child(6)");
      
      localStorage.setItem("missionDistance", distanceElement ? distanceElement.textContent : "");
      localStorage.setItem("missionDuration", durationElement ? durationElement.textContent : "");
      localStorage.setItem("missionFuel", fuelElement ? fuelElement.textContent : "");
    }
    
    // Navigate to the simulation page
    window.location.href = "simulation/index-simulation.html";
  }
});

// === Reset Confirmation PopUp ===
document.getElementById("reset-btn").addEventListener("click", () => {
  document.getElementById("reset-confirm").classList.remove("hidden");
});

// when user clicks cancel in the popup
document.getElementById("cancel-reset").addEventListener("click", () => {
  document.getElementById("reset-confirm").classList.add("hidden");
});

// when the user clicks "yes" in the popup
document.getElementById("confirm-reset").addEventListener("click", () => {
  resetMission(); 
  document.getElementById("reset-confirm").classList.add("hidden");
});

// === Info Modal Open Buttons ===
document.querySelectorAll(".info-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-target");
    const modal = document.getElementById(targetId);
    if (modal) {
      modal.classList.remove("hidden");
    }
  });
});

// === Info Modal Close Buttons ===
document.querySelectorAll(".close-info").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.closest(".modal").classList.add("hidden");
  });
});

// === Launch Code Logic ===
function generateLaunchCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function generateAndDisplayLaunchCode() {
  launchCode = generateLaunchCode();
  document.getElementById("launch-code").textContent = launchCode.split("").join(" , ");
  document.getElementById("launch-code-section").classList.remove("hidden");
  document.getElementById("code-confirmation").classList.remove("hidden");
}

const codeInput = document.getElementById("code-input");
codeInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const enteredCode = codeInput.value.toUpperCase();
    if (enteredCode === launchCode) {
      missionAborted = false;
      codeInput.classList.remove("incorrect");
      codeInput.classList.add("correct");
      document.getElementById("launch-btn").disabled = false;
      document.getElementById("launch-btn").style.backgroundColor = "#00ff00";
    } else {
      codeInput.classList.remove("correct");
      codeInput.classList.add("incorrect");
      document.getElementById("code-warning").classList.remove("hidden");
    }
  }
});

document.getElementById("retry-code").addEventListener("click", () => {
  document.getElementById("code-warning").classList.add("hidden");
  codeInput.value = "";
  codeInput.focus();
});

document.getElementById("force-launch").addEventListener("click", () => {
  document.getElementById("code-warning").classList.add("hidden");
  document.getElementById("launch-btn").disabled = false;
  document.getElementById("launch-btn").style.backgroundColor = "#ff0000";
  missionAborted = true;
});

// === Reusable Reset Function ===
function resetMission() {
  const services = ["crew", "destination", "weather", "iss"];

  // Reset dropdowns (skip 'ISS' which has no dropdown)
  services.slice(0, 3).forEach(service => {
    const select = document.getElementById(`${service}-select`);
    if (select) select.selectedIndex = 0;
  });

  // Clear outputs
  services.forEach(service => {
    document.getElementById(`${service}-output`).innerHTML = "";
  });

  // Reset status indicators
  services.forEach(service => {
    document.getElementById(`${service}-status`).classList.remove("ready");
  });

  // Reset flags and abort status
  for (let key in statusFlags) {
    statusFlags[key] = false;
  }
  missionAborted = false;
  launchCode = "";

  // Reset launch UI
  document.getElementById("launch-btn").disabled = true;
  document.getElementById("launch-btn").style.backgroundColor = "";
  document.getElementById("launch-code").textContent = "_ , _ , _ , _";
  document.getElementById("code-input").value = "";
  document.getElementById("code-input").classList.remove("correct", "incorrect");

  // Hide launch code sections
  document.getElementById("launch-code-section").classList.add("hidden");
  document.getElementById("code-confirmation").classList.add("hidden");
  document.getElementById("code-warning").classList.add("hidden");
  
  // Hide info modals
  document.querySelectorAll(".modal").forEach(modal => {
    modal.classList.add("hidden");
  });
}

// Randomize Mission Logic
document.getElementById("randomize-btn").addEventListener("click", () => {
  const getRandomIndex = (options) => Math.floor(Math.random() * (options.length - 1)) + 1;

  // Randomly select valid options (skip the disabled placeholder at index 0)
  const crewSelect = document.getElementById("crew-select");
  const destSelect = document.getElementById("destination-select");
  const weatherSelect = document.getElementById("weather-select");

  crewSelect.selectedIndex = getRandomIndex(crewSelect.options);
  destSelect.selectedIndex = getRandomIndex(destSelect.options);
  weatherSelect.selectedIndex = getRandomIndex(weatherSelect.options);

  // Trigger confirmation buttons
  document.getElementById("crew-btn").click();
  document.getElementById("destination-btn").click();
  document.getElementById("weather-btn").click();

  // Trigger ISS tracking
  document.getElementById("iss-btn").click();
});

// === Keyboard Shortcut for Reset (R) ===
document.addEventListener("keydown", (event) => {
  const tag = document.activeElement.tagName.toLowerCase();
  const isTyping = tag === "input" || tag === "textarea";

  if (!isTyping && event.key.toLowerCase() === "r") {
    event.preventDefault();
    // Simulate clicking the reset button
    document.getElementById("reset-btn").click();
  }
});
c
