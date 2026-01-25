# Internationalization (i18n) System

## Ülevaade

See projekt kasutab lihtsat, type-safe i18n süsteemi mitme keele toetamiseks. Praegu on toetatud eesti ja inglise keel.

## Struktuur

```
i18n/
├── locales/
│   ├── et.ts    # Eesti keel (default)
│   └── en.ts    # Inglise keel
├── index.ts     # Core i18n logic
├── useTranslation.tsx  # React hook
└── README.md    # See fail
```

## Kasutamine

### React Komponentides

```tsx
import { useTranslation } from '../i18n/useTranslation';

function MyComponent() {
  const t = useTranslation();
  
  return (
    <div>
      <h1>{t.menu.title}</h1>
      <p>{t.menu.selectProfile}</p>
    </div>
  );
}
```

### Funktsioonides (mitte React komponentides)

```ts
import { getTranslations } from '../i18n';

function myFunction() {
  const t = getTranslations();
  console.log(t.menu.title);
}
```

### Keele Muutmine

```tsx
import { setLocale, getLocale } from '../i18n';

// Muuda keelt
setLocale('en'); // Või 'et'

// Vaata praegust keelt
const currentLocale = getLocale();
```

## Uue Keele Lisamine

1. **Loo uus tõlke fail** `locales/XX.ts`:

```ts
export const xx = {
  common: {
    yes: 'Jah',
    // ...
  },
  // ...
} as const;
```

2. **Lisa keel** `index.ts` failis:

```ts
export type SupportedLocale = 'et' | 'en' | 'xx';

const translations: Record<SupportedLocale, Translations> = {
  et,
  en,
  xx, // Lisa uus keel
};
```

3. **Lisa keele valik** UI-s (vajadusel)

## Tõlke Struktuur

Tõlked on organiseeritud loogilistesse kategooriatesse:

- `common` - Üldised stringid (Jah, Ei, OK, jne.)
- `errors` - Veateated
- `feedback` - Tagasiside sõnumid
- `categories` - Mängu kategooriad
- `profiles` - Profiilid
- `menu` - Menüü stringid
- `game` - Mängu stringid
- `stats` - Statistika stringid
- `achievements` - Saavutuste stringid

## Type Safety

Kõik tõlked on type-safe. TypeScript kontrollib, et:
- Kõik võtmed on olemas
- Tüübid on õiged
- Ei ole tühistatud viiteid

## LocalStorage

Praegune keel salvestatakse LocalStorage'i võtme `app_locale` all. Kui keelt pole määratud, kasutatakse brauseri keelt või vaikimisi eesti keelt.

## Tulevik

- [ ] Lisada rohkem keeli
- [ ] Lisada keele valik UI-s
- [ ] Lisada tõlke haldus süsteem
- [ ] Lisada tõlke redigeerimise vahendid
