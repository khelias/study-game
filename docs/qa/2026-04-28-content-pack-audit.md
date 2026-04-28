# Content Pack Audit - 2026-04-28

## Ulatus

Audit katab runtime registritest loetud curriculum seisu:

- `skillRegistry`: kõik registreeritud `Skill` kirjed.
- `contentPackRegistry`: kõik registreeritud `ContentPack` kirjed.
- `gameRegistry`: kõik 23 mängu/bindingut pärast `src/games/registrations.ts` importi.

Audit on nüüd korratav koodiga `buildCurriculumAuditReport()` failis
`src/diagnostics/curriculumAudit.ts`. Sama raport kontrollib packi tarbijad,
item count'i, locale'i, skilli õpitargetit ja lihtsaid difficulty signaale
(`difficulty`, `minLevel`/`maxLevel`, `*Range`, `kind`).

## Kokkuvõte

| Mõõdik                 | Väärtus |
| ---------------------- | ------- |
| Skillid                | 19      |
| Content packid         | 22      |
| Game bindingud         | 23      |
| Packid ilma tarbijata  | 0       |
| Skillid ilma packita   | 0       |
| Skillid ilma tarbijata | 0       |
| Packid alla 6 itemi    | 6       |
| Shallow-warninguga     | 0       |

Hea uudis: Phase 1 migratsioon on struktuurselt seotud. Igal skillil on pack,
igal packil on vähemalt üks game consumer ja ükski pack ei vedele registris
kasutamata.

Peamine product-risk ei ole enam registri või metadata puudujääk. Arithmetic
snake'i packid on teadlikult väikesed DSL-spec poolid ja audit loeb need
kaetuks, kui operation family, range'id ja unlockid on olemas. Kõigil packidel
on nüüd consumer ja explicit difficulty või progression signaal. Järgmine risk
on authored content'i kvaliteet: kontrollitud sõnavara pildiankrute päris
renderdus, high-risk mängumehaanika smoke'id ja laiem copy-toimetus.

## Packide Tabel

| Pack                                       | Skill                       | Itemid | Tarbija(d)                                                      | Difficulty / struktuur                               | Märkus            |
| ------------------------------------------ | --------------------------- | ------ | --------------------------------------------------------------- | ---------------------------------------------------- | ----------------- |
| `astronomy.visible_from_estonia`           | Tähtkujud                   | 16     | `star_mapper`                                                   | `difficulty=easy/hard/medium`                        | OK                |
| `language.spatial_sentences.scene_pack`    | Asukohalaused               | 8      | `sentence_logic`                                                | `difficulty=easy/hard/medium`, `levels=1-open-ended` | OK                |
| `language.syllabification.en`              | Silbitamine                 | 35     | `syllable_builder`                                              | `difficulty=easy/hard/medium`, `levels=1-open-ended` | OK                |
| `language.syllabification.et`              | Silbitamine                 | 51     | `syllable_builder`                                              | `difficulty=easy/hard/medium`, `levels=1-open-ended` | OK                |
| `language.vocabulary.en`                   | Sõnavara                    | 90     | `letter_match`, `picture_pairs`, `word_builder`, `word_cascade` | `difficulty=easy/hard/medium`, `levels=1-open-ended` | OK; copy-reviewed |
| `language.vocabulary.et`                   | Sõnavara                    | 207    | `letter_match`, `picture_pairs`, `word_builder`, `word_cascade` | `difficulty=easy/hard/medium`, `levels=1-open-ended` | OK; copy-reviewed |
| `math.addition_memory.core`                | Liitmistehete meeldejätmine | 8      | `memory_math`                                                   | `levels=1-open-ended`, `stage:8`                     | OK                |
| `math.addition_within_100`                 | Liitmine kuni 100           | 2      | `addition_big_snake`                                            | `arithmetic-spec=covered`                            | DSL-spec OK       |
| `math.addition_within_20`                  | Liitmine kuni 20            | 2      | `addition_snake`                                                | `arithmetic-spec=covered`                            | DSL-spec OK       |
| `math.balance_equations.core`              | Tasakaaluvõrrandid          | 6      | `balance_scale`                                                 | `levels=1-open-ended`                                | OK                |
| `math.compare_numbers.core`                | Arvude võrdlemine           | 7      | `compare_sizes`                                                 | `levels=1-open-ended`                                | OK                |
| `math.geometry_shapes.shape_dash_basics`   | Geomeetrilised kujundid     | 39     | `shape_dash`                                                    | `checkpoint:32`, `gate:7`                            | OK                |
| `math.geometry_shapes.shape_shift_puzzles` | Geomeetrilised kujundid     | 20     | `shape_shift`                                                   | `difficulty=easy/hard/medium`                        | OK; expanded      |
| `math.grid_navigation.core`                | Ruudustikul liikumine       | 14     | `robo_path`                                                     | `levels=1-open-ended`, staged kinds                  | OK                |
| `math.mixed_problem_solving.battlelearn`   | Segatüüpi probleemülesanded | 36     | `battlelearn`                                                   | `levels=1-open-ended`, staged kinds                  | OK                |
| `math.multiplication_1_10`                 | Korrutustabel 1-10          | 2      | `multiplication_big_snake`                                      | `arithmetic-spec=covered`                            | DSL-spec OK       |
| `math.multiplication_1_5`                  | Korrutustabel 1-5           | 2      | `multiplication_snake`                                          | `arithmetic-spec=covered`                            | DSL-spec OK       |
| `math.pattern_sequences.core`              | Mustrijadad                 | 11     | `pattern`                                                       | `template:6`, `theme:5`                              | OK                |
| `math.subtraction_within_100`              | Lahutamine kuni 100         | 3      | `subtraction_big_snake`                                         | `arithmetic-spec=covered`                            | DSL-spec OK       |
| `math.subtraction_within_20`               | Lahutamine kuni 20          | 3      | `subtraction_snake`                                             | `arithmetic-spec=covered`                            | DSL-spec OK       |
| `math.time_reading.core`                   | Kellaaja lugemine           | 8      | `time_match`                                                    | `levels=1-open-ended`, `stage:8`                     | OK                |
| `math.unit_conversions.core`               | Ühikute teisendamine        | 14     | `unit_conversion`                                               | `levels=1-open-ended`, `conversion:7,stage:7`        | OK                |

