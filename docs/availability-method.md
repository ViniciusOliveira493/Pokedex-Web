# Contagem de espécies por aventura

`pokedex` é a quantidade de **espécies obteníveis** no grupo de jogos do personagem. Pokémon apenas vistos em batalhas, o tamanho da Pokédex Nacional e espécies meramente compatíveis com transferência não determinam esse número.

## Regras do projeto

- Unir as versões base e ampliadas da mesma aventura e geração, sem duplicar espécies ou formas. Por exemplo, Ruby/Sapphire/Emerald e Sun/Moon/Ultra Sun/Ultra Moon.
- Manter remakes e continuações em grupos próprios. HeartGold/SoulSilver não recebe automaticamente a disponibilidade de Diamond/Pearl/Platinum; Black 2/White 2 não recebe a de Black/White.
- Incluir captura, presentes, fósseis, trocas com NPCs, evolução, reprodução, pós-jogo e DLC. Contar todas as escolhas legítimas, inclusive os diferentes iniciais e fósseis; não limitar a uma única partida.
- Permitir trocas e comunicação dentro do mesmo grupo para exclusivos e evoluções. O Pokémon ou item necessário precisa ter uma origem permitida no próprio grupo; uma importação não se torna válida por ser retransmitida por outro jogo do par.
- Incluir eventos oficiais históricos, de qualquer país, destinados aos jogos do grupo, mesmo já encerrados. Isso também pode acrescentar espécies comuns de outras regiões, não apenas míticos.
- Excluir importações de outras famílias, Pal Park, Poké Transfer, GO, HOME, Dream Radar, Dream World, Pokéwalker e bônus que exigem save de outra família. Distribuições recebidas em outro jogo para depois transferir também são excluídas.
- Incluir Friend Safari: é um encontro dentro de X/Y desbloqueado pela lista de amigos, não uma importação de espécie.

## Fonte e reprodução

Fonte principal: [List of Pokémon by availability — Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_availability), consultada em **2026-11-05**.

A cópia normalizada fica em `scripts/data/pokemon-availability-source.json`: cada linha informa o número Nacional da espécie, o layout de colunas e os códigos de disponibilidade por jogo. Existem 1.127 linhas de espécies/formas, abrangendo 1.025 espécies. As formas têm linhas próprias na fonte e são deduplicadas pelo número da espécie.

Para reproduzir os totais, sem rede ou dependências:

```sh
node scripts/build-pokedex-availability.mjs
```

O resultado `docs/pokedex-availability.json` guarda `games`, `count`, `speciesIds` e uma evidência `{ game, method }` por espécie incluída. `gameplayCount` conta espécies com alguma rota normal permitida, e `eventAdditionalCount` conta as espécies acrescentadas exclusivamente pelos eventos permitidos. A interface usa o total de ambos.

Os códigos C/S/R/E/B, ET, FS e derivados, raids e DLC representam as rotas permitidas. EV/Ev e seus derivados representam eventos e suas evoluções/reprodução. T e TE, métodos externos PW/DR/DW/GEv e dual-slot DS são excluídos. CC e derivados não são aceitos automaticamente: o script contém as exceções verificadas abaixo.

## Comunicação e dependências verificadas

