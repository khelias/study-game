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

Peamine product-risk ei ole enam item count üksinda. Arithmetic snake'i packid
on teadlikult väikesed DSL-spec poolid ja audit loeb need kaetuks, kui operation
family, range'id ja unlockid on olemas. Alles on sisu-meta risk: mitmel
keelepackil ja `math.unit_conversions.core` packil puudub explicit
difficulty/learning-outcome signaal.

## Packide Tabel

| Pack                                       | Skill                       | Itemid | Tarbija(d)                                                      | Difficulty / struktuur              | Märkus                                       |
| ------------------------------------------ | --------------------------- | ------ | --------------------------------------------------------------- | ----------------------------------- | -------------------------------------------- |
| `astronomy.visible_from_estonia`           | Tähtkujud                   | 16     | `star_mapper`                                                   | `difficulty=easy/hard/medium`       | OK                                           |
| `language.spatial_sentences.scene_pack`    | Asukohalaused               | 8      | `sentence_logic`                                                | puudub                              | Lisa difficulty/level tagid või scene-rühmad |
| `language.syllabification.en`              | Silbitamine                 | 35     | `syllable_builder`                                              | puudub                              | Locale OK; lisa raskusmeta                   |
| `language.syllabification.et`              | Silbitamine                 | 51     | `syllable_builder`                                              | puudub                              | Locale OK; lisa raskusmeta                   |
| `language.vocabulary.en`                   | Sõnavara                    | 92     | `letter_match`, `picture_pairs`, `word_builder`, `word_cascade` | puudub                              | Maht OK; lisa vanuse/difficulty tagid        |
| `language.vocabulary.et`                   | Sõnavara                    | 223    | `letter_match`, `picture_pairs`, `word_builder`, `word_cascade` | puudub                              | Maht OK; vajab copy review + tagid           |
| `math.addition_memory.core`                | Liitmistehete meeldejätmine | 8      | `memory_math`                                                   | `levels=1-open-ended`, `stage:8`    | OK                                           |
| `math.addition_within_100`                 | Liitmine kuni 100           | 2      | `addition_big_snake`                                            | `arithmetic-spec=covered`           | DSL-spec OK                                  |
| `math.addition_within_20`                  | Liitmine kuni 20            | 2      | `addition_snake`                                                | `arithmetic-spec=covered`           | DSL-spec OK                                  |
| `math.balance_equations.core`              | Tasakaaluvõrrandid          | 6      | `balance_scale`                                                 | `levels=1-open-ended`               | OK                                           |
| `math.compare_numbers.core`                | Arvude võrdlemine           | 7      | `compare_sizes`                                                 | `levels=1-open-ended`               | OK                                           |
| `math.geometry_shapes.shape_dash_basics`   | Geomeetrilised kujundid     | 39     | `shape_dash`                                                    | `checkpoint:32`, `gate:7`           | OK                                           |
| `math.geometry_shapes.shape_shift_puzzles` | Geomeetrilised kujundid     | 15     | `shape_shift`                                                   | `difficulty=easy/hard/medium`       | OK, kuid võiks laiendada                     |
| `math.grid_navigation.core`                | Ruudustikul liikumine       | 14     | `robo_path`                                                     | `levels=1-open-ended`, staged kinds | OK                                           |
| `math.mixed_problem_solving.battlelearn`   | Segatüüpi probleemülesanded | 36     | `battlelearn`                                                   | `levels=1-open-ended`, staged kinds | OK                                           |
| `math.multiplication_1_10`                 | Korrutustabel 1-10          | 2      | `multiplication_big_snake`                                      | `arithmetic-spec=covered`           | DSL-spec OK                                  |
| `math.multiplication_1_5`                  | Korrutustabel 1-5           | 2      | `multiplication_snake`                                          | `arithmetic-spec=covered`           | DSL-spec OK                                  |
| `math.pattern_sequences.core`              | Mustrijadad                 | 11     | `pattern`                                                       | `template:6`, `theme:5`             | OK                                           |
| `math.subtraction_within_100`              | Lahutamine kuni 100         | 3      | `subtraction_big_snake`                                         | `arithmetic-spec=covered`           | DSL-spec OK                                  |
| `math.subtraction_within_20`               | Lahutamine kuni 20          | 3      | `subtraction_snake`                                             | `arithmetic-spec=covered`           | DSL-spec OK                                  |
| `math.time_reading.core`                   | Kellaaja lugemine           | 8      | `time_match`                                                    | `levels=1-open-ended`, `stage:8`    | OK                                           |
| `math.unit_conversions.core`               | Ühikute teisendamine        | 7      | `unit_conversion`                                               | puudub                              | Maht OK; lisa staged difficulty              |

## Prioriteedid

1. **Lisa difficulty/meta tagid keelepackidele.** `language.vocabulary.*`,
   `language.syllabification.*` ja `language.spatial_sentences.scene_pack`
   on mahult kasutatavad, kuid neil puudub selge raskus või õpitulemuse tag.
   See takistab päriselt adaptiivset valikut.
2. **Lisa staged difficulty `math.unit_conversions.core` packile.** Maht on 7,
   aga puudub level/difficulty signaal; see on järgmine matemaatika pack, mille
   audit annab veel sisulise hoiatuse.
3. **Tee Estonian copy review.** Sõnavara, laused, saavutused ja game title'id
   peaksid läbima ühe keeletoimetuse ringi koos vanuse sobivuse kontrolliga.

## Soovitatud Järgmine Slice

`math_snake` DSL-spec packid on nüüd auditiloogikas eraldi kaetud. Kõige
praktilisem järgmine slice on `math.unit_conversions.core`:

- jagada conversionid level-stage'ideks või lisada stage metadata olemasolevale
  conversion pangale;
- katta pikkus, mass ja maht eraldi õppesisu signaalidega;
- lisada generatori testid, et starter/advanced valikud jäävad stage'i piiridesse;
- pärast seda jätkata keelepackide difficulty/meta tagidega.

See annab väikese, hästi testitava muudatuse ning tõstab kohe ühe standardmängu
sisulist kvaliteeti.
