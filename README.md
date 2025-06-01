# Mission Control Simulator

A mission control simulator with microservices architecture for destination information, ISS tracking, weather data, and crew selection.

## Project Structure

- `frontend/`: Contains the web interface for the mission control dashboard
- `backend/`: Contains all microservices
  - `destination-microservice/`: Provides information about space destinations
  - `iss-microservice/`: Tracks the International Space Station location
  - `weather-microservice/`: Provides weather information for launch sites
  - `crew-microservice/`: Provides crew information for different missions

## Setup and Installation

1. Clone the repository
2. Install dependencies for all microservices at once using the provided script:

```bash
node install-all.js
```

Or install dependencies for each microservice individually:

```bash
# Install dependencies for destination microservice
cd backend/destination-microservice
npm install

# Install dependencies for ISS microservice
cd ../iss-microservice
npm install

# Install dependencies for weather microservice
cd ../weather-microservice
npm install

# Install dependencies for crew microservice
cd ../crew-microservice
npm install
```

## Running the Application

### Start all microservices

You can start all microservices at once using the provided script:

```bash
node start-all.js
```

Or open separate terminal windows for each microservice:

```bash
# Start destination microservice (port 3000)
cd backend/destination-microservice
npm start

# Start ISS microservice (port 3001)
cd backend/iss-microservice
npm start

# Start weather microservice (port 3002)
cd backend/weather-microservice
npm start

# Start crew microservice (port 3003)
cd backend/crew-microservice
npm start
```

### Open the frontend

Open the `frontend/index.html` file in your web browser.

## Microservice APIs

### Destination Microservice (Port 3000)

- `GET /trip-info?planet=<planet>`: Get information about a destination
  - Supported planets: moon, mars, venus, jupiter

### ISS Microservice (Port 3001)

- `GET /iss-location`: Get the current location of the ISS

### Weather Microservice (Port 3002)

- `GET /weather?site=<site>`: Get weather information for a launch site
  - Supported sites: cape canaveral, vandenberg, baikonur, tanegashima

### Crew Microservice (Port 3003)

- `GET /crew?mission=<mission>`: Get crew information for a mission
  - Supported missions: artemis ii, crew 4, expedition 73, crew 8

## Features

- Select mission crew
- Choose destination
- Check launch site weather
- Track ISS location
- Generate launch codes
- Randomize mission parameters
