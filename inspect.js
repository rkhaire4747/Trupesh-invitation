const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const idMatches = Array.from(content.matchAll(/id="([^"]+)"/g)).map(m => m[1]);
console.log('IDs in index.html:', idMatches);

const h1h2 = Array.from(content.matchAll(/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/g)).map(m => m[1].replace(/\s+/g, ' ').trim());
console.log('Headings in index.html:', h1h2);
