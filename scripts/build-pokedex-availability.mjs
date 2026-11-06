import fs from 'node:fs';

// Snapshot of Bulbapedia's availability table, retrieved 2026-11-05.
// Read the documented method codes, never National Pokédex size.
const snapshot = JSON.parse(fs.readFileSync('scripts/data/pokemon-availability-source.json','utf8'));
const records=snapshot.rows.map(([id,layout,codeString])=>{
    const codes=codeString.split(' '), columns=snapshot.layouts[layout];
    if(codes.length!==columns.length)throw new Error(`Invalid source columns for species ${id}`);
    return {id,methods:Object.fromEntries(columns.map((game,index)=>[game,codes[index]]))};
});
if(new Set(records.map(record=>record.id)).size!==1025)throw new Error('Incomplete availability snapshot');
const groupDefinitions = {
    kanto: ['red','green','blue-jp','yellow'],
    kantoRemakes: ['firered','leafgreen'],
    johto: ['gold','silver','crystal'],
    johtoRemakes: ['heartgold','soulsilver'],
    hoenn: ['ruby','sapphire','emerald'],
    sinnoh: ['diamond','pearl','platinum'],
    unova: ['black','white'],
    unovaSequels: ['black-2','white-2'],
    kalos: ['x','y'],
    alola: ['sun','moon','ultra-sun','ultra-moon'],
    letsGo: ['lets-go-pikachu','lets-go-eevee'],
    galar: ['sword','shield'],
    hisui: ['legends-arceus'],
    paldea: ['scarlet','violet'],
    lumiose: ['legends-za']
};
const accepted = /^(?:C|S|R|E|B|ET|EV|Ev|EvE|EvB|EvET|EVE|FS|FSB|FSE|FSET|D|DA|CD|BD|RD|ED|DD|ETD|EVD)$/;
const conditionalAllowed={
    johtoRemakes: new Set([384]),
    hoenn: new Set([152,153,154,155,156,157,158,159,160,273,274,275,283,284]),
    sinnoh: new Set([442,486]),
    unova: new Set([645]),
    unovaSequels: new Set([163,164,203,273,274,275,352,378,379,431,432,434,435,486]),
    alola: new Set([245,384,487,645,646]),
    galar: new Set([249,250,380,381,382,383,442,483,484,486,641,642,643,644,716,717,791,792]),
    paldea: new Set([27,28,37,38,128,190,200,207,243,244,245,246,247,248,249,250,371,372,373,
        380,381,382,383,384,408,409,410,411,424,425,426,429,434,435,472,483,484,633,634,635,
        638,639,640,643,644,646,690,691,692,693,765,766,791,792,800,845,874,875,877,885,886,
        887,896,897,936,937,984,985,986,987,988,989,990,991,992,993,994,995,1005,1006,1009,1010])
};
const groups={};
for(const [key,games] of Object.entries(groupDefinitions)) {
    const evidence={};
    const gameplaySpecies=new Set();
    for(const record of records) for(const game of games) {
        let method=record.methods[game];
        // The table now marks the Switch rereleases as C. These original carts
        // needed the distributed MysticTicket/AuroraTicket or Japanese GS Ball.
        if(key==='kantoRemakes'&&[249,250,386].includes(record.id))method='EV';
        if(key==='johto'&&record.id===251)method='EV';
        // Sinjoh Ruins requires Arceus from D/P/Pt; HG/SS has no direct Arceus event.
        const excludedDependency=key==='johtoRemakes'&&[483,484,487].includes(record.id);
        if(!excludedDependency && (accepted.test(method) || (method?.startsWith('CC') && conditionalAllowed[key]?.has(record.id)))) {
            const event=method.includes('Ev')||method.includes('EV')||(key==='sinnoh'&&record.id===486);
            if(!event)gameplaySpecies.add(record.id);
            if(!evidence[record.id] || (!event && /Ev|EV/.test(evidence[record.id].method)))evidence[record.id]={game,method};
        }
    }
    const speciesIds=Object.keys(evidence).map(Number).sort((a,b)=>a-b);
    groups[key]={games,count:speciesIds.length,gameplayCount:gameplaySpecies.size,eventAdditionalCount:speciesIds.length-gameplaySpecies.size,speciesIds,evidence};
    console.log(key,speciesIds.length);
}
fs.writeFileSync('docs/pokedex-availability.json',JSON.stringify({sourceUrl:snapshot.sourceUrl,retrievedAt:snapshot.retrievedAt,groups},null,2)+'\n');
