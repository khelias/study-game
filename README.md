# Tarkade Mängud 🚀

Hariduslik veebimäng 6-8 aastastele lastele lugemise, matemaatika ja loogika harjutamiseks.

## ✨ Funktsioonid

### 🎮 Mängud

- **SÕNAMEISTER** - Tähtedest sõnade kokkupanemine
- **SILBIMEISTER** - Silpidest sõnade kokkupanemine
- **MUSTRI-RONG** - Mustrite äratundmine ja jätkamine
- **LAUSE-DETEKTIIV** - Loogilise mõtlemise harjutamine
- **MATEMAATIKA MÄLU** - Matemaatika mälumäng
- **ROBO-RADA** - Programmeerimise põhitõed
- **KAALUD** - Matemaatilise loogika harjutamine
- **KELLAMÄNG** - Kellaaegade õppimine
- **TÄHE-DETEKTIIV** - Tähtede äratundmine

### 🌟 Peamised Täiustused

- **Adaptiivne raskusaste** - automaatne raskuse kohandamine
- **Täiustatud tagasiside** - mitmekesine julgustus
- **Modernne UI/UX** - professionaalsed animatsioonid ja disain
- **Accessibility** - WCAG 2.1 AA compliance, klaviatuuritugi
- **Progressi jälgimine** - analüüs ja soovitused
- **Achievement süsteem** - medalid ja saavutused

## 🚀 Kiire Algus

### Nõuded

- Node.js 18+
- npm või yarn

### Paigaldamine

```bash
# Klooni repositoorium
git clone <repository-url>
cd study-game

# Paigalda sõltuvused
npm install

# Käivita arendusserver
npm run dev
```

### Ehitamine

```bash
# Ehitamine tootmiseks
npm run build
```

Ehitamise tulemus on `dist/` kaustas.

## 🎯 Mängudisain

### Vanuseprofiilid

- **6+ (Starter)** - Koolieelikutele, lihtsamad ülesanded
- **8+ (Advanced)** - 2. klassi õpilastele, raskemad ülesanded

### Raskusastmed

- **Lihtne** ⭐ - Alustajatele
- **Keskmine** ⭐⭐ - Harjutajatele
- **Raske** ⭐⭐⭐ - Kogenutele

### Progressioon

- Iga õige vastus annab tähe
- 5 tähte = tase tõuseb
- 3 südamega mängimine
- Adaptiivne raskusaste kohandab automaatselt

## 🏗️ Arhitektuur

### Adaptiivne Raskusaste

Mäng jälgib mängija jõudlust ja kohandab raskust automaatselt:
- Täpsus > 80% + 3+ järjestikust õiget → suurendab raskust
- Täpsus < 50% või 3+ järjestikust vale → vähendab raskust

### State Management

- Custom React hook'id state haldamiseks
- LocalStorage salvestamine
- Performance optimizations

## 📁 Projekti Struktuur

```
src/
├── components/          # React komponendid
│   ├── GameViews.jsx   # Mängu vaated
│   ├── FeedbackSystem.jsx  # Tagasiside süsteem
│   └── ...
├── engine/             # Mängu mootor
│   ├── adaptiveDifficulty.js  # Adaptiivne raskusaste
│   ├── achievements.js  # Achievement süsteem
│   ├── stats.js        # Statistika
│   └── audio.js        # Heli süsteem
├── games/              # Mängu andmed
│   ├── data.js        # Mängu konfiguratsioon
│   └── generators.js  # Ülesannete genereerimine
├── hooks/              # React hook'id
│   └── useGameState.js  # State management
└── utils/              # Utils
    └── performance.js  # Performance optimizations
```

## ♿ Accessibility

- ✅ WCAG 2.1 AA compliance
- ✅ Keyboard navigation (ESC, Enter, Tab)
- ✅ Screen reader support (ARIA labels)
- ✅ Focus management
- ✅ Reduced motion support
- ✅ High contrast support

## 📊 Statistika

Mäng jälgib:
- Mängitud mängude arv
- Õiged/valed vastused
- Parim seeria
- Kõrgeimad tasemed
- Mänguaeg
- Kogutud tähed
- Saavutused

## 🎨 UI/UX

- **Modernne disain** - värvikas ja kaasahaarav
- **Animatsioonid** - sujuvad ja professionaalsed
- **Responsive** - töötab kõigil seadmetel
- **Touch-friendly** - optimaalne mobiilseks kasutamiseks

## 📚 Hariduslik Väärtus

- **Lugemine** - tähtede, silpide ja sõnade harjutamine
- **Matemaatika** - arvutused, loogika, kellaajad
- **Loogika** - mustrite äratundmine, programmeerimise põhitõed
- **Mälu** - mälumängud

## 🔧 Arendamine

### Uue Mängu Lisamine

1. Lisa mängu konfiguratsioon `src/games/data.js`
2. Lisa genereerimise loogika `src/games/generators.js`
3. Lisa mängu vaade `src/components/GameViews.jsx`
4. Integreeri `src/SmartAdventure.jsx`

## 📝 Muudatused

Vaata `CHANGELOG.md` faili kõigi muudatuste kohta.

## 🐛 Probleemide Teavitamine

Kui leiad vea või soovid soovitust, palun ava issue GitHub'is.

## 📄 Litsents

Privaatne projekt - kõik õigused kaitstud.

---

**Tehnoloogiad**: React, Vite, Tailwind CSS  
**Versioon**: 2.1
