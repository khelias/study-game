# Tarkade Mängud 🎮

Hariduslik veebimäng 5-8 aastastele lastele, mis aitab harjutada lugemist, matemaatikat ja loogikat mängulises vormis.

## 📋 Sisu

- [Ülevaade](#ülevaade)
- [Funktsioonid](#funktsioonid)
- [Mängud](#mängud)
- [Paigaldamine](#paigaldamine)
- [Kasutamine](#kasutamine)
- [Arendamine](#arendamine)
- [Projekti Struktuur](#projekti-struktuur)
- [Tehnoloogiad](#tehnoloogiad)

## 🎯 Ülevaade

**Tarkade Mängud** on interaktiivne hariduslik mäng, mis pakub 14 erinevat mängu kahes vanuseprofiilis:
- **5+ (Starter)** - Koolieelikutele ja 1. klassi algajatele
- **Alates 1. klass (Advanced)** - Kogenumatele õpilastele

Mäng kasutab adaptiivset raskusastet, mis kohandab ülesannete keerukust automaatselt mängija jõudluse põhjal.

## ✨ Funktsioonid

### 🎮 Mängud

#### Starter profiil (5+)
1. **SÕNAMEISTER** - Tähtedest sõnade kokkupanemine
2. **SILBIMEISTER** - Silpidest sõnade kokkupanemine
3. **MUSTRI-RONG** - Mustrite äratundmine ja jätkamine
4. **LAUSE-DETEKTIIV** - Loogilise mõtlemise harjutamine
5. **MATEMAATIKA MÄLU** - Matemaatika mälumäng
6. **ROBO-RADA** - Programmeerimise põhitõed
7. **TÄHE-DETEKTIIV** - Tähtede äratundmine

#### Advanced profiil (alates 1. klass)
1. **KAALUD** - Matemaatilise loogika harjutamine
2. **KELLAMÄNG** - Kellaaegade õppimine
3. **MATEMAATIKA MÄLU** (täiustatud) - Raskemad matemaatika ülesanded
4. **ROBO-RADA** (täiustatud) - Keerukamad programmeerimise ülesanded
5. **LAUSE-DETEKTIIV** (täiustatud) - Keerukamad loogikaülesanded
6. **MUSTRI-RONG** (täiustatud) - Keerukamad mustrid
7. **TÄHE-DETEKTIIV** (täiustatud) - Keerukamad tähtede ülesanded

### 🌟 Peamised Täiustused

- **Adaptiivne raskusaste** - Mäng jälgib mängija jõudlust ja kohandab raskust automaatselt
- **Progressiooni süsteem** - Iga õige vastus annab tähe, 5 tähte tõstab taset
- **Achievement süsteem** - Medalid ja saavutused julgustavad edasi mängima
- **Statistika** - Detailne jälgimine mängitud mängude, täpsuse ja progressi kohta
- **Hariduslikud näpunäited** - Õpetused ja vihjed mängude mängimiseks
- **Täiustatud tagasiside** - Mitmekesine julgustus ja positiivne tagasiside
- **Accessibility** - WCAG 2.1 AA compliance, klaviatuuritugi, screen reader support
- **Responsive disain** - Töötab kõigil seadmetel (arvuti, tahvel, telefon)

## 🚀 Paigaldamine

### Nõuded

- **Node.js** 18 või uuem
- **npm** või **yarn** paketihaldur

### Sammud

1. **Klooni repositoorium**
   ```bash
   git clone https://github.com/khelias/study-game.git
   cd study-game
   ```

2. **Paigalda sõltuvused**
   ```bash
   npm install
   ```

3. **Käivita arendusserver**
   ```bash
   npm run dev
   ```
   Mäng avaneb brauseris aadressil `http://localhost:5173`

4. **Ehitamine tootmiseks**
   ```bash
   npm run build
   ```
   Ehitamise tulemus on `dist/` kaustas.

### Automaatne Deploy FTP Serverisse

Projekt kasutab GitHub Actions CI/CD töövoogu, mis automaatselt ehitab ja laeb rakenduse FTP serverisse iga `main` branch'i push'i korral.

**Seadistamine:**
1. Mine GitHub repository → Settings → Secrets and variables → Actions
2. Lisa järgmised secrets:
   - `FTP_SERVER` - FTP serveri aadress (nt. `ftp.example.com`)
   - `FTP_USERNAME` - FTP kasutajanimi
   - `FTP_PASSWORD` - FTP parool
3. Muuda `server-dir` väärtust `.github/workflows/deploy.yml` failis vastavalt oma FTP serveri struktuurile

**Käsitsi käivitamine:**
Workflow saab käivitada ka käsitsi GitHub Actions lehelt.

## 💻 Kasutamine

### Arendusrežiim

```bash
npm run dev
```

### Tootmisversioon

```bash
npm run build
npm run preview
```

### Testimine

Projekt kasutab **Vitest** testiraamistikku koos **React Testing Library**-ga.

```bash
# Käivita testid watch-režiimis
npm run test

# Käivita testid ühekordselt
npm run test:run

# Käivita testid UI-ga (vajab @vitest/ui installimist)
npm run test:ui

# Käivita testid coverage-ga
npm run test:coverage
```

**Test Coverage:**
- Engine (kriitiline loogika): 76.58% ✅
- Testitud komponendid: 100% ✅
- Testimise eesmärgid: Engine 80%+, Komponendid 60%+

### Koodi kvaliteet

```bash
npm run lint
```

## 🔧 Arendamine

### Projekti Struktuur

```
study-game/
├── public/                 # Staatilised failid
│   └── vite.svg
├── src/
│   ├── components/         # React komponendid
│   │   ├── GameViews.jsx   # Mängu vaated
│   │   ├── FeedbackSystem.jsx  # Tagasiside süsteem
│   │   ├── EnhancedAnimations.jsx  # Animatsioonid
│   │   ├── AchievementModal.jsx  # Achievement modaal
│   │   ├── StatsModal.jsx  # Statistika modaal
│   │   └── ...
│   ├── engine/            # Mängu mootor
│   │   ├── adaptiveDifficulty.js  # Adaptiivne raskusaste
│   │   ├── achievements.js  # Achievement süsteem
│   │   ├── stats.js        # Statistika
│   │   ├── audio.js        # Heli süsteem
│   │   ├── progression.js  # Progressiooni loogika
│   │   └── rng.js          # Juhuslikkuse genereerimine
│   ├── games/             # Mängu andmed
│   │   ├── data.js        # Mängu konfiguratsioon
│   │   └── generators.js  # Ülesannete genereerimine
│   ├── hooks/             # React hook'id
│   │   └── useGameState.js  # State management
│   ├── utils/             # Utils
│   │   ├── errorHandler.js  # Veakäsitlus
│   │   └── performanceOptimizations.js  # Performance optimizations
│   ├── App.jsx            # Põhikomponent
│   ├── SmartAdventure.jsx # Peamine mängu komponent
│   └── main.jsx           # Entry point
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

### Uue Mängu Lisamine

1. **Lisa mängu konfiguratsioon** `src/games/data.js`
   ```javascript
   uus_mang: {
     id: 'uus_mang',
     title: 'UUS MÄNG',
     theme: THEME.blue,
     icon: 'Icon',
     desc: 'Mängu kirjeldus',
     allowedProfiles: ['starter'],
     difficulty: 'easy'
   }
   ```

2. **Lisa genereerimise loogika** `src/games/generators.js`
   ```javascript
   generateUusMang(level, rng) {
     // Genereeri ülesanne
   }
   ```

3. **Lisa mängu vaade** `src/components/GameViews.jsx`
   ```javascript
   export const UusMangView = ({ problem, onAnswer, ... }) => {
     // Mängu UI
   }
   ```

4. **Integreeri** `src/SmartAdventure.jsx`
   - Lisa mängu tüüp `startGame` funktsioonisse
   - Lisa vaate renderimine

### Adaptiivne Raskusaste

Mäng kasutab adaptiivset raskusastet, mis töötab järgmiselt:

- **Raskuse suurendamine:**
  - Täpsus > 80% + 3+ järjestikust õiget vastust
  - Tõstab efektiivset taset

- **Raskuse vähendamine:**
  - Täpsus < 50% või 3+ järjestikust vale vastust
  - Langetab efektiivset taset

### State Management

Mäng kasutab:
- **React useState** - Komponentide state
- **LocalStorage** - Progressi ja statistika salvestamine
- **Custom hooks** - `useGameState` state haldamiseks

## 🎨 Tehnoloogiad

### Frontend

- **React 19.2** - UI raamistik
- **Vite 7.2** - Build tool ja dev server
- **Tailwind CSS 3.4** - CSS raamistik
- **Lucide React** - Ikoonid

### Arendustööriistad

- **ESLint** - Koodi kvaliteedi kontroll
- **PostCSS** - CSS töötlemine
- **Autoprefixer** - CSS vendor prefixid

### Accessibility

- **WCAG 2.1 AA** compliance
- **Keyboard navigation** (ESC, Enter, Tab)
- **Screen reader support** (ARIA labels)
- **Focus management**
- **Reduced motion support**
- **High contrast support**

## 📊 Statistika ja Progressioon

Mäng jälgib:
- Mängitud mängude arv
- Õiged/valed vastused
- Parim seeria
- Kõrgeimad tasemed
- Mänguaeg
- Kogutud tähed
- Avatud saavutused

Kõik andmed salvestatakse LocalStorage'i ja säilivad brauseri sessioonide vahel.

## 🧪 Testimine

### Testimise Filosoofia

Projekt järgib parimaid testimise praktikaid:
- **Käitumine, mitte implementatsioon** - Testid kontrollivad, mida kood teeb, mitte kuidas
- **Kiiret ja isoleeritud** - Testid töötavad kiiresti (alla 10 sekundi) ja ei sõltu üksteisest
- **Deterministlikud** - Testid kasutavad seededitud RNG-d ennustatavuse tagamiseks
- **AAA muster** - Testid järgivad Arrange-Act-Assert struktuuri

### Testikomplekt

#### Engine Testid (Ühiktestid)
Kõrgeima prioriteediga testid kriitilise äriloogika jaoks:

- **rng.test.ts** (16 testi)
  - Deterministlik juhuarvude genereerimine
  - Seededitud RNG järjepidevus
  - Massiivi elementide valik
  - Unikaalsete ID-de genereerimine

- **stats.test.ts** (25 testi)
  - Statistika loomine ja uuendamine
  - Mängude arvestus
  - Vastuste salvestamine ja seeriaid
  - Tasemete ja skooride jälgimine

- **achievements.test.ts** (19 testi)
  - Saavutuste avamine
  - Saavutuste tingimuste kontroll
  - Dubleeritud avamiste vältimine

- **adaptiveDifficulty.test.ts** (28 testi)
  - Raskusastme kohandamine jõudluse põhjal
  - Järjestikused õiged/valed vastused
  - Raskusastme piirangud

- **progression.test.ts** (26 testi)
  - Optimaalse raskusastme arvutamine
  - Progressiooni soovitused
  - Edukuse skoori arvutamine

#### Mängu Loogika Testid

- **generators.test.ts** (20 testi)
  - Ülesannete genereerimine (balance_scale, word_builder, pattern)
  - Raskusastme progressioon
  - Seededitud RNG järjepidevus
  - Vastuse valideerimise loogika

#### Komponendi Testid (Integratsioonitestid)

- **GameCard.test.tsx** (13 testi)
  - Mängu info kuvamine
  - Klikkimise käsitlemine
  - Lukustatud seisundi käsitlemine
  - Progressi kuvamine

- **StatsModal.test.tsx** (10 testi)
  - Statistika kuvamine
  - Sulgemise nupu töö
  - Saavutuste renderdamine

- **AchievementsModal.test.tsx** (14 testi)
  - Lukustatud/avatud saavutuste kuvamine
  - Progressi kuvamine

#### Utility Testid

- **performance.test.ts** (16 testi)
  - Debounce funktsioon
  - Throttle funktsioon
  - Seadme tuvastamise utiliidid

### Testimise Käivitamine

```bash
# Watch režiim (arendamiseks)
npm run test

# Ühekordselt (CI jaoks)
npm run test:run

# Coverage raportiga
npm run test:coverage

# UI-ga (interaktiivne)
npm run test:ui
```

### Coverage Eesmärgid

- **Engine**: 80%+ (saavutatud: 76.58%) ✅
- **Testitud Komponendid**: 100% ✅
- **Kogu**: Keskendutud kriitilisele funktsionaalsusele

### Uue Testi Lisamine

1. Loo test fail `__tests__` kaustasse
2. Kasuta järjekindlat nimetamist: `<component>.test.tsx` või `<module>.test.ts`
3. Kasuta test utiliite: `src/test/utils.tsx`
4. Järgi AAA mustrit (Arrange-Act-Assert)
5. Lisa kirjeldavad test nimed

**Näide:**
```typescript
import { describe, it, expect } from 'vitest';
import { createRng } from '../rng';

describe('createRng', () => {
  it('should create deterministic RNG with seed', () => {
    // Arrange
    const rng1 = createRng(12345);
    const rng2 = createRng(12345);
    
    // Act
    const values1 = [rng1(), rng1(), rng1()];
    const values2 = [rng2(), rng2(), rng2()];
    
    // Assert
    expect(values1).toEqual(values2);
  });
});
```

## 🎯 Hariduslik Väärtus

Mäng arendab:
- **Lugemist** - Tähtede, silpide ja sõnade harjutamine
- **Matemaatikat** - Arvutused, loogika, kellaajad
- **Loogikat** - Mustrite äratundmine, programmeerimise põhitõed
- **Mälu** - Mälumängud

## 🐛 Probleemide Teavitamine

Kui leiad vea või soovid soovitust, palun ava [issue GitHub'is](https://github.com/khelias/study-game/issues).

## 📝 Muudatused

Vaata [CHANGELOG.md](CHANGELOG.md) faili kõigi muudatuste kohta.

## 📄 Litsents

Privaatne projekt - kõik õigused kaitstud.

---

**Versioon:** 2.1  
**Loodud:** 2026  
**Viimati uuendatud:** 2026-01-24
