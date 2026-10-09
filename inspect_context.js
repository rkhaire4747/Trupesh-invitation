const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const imgs = [
  'tjsmDC8g305SmMs98B3ABqR5QE.png',
  'z8fNGgEf83GUW8GN7ddabomNq0.png',
  'T1dORVl8kMLXNd7ShMJWzCpoHtM.png',
  'ySQ0SbzHWfVo1ClVjS303cCa9E.png',
  'DdFrH1xuj9wKnCb1V2cCwhyUujQ.png',
  'RXBpca6GqTplpajDfA7doITJQA.png',
  '22xXcSSm9sQYXLb74vUWOaNwXY.png'
];

imgs.forEach(img => {
  const idx = content.indexOf(img);
  if (idx !== -1) {
    const start = Math.max(0, idx - 100);
    const end = Math.min(content.length, idx + 100);
    console.log(`=== ${img} ===`);
    console.log(content.slice(start, end));
  } else {
    console.log(`=== ${img} not in index.html ===`);
  }
});
