const fs = require('fs');
const path = require('path');

const srcTemplates = path.resolve(__dirname, '../src/shared/infrastructure/email/templates');
const distTemplates = path.resolve(__dirname, '../dist/shared/infrastructure/email/templates');

if (fs.existsSync(srcTemplates)) {
  fs.mkdirSync(distTemplates, { recursive: true });
  fs.cpSync(srcTemplates, distTemplates, { recursive: true });
  console.log(`[copy-assets] Copied email templates from ${srcTemplates} to ${distTemplates}`);
} else {
  console.warn(`[copy-assets] Warning: Templates directory not found at ${srcTemplates}`);
}
