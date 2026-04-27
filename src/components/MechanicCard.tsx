import React, { useMemo } from 'react';
import { ChevronRight, Layers, type LucideIcon } from 'lucide-react';
import { FadeIn } from './EnhancedAnimations';
import type { MechanicConfig } from '../types/game';
import { useTranslation } from '../i18n/useTranslation';
import { useProfileText } from '../hooks/useProfileText';

const DefaultIcon = () => null;

interface MechanicCardProps {
  mechanicConfig: MechanicConfig & {
    iconComponent?: LucideIcon | React.ComponentType<{ size?: number; className?: string }>;
  };
  packCount: number;
  badge?: string | null;
  delay?: number;
  onClick: () => void;
}

export const MechanicCard: React.FC<MechanicCardProps> = ({
  mechanicConfig,
  packCount,
  badge = null,
  delay = 0,
  onClick,
}) => {
  const t = useTranslation();
  const { formatText } = useProfileText();
  const IconComponent = useMemo(
    () => mechanicConfig.iconComponent || DefaultIcon,
    [mechanicConfig.iconComponent],
  );

  const mechanicCopy = t.mechanics[mechanicConfig.id as keyof typeof t.mechanics];
  const title: string = (mechanicCopy?.title ?? mechanicConfig.title) as string;
  const desc: string = (mechanicCopy?.desc ?? mechanicConfig.desc) as string;

  const countTemplate =
    packCount === 1 ? t.menuSpecific.packCount_one : t.menuSpecific.packCount_other;
  const countLabel = countTemplate.replace('{count}', String(packCount));

  const ariaLabel = `${formatText(title)} - ${formatText(desc)} - ${countLabel}`;

  return (
    <FadeIn delay={delay}>
      <button
        onClick={onClick}
        aria-label={ariaLabel}
        className={`
          group relative grid w-full grid-cols-[auto_1fr_auto] items-center gap-2.5 overflow-hidden rounded-lg
          ${mechanicConfig.theme.bg} border border-slate-200 p-3 text-left shadow-sm transition duration-200
          hover:border-slate-300 hover:shadow-md active:bg-slate-50 sm:gap-3 sm:p-3.5 cursor-pointer
        `}
      >
        <span
          className={`absolute inset-y-3 left-0 w-1 rounded-r-full ${mechanicConfig.theme.accent}`}
          aria-hidden
        />

        <div
          className={`
            flex h-10 w-10 items-center justify-center rounded-lg border border-white/70 sm:h-11 sm:w-11
            ${mechanicConfig.theme.iconBg} ${mechanicConfig.theme.text}
          `}
        >
          <IconComponent size={22} aria-hidden />
        </div>

        <div className="text-left flex-1 min-w-0">
          <h3
            className={`text-sm sm:text-base font-bold ${mechanicConfig.theme.text} flex items-center gap-2 truncate`}
          >
            {formatText(title)}
          </h3>
          <p className="mt-0.5 line-clamp-2 text-xs font-medium leading-snug text-slate-600 sm:text-sm">
            {formatText(desc)}
          </p>
          <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
            {badge && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-900 text-white">
                {formatText(badge)}
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/80 text-slate-700">
              <Layers size={12} aria-hidden />
              {countLabel}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/80 border border-slate-200 sm:h-11 sm:w-11">
            <ChevronRight size={24} className={`${mechanicConfig.theme.text}`} aria-hidden />
          </div>
        </div>
      </button>
    </FadeIn>
  );
};
