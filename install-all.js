const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Define the microservice directories
const microservices = [
  'backend/destination-microservice',
  'backend/iss-microservice',
  'backend/weather-microservice',
  'backend/crew-microservice'
];

console.log('Installing dependencies for all microservices...\n');

// Install dependencies for each microservice
microservices.forEach(dir => {
  if (fs.existsSync(path.join(__dirname, dir, 'package.json'))) {
    console.log(`\nInstalling dependencies for ${dir}...`);
    try {
      execSync('npm install', { 
        cwd: path.join(__dirname, dir),
        stdio: 'inherit'
      });
      console.log(`Successfully installed dependencies for ${dir}`);
    } catch (error) {
      console.error(`Error installing dependencies for ${dir}:`, error.message);
    }
  } else {
    console.log(`Skipping ${dir} - package.json not found`);
  }
});

console.log('\nAll dependencies installed successfully!');
console.log('\nTo start all microservices, run:');
console.log('node start-all.js');
