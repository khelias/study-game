// PackPickerModal — opened from a mechanic card on MenuScreen.
// Lists the bindings inside that mechanic so the user can pick a content
// pack (skill). Each row → starts the corresponding game binding by id.
import React from 'react';
import { Trophy, Type, type LucideIcon } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useProfileText } from '../../hooks/useProfileText';
import { AppModal, AppModalHeader } from '../../components/shared';
import type { GameConfig, MechanicConfig } from '../../types/game';

interface CurriculumSummaryLabel {
  label: string;
  title: string;
}

interface PackPickerModalProps {
  mechanicConfig: MechanicConfig;
  bindings: Array<{
    config: GameConfig;
    iconComponent: LucideIcon | React.ComponentType<{ size?: number; className?: string }>;
    level: number;
    highScore: number;
    isNew: boolean;
    curriculumSummary?: CurriculumSummaryLabel | null;
  }>;
  onSelect: (gameId: string) => void;
  onClose: () => void;
}

export const PackPickerModal: React.FC<PackPickerModalProps> = ({
  mechanicConfig,
  bindings,
  onSelect,
  onClose,
}) => {
  const t = useTranslation();
  const { formatText } = useProfileText();

  const mechanicCopy = t.mechanics[mechanicConfig.id as keyof typeof t.mechanics];
  const mechanicTitle: string = mechanicCopy?.title ?? mechanicConfig.title;
  const heading = formatText(mechanicTitle);

  return (
    <AppModal labelledBy="pack-picker-title" onClose={onClose} size="md">
      <AppModalHeader
        title={heading}
        titleId="pack-picker-title"
        subtitle={formatText(t.menuSpecific.choosePack)}
        onClose={onClose}
        closeLabel={String(t.common.close)}
      />

      <div className="p-4">
        <ul className="flex flex-col gap-2">
          {bindings.map((binding) => {
            const { config, iconComponent, level, highScore, isNew, curriculumSummary } = binding;
            const Icon = iconComponent || Type;
            const title: string = t.games[config.id as keyof typeof t.games]?.title ?? config.title;
            const desc: string = t.games[config.id as keyof typeof t.games]?.desc ?? config.desc;
            const difficultyText = config.difficulty
              ? ((t.difficulty[config.difficulty] ?? config.difficulty) as string)
              : null;

            return (
              <li key={config.id}>
                <button
                  onClick={() => onSelect(config.id)}
                  className={`group relative w-full grid grid-cols-[auto_1fr_auto] items-center gap-3 p-3 rounded-lg border ${config.theme.border} ${config.theme.bg} hover:bg-white hover:shadow-md active:bg-slate-50 transition-colors text-left`}
                  aria-label={`${formatText(title)} - ${formatText(desc)}${
                    curriculumSummary ? ` - ${formatText(curriculumSummary.title)}` : ''
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-lg ${config.theme.iconBg} ${config.theme.text} flex-shrink-0`}
                  >
                    <Icon size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-black text-base ${config.theme.text} truncate`}>
                      {formatText(title)}
                    </div>
                    <div className="text-xs font-semibold text-slate-600 truncate">
                      {formatText(desc)}
                    </div>
                    {curriculumSummary && (
                      <div
                        className="mt-0.5 truncate text-[11px] font-semibold text-slate-500"
                        title={formatText(curriculumSummary.title)}
                      >
                        {formatText(curriculumSummary.label)}
                      </div>
                    )}
                    <div className="mt-1 flex items-center gap-2 flex-wrap">
                      {isNew && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900 text-white">
                          {formatText(t.menuSpecific.newGame)}
                        </span>
                      )}
                      {difficultyText && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            config.difficulty === 'easy'
                              ? 'bg-green-100 text-green-700'
                              : config.difficulty === 'medium'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {formatText(difficultyText)}
                        </span>
                      )}
                      <span className="text-[10px] font-semibold text-slate-500 inline-flex items-center gap-1">
                        <Trophy size={11} aria-hidden />
                        {highScore > 0 ? highScore : '-'}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-white/80 border ${config.theme.border} flex-shrink-0`}
                  >
                    <span className="text-[9px] font-bold text-slate-500">
                      {formatText(t.game.level)}
                    </span>
                    <span className={`text-lg font-black ${config.theme.text}`}>{level}</span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </AppModal>
  );
};
