# Catálogo de treinadores

O catálogo em `js/data/trainers.json` reúne 53 personagens dos jogos principais, incluindo rivais e personagens das expansões. Red, Leaf e Blue conservam os IDs `00001`, `00002` e `00003`. Cada personagem aparece uma única vez; não há classificação por papel na interface ou nos dados.

## Campos

| Campo | Significado |
| --- | --- |
| `name` | Nome oficial do personagem. Barry é o rival que também pode receber o nome sugerido Roy em Platinum. |
| `sprite` | Caminho local da imagem, com proporção preservada pelo cartão. |
| `id` | Identificador único de cinco dígitos. |
| `pokedex` | Quantidade de espécies obteníveis no conjunto de jogos de referência. |
| `originGames` | Jogos que compõem esse conjunto, incluindo as versões ampliadas. |
| `gameGroup` | Chave da lista de espécies documentada em `pokedex-availability.json`. |
| `badgesLabel` | Título das conquistas: Insígnias, Cristais Z, Patente ou Classificação. |
| `badges` | Lista de conquistas com `name` e, quando houver imagem, `sprite`. |
| `badgesNote` | Informação complementar preservada nos dados, sem exibição no cartão, ou `null`. |

## Espécies obteníveis

A contagem representa as possibilidades do conjunto de jogos, não as capturas de uma única partida. Inclui escolhas alternativas de iniciais e fósseis, capturas, presentes, trocas com NPCs, evolução, reprodução, pós-jogo, DLC e eventos oficiais efetivamente distribuídos. Cada espécie conta uma vez, independentemente das formas.

São permitidas trocas dentro da família de jogos, incluindo exclusivos e evoluções por troca. Um Pokémon importado de fora da família não passa a ser elegível por ser retransmitido entre duas versões permitidas. Espécies apenas vistas em batalhas não contam.

As versões ampliadas compartilham o conjunto com as versões base: Red/Blue/Yellow, Gold/Silver/Crystal, Ruby/Sapphire/Emerald, Diamond/Pearl/Platinum e Sun/Moon/Ultra Sun/Ultra Moon. Os remakes constituem famílias próprias. Black/White e Black 2/White 2 ficam separados por serem aventuras com protagonistas distintos.

Eventos históricos de qualquer país entram quando houve distribuição direta para os jogos do conjunto. Isso pode acrescentar espécies comuns de outras regiões, além dos míticos. Portanto, o total pode superar tanto a Pokédex regional quanto a disponibilidade sem eventos. Compatibilidade com a Pokédex Nacional, por si só, não permite inclusão.

O arquivo [availability-method.md](availability-method.md) explica as condições de obtenção e exceções. [pokedex-availability.json](pokedex-availability.json) preserva as listas de IDs e evidências; o cálculo pode ser refeito sem rede a partir do snapshot normalizado em `scripts/data/`.

## Conquistas

Todos os personagens do mesmo conjunto recebem as conquistas da jornada completa; não se verifica se cada rival as obteve individualmente.

- Kanto: oito insígnias.
- Johto: oito insígnias de Johto e oito de Kanto.
- Hoenn, Sinnoh e Kalos: oito insígnias por região. Sinnoh segue a ordem de Platinum.
- Unova: oito insígnias, respeitando as diferenças entre Black/White e Black 2/White 2.
- Galar: oito insígnias por versão. Os dados informam a versão usada como referência; a escolha de versão para personagens presentes em ambos os jogos é editorial, sem afirmar uma associação canônica. Klara usa Sword e Avery usa Shield.
- Paldea: oito insígnias de ginásio, cinco da Team Star e cinco dos Titãs.
- Alola: Fightinium Z, Rockium Z, Darkinium Z e Groundium Z, recompensas das quatro Grandes Provas.
- Hisui: décima estrela da Equipe de Pesquisa Galaxy, apresentada em texto.
- Legends: Z-A: Rank A na campanha e Rank ∞ no pós-jogo, apresentados em texto.

Os conjuntos reutilizados ficam em [badge-sets.json](badge-sets.json). As imagens são locais. A Bulbapedia/Bulbagarden Archives é priorizada; os espelhos utilizados quando o download direto foi bloqueado e as URLs de origem estão documentados em [trainer-image-sources.json](trainer-image-sources.json) e [badge-image-sources.json](badge-image-sources.json). Os personagens e as imagens de Pokémon pertencem aos respectivos titulares; a disponibilidade pública não transfere seus direitos.

## Atualização e verificação

Execute a partir da raiz do projeto, com Node.js:

```sh
node scripts/build-pokedex-availability.mjs
node scripts/build-trainers.mjs
node scripts/check-trainers.mjs
node --check js/script.js
```

O gerador mantém `trainers.json` completo e independente dos documentos durante a execução do site. A validação confere os 53 registros, os IDs originais, a ausência de papéis, as contagens e listas de espécies, as imagens locais e a renderização de todos os cartões, incluindo conquistas textuais.

Para abrir o site, use um servidor HTTP estático; o carregamento de JSON por `fetch` depende de HTTP, como já ocorria antes desta alteração.
