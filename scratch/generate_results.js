const fs = require('fs');
const path = require('path');

function parseCSV(content) {
    const lines = content.split('\n').filter(l => l.trim());
    if (lines.length === 0) return [];
    const header = lines[0].split(',').map(h => h.trim());
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        const row = [];
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
        const obj = {};
        header.forEach((h, index) => {
            obj[h] = row[index];
        });
        data.push(obj);
    }
    return data;
}

const registrationsRaw = fs.readFileSync(path.join(process.cwd(), 'public/csv/registrations.csv'), 'utf8');
const resultsRaw = fs.readFileSync(path.join(process.cwd(), 'public/csv/results.csv'), 'utf8');

const registrations = parseCSV(registrationsRaw);
const results = parseCSV(resultsRaw);

// Extract unique games from registrations to use as the source of truth
const registrationGames = new Set();
registrations.forEach(r => {
    if (r['Selected Games']) {
        r['Selected Games'].split(';').forEach(g => {
            const clean = g.trim().toLowerCase();
            if (clean) registrationGames.add(clean);
        });
    }
});

const gameMapping = {
    'Cards': 'cards',
    'Carrom': 'carrom',
    'Chess': 'chess',
    'COC': 'clash of clans',
    'CR': 'clash royale',
    'Cricket': 'cricket',
    'Dart': 'dart',
    'Dumb Charades': 'dumb charades',
    'efootball multi': 'efootball (pes) multiplayer',
    'efootball single': 'efootball (pes)',
    'Musical Female': 'musical chairs',
    'Musical Male': 'musical chairs',
    "Rubik's Cube": 'rubiks cube',
    'Scrabble': 'scrabble',
    'Speed-Typing': 'typing speed',
    'Table Tennis': 'table tennis',
    'Wire Loop': 'wire loop',
    'Valorant': 'valorant'
};

// Ensure all mapping targets exist in registrationGames
Object.keys(gameMapping).forEach(key => {
    const target = gameMapping[key];
    if (!registrationGames.has(target)) {
        // Fallback or fuzzy match if a mapping target isn't found in registrations
        const bestMatch = Array.from(registrationGames).find(rg => rg.includes(target) || target.includes(rg));
        if (bestMatch) gameMapping[key] = bestMatch;
    }
});

function getBatch(reg) {
    let b = reg.Batch;
    if (b === '1' || !b || b === 'N/A') {
        const rollMatch = reg.Roll.match(/(\d{2})\d{2}/);
        if (rollMatch) b = rollMatch[1];
        else {
            const emailMatch = reg.Email.match(/bsse(\d{2})/);
            if (emailMatch) b = emailMatch[1];
        }
    }
    return b;
}

const participants = [];

registrations.forEach(r => {
    const batch = getBatch(r);
    const games = r['Selected Games'] ? r['Selected Games'].split(';').map(g => g.trim().toLowerCase()) : [];

    participants.push({
        name: r.Name,
        batch: batch,
        games: games
    });

    if (r.Teammates && r.Teammates !== 'N/A') {
        const segments = r.Teammates.split('|');
        segments.forEach(seg => {
            const parts = seg.split(':');
            if (parts.length === 2) {
                const gameName = parts[0].trim().toLowerCase();
                const names = parts[1].split(/;|and|,/).map(n => n.trim()).filter(n => n);
                names.forEach(n => {
                    const bMatch = n.match(/\((\d{2})\d*\)/);
                    const tBatch = bMatch ? bMatch[1] : batch;
                    const tName = n.replace(/\(\d+\)/, '').trim();

                    participants.push({
                        name: tName,
                        batch: tBatch,
                        games: [gameName]
                    });
                });
            }
        });
    }
});

function levenshtein(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) matrix[i][j] = matrix[i - 1][j - 1];
            else matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
        }
    }
    return matrix[b.length][a.length];
}

function parseNameEntry(entry) {
    if (entry === 'N/A' || !entry) return null;

    const batchWideMatch = entry.match(/BSSE (\d+)(?:st|nd|rd|th)? Batch/i);
    if (batchWideMatch) {
        return [{ name: entry.toLowerCase(), batch: `bsse${batchWideMatch[1]}`, type: 'batch' }];
    }

    const batchMatch = entry.match(/\((\d+)\)/);
    const batch = batchMatch ? batchMatch[1] : null;
    const namesPart = entry.replace(/\(\d+\)/, '').trim();

    const names = namesPart.split(/,|\band\b|&/).map(n => n.trim()).filter(n => n);
    return { names, batch };
}

