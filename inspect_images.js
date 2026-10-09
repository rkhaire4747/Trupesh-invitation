const fs = require('fs');
const path = require('path');

const dir = 'City – Indian Wedding Invitation Website Template_files';
const files = fs.readdirSync(dir);
console.log('PNG files:');
files.filter(f => f.endsWith('.png')).forEach(f => console.log(f));
console.log('\nSVG files:');
files.filter(f => f.endsWith('.svg')).forEach(f => {
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  console.log(f, content.slice(0, 150));
});
