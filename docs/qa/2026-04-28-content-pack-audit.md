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

Hea uudis: Phase 1 migratsioon on struktuurselt seotud. Igal skillil on pack,
igal packil on vähemalt üks game consumer ja ükski pack ei vedele registris
kasutamata.

Peamine product-risk: osa packe on endiselt progression-specid, mitte sisukad
õppematerjali pangad. See on smoke QA jaoks piisav, kuid pikaajaliseks
õppetoote korduvkasutuseks õhuke.

## Packide Tabel

| Pack                                       | Skill                       | Itemid | Tarbija(d)                                                      | Difficulty / struktuur                 | Märkus                                       |
| ------------------------------------------ | --------------------------- | ------ | --------------------------------------------------------------- | -------------------------------------- | -------------------------------------------- |
| `astronomy.visible_from_estonia`           | Tähtkujud                   | 16     | `star_mapper`                                                   | `difficulty=easy/hard/medium`          | OK                                           |
| `language.spatial_sentences.scene_pack`    | Asukohalaused               | 8      | `sentence_logic`                                                | puudub                                 | Lisa difficulty/level tagid või scene-rühmad |
| `language.syllabification.en`              | Silbitamine                 | 35     | `syllable_builder`                                              | puudub                                 | Locale OK; lisa raskusmeta                   |
| `language.syllabification.et`              | Silbitamine                 | 51     | `syllable_builder`                                              | puudub                                 | Locale OK; lisa raskusmeta                   |
| `language.vocabulary.en`                   | Sõnavara                    | 92     | `letter_match`, `picture_pairs`, `word_builder`, `word_cascade` | puudub                                 | Maht OK; lisa vanuse/difficulty tagid        |
| `language.vocabulary.et`                   | Sõnavara                    | 223    | `letter_match`, `picture_pairs`, `word_builder`, `word_cascade` | puudub                                 | Maht OK; vajab copy review + tagid           |
| `math.addition_memory.core`                | Liitmistehete meeldejätmine | 8      | `memory_math`                                                   | `levels=1-open-ended`, `stage:8`       | OK                                           |
| `math.addition_within_100`                 | Liitmine kuni 100           | 2      | `addition_big_snake`                                            | `valueRange 10-100`                    | Õhuke spec; generator teeb töö               |
| `math.addition_within_20`                  | Liitmine kuni 20            | 2      | `addition_snake`                                                | `valueRange 4-20`                      | Õhuke spec; generator teeb töö               |
| `math.balance_equations.core`              | Tasakaaluvõrrandid          | 6      | `balance_scale`                                                 | `levels=1-open-ended`                  | OK                                           |
| `math.compare_numbers.core`                | Arvude võrdlemine           | 7      | `compare_sizes`                                                 | `levels=1-open-ended`                  | OK                                           |
| `math.geometry_shapes.shape_dash_basics`   | Geomeetrilised kujundid     | 39     | `shape_dash`                                                    | `checkpoint:32`, `gate:7`              | OK                                           |
| `math.geometry_shapes.shape_shift_puzzles` | Geomeetrilised kujundid     | 15     | `shape_shift`                                                   | `difficulty=easy/hard/medium`          | OK, kuid võiks laiendada                     |
| `math.grid_navigation.core`                | Ruudustikul liikumine       | 14     | `robo_path`                                                     | `levels=1-open-ended`, staged kinds    | OK                                           |
| `math.mixed_problem_solving.battlelearn`   | Segatüüpi probleemülesanded | 36     | `battlelearn`                                                   | `levels=1-open-ended`, staged kinds    | OK                                           |
| `math.multiplication_1_10`                 | Korrutustabel 1-10          | 2      | `multiplication_big_snake`                                      | `factorRange 2-10`, `valueRange 4-100` | Õhuke spec                                   |
| `math.multiplication_1_5`                  | Korrutustabel 1-5           | 2      | `multiplication_snake`                                          | `factorRange 2-5`                      | Õhuke spec                                   |
| `math.pattern_sequences.core`              | Mustrijadad                 | 11     | `pattern`                                                       | `template:6`, `theme:5`                | OK                                           |
| `math.subtraction_within_100`              | Lahutamine kuni 100         | 3      | `subtraction_big_snake`                                         | `valueRange 10-100`                    | Õhuke spec                                   |
| `math.subtraction_within_20`               | Lahutamine kuni 20          | 3      | `subtraction_snake`                                             | `valueRange 4-20`, `valueRange 5-20`   | Õhuke spec                                   |
| `math.time_reading.core`                   | Kellaaja lugemine           | 8      | `time_match`                                                    | `levels=1-open-ended`, `stage:8`       | OK                                           |
| `math.unit_conversions.core`               | Ühikute teisendamine        | 7      | `unit_conversion`                                               | puudub                                 | Maht OK; lisa staged difficulty              |

## Prioriteedid

1. **Lisa difficulty/meta tagid keelepackidele.** `language.vocabulary.*`,
   `language.syllabification.*` ja `language.spatial_sentences.scene_pack`
   on mahult kasutatavad, kuid neil puudub selge raskus või õpitulemuse tag.
   See takistab päriselt adaptiivset valikut.
2. **Otsusta arithmetic snake'i specide auditikriteerium.** Allesjäänud alla
   6-itemi packid on kõik `math_snake` DSL-specid (`add/sub/mul`), mitte
   klassikalised authored content pangad. Nende puhul on mõistlik mõõta spec
   coverage'it, mitte ainult item count'i.
3. **Otsusta arithmetic specide sihttase.** Snake'i `add/sub/mul` packid on
   teadlikult DSL-specid, mitte ülesandepangad. Kui see jääb nii, peaks nende
   auditikriteerium olema "spec coverage", mitte item count.
4. **Tee Estonian copy review.** Sõnavara, laused, saavutused ja game title'id
   peaksid läbima ühe keeletoimetuse ringi koos vanuse sobivuse kontrolliga.

## Soovitatud Järgmine Slice

`math.balance_equations.core`, `math.time_reading.core` ja
`math.addition_memory.core` on nüüd stage-põhised. Kõige praktilisem järgmine
slice on arithmetic snake'i packide auditireegli täpsustamine:

- lisada `spec coverage` eristus auditisse;
- märkida `math.addition_*`, `math.subtraction_*` ja `math.multiplication_*`
  packid DSL-spec packideks;
- võtta shallow-warning ära packidelt, mille spec katab kõik vajaliku:
  operation kind, value/factor range ja variantide arv;
- pärast seda jätkata keelepackide difficulty/meta tagidega.

See annab väikese, hästi testitava muudatuse ning tõstab kohe ühe standardmängu
sisulist kvaliteeti.
