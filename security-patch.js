/**
 * Security patch script for esbuild CORS vulnerability
 * 
 * This script patches the esbuild CORS vulnerability by replacing the default CORS handler
 * with a secure implementation that only allows specific origins.
 * 
 * To apply this patch, run:
 * node security-patch.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

// Find esbuild in node_modules
function findEsbuildPaths() {
  const basePath = path.join(__dirname, 'node_modules');
  
  // Look for the esbuild package
  const esbuildPath = path.join(basePath, 'esbuild');
  
  if (!fs.existsSync(esbuildPath)) {
    console.error('Cannot find esbuild in node_modules');
    return null;
  }
  
  // Look for lib files that might have CORS configurations
  const libFiles = [];
  const libPath = path.join(esbuildPath, 'lib');
  
  if (fs.existsSync(libPath)) {
    const files = fs.readdirSync(libPath);
    for (const file of files) {
      if (file.includes('serve') || file.includes('http')) {
        libFiles.push(path.join(libPath, file));
      }
    }
  }
  
  return {
    esbuildPath,
    libFiles
  };
}

// Patch esbuild CORS settings
function patchEsbuildCORS() {
  const paths = findEsbuildPaths();
  
  if (!paths) {
    return false;
  }
  
  // Create backup directory
  const backupDir = path.join(__dirname, 'security-backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }
  
  let patchCount = 0;
  
  // Patch each potentially vulnerable file
  for (const filePath of paths.libFiles) {
    const fileName = path.basename(filePath);
    const backupPath = path.join(backupDir, fileName + '.bak');
    
    // Backup the original file
    if (fs.existsSync(filePath) && !fs.existsSync(backupPath)) {
      fs.copyFileSync(filePath, backupPath);
      console.log(`Backed up ${fileName} to ${backupPath}`);
    }
    
    // Read the file content
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Look for vulnerable code patterns
      if (content.includes('Access-Control-Allow-Origin') && content.includes('*')) {
        // Replace vulnerable CORS headers with secure ones
        content = content.replace(
          /['"]Access-Control-Allow-Origin['"]:\s*['"]\*['"]/g,
          `'Access-Control-Allow-Origin': 'http://localhost:3000'`
        );
        
        // Write patched content back to file
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Patched CORS vulnerability in ${fileName}`);
        patchCount++;
      }
    }
  }
  
  if (patchCount > 0) {
    console.log(`Successfully patched ${patchCount} files`);
    return true;
  } else {
    console.log('No vulnerable CORS patterns found or files already patched');
    return false;
  }
}

// Main function
function main() {
  console.log('Applying security patch for esbuild CORS vulnerability...');
  
  const success = patchEsbuildCORS();
  
  if (success) {
    console.log('Security patch applied successfully');
    
    // Create or update the patch status file
    const statusFile = path.join(__dirname, '.security-patch-status');
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
    fs.writeFileSync(statusFile, JSON.stringify({
      patched: true,
      timestamp: new Date().toISOString(),
      version: packageJson.dependencies.esbuild || 'unknown'
    }, null, 2));
    
    console.log('Patch status file updated');
  } else {
    console.log('Failed to apply security patch or no vulnerable patterns found');
  }
}

// Run the patch
main();
