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
document.getElementById("crew-btn").addEventListener("click", () => {
  const mission = document.getElementById("crew-select").value;
  const crewOutput = `
  <h3>Crew Selected: ${mission}</h3>
  <div class="crew-grid">
    <div class="role-header">Commander</div>
    <div class="role-header">Pilot</div>
    <div class="role-header">Engineer</div>
    <div class="role-header">Mission Specialist</div>
    
    <div>Reid Wiseman</div>
    <div>Victor Glover</div>
    <div>Christina Koch</div>
    <div>Jeremy Hansen</div>
  </div>
`;
  document.getElementById("crew-output").innerHTML = crewOutput;
  updateChecklist("crew");
});

// === Destination selection handler ===
document.getElementById("destination-btn").addEventListener("click", () => {
  const destination = document.getElementById("destination-select").value;
  const destOutput = `
  <h3>Destination Selected: ${destination}</h3>
  <div class="destination-grid">
    <div class="dest-header">Distance</div>
    <div class="dest-header">Estimated Flight Time</div>
    <div class="dest-header">Fuel Requirement</div>

    <div>500 million km</div>
    <div>6 months</div>
    <div>700 tons</div>
  </div>
`;

  document.getElementById("destination-output").innerHTML = destOutput;
  updateChecklist("destination");
});

// === Weather selection handler ===
document.getElementById("weather-btn").addEventListener("click", () => {
  const site = document.getElementById("weather-select").value;
  const weather = "72°F, Overcast, 62% Humidity";
  const weatherOutput = `
    <h3>Weather at ${site}</h3>
    <p>${weather}</p>
  `;
  document.getElementById("weather-output").innerHTML = weatherOutput;
  updateChecklist("weather");
});

// === ISS tracking handler ===
document.getElementById("iss-btn").addEventListener("click", () => {
  const iss = "ISS currently over: South Pacific Ocean (Lat: -15.6, Lon: -137.8)";
  document.getElementById("iss-output").innerHTML = `<h3>ISS Location</h3><p>${iss}</p>`;
  updateChecklist("iss");
});

// === Launch button ===
document.getElementById("launch-btn").addEventListener("click", () => {
  if (missionAborted) {
    alert("LAUNCH ABORTED. Mission compromised due to code mismatch.");
  } else {
    alert("Launch Sequence Confirmed. GO FOR LAUNCH!");
  }
  resetMission(); // Automatically reset after launch
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
  const chars = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
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

