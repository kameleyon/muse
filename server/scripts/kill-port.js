const { exec } = require('child_process');
const port = process.env.PORT || 9999;

console.log(`Killing any process on port ${port}...`);

// Try to kill the port - works on both Windows and Unix
exec(`npx kill-port ${port}`, (error) => {
  if (error) {
    console.log(`No process found on port ${port} or unable to kill it.`);
  } else {
    console.log(`Port ${port} cleared successfully.`);
  }
});