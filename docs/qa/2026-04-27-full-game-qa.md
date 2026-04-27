# Study Game QA - 2026-04-27

## Ulatus

Manualne browseri QA jooksis Codexi in-app browseris aadressil `http://127.0.0.1:5173/study/`, kitsas mobiililaadses viewportis. Ring kattis menüü, seaded, statistika, saavutused, poe, juhendi, lemmikute muutmise ja kõik mängude route'id.

Kohalikud QA artefaktid loodi kausta `/tmp/study-game-qa/`:

- `all-games-contact-sheet.png` - kõigi mängude esmane render
- `all-games-after-contact-sheet.png` - kõigi mängude seis pärast üht kasutaja interaktsiooni
- `interact-results.json` - interaktsioonide ja vigade kokkuvõte

## Kohe Parandatud

- Poe ja tasemevalija sulgemisnupud ei loe enam end screen readerile kui "Sulge statistika".
- Shape Dashi nähtavad UI ja canvase tekstid tulevad nüüd locale stringidest, mitte hardcoded inglise keelest.
- Shape Shifti drag hoiab ghost-kujundit pointeri keskmes ja kuulab pointer release'i ka `window` tasemel, nii et tray'st välja liikudes saab tüki usaldusväärselt maha panna.

## Browseri QA Tulemused

Kõik mängude route'id renderdasid ilma `Tundmatu mängutüüp`, üldise error screeni ja püütud console erroriteta. Iga route sai vähemalt ühe päris browseri interaktsiooni.

| Mäng                     | Route                                   | Interaktsioon                      | Tulemus          |
| ------------------------ | --------------------------------------- | ---------------------------------- | ---------------- |
| Word Builder             | `/study/games/word-builder`             | tähe vajutus                       | OK               |
| Word Cascade             | `/study/games/word-cascade`             | langeva tähe vajutus               | OK               |
| Syllable Builder         | `/study/games/syllable-builder`         | silbi vajutus                      | OK               |
| Pattern                  | `/study/games/pattern`                  | vastuse vajutus                    | OK               |
| Sentence Logic           | `/study/games/sentence-logic`           | pildi-vastuse vajutus              | OK               |
| Memory Math              | `/study/games/memory-math`              | kahe kaardi vajutus                | OK               |
| Picture Pairs            | `/study/games/picture-pairs`            | kaartide vajutus pärast peek-faasi | OK               |
| Robo Path                | `/study/games/robo-path`                | käsk + robotikäivitus              | OK               |
| Addition Snake           | `/study/games/addition-snake`           | suunanupp                          | OK               |
| Addition Big Snake       | `/study/games/addition-big-snake`       | suunanupp                          | OK               |
| Subtraction Snake        | `/study/games/subtraction-snake`        | suunanupp                          | OK               |
| Subtraction Big Snake    | `/study/games/subtraction-big-snake`    | suunanupp                          | OK               |
| Multiplication Snake     | `/study/games/multiplication-snake`     | suunanupp                          | OK               |
| Multiplication Big Snake | `/study/games/multiplication-big-snake` | suunanupp                          | OK               |
| Letter Match             | `/study/games/letter-match`             | vastuse vajutus                    | OK               |
| Unit Conversion          | `/study/games/unit-conversion`          | vastuse vajutus                    | OK               |
| Compare Sizes            | `/study/games/compare-sizes`            | võrdluse vajutus                   | OK               |
| Star Mapper              | `/study/games/star-mapper`              | tähtede vajutused                  | OK               |
| Shape Shift              | `/study/games/shape-shift`              | tray drag + hint check             | parandatud ja OK |
| BattleLearn              | `/study/games/battlelearn`              | ruudustiku lahtri vajutus          | OK               |
| Shape Dash               | `/study/games/shape-dash`               | hüppe vajutus                      | parandatud ja OK |
| Balance Scale            | `/study/games/balance-scale`            | vastuse vajutus                    | OK               |
| Time Match               | `/study/games/time-match`               | kellaaja vastuse vajutus           | OK               |

