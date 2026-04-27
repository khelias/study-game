import React from 'react';
import { getLocale } from '../../i18n';

interface KheBrandLinkProps {
  className?: string;
}

export const KheBrandLink: React.FC<KheBrandLinkProps> = ({ className = '' }) => {
  const locale = getLocale();
  const ariaLabel = locale === 'et' ? 'KHE avaleht' : 'KHE home';

  return (
    <a
      href={`https://khe.ee/?lang=${locale}`}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={`inline-flex h-10 min-w-10 sm:h-11 sm:min-w-11 items-center justify-center rounded-lg border border-slate-200 bg-white/80 px-2 text-[0.68rem] font-black tracking-normal text-slate-700 shadow-sm backdrop-blur transition-colors hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${className}`}
    >
      KHE
    </a>
  );
};
