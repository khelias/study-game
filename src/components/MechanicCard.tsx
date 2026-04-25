// Mechanic card — aggregate menu card representing one engine + its content packs.
// Visually mirrors GameCard but shows skill count + chevron in the right slot.
import React, { useMemo } from 'react';
import { ChevronRight, type LucideIcon } from 'lucide-react';
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
          group relative flex items-center gap-4 p-5 rounded-3xl w-full
          ${mechanicConfig.theme.bg} border-4 ${mechanicConfig.theme.border}
          shadow-lg hover:shadow-2xl transition-all duration-300
          hover:scale-[1.03] hover:-translate-y-1 active:scale-[0.98] cursor-pointer
        `}
      >
        {badge && (
          <div className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-black px-3 py-1.5 rounded-full animate-bounce shadow-lg z-10 border-2 border-white">
            ✨ {formatText(badge)}
          </div>
        )}

        <div
          className={`
            relative p-5 rounded-2xl transition-all duration-300
            group-hover:rotate-12 group-hover:scale-125
            bg-gradient-to-br ${mechanicConfig.theme.iconBg}
            shadow-md group-hover:shadow-xl
            ${mechanicConfig.theme.text}
          `}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
          <IconComponent size={36} className="relative z-10" />
        </div>

        <div className="text-left flex-1 min-w-0">
          <h3
            className={`text-xl font-black ${mechanicConfig.theme.text} flex items-center gap-2 mb-1 truncate`}
          >
            {mechanicConfig.emoji && (
              <span className="text-2xl" aria-hidden>
                {mechanicConfig.emoji}
              </span>
            )}
            {formatText(title)}
          </h3>
          <p className="text-sm font-semibold text-slate-600 mb-2 truncate">{formatText(desc)}</p>
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            🎯 {countLabel}
          </span>
        </div>

        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <div
            className={`
              w-16 h-16 rounded-2xl flex items-center justify-center
              bg-gradient-to-br ${mechanicConfig.theme.iconBg}
              border-4 ${mechanicConfig.theme.border}
              shadow-lg group-hover:scale-110 transition-transform
            `}
          >
            <ChevronRight size={28} className={`${mechanicConfig.theme.text}`} aria-hidden />
          </div>
        </div>
      </button>
    </FadeIn>
  );
};
