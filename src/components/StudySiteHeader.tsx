import React from 'react';
import { getLocale, setLocale, type SupportedLocale } from '../i18n';
import { useTranslation } from '../i18n/useTranslation';

export const StudySiteHeader: React.FC = () => {
  const t = useTranslation();
  const locale = getLocale();
  const isEt = locale === 'et';
  const kheLabel = isEt ? 'KHE Games avaleht' : 'KHE Games home';
  const languageLabel = isEt ? 'Keel' : 'Language';
  const gamesHomeHref = `/?lang=${locale}`;

  const handleLocaleChange = (nextLocale: SupportedLocale) => {
    if (nextLocale !== locale) setLocale(nextLocale);
  };

  return (
    <header className="w-full flex-shrink-0 border-b border-slate-200/80 bg-white/90 backdrop-blur-lg shadow-sm">
      <div className="mx-auto flex min-h-[3.5rem] w-full max-w-[1180px] items-center gap-2 px-3 py-1.5 sm:gap-3 sm:px-4">
        <a
          href={gamesHomeHref}
          aria-label={kheLabel}
          title={kheLabel}
          className="inline-flex h-11 min-w-[3.35rem] items-center justify-center gap-[0.02em] rounded-lg border border-slate-200 bg-white px-2 text-[0.78rem] font-black tracking-normal text-slate-800 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
        >
          <span>KHE</span>
          <span className="inline-block translate-y-[0.16em] text-[0.58em] leading-none text-red-500">
            .ee
          </span>
        </a>

        <div className="min-w-0 flex-1">
          <div className="truncate text-[0.62rem] font-extrabold uppercase leading-none tracking-normal text-slate-400">
            KHE Games
          </div>
          <div className="truncate text-sm font-black leading-tight tracking-normal text-slate-900">
            {t.menu.title}
          </div>
        </div>

        <div
          className="inline-flex shrink-0 gap-0.5 rounded-lg border border-slate-200 bg-slate-100/80 p-0.5"
          role="group"
          aria-label={languageLabel}
        >
          {(['et', 'en'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleLocaleChange(option)}
              aria-pressed={locale === option}
              className={[
                'min-h-9 min-w-10 rounded-md border px-2 text-[0.68rem] font-black uppercase tracking-normal transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500',
                locale === option
                  ? 'border-sky-200 bg-white text-slate-900 shadow-sm'
                  : 'border-transparent text-slate-500 hover:bg-white/70 hover:text-slate-800',
              ].join(' ')}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
