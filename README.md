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