## Prioriteedid

1. **Hoia authored-content kvaliteedi järjekord nähtaval.** Shape Shift ja
   vocabulary on mahult korras, kuid järgmine kvaliteedihüpe tuleb sisulise
   rühmituse ja toimetamise, mitte registri migratsiooni kaudu.
2. **Kasuta metadata't adaptiivses valikus järjekindlalt.** Sõnamängud on nüüd
   metadata külge seotud ning menu ja stats/progress UI näitavad packi
   pealkirja, item count'i, difficulty tier'e ning fookuste arvu. Järgmine
   samalaadne töö peaks kasutama seda infot adaptiivses valikus või detailsemas
   mastery mudelis.
3. **Laienda UI smoke'i vajaduse järgi.** Vocabulary mängudel on nüüd mõlema
   locale'i smoke; sama muster sobib järgmistele copy- või content-heavy
   mängudele, kui nende packid muutuvad.

## Soovitatud Järgmine Slice

Kõik content-pack metadata warningud, vocabulary duplikaadid ja
`language.vocabulary.et` / `language.vocabulary.en` vanusesobivuse ja
pildiankru esmased riskid on nüüd kaetud. ET packi copy review eemaldas 9-10
tähega või nõrga visuaalse vastega sõnad, asendas mitu täpsema eestikeelse
vastega ning lisas regressioonikaitse: ET vocabulary sõnad peavad olema kuni 8
tähte, kasutama ainult eesti suurtähti, vältima duplicate emoji vasteid ja
hoidma reviewed-out sõnad väljas. EN packi copy review eemaldas duplicate
emoji riski ning asendas nõrgad ankrud selgemate 5-6 tähega sõnadega.

Vocabulary-game UI smoke on nüüd kaetud Playwright testiga
`e2e/vocabulary-games.spec.ts`: `word_builder`, `word_cascade`,
`picture_pairs` ja `letter_match` avatakse nii `et` kui `en` locale'is,
kontrollitakse locale chrome'i ja sõna-emoji renderdust ning käivitatakse
vastuse või reveal flow.

Shape Shift puzzle pack on samuti laiendatud 20 itemini: lisatud on uued
loetavad easy/medium/hard pusled ning testid kontrollivad nüüd localized nimesid,
piece id unikaalsust, shape tüüpe, mõõtmeid, tier'i mahtu ja board bounds'e.

Pack metadata on nüüd õppija menüüs ja progressi/statistika vaates nähtav:
mängukaardid, mechanic pack picker, enim mängitud mängud ja kõrgeimad tasemed
näitavad sama kokkuvõtet (`pack title · item count · difficulty · focus count`)
ning aria/title tekstis on ka fookuste pikemad learning-outcome nimed.

Progress UI pind on nüüd ühemõtteline: vanad kasutamata `LearningProgress` ja
`GameProgression` komponendid eemaldati, sest neid ei importinud ega renderdanud
ükski aktiivne vaade. Edasine progress/mastery töö peaks jätkama nähtaval
`StatsModal` / `StatsDashboard` pinnal või looma uue pinna teadliku disainiotsusena.

Kõige praktilisem järgmine slice on otsustada, kas authored-content töö jätkub
veel ühe pildikeskse packi smoke'iga või viiakse metadata kasutamine järgmisse
adaptiivse valiku/mastery sammu:

- mastery: kasutada packi difficulty/focus infot harjutuste valiku või skill
  detailide järjestamisel;
- content QA: teha sama smoke muster järgmisele kõige pildikesksemale mängule.