function cleanName(name) {
    return name.replace(/\b(bhai|sir|apu|bhaya)\b/gi, '').replace(/\s+/g, ' ').trim();
}

function matchPlayers(entry, gameName) {
    const parsed = parseNameEntry(entry);
    if (!parsed) return [];
    if (Array.isArray(parsed)) return parsed;

    const { names, batch } = parsed;
    const targetGame = gameMapping[gameName] || gameName.toLowerCase();

    return names.map(n => {
        const cleanedN = cleanName(n);
        const normalizedN = cleanedN.toLowerCase();
        const soundLike = (s) => s.replace(/[aeiou]/g, '').replace(/\s+/g, '');
        const nSound = soundLike(normalizedN);

        let pool = participants.filter(p => batch ? p.batch === batch : true);
        let gamePool = pool.filter(p => p.games.some(g => g.includes(targetGame) || targetGame.includes(g)));
        let activePool = gamePool.length > 0 ? gamePool : pool;

        // 1. Exact or Substring match
        let matches = activePool.filter(p => p.name.toLowerCase().includes(normalizedN) || normalizedN.includes(p.name.toLowerCase()));
        
        // 2. Sound-like word match
        if (matches.length === 0 && nSound.length > 2) {
            matches = activePool.filter(p => {
                const words = p.name.toLowerCase().split(/\s+/);
                return words.some(w => {
                    const ws = soundLike(w);
                    return ws.length > 2 && (ws === nSound || ws.includes(nSound) || nSound.includes(ws));
                });
            });
        }

        // 3. Fuzzy match
        if (matches.length === 0) {
            const fullFuzzy = activePool.map(p => ({
                p,
                dist: levenshtein(normalizedN, p.name.toLowerCase())
            })).sort((a, b) => a.dist - b.dist);

            if (fullFuzzy[0] && fullFuzzy[0].dist < 3) {
                matches = [fullFuzzy[0].p];
            } else {
                const wordFuzzy = activePool.map(p => {
                    const words = p.name.toLowerCase().split(/\s+/);
                    const minWordDist = Math.min(...words.map(w => levenshtein(normalizedN, w)));
                    return { p, dist: minWordDist };
                }).sort((a, b) => a.dist - b.dist);

                if (wordFuzzy[0] && wordFuzzy[0].dist < 2) {
                    matches = [wordFuzzy[0].p];
                }
            }
        }

        if (matches.length > 0) {
            if (matches.length > 1) {
                const preferred = matches.find(m => m.games.some(g => g.includes(targetGame) || targetGame.includes(g)));
                if (preferred) matches = [preferred];
            }
            
            // Keep the longer name (prefer full name over nickname)
            const matchedName = matches[0].name;
            const finalName = (cleanedN.length > matchedName.length) ? cleanedN : matchedName;

            return {
                name: finalName.toLowerCase(),
                batch: `bsse${matches[0].batch}`
            };
        }
        return { name: cleanedN.toLowerCase(), batch: batch ? `bsse${batch}` : 'unknown' };
    });
}

const curatedResults = results.map(row => {
    const rawGame = row['Game Name'];
    const normalizedGame = gameMapping[rawGame] || rawGame.toLowerCase();
    
    return {
        game: normalizedGame,
        champion: matchPlayers(row['Champion'], rawGame),
        runnerUp: matchPlayers(row['Runner-Up'], rawGame),
        secondRunnerUp: matchPlayers(row['2nd Runner-Up'], rawGame)
    };
});

const jsonOutput = JSON.stringify(curatedResults, null, 2);
const outputPath = path.join(process.cwd(), 'public/json/results.json');

if (!fs.existsSync(path.join(process.cwd(), 'public/json'))) {
    fs.mkdirSync(path.join(process.cwd(), 'public/json'));
}

fs.writeFileSync(outputPath, jsonOutput);
console.log(`Successfully generated ${outputPath}`);
