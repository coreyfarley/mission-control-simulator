// Configuration for microservice URLs
const CONFIG = {
  // Microservice URLs
  SERVICES: {
    DESTINATION: "https://mission-control-simulator-destination.onrender.com/",
    ISS: "https://mission-control-simulator-iss.onrender.com",
    WEATHER: "https://mission-control-simulator-weather.onrender.com",
    CREW: "https://mission-control-simulator-lrmb.onrender.com"
  },
  
  // API endpoints
  ENDPOINTS: {
    DESTINATION: "/trip-info",
    ISS: "/iss-location",
    WEATHER: "/weather",
    CREW: "/crew"
  },
  
  // For local development, set this to true to use localhost URLs
  USE_LOCAL: false,
  
  // Local ports (only used if USE_LOCAL is true)
  LOCAL_PORTS: {
    DESTINATION: 3000,
    ISS: 3001,
    WEATHER: 3002,
    CREW: 3003
  }
};

// Helper function to get the appropriate URL for a service
function getServiceUrl(service) {
  if (CONFIG.USE_LOCAL) {
    return `http://localhost:${CONFIG.LOCAL_PORTS[service]}`;
  }
  return CONFIG.SERVICES[service];
}

// Export the configuration
export { CONFIG, getServiceUrl };
