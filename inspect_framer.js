const fs = require('fs');
const content = fs.readFileSync('City – Indian Wedding Invitation Website Template_files/City – Indian Wedding Invitation Website Template.html', 'utf8');

const list = [
  '22xXcSSm9sQYXLb74vUWOaNwXY.png',
  'munXckNtNDlAiOMLLgrVsV1o.png',
  'FLSOOveTOLX34LMuvOegzZoZ2eo.png',
  'ndc7VHWOkcPiELsDteUplHBg.png',
  'O07fRruEj5em3moPWz2blxIGqRI.png',
  '54JwjUrKR8txnFhN4dFmme3FzoQ.png',
  'CxMq9eNVYFWeipRkOH7L6BF7EV4.png'
];

list.forEach(item => {
  const idx = content.indexOf(item);
  if (idx !== -1) {
    console.log(item, 'found:');
    const start = Math.max(0, idx - 150);
    const end = Math.min(content.length, idx + 150);
    console.log(content.slice(start, end).replace(/\s+/g, ' '));
  }
});
