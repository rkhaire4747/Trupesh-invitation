const fs = require('fs');
const content = fs.readFileSync('City – Indian Wedding Invitation Website Template_files/City – Indian Wedding Invitation Website Template.html', 'utf8');

const matches = Array.from(content.matchAll(/<img[^>]+src="([^">]+)"[^>]*>/gi));
console.log('Images in HTML count:', matches.length);
matches.slice(0, 30).forEach(m => {
  const alt = m[0].match(/alt="([^"]*)"/);
  console.log(m[1].split('/').pop(), 'alt:', alt ? alt[1] : 'none');
});
