// Simple test script to verify security fix
const http = require('http');

// Test security fix for raw query parameter
const testRawBypass = () => {
  // Attempt to access .env file with raw query parameter
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/.env?raw',
    method: 'GET'
  };

  console.log('Testing security fix for ?raw query parameter...');
  console.log(`Making request to: ${options.path}`);

  const req = http.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    
    if (res.statusCode === 403) {
      console.log('PASS: Access is properly denied (403)');
    } else {
      console.log('FAIL: Access was not properly denied');
    }
    
    res.on('data', (chunk) => {
      console.log(`Response body: ${chunk}`);
    });
  });

  req.on('error', (e) => {
    console.error(`Error: ${e.message}`);
  });
  
  req.end();
};

// Wait for server to start before running tests
console.log('Start the Vite dev server with "npm run dev", then run this test');
console.log('NOTE: This test script should be run only in a development environment');
