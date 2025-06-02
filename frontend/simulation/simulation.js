// Default constants for the simulation (will be overridden by mission data)
let MISSION_DISTANCE = 78000000; // Default value (km)
let MAX_VELOCITY = 150000; // km/h
let MISSION_DURATION = 210; // Default value (hours)
let INITIAL_FUEL = 100; // Default percentage
const UPDATE_INTERVAL = 1000; // ms

// Variables for the simulation
let missionStartTime = null;
let simulationTime = 0; // hours
let currentDistance = 0;
let currentVelocity = 0;
let fuelLevel = 100;
let rocketPositionElement = null;
let flightPath = null;
let flightPathLength = 0;
let telemetryInterval = null;
let missionComplete = false;
let solarJourneyMessageIndex = 0;
let simulationPaused = false;
let simulationSpeed = 1; // 1 = normal speed, 2 = 2x speed, etc.
let selectedDestination = "Olympus Mons, Mars"; // Default destination
let selectedPlanet = "mars"; // Default planet

// Telemetry data for the launch log
const telemetryData = [
  "Initializing telemetry stream...",
  "T+00:00:01 | Liftoff confirmed",
  "T+00:00:02 | Engines nominal",
  "T+00:00:04 | Velocity: 120 m/s | Altitude: 0.5 km",
  "T+00:00:07 | Velocity: 450 m/s | Altitude: 2.3 km",
  "T+00:00:11 | Roll: 3.2° | Pitch: 87.1° | Yaw: 0.5°",
  "T+00:00:15 | MECO confirmed",
  "T+00:00:18 | Stage separation confirmed",
  "T+00:00:20 | Second stage ignition",
  "T+00:00:25 | Velocity: 2,800 m/s | Altitude: 65.1 km",
  "T+00:00:30 | Target trajectory nominal",
  "T+00:00:35 | Telemetry lock acquired",
  "T+00:00:40 | Preparing for orbit insertion...",
  "T+00:00:45 | Mission parameters within bounds",
  "T+00:00:50 | Systems green | Awaiting next burn window..."
];

// Generate dynamic solar journey messages based on destination
function generateSolarJourneyData(destination) {
  const planetName = destination.split(",")[0];
  return [
    "T+01:00:00 | Earth orbit departure burn complete",
    `T+12:00:00 | Trajectory correction maneuver executed for ${planetName} approach`,
    "T+48:00:00 | Halfway point reached | All systems nominal",
    `T+96:00:00 | ${planetName} approach trajectory confirmed`,
    `T+120:00:00 | Beginning deceleration burn for ${planetName} orbit insertion`,
    `T+200:00:00 | Final approach to ${planetName} | Preparing landing systems`
  ];
}

// Default solar journey data
let solarJourneyData = [
  "T+01:00:00 | Earth orbit departure burn complete",
  "T+12:00:00 | Trajectory correction maneuver executed",
  "T+48:00:00 | Halfway point reached | All systems nominal",
  "T+96:00:00 | Mars approach trajectory confirmed",
  "T+120:00:00 | Beginning deceleration burn for Mars orbit insertion",
  "T+200:00:00 | Final approach to Mars | Preparing landing systems"
];

