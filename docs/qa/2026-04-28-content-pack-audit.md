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
on authored content'i kvaliteet: sõnavara copy, duplikaadid ja vanusesobivus.

## Packide Tabel

| Pack                                       | Skill                       | Itemid | Tarbija(d)                                                      | Difficulty / struktuur                               | Märkus                      |
| ------------------------------------------ | --------------------------- | ------ | --------------------------------------------------------------- | ---------------------------------------------------- | --------------------------- |
| `astronomy.visible_from_estonia`           | Tähtkujud                   | 16     | `star_mapper`                                                   | `difficulty=easy/hard/medium`                        | OK                          |
| `language.spatial_sentences.scene_pack`    | Asukohalaused               | 8      | `sentence_logic`                                                | `difficulty=easy/hard/medium`, `levels=1-open-ended` | OK                          |
| `language.syllabification.en`              | Silbitamine                 | 35     | `syllable_builder`                                              | `difficulty=easy/hard/medium`, `levels=1-open-ended` | OK                          |
| `language.syllabification.et`              | Silbitamine                 | 51     | `syllable_builder`                                              | `difficulty=easy/hard/medium`, `levels=1-open-ended` | OK                          |
| `language.vocabulary.en`                   | Sõnavara                    | 92     | `letter_match`, `picture_pairs`, `word_builder`, `word_cascade` | `difficulty=easy/hard/medium`, `levels=1-open-ended` | OK; vajab copy sanity check |
| `language.vocabulary.et`                   | Sõnavara                    | 223    | `letter_match`, `picture_pairs`, `word_builder`, `word_cascade` | `difficulty=easy/hard/medium`, `levels=1-open-ended` | OK; vajab copy review       |
| `math.addition_memory.core`                | Liitmistehete meeldejätmine | 8      | `memory_math`                                                   | `levels=1-open-ended`, `stage:8`                     | OK                          |
| `math.addition_within_100`                 | Liitmine kuni 100           | 2      | `addition_big_snake`                                            | `arithmetic-spec=covered`                            | DSL-spec OK                 |
| `math.addition_within_20`                  | Liitmine kuni 20            | 2      | `addition_snake`                                                | `arithmetic-spec=covered`                            | DSL-spec OK                 |
| `math.balance_equations.core`              | Tasakaaluvõrrandid          | 6      | `balance_scale`                                                 | `levels=1-open-ended`                                | OK                          |
| `math.compare_numbers.core`                | Arvude võrdlemine           | 7      | `compare_sizes`                                                 | `levels=1-open-ended`                                | OK                          |
| `math.geometry_shapes.shape_dash_basics`   | Geomeetrilised kujundid     | 39     | `shape_dash`                                                    | `checkpoint:32`, `gate:7`                            | OK                          |
| `math.geometry_shapes.shape_shift_puzzles` | Geomeetrilised kujundid     | 15     | `shape_shift`                                                   | `difficulty=easy/hard/medium`                        | OK, kuid võiks laiendada    |
| `math.grid_navigation.core`                | Ruudustikul liikumine       | 14     | `robo_path`                                                     | `levels=1-open-ended`, staged kinds                  | OK                          |
| `math.mixed_problem_solving.battlelearn`   | Segatüüpi probleemülesanded | 36     | `battlelearn`                                                   | `levels=1-open-ended`, staged kinds                  | OK                          |
| `math.multiplication_1_10`                 | Korrutustabel 1-10          | 2      | `multiplication_big_snake`                                      | `arithmetic-spec=covered`                            | DSL-spec OK                 |
| `math.multiplication_1_5`                  | Korrutustabel 1-5           | 2      | `multiplication_snake`                                          | `arithmetic-spec=covered`                            | DSL-spec OK                 |
| `math.pattern_sequences.core`              | Mustrijadad                 | 11     | `pattern`                                                       | `template:6`, `theme:5`                              | OK                          |
| `math.subtraction_within_100`              | Lahutamine kuni 100         | 3      | `subtraction_big_snake`                                         | `arithmetic-spec=covered`                            | DSL-spec OK                 |
| `math.subtraction_within_20`               | Lahutamine kuni 20          | 3      | `subtraction_snake`                                             | `arithmetic-spec=covered`                            | DSL-spec OK                 |
| `math.time_reading.core`                   | Kellaaja lugemine           | 8      | `time_match`                                                    | `levels=1-open-ended`, `stage:8`                     | OK                          |
| `math.unit_conversions.core`               | Ühikute teisendamine        | 14     | `unit_conversion`                                               | `levels=1-open-ended`, `conversion:7,stage:7`        | OK                          |

## Prioriteedid

1. **Tee Estonian copy review.** Sõnavara, laused, saavutused ja game title'id
   peaksid läbima ühe keeletoimetuse ringi koos vanuse sobivuse kontrolliga.
2. **Hoia authored-content kvaliteedi järjekord nähtaval.** Shape Shift ja
   vocabulary on mahult korras, kuid järgmine kvaliteedihüpe tuleb sisulise
   rühmituse ja toimetamise, mitte registri migratsiooni kaudu.
3. **Kasuta metadata't adaptiivses valikus järjekindlalt.** Sõnamängud on nüüd
   metadata külge seotud; järgmine samalaadne töö peaks olema UI või mastery
   vaates selle info nähtavaks tegemine.

## Soovitatud Järgmine Slice

Kõik content-pack metadata warningud on nüüd kaetud. Kõige praktilisem järgmine
slice on `language.vocabulary.et` copy sanity check:

- leida ja lahendada duplikaadid või mitmetähenduslikud emoji vasted;
- märkida või eemaldada vanuse mõttes nõrgad sõnad;
- kontrollida Estonian diakriitikuid ja liiga pikki sõnu 5+ vanuserühma jaoks;
- lisada väike test, mis püüab duplikaat-sõnad ja tühjad emoji vasted kinni.

See annab väikese, hästi testitava muudatuse ning tõstab kohe ühe standardmängu
sisulist kvaliteeti.
