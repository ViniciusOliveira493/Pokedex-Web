import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));

// One entry per character. Game groups describe availability, not character roles.
const roster = [
    ['Red', 'kanto', 'kanto'],
    ['Leaf', 'kantoRemakes', 'kanto'],
    ['Blue', 'kanto', 'kanto'],
    ['Ethan', 'johto', 'johto'],
    ['Kris', 'johto', 'johto'],
    ['Lyra', 'johtoRemakes', 'johto'],
    ['Silver', 'johto', 'johto'],
    ['Brendan', 'hoenn', 'hoenn'],
    ['May', 'hoenn', 'hoenn'],
    ['Wally', 'hoenn', 'hoenn'],
    ['Lucas', 'sinnoh', 'sinnoh'],
    ['Dawn', 'sinnoh', 'sinnoh'],
    ['Barry', 'sinnoh', 'sinnoh'],
    ['Hilbert', 'unova', 'unova'],
    ['Hilda', 'unova', 'unova'],
    ['Cheren', 'unova', 'unova'],
    ['Bianca', 'unova', 'unova'],
    ['N', 'unova', 'unova'],
    ['Nate', 'unovaSequels', 'unovaSequels'],
    ['Rosa', 'unovaSequels', 'unovaSequels'],
    ['Hugh', 'unovaSequels', 'unovaSequels'],
    ['Calem', 'kalos', 'kalos'],
    ['Serena', 'kalos', 'kalos'],
    ['Shauna', 'kalos', 'kalos'],
    ['Tierno', 'kalos', 'kalos'],
    ['Trevor', 'kalos', 'kalos'],
    ['Elio', 'alola', 'alola'],
    ['Selene', 'alola', 'alola'],
    ['Hau', 'alola', 'alola'],
    ['Gladion', 'alola', 'alola'],
    ['Chase', 'letsGo', 'kanto'],
    ['Elaine', 'letsGo', 'kanto'],
    ['Trace', 'letsGo', 'kanto'],
    ['Victor', 'galar', 'galarSword'],
    ['Gloria', 'galar', 'galarShield'],
    ['Hop', 'galar', 'galarSword'],
    ['Bede', 'galar', 'galarSword'],
    ['Marnie', 'galar', 'galarShield'],
    ['Klara', 'galar', 'galarSword'],
    ['Avery', 'galar', 'galarShield'],
    ['Rei', 'hisui', 'hisui'],
    ['Akari', 'hisui', 'hisui'],
    ['Florian', 'paldea', 'paldea'],
    ['Juliana', 'paldea', 'paldea'],
    ['Nemona', 'paldea', 'paldea'],
    ['Arven', 'paldea', 'paldea'],
    ['Penny', 'paldea', 'paldea'],
    ['Carmine', 'paldea', 'paldea'],
    ['Kieran', 'paldea', 'paldea'],
    ['Paxton', 'lumiose', 'lumiose'],
    ['Harmony', 'lumiose', 'lumiose'],
    ['Urbain', 'lumiose', 'lumiose'],
    ['Taunie', 'lumiose', 'lumiose'],
];

const availability = read('docs/pokedex-availability.json');
const images = read('docs/trainer-image-sources.json');
const badgeSets = read('docs/badge-sets.json');

const trainers = roster.map(([name, gameGroup, badgeSet], index) => {
    const group = availability.groups[gameGroup];
    const image = images[name];
    const set = badgeSets[badgeSet];
    if (!group || !image || !set) throw new Error(`Missing source data for ${name}`);
    return {
        name,
        sprite: image.sprite,
        pokedex: group.count,
        id: String(index + 1).padStart(5, '0'),
        originGames: group.games,
        gameGroup,
        badgesLabel: set.label || 'Insígnias',
        badges: set.items,
        badgesNote: set.note || null,
    };
});

fs.writeFileSync(path.join(root, 'js/data/trainers.json'), JSON.stringify({ trainers }, null, 4) + '\n');
console.log(`Generated ${trainers.length} trainers.`);