// Generate stars in the sky
function generateStars(count) {
  const container = document.getElementById("stars-container");
  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");
    star.classList.add("star");
    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 2}s`;
    container.appendChild(star);
  }
}

// Start the star animation for day time
function startDayStars() {
  const stars = document.querySelectorAll(".star");
  stars.forEach(star => {
    star.classList.add("day");
    star.classList.remove("space");
  });
}

// Start the star animation for space
function startSpaceStars() {
  const stars = document.querySelectorAll(".star");
  stars.forEach(star => {
    star.classList.remove("day");
    star.classList.add("space");
  });
}

// Calculate and draw the flight path
function calculateFlightPath() {
  const path = document.querySelector("#flight-path path");
  const earth = document.getElementById("earth");
  const destination = document.getElementById("destination");
  
  if (!path || !earth || !destination) return;
  
  const startRect = earth.getBoundingClientRect();
  const endRect = destination.getBoundingClientRect();

  const startX = startRect.left + startRect.width / 2;
  const startY = startRect.top + startRect.height / 2;
  const endX = endRect.left + endRect.width / 2;
  const endY = endRect.top + endRect.height / 2;

  // Adjust control points to ensure the curve reaches Mars
  const controlX1 = startX + (endX - startX) * 0.3;
  const controlY1 = startY - 100;
  const controlX2 = endX;
  const controlY2 = endY;

  const curve = `M${startX},${startY} C${controlX1},${controlY1} ${controlX2},${controlY2} ${endX},${endY}`;
  path.setAttribute("d", curve);
  
  // Store the path for animation
  flightPath = path;
  
  // If the rocket is already positioned on the path, update its position
  if (rocketPositionElement && rocketPositionElement.style.display === "block" && flightPathLength > 0) {
    const progress = simulationTime / MISSION_DURATION;
    updateRocketPosition(Math.min(progress, 1));
  }
  
  // Update the flight path length for animation
  flightPathLength = flightPath.getTotalLength();
}

// Show the solar system view
function showSolarView() {
  document.getElementById("launch-sequence").style.display = "none";
  const solar = document.getElementById("solar-view");
  solar.style.display = "flex";

  // Get rocket position element
  rocketPositionElement = document.getElementById("rocket-position");
  
  // Initialize the solar telemetry log with the last two messages from the launch sequence
  const solarLog = document.getElementById("solar-telemetry-log");
  solarLog.textContent = telemetryData[telemetryData.length - 2] + "\n" + telemetryData[telemetryData.length - 1] + "\n";
  solarJourneyMessageIndex = 0;
  
  // Wait a moment for elements to be fully rendered
  setTimeout(() => {
    // Calculate and draw the flight path
    calculateFlightPath();
    
    // Start the telemetry simulation
    startTelemetrySimulation();
    
    // Add window resize event listener to recalculate flight path
    window.addEventListener("resize", handleWindowResize);
  }, 100);
}

// Handle window resize
function handleWindowResize() {
  // Debounce the resize event to avoid excessive calculations
  if (window.resizeTimeout) {
    clearTimeout(window.resizeTimeout);
  }
  
  window.resizeTimeout = setTimeout(() => {
    calculateFlightPath();
  }, 250);
}

// Start the telemetry simulation
function startTelemetrySimulation() {
  missionStartTime = new Date();
  rocketPositionElement.style.display = "block";
  
  // Get the total length of the path for animation
  flightPathLength = flightPath.getTotalLength();
  
  // Initialize telemetry values
  updateTelemetryValues();
  
  // Start the telemetry update interval
  telemetryInterval = setInterval(updateTelemetryValues, UPDATE_INTERVAL);
  
  // Add event listeners for simulation controls
  document.getElementById("pause-btn").addEventListener("click", togglePause);
  document.getElementById("fast-forward-btn").addEventListener("click", toggleFastForward);
}

// Toggle pause/play
function togglePause() {
  simulationPaused = !simulationPaused;
  
  // Update button appearance
  const pauseBtn = document.getElementById("pause-btn");
  const pauseIcon = pauseBtn.querySelector(".pause-icon");
  const playIcon = pauseBtn.querySelector(".play-icon");
  
  if (simulationPaused) {
    pauseIcon.classList.add("hidden");
    playIcon.classList.remove("hidden");
  } else {
    pauseIcon.classList.remove("hidden");
    playIcon.classList.add("hidden");
  }
}

// Toggle fast forward
function toggleFastForward() {
  // Cycle through speeds: 1x -> 2x -> 5x -> 1x
  if (simulationSpeed === 1) {
    simulationSpeed = 2;
  } else if (simulationSpeed === 2) {
    simulationSpeed = 5;
  } else {
    simulationSpeed = 1;
  }
  
  // Update button text to show current speed
  const ffIcon = document.querySelector(".ff-icon");
  ffIcon.textContent = simulationSpeed + "x";
}

// Update telemetry values
function updateTelemetryValues() {
  // Skip updates if simulation is paused
  if (simulationPaused) return;
  
  // Increment simulation time (accelerated for visual effect)
  simulationTime += UPDATE_INTERVAL / 1000 * (MISSION_DURATION / 60) * simulationSpeed;
  
  // Calculate progress as a percentage (0-1)
  const progress = Math.min(simulationTime / MISSION_DURATION, 1);
  
  // Calculate current distance
  currentDistance = MISSION_DISTANCE * progress;
  
  // Calculate remaining distance
  const remainingDistance = MISSION_DISTANCE - currentDistance;
  
  // Calculate velocity (bell curve: starts slow, accelerates, then decelerates)
  const velocityFactor = 4 * progress * (1 - progress);
  currentVelocity = MAX_VELOCITY * velocityFactor + 30000;
  
  // Calculate ETA
  const etaHours = remainingDistance / currentVelocity;
  
  // Calculate fuel level (decreases more rapidly at the beginning)
  fuelLevel = 100 - (progress * 100 * (1.1 - 0.2 * progress));
  
  // Update the rocket position along the path
  updateRocketPosition(progress);
  
  // Update the telemetry display
  updateTelemetryDisplay(
    simulationTime,
    currentDistance,
    remainingDistance,
    currentVelocity,
    etaHours,
    fuelLevel
  );
  
  // Update solar journey log at specific progress points
  updateSolarJourneyLog(progress);
  
  // Check if mission is complete
  if (progress >= 1 && !missionComplete) {
    missionComplete = true;
    showMissionComplete();
  }
}

// Update the solar journey log at specific progress points
function updateSolarJourneyLog(progress) {
  const solarLog = document.getElementById("solar-telemetry-log");
  
  // Add new messages at specific progress points
  if (solarJourneyMessageIndex < solarJourneyData.length) {
    const progressThresholds = [0.15, 0.3, 0.5, 0.7, 0.85, 0.95];
    
    if (progress >= progressThresholds[solarJourneyMessageIndex]) {
      solarLog.textContent += solarJourneyData[solarJourneyMessageIndex] + "\n";
      solarLog.scrollTop = solarLog.scrollHeight;
      solarJourneyMessageIndex++;
    }
  }
}

// Show mission complete message
function showMissionComplete() {
  document.getElementById("mission-complete").style.display = "block";
  document.getElementById("restart-btn").style.display = "block";
}

// Update rocket position along the path
function updateRocketPosition(progress) {
  if (!flightPath || !rocketPositionElement) return;
  
  // Get the point at the current position along the path
  const point = flightPath.getPointAtLength(flightPathLength * progress);
  
  // Calculate the angle of rotation for the rocket
  let angle = 0;
  if (progress < 0.98) {
    const pointAhead = flightPath.getPointAtLength(flightPathLength * Math.min(progress + 0.02, 0.98));
    angle = Math.atan2(pointAhead.y - point.y, pointAhead.x - point.x) * 180 / Math.PI;
  }
  
  // Position the rocket
  rocketPositionElement.style.left = `${point.x}px`;
  rocketPositionElement.style.top = `${point.y}px`;
  rocketPositionElement.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
}

// Update telemetry display
function updateTelemetryDisplay(time, distance, remaining, velocity, etaHours, fuel) {
  // Format mission time
  const days = Math.floor(time / 24);
  const hours = Math.floor(time % 24);
  const minutes = Math.floor((time * 60) % 60);
  const timeFormatted = `${days.toString().padStart(2, '0')}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`;
  
  // Format ETA
  const etaDays = Math.floor(etaHours / 24);
  const etaHoursRem = Math.floor(etaHours % 24);
  const etaMinutes = Math.floor((etaHours * 60) % 60);
  const etaFormatted = `${etaDays.toString().padStart(2, '0')}d ${etaHoursRem.toString().padStart(2, '0')}h ${etaMinutes.toString().padStart(2, '0')}m`;
  
  // Format distance and velocity with thousand separators
  const distanceFormatted = Math.round(distance).toLocaleString() + " km";
  const remainingFormatted = Math.round(remaining).toLocaleString() + " km";
  const velocityFormatted = Math.round(velocity).toLocaleString() + " km/h";
  
  // Format fuel level
  const fuelFormatted = Math.max(0, Math.round(fuel)) + "%";
  
  // Update the display elements with highlighting effect
  updateElementWithHighlight("mission-time", timeFormatted);
  updateElementWithHighlight("distance", distanceFormatted);
  updateElementWithHighlight("remaining", remainingFormatted);
  updateElementWithHighlight("velocity", velocityFormatted);
  updateElementWithHighlight("eta", etaFormatted);
  updateElementWithHighlight("fuel-status", fuelFormatted);
  
  // Update the fuel bar
  document.getElementById("fuel-bar").style.width = `${Math.max(0, fuel)}%`;
  
  // Update system status
  let systemStatus = "SYSTEM STATUS: All systems nominal";
  if (fuel < 20) {
    systemStatus = "SYSTEM STATUS: Low fuel warning";
  } else if (velocity > 140000) {
    systemStatus = "SYSTEM STATUS: High velocity warning";
  }
  document.getElementById("system-status").textContent = systemStatus;
}

// Update element with highlight effect
function updateElementWithHighlight(elementId, newValue) {
  const element = document.getElementById(elementId);
  if (element.textContent !== newValue) {
    element.textContent = newValue;
    element.classList.remove("highlight");
    void element.offsetWidth; // Trigger reflow
    element.classList.add("highlight");
  }
}

// Display telemetry log
function displayTelemetryLog() {
  const log = document.getElementById("telemetry-log");
  log.classList.remove("hidden");
  let i = 0;
  const interval = setInterval(() => {
    if (i < telemetryData.length) {
      log.textContent += telemetryData[i] + "\n";
      log.scrollTop = log.scrollHeight;
      i++;
    } else {
      clearInterval(interval);
    }
  }, 1500); // Slowed down from 500ms to 1500ms
}

// Reset simulation
function resetSimulation() {
  // Reset all simulation variables
  missionStartTime = null;
  simulationTime = 0;
  currentDistance = 0;
  currentVelocity = 0;
  fuelLevel = 100;
  missionComplete = false;
  simulationPaused = false;
  simulationSpeed = 1;
  
  // Clear any intervals
  if (telemetryInterval) {
    clearInterval(telemetryInterval);
    telemetryInterval = null;
  }
  
  // Reset UI elements
  document.getElementById("mission-complete").style.display = "none";
  document.getElementById("restart-btn").style.display = "none";
  document.getElementById("solar-view").style.display = "none";
  document.getElementById("launch-sequence").classList.add("hidden");
  document.getElementById("start-btn").style.display = "block";
  
  // Reset control buttons
  const pauseIcon = document.querySelector(".pause-icon");
  const playIcon = document.querySelector(".play-icon");
  const ffIcon = document.querySelector(".ff-icon");
  
  pauseIcon.classList.remove("hidden");
  playIcon.classList.add("hidden");
  ffIcon.textContent = "1x";
  
  // Reset telemetry logs
  document.getElementById("telemetry-log").textContent = "";
  document.getElementById("telemetry-log").classList.add("hidden");
  document.getElementById("solar-telemetry-log").textContent = "";
  solarJourneyMessageIndex = 0;
  
  // Reset space background
  document.getElementById("space").classList.remove("in-space");
  document.getElementById("space").classList.remove("mid-altitude");
  document.getElementById("ground").classList.remove("hidden");
  document.getElementById("ground").classList.remove("scrolling");
  
  // Clear stars
  document.getElementById("stars-container").innerHTML = "";
  
  // Reset rocket position
  const rocket = document.getElementById("rocket");
  rocket.style.animation = "none";
  rocket.offsetHeight; // Trigger reflow
}

// Function to start the launch sequence
function startLaunchSequence() {
  document.getElementById("launch-sequence").classList.remove("hidden");
  document.getElementById("start-btn").style.display = "none";
  generateStars(200);
  
  // Start the launch sequence with a gradual transition to space
  setTimeout(() => {
    // Start rocket animation
    document.getElementById("rocket").style.animation = "liftOff 6s ease-in forwards";
    
    // Start ground scrolling animation
    document.getElementById("ground").classList.add("scrolling");
    
    // Start with day time stars to create climbing illusion
    startDayStars();
    
    // After a delay, transition to mid-altitude
    setTimeout(() => {
      document.getElementById("space").classList.add("mid-altitude");
      
      // After another delay, transition to space
      setTimeout(() => {
        document.getElementById("space").classList.add("in-space");
        document.getElementById("space").classList.remove("mid-altitude");
        document.getElementById("ground").classList.add("hidden");
        
        // Keep the same star animation in space
        startSpaceStars();
        
        // Wait for stars to fall for 2 seconds before showing solar view
        setTimeout(showSolarView, 2000);
      }, 2500);
    }, 1500);
  }, 1000);
  
  // Display telemetry log
  displayTelemetryLog();
}

// Show mission complete message
function showMissionComplete() {
  document.getElementById("mission-complete").style.display = "block";
  document.getElementById("restart-btn").style.display = "block";
  
  // Update the destination name in the mission complete message
  const destinationName = selectedDestination.split(",")[0];
  document.getElementById("destination-name").textContent = destinationName;
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Get mission data from localStorage
  selectedDestination = localStorage.getItem("selectedDestination") || "Olympus Mons, Mars";
  selectedPlanet = localStorage.getItem("selectedPlanet") || "mars";
  
  // Update the destination image based on the selected planet
  const destinationImg = document.getElementById("destination");
  destinationImg.src = `../images/${selectedPlanet}.png`;
  
  // Make the moon image larger if it's selected
  if (selectedPlanet === "moon") {
    destinationImg.style.width = "120px"; // Increase size for the moon
  } else {
    destinationImg.style.width = "80px"; // Default size for other planets
  }
  
  // Update the destination name in the mission complete message
  const destinationName = selectedDestination.split(",")[0];
  document.getElementById("destination-name").textContent = destinationName;
  
  // Generate dynamic solar journey messages based on the selected destination
  solarJourneyData = generateSolarJourneyData(selectedDestination);
  
  // Parse mission data from localStorage
  const distanceStr = localStorage.getItem("missionDistance") || "";
  const durationStr = localStorage.getItem("missionDuration") || "";
  const fuelStr = localStorage.getItem("missionFuel") || "";
  
  // Extract numeric values from the strings (removing commas and units)
  if (distanceStr) {
    const distanceMatch = distanceStr.match(/[\d,]+/);
    if (distanceMatch) {
      MISSION_DISTANCE = parseInt(distanceMatch[0].replace(/,/g, ""));
    }
  }
  
  if (durationStr) {
    // Parse duration - could be in various formats like "9 days" or "210 hours"
    // We'll need to convert to hours for the simulation
    const durationMatch = durationStr.match(/(\d+)\s*(\w+)/);
    if (durationMatch) {
      const value = parseInt(durationMatch[1]);
      const unit = durationMatch[2].toLowerCase();
      
      if (unit.includes("day")) {
        MISSION_DURATION = value * 24; // Convert days to hours
      } else if (unit.includes("hour")) {
        MISSION_DURATION = value;
      }
    }
  }
  
  // Hide the start button and automatically start the launch sequence
  document.getElementById("start-btn").style.display = "none";
  
  // Add event listener for the return home button
  document.getElementById("return-home-btn").addEventListener("click", () => {
    window.location.href = "../landing.html";
  });
  
  // Add event listener for the return to dashboard button
  document.getElementById("return-dashboard-btn").addEventListener("click", () => {
    window.location.href = "../index.html";
  });
  
  // Start the launch sequence automatically
  startLaunchSequence();
  
  // Keep the start button event listener for potential manual starts
  document.getElementById("start-btn").addEventListener("click", startLaunchSequence);
  
  // Restart button event listener
  document.getElementById("restart-btn").addEventListener("click", resetSimulation);
});
