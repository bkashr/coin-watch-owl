import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy manifest.json
fs.copyFileSync(
  path.join(__dirname, 'public', 'manifest.json'),
  path.join(distDir, 'manifest.json')
);

// Copy icons directory
copyDir(
  path.join(__dirname, 'public', 'icons'),
  path.join(distDir, 'icons')
);

// Ensure index.html exists
if (!fs.existsSync(path.join(distDir, 'index.html'))) {
  console.error('index.html not found in dist directory!');
  process.exit(1);
}

// Ensure background.js exists
if (!fs.existsSync(path.join(distDir, 'background.js'))) {
  console.error('background.js not found in dist directory!');
  process.exit(1);
}

console.log('Build files copied successfully!'); 