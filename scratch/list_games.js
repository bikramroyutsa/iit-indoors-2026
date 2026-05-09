const fs = require('fs');
const content = fs.readFileSync('public/csv/registrations.csv', 'utf8');
const lines = content.split('\n').filter(l => l.trim());
const header = lines[0].split(',').map(h => h.trim());
const gIdx = header.indexOf('Selected Games');
const games = new Set();

for (let i = 1; i < lines.length; i++) {
    let row = [];
    let current = '';
    let inQuotes = false;
    for (let char of lines[i]) {
        if (char === '"') inQuotes = !inQuotes;
        else if (char === ',' && !inQuotes) {
            row.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    row.push(current.trim());
    if (row[gIdx]) {
        row[gIdx].split(';').forEach(g => {
            const clean = g.trim().toLowerCase();
            if (clean) games.add(clean);
        });
    }
}
console.log(JSON.stringify(Array.from(games).sort(), null, 2));
