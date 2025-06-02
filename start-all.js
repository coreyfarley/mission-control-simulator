const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Define the microservice directories and their ports
const microservices = [
  { dir: 'backend/destination-microservice', port: 3000, command: 'npm', args: ['start'] },
  { dir: 'backend/iss-microservice', port: 3001, command: 'npm', args: ['start'] },
  { dir: 'backend/weather-microservice', port: 3002, command: 'npm', args: ['start'] },
  { dir: 'backend/crew-microservice', port: 3003, command: 'npm', args: ['start'] },
  { dir: 'backend/main-server', port: 8080, command: 'npm', args: ['start'] }
];

console.log('Starting all microservices...\n');

// Track running processes
const processes = [];

// Function to start a microservice
function startMicroservice(service) {
  // For services using npm start, check for package.json
  if (service.command === 'npm' && !fs.existsSync(path.join(__dirname, service.dir, 'package.json'))) {
    console.log(`Skipping ${service.dir} - package.json not found`);
    return;
  }
  
  // For services using node directly, check for the specified JS file
  if (service.command === 'node' && !fs.existsSync(path.join(__dirname, service.dir, service.args[0]))) {
    console.log(`Skipping ${service.dir} - ${service.args[0]} not found`);
    return;
  }

  console.log(`Starting ${service.dir} on port ${service.port}...`);
  
  const process = spawn(service.command, service.args, {
    cwd: path.join(__dirname, service.dir),
    stdio: 'pipe',
    shell: true
  });

  processes.push(process);

  // Handle stdout
  process.stdout.on('data', (data) => {
    console.log(`[${service.dir}] ${data.toString().trim()}`);
  });

  // Handle stderr
  process.stderr.on('data', (data) => {
    console.error(`[${service.dir}] ${data.toString().trim()}`);
  });

  // Handle process exit
  process.on('close', (code) => {
    console.log(`${service.dir} exited with code ${code}`);
  });
}

// Start all microservices
microservices.forEach(startMicroservice);

console.log('\nAll microservices started!');
console.log('Main application is available at: http://localhost:8080');
console.log('Press Ctrl+C to stop all services\n');

// Handle script termination
process.on('SIGINT', () => {
  console.log('\nStopping all microservices...');
  processes.forEach(p => {
    p.kill();
  });
  console.log('All microservices stopped');
  process.exit(0);
});