- **Hoenn:** iniciais de Johto em Emerald após completar a Pokédex de Hoenn; os pré-requisitos podem ser obtidos dentro de Ruby/Sapphire/Emerald. Record mixing entre esses jogos também é permitido.
- **HeartGold/SoulSilver:** Rayquaza exige o Kyogre e o Groudon do Embedded Tower, ambos obteníveis no par. [Embedded Tower](https://bulbapedia.bulbagarden.net/wiki/Embedded_Tower).
- **HeartGold/SoulSilver:** Dialga, Palkia e Giratina das Sinjoh Ruins são excluídos: a ativação exige Arceus recebido em Diamond/Pearl/Platinum, que seria uma importação externa ao grupo. [Arceus](https://bulbapedia.bulbagarden.net/wiki/Arceus_(Pok%C3%A9mon)), [Sinjoh Ruins](https://bulbapedia.bulbagarden.net/wiki/Sinjoh_Ruins).
- **Sinnoh:** Spiritomb exige encontros com outros jogadores no Underground. Regigigas e os três Regis podem ser obtidos com distribuições oficiais de Regigigas válidas para o grupo e os encontros de Platinum. [Encontros de Platinum](https://bulbapedia.bulbagarden.net/wiki/List_of_in-game_event_Pok%C3%A9mon_in_Pok%C3%A9mon_Platinum).
- **Black/White:** Landorus pode ser desbloqueado reunindo os Tornadus/Thundurus do próprio par.
- **Black 2/White 2:** incluir Nature Preserve, trocas e chaves do par, além de Regigigas com os Regis locais. [Nature Preserve](https://bulbapedia.bulbagarden.net/wiki/Nature_Preserve), [Underground Ruins](https://bulbapedia.bulbagarden.net/wiki/Underground_Ruins).
- **Alola:** os pré-requisitos para Suicune, Rayquaza, Giratina, Landorus e Kyurem das Ultra Wormholes podem ser reunidos no grupo de Alola.
- **Galar:** incluir multiplayer e Dynamax Adventures dentro de Sword/Shield, Spiritomb e Regigigas, cujos requisitos são obteníveis nas DLCs e no par.
- **Hisui:** Darkrai e Shaymin são excluídos porque exigem saves externos de BDSP e Sword/Shield. Os demais 240 são obteníveis sem essas dependências.
- **Paldea:** incluir Union Circle, raids e DLCs entre Scarlet/Violet. Rayquaza, Kyurem e Necrozma podem ser liberados pelos Group Quests de Blueberry Quests. Os padrões de Vivillon dependentes de GO não acrescentam uma espécie: existe forma obtível normalmente no próprio par.

## Totais auditáveis

| Grupo | Gameplay | Eventos adicionais | Total |
| --- | ---: | ---: | ---: |
| Red/Blue/Yellow | 150 | 1 | 151 |
| FireRed/LeafGreen | 212 | 92 | 304 |
| Gold/Silver/Crystal | 232 | 19 | 251 |
| HeartGold/SoulSilver | 427 | 12 | 439 |
| Ruby/Sapphire/Emerald | 242 | 57 | 299 |
| Diamond/Pearl/Platinum | 410 | 20 | 430 |
| Black/White | 465 | 49 | 514 |
| Black 2/White 2 | 482 | 30 | 512 |
| X/Y | 593 | 45 | 638 |
| Sun/Moon/Ultra Sun/Ultra Moon | 618 | 25 | 643 |
| Let's Go, Pikachu!/Eevee! | 150 | 2 | 152 |
| Sword/Shield e DLCs | 651 | 8 | 659 |
| Legends: Arceus | 240 | 0 | 240 |
| Scarlet/Violet e DLCs | 689 | 11 | 700 |
| Legends: Z-A e Mega Dimension | 361 | 3 | 364 |

FireRed/LeafGreen originalmente exigiam MysticTicket/AuroraTicket para Lugia, Ho-Oh e Deoxys. A fonte passou a marcá-los como captura normal por causa dos relançamentos; o script os classifica como eventos para representar os cartuchos originais. Celebi de Crystal também é tratado como evento histórico, em vez de aplicar automaticamente a disponibilidade do relançamento Virtual Console.

Let's Go inclui Mew e **Melmetal**, mas não Meltan. Apesar de normalmente depender de GO, Melmetal teve distribuição direta para a versão chinesa em 27 de fevereiro–30 de abril de 2025; isso atende à regra de eventos oficiais de qualquer país. [Melmetal — eventos](https://bulbapedia.bulbagarden.net/wiki/Melmetal_(Pok%C3%A9mon)#In_events).

Os totais refletem a revisão da fonte nesta data e os critérios acima. Novos eventos e correções da enciclopédia exigem revisar a matriz de disponibilidade e suas dependências, regenerar este artefato e atualizar os números dos treinadores do grupo.
