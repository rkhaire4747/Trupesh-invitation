const fs = require('fs');
const path = require('path');

console.log('--- Verifying Wedding Invitation Website Assets & Logic ---');

const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('styles/main.css', 'utf8');
const js = fs.readFileSync('scripts/main.js', 'utf8');

// Check JS syntax
try {
  new Function(js);
  console.log('✅ JavaScript syntax valid!');
} catch (e) {
  console.error('❌ JS syntax error:', e);
}

// Check asset paths in HTML
const assetMatches = Array.from(html.matchAll(/(?:src|href)=["'](\.\/assets\/[^"']+)["']/g)).map(m => m[1]);
console.log(`Checking ${assetMatches.length} assets referenced in HTML:`);
let missingAssets = 0;
assetMatches.forEach(relPath => {
  const localPath = relPath.replace(/^\.\//, '');
  if (fs.existsSync(localPath)) {
    console.log(`  ✅ Exists: ${localPath} (${(fs.statSync(localPath).size / 1024).toFixed(1)} KB)`);
  } else {
    console.error(`  ❌ MISSING: ${localPath}`);
    missingAssets++;
  }
});

// Check asset paths in CSS
const cssUrls = Array.from(css.matchAll(/url\(["']?(\.\.\/assets\/[^"')]+)["']?\)/g)).map(m => m[1]);
console.log(`Checking ${cssUrls.length} assets referenced in CSS:`);
cssUrls.forEach(relPath => {
  const localPath = path.join('styles', relPath);
  if (fs.existsSync(localPath)) {
    console.log(`  ✅ Exists: ${localPath} (${(fs.statSync(localPath).size / 1024).toFixed(1)} KB)`);
  } else {
    console.error(`  ❌ MISSING in CSS: ${localPath}`);
    missingAssets++;
  }
});

// Check IDs in JS vs HTML
const getElementByIdMatches = Array.from(js.matchAll(/getElementById\(["']([^"']+)["']\)/g)).map(m => m[1]);
console.log(`Checking ${getElementByIdMatches.length} getElementById calls:`);
let missingIds = 0;
getElementByIdMatches.forEach(id => {
  if (html.includes(`id="${id}"`)) {
    console.log(`  ✅ ID found in HTML: #${id}`);
  } else {
    console.error(`  ❌ ID NOT FOUND in HTML: #${id}`);
    missingIds++;
  }
});

// Check data attributes
const dataAttributes = ['data-cal-id', 'data-filter-day', 'data-target-pane', 'data-lang', 'data-copy-addr'];
dataAttributes.forEach(attr => {
  const count = (html.match(new RegExp(attr, 'g')) || []).length;
  console.log(`  ✅ Data attribute [${attr}] count: ${count}`);
});

console.log(`\nResult: ${missingAssets === 0 && missingIds === 0 ? 'ALL CHECKS PASSED PERFECTLY! 🎉' : 'ISSUES DETECTED'}`);
