var isPokedexOpen = false;
var qttPokemonByGen = [151,100,135,108,155,72,88,96,121];

document.getElementById("playerCard").addEventListener("click",function () {
    let playerCard = document.getElementById("playerCard");
    let list = document.getElementById("pokemonList");

    if(!isPokedexOpen){
        playerCard.setAttribute("class","slideLeft");
        list.setAttribute("class","slideRight");
        isPokedexOpen = !isPokedexOpen;
        loadPokemons(1);
        let txt = document.getElementById("gen");
        txt.innerHTML = 1;
    }else{
        playerCard.removeAttribute("class","slideLeft");
        list.removeAttribute("class","slideRight");
        isPokedexOpen = !isPokedexOpen;
        getTrainers();
    }
});

document.getElementById("prev").addEventListener("click",function () {
    let txt = document.getElementById("gen");
    let number = parseInt(txt.textContent);
    number -=1;

    if(number<1){
        number=1;
    }
   
    txt.innerHTML = number;
    loadPokemons(number);
});

document.getElementById("next").addEventListener("click",function () {
    let txt = document.getElementById("gen");
    let number = parseInt(txt.textContent);
    number +=1;

    if(number > qttPokemonByGen.length){
        number = qttPokemonByGen.length;
    }

    txt.innerHTML = number;
    loadPokemons(number);
});

document.getElementById("list").addEventListener("click",function (element) {
    let line = element.target.children[0].innerHTML
    let s = line.split(" ");
    
    highlightPokemon(s[1]);
});

window.onload = init();
//-----------------------------------------
function init() {        
    getTrainers();
    setTimeout(mensagemClique, 1500);
}

function mensagemClique() {
    alert("Clique na pokédex para abrir");
}

async function getTrainers() {
    let trainers;
    await fetch("./js/data/trainers.json")
        .then((response) => response.json())
        .then((data) => {
            trainers = data;
        });        

        let chosen = parseInt(Math.random() * trainers.trainers.length)

        loadTrainer(trainers.trainers[chosen]);
}

function loadTrainer(trainer) {
    let imageDiv = document.getElementById("displayImage");
    
    let image = document.createElement("img");

    image.setAttribute("src",trainer.sprite);
    image.setAttribute("class","image");
    image.setAttribute("alt",trainer.name);

    imageDiv.innerHTML = "";
    imageDiv.appendChild(image);

    let info = document.getElementById("info");
    info.innerHTML = "";
    info.classList.add("trainerInfo");

    let tId = document.createElement("span");
    tId.textContent = "ID: "+trainer.id;

    let tName = document.createElement("span");
    tName.textContent = "Nome: "+trainer.name;

    let tDex = document.createElement("span");
    tDex.textContent = "Pokédex: "+trainer.pokedex+" espécies";
    tDex.title = "Espécies obteníveis no grupo de jogos de origem, incluindo eventos oficiais e trocas entre suas versões.";



    info.appendChild(tId);
    info.appendChild(tName);
    info.appendChild(tDex);

    let tbadges = document.createElement("div");
    tbadges.className = "trainerAchievements";
    let lblbadge = document.createElement("h2");
    lblbadge.className = "trainerProgressTitle";
    lblbadge.textContent = trainer.badgesLabel || "Insígnias";

    tbadges.appendChild(lblbadge);

    let listbadges = document.createElement("ul");
    listbadges.className = "badgeList";
    trainer.badges.forEach(element => {
        let item = document.createElement("li");
        if (element.sprite) {
            let badge = document.createElement("img");
            badge.src = element.sprite;
            badge.className = "badge";
            badge.alt = element.name;
            badge.title = element.name;
            item.appendChild(badge);
        } else {
            item.className = "badgeText";
            item.textContent = element.name;
        }
        listbadges.appendChild(item);
    });

    tbadges.appendChild(listbadges);
    info.appendChild(tbadges);
}

async function loadPokemons(gen){
    let imageDiv = document.getElementById("displayImage");
    let info = document.getElementById("info");
    info.classList.remove("trainerInfo");

    imageDiv.innerHTML = "";
    info.innerHTML = "";
    
    let offset = 0;

    for (let i = 0; i < gen; i++) {
        offset += qttPokemonByGen[i];       
    }

    gen-=1;
    offset-=qttPokemonByGen[gen];

    let url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${qttPokemonByGen[gen]}`;

    
    await fetch(url)
    .then((response) => response.json())
    .then((data) => {
        listPokemons(data);
    })
}

function listPokemons(list){
    let listDiv = document.getElementById("list");
    listDiv.innerHTML = "";

    list.results.forEach(element => {
        let div = document.createElement("div");
        div.setAttribute("class","pokemonItem");

        let span = document.createElement("span");
        
        let partes = element.url.split("/");
        
        span.innerHTML = "# "+partes[6] +" "+ element.name;
        div.appendChild(span);

        listDiv.appendChild(div);
    });
}

async function highlightPokemon(pokemonId){
    let imageDiv = document.getElementById("displayImage");
    imageDiv.innerHTML = "";

    let pokemon;
    await fetch("https://pokeapi.co/api/v2/pokemon/"+pokemonId)
    .then((response) => response.json())
    .then((data) => {
        pokemon = data;
    });

    let image = document.createElement("img");
    image.setAttribute("src","https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+pokemonId+".png");
    image.setAttribute("class","image");

    imageDiv.appendChild(image);    
    loadInfo(pokemon);
}

function loadInfo(pokemon) {
    let info = document.getElementById("info");
    info.classList.remove("trainerInfo");
    info.innerHTML = "";
    let div = document.createElement("div");

    let spnIdName = document.createElement("span");
    spnIdName.innerHTML = "#"+pokemon.id + " - " + pokemon.name;
    spnIdName.setAttribute("class","pknTitle");

    let spnSubtitle = document.createElement("span");
    spnSubtitle.innerHTML = "----------";
    spnSubtitle.setAttribute("class","pknSubtitle");

    div.appendChild(spnIdName);
    div.appendChild(spnSubtitle);

    let divTypes = document.createElement("div");
    divTypes.setAttribute("class","listTypes");

    pokemon.types.forEach(element => {
        let spn = document.createElement("span");
        spn.setAttribute("class","typeItem "+element.type.name);
        spn.innerHTML = " "+element.type.name+" ";

        divTypes.appendChild(spn);
    });

    let divDesc = document.createElement("div");
    divDesc.setAttribute("class","pokemonDesc")
    let p = document.createElement("p");

    fetch("https://pokeapi.co/api/v2/pokemon-species/"+pokemon.id)
    .then((response) => response.json())
    .then((data) => {
        data.flavor_text_entries.forEach(element => {
            if(element.language.name == "en"){
                let txt = document.createElement("span");
                txt.innerHTML = ("["+element.version.name+"] "+element.flavor_text) + "<br> <br>";

                p.appendChild(txt);
            }
            
        });
    });

    divDesc.appendChild(p);

    info.appendChild(div);
    info.appendChild(divTypes);
    info.appendChild(divDesc);

    if(pokemon.id == 162){
        document.title = "Pokédex - Accumula Town";
    }else{
        document.title = "Pokédex"
    }
}
