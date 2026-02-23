/**
 * Builds the frontend and copies output to backend/static for deployment.
 * Used by Azure (and other) deployment workflows so the backend can serve the SPA.
 */
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const staticDir = path.join(root, 'backend', 'static');

console.log('Building frontend...');
execSync('npm run build', { cwd: root, stdio: 'inherit' });

if (!fs.existsSync(distDir)) {
  console.error('Expected dist/ after build. Aborting.');
  process.exit(1);
}

if (fs.existsSync(staticDir)) {
  console.log('Removing existing backend/static...');
  fs.rmSync(staticDir, { recursive: true });
}
fs.mkdirSync(staticDir, { recursive: true });

console.log('Copying dist to backend/static...');
function copyRecursive(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const e of entries) {
    const srcPath = path.join(src, e.name);
    const destPath = path.join(dest, e.name);
    if (e.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
copyRecursive(distDir, staticDir);
console.log('Done. backend/static is ready for deployment.');
