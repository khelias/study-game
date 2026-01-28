# Sõnade andmebaasi laiendamise analüüs

## Praegune olukord

### Sõnade arv pikkuse järgi:
- **3 tähte: 14 sõna** ⚠️ (väga vähe!)
- **4 tähte: 87 sõna** ✅ (hea)
- **5 tähte: 28 sõna** ⚠️ (keskmine)
- **6 tähte: 33 sõna** ✅ (hea)
- **7 tähte: 28 sõna** ⚠️ (keskmine)
- **8+ tähte: 13 sõna** (vähe, aga OK kuna need on advanced)

**Kokku: 207 sõna**

### Probleem

Word Cascade mängus:
- Level 1-2: valitakse 3-tähelisi sõnu (ainult 14 võimalust!)
- Level 3-4: valitakse 4-tähelisi sõnu (87 võimalust - OK)
- Level 5-6: valitakse 5-tähelisi sõnu (28 võimalust - piisav, aga võib korduda)
- Level 7+: valitakse 6-7 tähelisi sõnu

**Duplikaatide vältimise mehhanism:**
- `useGameEngine.ts` hoiab meeles viimased **20 probleemi** per mängutüüp
- Proovib kuni **15 korda** genereerida uut, kui see on duplikaat
- Kui on ainult 14 sõna, siis pärast 14 erinevat sõna tuleb sama sõna uuesti

## Lahendused

### Lahendus 1: Vältida sama sõna näitamist järjest mitu korda

**Eelised:**
- Kiire lahendus, ei vaja andmebaasi muutmist
- Parandab kohe kasutajakogemust

**Puudused:**
- Kui on vähe sõnu, siis pärast mõnda aega kordub ikkagi
- Ei lahenda põhiprobleemi (vähe sõnu)

**Implementatsioon:**
- Suurendada `lastKeysRef` bufferit 20 → 50 või rohkem
- Või hoida eraldi viimased 10-15 **sõna** (mitte probleemi), et vältida sama sõna järjest

### Lahendus 2: Suurendada pool-id (lubada pikemaid sõnu varasematel tasemetel)

**Eelised:**
- Suurendab kohe valikuvõimalusi
- Ei vaja andmebaasi muutmist

**Puudused:**
- Pikemad sõnad võivad olla raskemad noorematele lastele
- Ei lahenda 3-täheliste sõnade puudust

**Implementatsioon:**
- Level 1-2: lubada ka 4-tähelisi sõnu (mitte ainult 3)
- Level 3-4: lubada ka 5-tähelisi sõnu (mitte ainult 4)

### Lahendus 3: Lisada rohkem sõnu andmebaasi ⭐ (SOOVITATAV)

**Eelised:**
- Lahendab põhiprobleemi
- Parandab pikaajalist kasutajakogemust
- Rohkem variatsiooni = huvitavam mäng

**Puudused:**
- Vajab tööd (sõnade leidmine, emoji valik)
- Võib võtta aega

**Soovitused:**
- **3 tähte: +20-30 sõna** (kokku 34-44) - kriitiline!
- **4 tähte: +10-15 sõna** (kokku 97-102) - hea
- **5 tähte: +10-15 sõna** (kokku 38-43) - hea
- **6 tähte: +5-10 sõna** (kokku 38-43) - hea
- **7 tähte: +5-10 sõna** (kokku 33-38) - hea

## Soovitatav lähenemine

**Kombineerida kõik 3 lahendust:**

1. **Lühiajaline (kohe):**
   - Parandada duplikaatide vältimist (suurendada bufferit)
   - Lubada pikemaid sõnu varasematel tasemetel

2. **Pikaajaline (järgmised sammud):**
   - Lisada rohkem sõnu, eriti 3-tähelisi
   - Jätkata andmebaasi täiendamist

## Sõnade kategooriad, mida võiks lisada

### 3-tähelised sõnad (kriitiline!):
- Loomad: KASS (juba on), KALA (juba on), KITS (juba on)
- Toit: SAI (juba on), TEE (juba on), MESI (juba on)
- **Võiks lisada:**
  - Loomad: KUKK (🐓), KANA (juba on), KASS (juba on)
  - Toit: PIIM (juba on), LEIB (juba on), JUUST (juba on)
  - Loodus: PUU (juba on), MERI (juba on), JÄRV (→ LOODUS)
  - Esemed: AUTO (juba on), KODU (juba on), KELL (juba on)
  - **Uued võimalused:**
    - KUKK (🐓 - rooster)
    - KANA (🐔 - chicken) - juba on
    - KASS (🐱 - cat) - juba on
    - KALA (🐟 - fish) - juba on
    - KITS (🐐 - goat) - juba on
    - KURK (🥒 - cucumber) - juba on
    - KIVI (🪨 - stone) - juba on
    - KUU (🌙 - moon) - juba on
    - KELL (⌚ - clock) - juba on
    - KODU (🏡 - home) - juba on
    - AUTO (🚗 - car) - juba on
    - SAI (🍞 - white bread) - juba on
    - TEE (🫖 - tea) - juba on
    - MESI (🍯 - honey) - juba on
    - PIIM (🥛 - milk) - juba on
    - LEIB (🥖 - bread) - juba on
    - JUUST (🧀 - cheese) - juba on

**Võimalikud uued 3-tähelised sõnad:**
- KUKK (🐓 - rooster)
- KÄSI (✋ - hand) - juba on, aga 4 tähte
- JALG (🦵 - leg) - juba on, aga 4 tähte
- SILM (👁️ - eye) - juba on, aga 4 tähte
- SUU (👄 - mouth) - juba on, aga 3 tähte! ✅
- KÕRV (👂 - ear) - juba on, aga 4 tähte
- NINA (👃 - nose) - juba on, aga 4 tähte
- AJU (🧠 - brain) - juba on, aga 3 tähte! ✅
- KÄSI (✋ - hand) - juba on, aga 4 tähte

**Kontrollime, mis 3-tähelisi sõnu meil juba on:**
- KASS, KALA, KITS, KURK, KIVI, KUU, KELL, KODU, AUTO, SAI, TEE, MESI, PIIM, LEIB, JUUST, SUU, AJU

**Võimalikud uued:**
- KUKK (🐓)
- KÄSI (✋) - aga see on 4 tähte
- JALG (🦵) - aga see on 4 tähte
- SILM (👁️) - aga see on 4 tähte
- KÕRV (👂) - aga see on 4 tähte
- NINA (👃) - aga see on 4 tähte

**Tegelikult on meil juba:**
- SUU (3 tähte) ✅
- AJU (3 tähte) ✅

**Uued 3-tähelised sõnad, mida võiks lisada:**
- KUKK (🐓 - rooster)
- KANA (🐔 - chicken) - aga see on 4 tähte
- KASS (🐱 - cat) - juba on
- KALA (🐟 - fish) - juba on
- KITS (🐐 - goat) - juba on

**Tegelikult vajame rohkem 3-tähelisi sõnu!**