## Suuremate Probleemide Kaart

### UI

- Ühine shell on nüüd stabiilsem, aga mängud ise kõiguvad veel palju tiheduse, spacing'u ja värvikäsitluse poolest. Eriti paistab see välja Shape Dashi, Shape Shifti, snake'i mängude ja standardsete answer-card mängude vahel.
- Lukus saavutused on liiga tuhmid; saavutuste modal tundub rohkem disabled UI kui progressi ülevaade.
- Shape Dash töötab portraitis tehniliselt ära, aga canvas raiskab palju vertikaalset ruumi ja palub kasutajal seadet pöörata. Siin on vaja kas päriselt portrait layout'i või selget landscape-only otsust.
- Shape Shift algab suure tühja lauaga ja kujundid on all. Ilma nähtava target/outline'ita pole eesmärk selge enne, kui kasutaja kasutab vihjet või juba mõistab mängu.

### UX

- Header ja progression on kasutatavad, aga economy kihte on palju korraga: südamed, tähed, tasuta tähtede ost, tasulised vihjed, level progress, score ja saavutused.
- Pood tundub endiselt mock-süsteemina, sest tähtede ost on tasuta. See peaks olema kas teadlik dev/test affordance või production UI-st väljas.
- Statistikas on "Kogutud tähed", headeris on kulutatavad tähed. Teenitud tähtede, praeguste tähtede ja tasuta ostetud tähtede suhe vajab selgemat product semantikat.
- Mitmed mängud toetuvad icon-only vihjetele või väga napile promptile. Lastele oleks kasulik lühike inline ülesandejuhis, mitte ainult help modal.

### Mänguloogika

- Esimese interaktsiooni ring ei näidanud crashe, aga sügavam correctness QA peab katma scoring'u, südame mahaarvestuse, level-up piirid ja vastuste õigsuse iga mechanic'u kohta.
- Shape Shift oli selgeim interaktsioonibug: pointer release ja ghost ankurdus olid haprad. See on parandatud, aga drag mängudele on vaja regressioonikatet.
- Snake'i variandid jagavad sama core'i, mis on hea, kuid operation family kaupa on vaja eraldi collision/food/fact correctness teste.

### Huvitavus

- Kõige tugevamad mechanic'ud on BattleLearn, Shape Dash, Star Mapper ja snake'i perekond, sest need tunduvad esmalt mänguna ja alles siis harjutusena.
- Standard answer-card mängud on stabiilsed, aga vähem kleepuvad. Neil on vaja rohkem feedback'i varieeruvust, lühikesi round goal'e ja nähtavaid väikseid võite.
- Järgmine suur väärtus tuleb rohkem content variation'ist kui UI polishist: korduv arvutamine/tähevasted muutuvad õhukeseks, kui content packid ei tee selget progressikaart.

### Content Packid

- Praegused packid sobivad smoke QA jaoks, aga mitte veel täislahendusena. Vaja on skill tag'e, raskusastmeid, locale review'd ja per-level õpitulemusi.
- BattleLearn ja Shape Dash peaksid olema flagship content-pack tarbijad: need peidavad korduse hästi, kui alusmaterjal on lai ja hästi leveleeritud.
- Keelematerjal vajab Estonian copy review'd: sõnastus, kapitalisatsioon ja vanusele sobivus. Osa saavutuste tekstidest peegeldab endiselt vanu sisemisi mängunimesid.

## Soovitatud Järgmine Töö

1. Tee content-pack audit: iga pack, skill, item count, difficulty range, locale coverage ja millised mängud seda tarbivad.
2. Lisa fokuseeritud interaction E2E Shape Shifti drag'ile, Shape Dashi jump/run'ile, BattleLearni question modalile ja ühele standard answer mängule.
3. Otsusta tähtede/südamete/poe product semantika enne järgmist UI polishit.
4. Disaini ümber Shape Shifti onboarding ja Shape Dashi portrait handling.
5. Vaata saavutuste ja statistika copy üle ühe süsteemina, mitte eraldi modalitena.
