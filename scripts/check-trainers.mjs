import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const { trainers } = read('js/data/trainers.json');
const { groups } = read('docs/pokedex-availability.json');

assert.equal(trainers.length, 53, 'Expected the approved 53-character roster');
assert.equal(new Set(trainers.map(t => t.id)).size, trainers.length, 'Duplicate trainer IDs');
assert.equal(new Set(trainers.map(t => t.name)).size, trainers.length, 'Duplicate characters');
for (const [name, id] of [['Red', '00001'], ['Leaf', '00002'], ['Blue', '00003']]) {
    assert.equal(trainers.find(t => t.name === name)?.id, id, `Changed original ID for ${name}`);
}

const imagePaths = new Set();
for (const trainer of trainers) {
    assert.ok(!('role' in trainer) && !('roles' in trainer), 'Roles must not be added');
    assert.match(trainer.id, /^\d{5}$/);
    assert.ok(trainer.originGames.length && trainer.badgesLabel && trainer.badges.length);
    const group = groups[trainer.gameGroup];
    assert.ok(group, `Missing availability group for ${trainer.name}`);
    assert.equal(trainer.pokedex, group.count, `Incorrect count for ${trainer.name}`);
    assert.deepEqual(trainer.originGames, group.games);
    imagePaths.add(trainer.sprite);
    for (const badge of trainer.badges) {
        assert.ok(badge.name, `Unnamed achievement for ${trainer.name}`);
        if (badge.sprite) imagePaths.add(badge.sprite);
    }
}
for (const [key, group] of Object.entries(groups)) {
    assert.equal(group.count, group.speciesIds.length, `Count does not match species list: ${key}`);
    assert.equal(new Set(group.speciesIds).size, group.count, `Duplicate species: ${key}`);
    assert.ok(group.speciesIds.every(id => Number.isInteger(id) && id >= 1 && id <= 1025));
}
for (const imagePath of imagePaths) {
    assert.ok(imagePath.startsWith('./img/'), `Image is not local: ${imagePath}`);
    const absolute = path.resolve(root, imagePath);
    assert.ok(absolute.startsWith(path.join(root, 'img') + path.sep));
    const bytes = fs.readFileSync(absolute);
    const png = bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    const gif = bytes.subarray(0, 3).toString() === 'GIF';
    const jpeg = bytes[0] === 255 && bytes[1] === 216;
    const webp = bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP';
    assert.ok(png || gif || jpeg || webp, `Not an image: ${imagePath}`);
    if (png) assert.ok(bytes.readUInt32BE(16) > 0 && bytes.readUInt32BE(20) > 0);
}

// Exercise the real renderer for every record, including text-only achievements.
class Element {
    constructor(tag) {
        this.tagName = tag;
        this.children = [];
        this.attributes = {};
        this.classes = new Set();
        this.classList = { add: c => this.classes.add(c), remove: c => this.classes.delete(c) };
    }
    set innerHTML(value) { this.children = []; this.html = value; }
    get innerHTML() { return this.html || ''; }
    setAttribute(name, value) { this.attributes[name] = value; }
    appendChild(child) { this.children.push(child); return child; }
    addEventListener() {}
}
const elements = new Map();
const document = {
    getElementById(id) {
        if (!elements.has(id)) elements.set(id, new Element('div'));
        return elements.get(id);
    },
    createElement: tag => new Element(tag),
};
const context = vm.createContext({ document, window: {}, setTimeout() {}, alert() {}, fetch() {
    return Promise.resolve({ json: () => Promise.resolve({ trainers: [trainers[0]] }) });
} });
vm.runInContext(fs.readFileSync(path.join(root, 'js/script.js'), 'utf8'), context);
await new Promise(resolve => setImmediate(resolve));
for (const trainer of trainers) {
    context.loadTrainer(trainer);
    const info = document.getElementById('info');
    assert.equal(info.children[1].textContent, 'Nome: ' + trainer.name);
    assert.equal(info.children[2].textContent, `Pokédex: ${trainer.pokedex} espécies`);
    const achievements = info.children[3];
    assert.equal(achievements.children[0].textContent, trainer.badgesLabel);
    assert.equal(achievements.children[1].children.length, trainer.badges.length);
    assert.equal(document.getElementById('displayImage').children[0].attributes.alt, trainer.name);
    for (let i = 0; i < trainer.badges.length; i++) {
        const badge = trainer.badges[i];
        const item = achievements.children[1].children[i];
        if (badge.sprite) assert.equal(item.children[0].alt, badge.name);
        else assert.equal(item.textContent, badge.name);
    }
}
console.log(`OK: ${trainers.length} trainers, ${Object.keys(groups).length} game groups, ${imagePaths.size} local images, all cards rendered.`);
